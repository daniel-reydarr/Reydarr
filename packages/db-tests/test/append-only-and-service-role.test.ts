// GUARD-OWNED: do not edit. Request changes through the architect.
// Proves what server code (the privileged key) may and may not do, per migration 4.
//
// The update-blocking trigger cannot be reached from here: the privileged role has no
// update grant on the three append-only tables, so Postgres refuses the update (42501)
// before the trigger runs. The trigger itself is proven by verification query 8 and the
// manual check in the README. The message text is deliberately not asserted.

import { randomUUID } from 'node:crypto';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { serviceClient, type Db } from '../src/clients';
import {
  getWorld,
  restoreFixtures,
  rowFilter,
  rowsOf,
  snapshot,
  type BusinessWorld,
  type Row,
  type TableName,
  type World,
} from '../src/fixtures';

const APPEND_ONLY_UPDATES: {
  table: TableName;
  patch: Row;
  idOf: (b: BusinessWorld) => string;
}[] = [
  { table: 'site_versions', patch: { snapshot: { changed: true } }, idOf: (b) => b.versionId },
  { table: 'usage_ledger', patch: { quantity: 2 }, idOf: (b) => b.ledgerId },
  { table: 'audit_log', patch: { action: 'changed' }, idOf: (b) => b.auditId },
];

const NEW_ROWS: { table: TableName; row: (b: BusinessWorld) => Row }[] = [
  {
    table: 'site_versions',
    row: (b) => ({
      site_id: b.siteId,
      business_id: b.businessId,
      kind: 'draft_autosave',
      version_number: 1,
      snapshot: {},
    }),
  },
  {
    table: 'usage_ledger',
    row: (b) => ({
      business_id: b.businessId,
      entry_type: 'usage',
      meter: 'ai_text',
      quantity: 1,
    }),
  },
  {
    table: 'audit_log',
    row: (b) => ({
      business_id: b.businessId,
      actor_type: 'system',
      action: 'append_check',
      entity_type: 'test',
    }),
  },
];

const ORDINARY_UPDATES: { table: TableName; patch: Row }[] = [
  { table: 'profiles', patch: { display_name: 'Isolation Service' } },
  { table: 'businesses', patch: { name: 'Isolation A One Service' } },
  { table: 'business_members', patch: { role: 'owner' } },
  { table: 'sites', patch: { recipe: { service: true } } },
  { table: 'pages', patch: { title: 'Service title' } },
  { table: 'sections', patch: { content: { text: 'service' } } },
];

describe('privileged client: append-only tables and table limits', () => {
  let world: World;
  let service: Db;

  beforeAll(() => {
    world = getWorld();
    service = serviceClient();
  });

  afterEach(async () => {
    // Removes the extra owner row if a case let it through, then restores A1.
    await service
      .from('business_members')
      .delete()
      .eq('business_id', world.a1.businessId)
      .eq('user_id', world.userB.id);
    await restoreFixtures(world);
  });

  for (const { table, patch, idOf } of APPEND_ONLY_UPDATES) {
    it(`${table} | update | service role | refused (42501) and row unchanged`, async () => {
      const id = idOf(world.a1);
      const before = await snapshot(table, 'id', id);
      expect(before).toHaveLength(1);

      const res = await service.from(table).update(patch).eq('id', id);
      expect(res.error?.code).toBe('42501');
      expect(await snapshot(table, 'id', id)).toEqual(before);
    });
  }

  for (const { table, row } of NEW_ROWS) {
    it(`${table} | insert and delete | service role | both work`, async () => {
      const inserted = await service.from(table).insert(row(world.a1)).select('id').single();
      expect(inserted.error).toBeNull();
      const id = (inserted.data as { id?: string } | null)?.id;
      expect(typeof id).toBe('string');

      // Only the row created here is deleted.
      const removed = await service.from(table).delete().eq('id', String(id)).select('id');
      expect(removed.error).toBeNull();
      expect(rowsOf(removed)).toHaveLength(1);
    });
  }

  for (const { table, patch } of ORDINARY_UPDATES) {
    it(`${table} | update | service role | works`, async () => {
      const { column, value } = rowFilter(table, world.a1, world.userA);
      const res = await service.from(table).update(patch).eq(column, value).select('id');
      expect(res.error).toBeNull();
      expect(rowsOf(res)).toHaveLength(1);
    });
  }

  it('business_members | insert second owner | service role | rejected (23505)', async () => {
    const res = await service.from('business_members').insert({
      business_id: world.a1.businessId,
      user_id: world.userB.id,
      role: 'owner',
    });
    expect(res.error?.code).toBe('23505');
  });

  it("sites | set published_version_id to B1's version | service role | rejected (23503)", async () => {
    const res = await service
      .from('sites')
      .update({ published_version_id: world.b1.versionId })
      .eq('id', world.a1.siteId);
    expect(res.error?.code).toBe('23503');
  });

  it("sites | set published_version_id to A1's own version | service role | works", async () => {
    const res = await service
      .from('sites')
      .update({ published_version_id: world.a1.versionId })
      .eq('id', world.a1.siteId)
      .select('id');
    expect(res.error).toBeNull();
    expect(rowsOf(res)).toHaveLength(1);
  });

  it('usage_ledger | duplicate business_id and idempotency_key | service role | rejected (23505)', async () => {
    const key = `isolation-${randomUUID()}`;
    const row = {
      business_id: world.a1.businessId,
      entry_type: 'usage',
      meter: 'ai_text',
      quantity: 1,
      idempotency_key: key,
    };
    try {
      const first = await service.from('usage_ledger').insert(row);
      expect(first.error).toBeNull();
      const second = await service.from('usage_ledger').insert(row);
      expect(second.error?.code).toBe('23505');
    } finally {
      await service.from('usage_ledger').delete().eq('idempotency_key', key);
    }
  });
});
