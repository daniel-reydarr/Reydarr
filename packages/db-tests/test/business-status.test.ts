// GUARD-OWNED: do not edit. Request changes through the architect.
// Proves what happens to user A when her business A1 is suspended or pending deletion.
// Expectations follow docs/schema.md: an insert blocked by a policy gives 42501, and an
// update or delete on a row the policy hides gives no error and zero rows.

import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { signedInClient, type Db } from '../src/clients';
import {
  getWorld,
  ownerColumn,
  rowFilter,
  rowsOf,
  setBusinessStatus,
  snapshot,
  type TableName,
  type World,
} from '../src/fixtures';

const READABLE_WHEN_SUSPENDED: TableName[] = ['businesses', 'sites', 'pages', 'sections'];

const HIDDEN_WHEN_PENDING_DELETION: TableName[] = [
  'businesses',
  'business_members',
  'sites',
  'pages',
  'sections',
  'site_versions',
  'usage_ledger',
  'audit_log',
];

describe('business status as seen by user A on A1', () => {
  let world: World;
  let client: Db;

  beforeAll(async () => {
    world = getWorld();
    client = await signedInClient(world.userA.email, world.userA.password);
  });

  // Every case starts from, and returns to, an active A1.
  afterEach(async () => {
    await setBusinessStatus(world.a1.businessId, 'active');
  });

  describe('suspended', () => {
    for (const table of READABLE_WHEN_SUSPENDED) {
      it(`${table} | select | user A on suspended A1 | still works`, async () => {
        await setBusinessStatus(world.a1.businessId, 'suspended');
        const { column, value } = rowFilter(table, world.a1, world.userA);
        const res = await client.from(table).select('*').eq(column, value);
        expect(res.error).toBeNull();
        expect(rowsOf(res)).toHaveLength(1);
      });
    }

    it('businesses | update name | user A on suspended A1 | zero rows affected and row unchanged', async () => {
      await setBusinessStatus(world.a1.businessId, 'suspended');
      const before = await snapshot('businesses', 'id', world.a1.businessId);
      const res = await client
        .from('businesses')
        .update({ name: 'Suspended rename' })
        .eq('id', world.a1.businessId)
        .select('id');
      expect(res.error).toBeNull();
      expect(rowsOf(res)).toEqual([]);
      expect(await snapshot('businesses', 'id', world.a1.businessId)).toEqual(before);
    });

    it('pages | insert | user A on suspended A1 | refused (42501)', async () => {
      await setBusinessStatus(world.a1.businessId, 'suspended');
      const res = await client.from('pages').insert({
        site_id: world.a1.siteId,
        business_id: world.a1.businessId,
        slug: 'suspended-test',
        title: 'Suspended test',
        position: 20,
      });
      expect(res.error?.code).toBe('42501');
      expect(await snapshot('pages', 'slug', 'suspended-test')).toEqual([]);
    });

    it('sections | update content | user A on suspended A1 | zero rows affected and row unchanged', async () => {
      await setBusinessStatus(world.a1.businessId, 'suspended');
      const before = await snapshot('sections', 'id', world.a1.sectionId);
      const res = await client
        .from('sections')
        .update({ content: { text: 'suspended change' } })
        .eq('id', world.a1.sectionId)
        .select('id');
      expect(res.error).toBeNull();
      expect(rowsOf(res)).toEqual([]);
      expect(await snapshot('sections', 'id', world.a1.sectionId)).toEqual(before);
    });

    it('pages | delete | user A on suspended A1 | zero rows affected and row still exists', async () => {
      await setBusinessStatus(world.a1.businessId, 'suspended');
      const res = await client.from('pages').delete().eq('id', world.a1.pageId).select('id');
      expect(res.error).toBeNull();
      expect(rowsOf(res)).toEqual([]);
      expect(await snapshot('pages', 'id', world.a1.pageId)).toHaveLength(1);
    });
  });

  describe('pending_deletion', () => {
    for (const table of HIDDEN_WHEN_PENDING_DELETION) {
      it(`${table} | select | user A on pending_deletion A1 | zero rows for A1`, async () => {
        await setBusinessStatus(world.a1.businessId, 'pending_deletion');
        const res = await client.from(table).select('*').eq(ownerColumn(table), world.a1.businessId);
        expect(res.error).toBeNull();
        expect(rowsOf(res)).toEqual([]);
      });
    }

    it('businesses | select | user A while A1 is pending_deletion | A2 stays visible', async () => {
      await setBusinessStatus(world.a1.businessId, 'pending_deletion');
      const res = await client.from('businesses').select('id').eq('id', world.a2.businessId);
      expect(res.error).toBeNull();
      expect(rowsOf(res)).toHaveLength(1);
    });
  });
});
