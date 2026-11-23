// GUARD-OWNED: do not edit. Request changes through the architect.
// Proves that one person cannot read or change another person's business, in both
// directions. User A is tested against B1 on every table. User B is tested against A1 on
// the tables where it matters.

import { beforeAll, describe, expect, it } from 'vitest';
import { serviceClient, signedInClient, type Db, type TestUser } from '../src/clients';
import {
  getWorld,
  ownerColumn,
  rowFilter,
  rowsOf,
  snapshot,
  TABLES,
  type BusinessWorld,
  type Row,
  type TableName,
  type World,
} from '../src/fixtures';

interface Direction {
  who: string;
  actor: (w: World) => TestUser;
  own: (w: World) => BusinessWorld[];
  target: (w: World) => BusinessWorld;
  targetUser: (w: World) => TestUser;
  tables: readonly TableName[];
}

const DIRECTIONS: Direction[] = [
  {
    who: 'user A',
    actor: (w) => w.userA,
    own: (w) => [w.a1, w.a2],
    target: (w) => w.b1,
    targetUser: (w) => w.userB,
    tables: TABLES,
  },
  {
    who: 'user B',
    actor: (w) => w.userB,
    own: (w) => [w.b1],
    target: (w) => w.a1,
    targetUser: (w) => w.userA,
    tables: ['businesses', 'sites', 'pages', 'sections', 'profiles'],
  },
];

const UPDATES: { table: TableName; patch: Row }[] = [
  { table: 'businesses', patch: { name: 'Hijacked name' } },
  { table: 'sites', patch: { recipe: { hijacked: true } } },
  { table: 'pages', patch: { title: 'Hijacked title' } },
  { table: 'sections', patch: { content: { hijacked: true } } },
  { table: 'profiles', patch: { display_name: 'Hijacked' } },
];

const DELETES: TableName[] = ['pages', 'sections'];

for (const d of DIRECTIONS) {
  describe(`${d.who} against the other person's business`, () => {
    let world: World;
    let client: Db;
    let service: Db;

    beforeAll(async () => {
      world = getWorld();
      service = serviceClient();
      const actor = d.actor(world);
      client = await signedInClient(actor.email, actor.password);
    });

    for (const table of d.tables) {
      it(`${table} | select | ${d.who} | returns only own rows`, async () => {
        const res = await client.from(table).select('*');
        expect(res.error).toBeNull();
        const column = ownerColumn(table);
        const values = rowsOf(res).map((row) => String(row[column]));
        const own =
          table === 'profiles' ? [d.actor(world).id] : d.own(world).map((b) => b.businessId);
        expect(values.filter((value) => !own.includes(value))).toEqual([]);
        expect(values).toContain(own[0]);
      });

      it(`${table} | select by id | ${d.who} | other person's row returns zero rows`, async () => {
        const { column, value } = rowFilter(table, d.target(world), d.targetUser(world));
        const res = await client.from(table).select('*').eq(column, value);
        expect(res.error).toBeNull();
        expect(rowsOf(res)).toEqual([]);
      });
    }

    for (const { table, patch } of UPDATES) {
      it(`${table} | update | ${d.who} | zero rows affected and row unchanged`, async () => {
        const { column, value } = rowFilter(table, d.target(world), d.targetUser(world));
        const before = await snapshot(table, column, value);
        expect(before).toHaveLength(1);

        const res = await client.from(table).update(patch).eq(column, value).select('id');
        expect(res.error).toBeNull();
        expect(rowsOf(res)).toEqual([]);

        expect(await snapshot(table, column, value)).toEqual(before);
      });
    }

    for (const table of DELETES) {
      it(`${table} | delete | ${d.who} | zero rows affected and row still exists`, async () => {
        const { column, value } = rowFilter(table, d.target(world), d.targetUser(world));
        const res = await client.from(table).delete().eq(column, value).select('id');
        expect(res.error).toBeNull();
        expect(rowsOf(res)).toEqual([]);
        expect(await snapshot(table, column, value)).toHaveLength(1);
      });
    }

    it(`pages | insert into other business | ${d.who} | refused by row-level security (42501)`, async () => {
      const target = d.target(world);
      const res = await client.from('pages').insert({
        site_id: target.siteId,
        business_id: target.businessId,
        slug: 'isolation-attack',
        title: 'Attack',
        position: 50,
      });
      expect(res.error?.code).toBe('42501');

      const leaked = await service
        .from('pages')
        .select('id')
        .eq('site_id', target.siteId)
        .eq('slug', 'isolation-attack');
      expect(rowsOf(leaked)).toEqual([]);
    });

    it(`pages | insert own business_id with other site_id | ${d.who} | refused by foreign key (23503)`, async () => {
      const own = d.own(world)[0];
      const target = d.target(world);
      const res = await client.from('pages').insert({
        site_id: target.siteId,
        business_id: own?.businessId,
        slug: 'isolation-attack',
        title: 'Attack',
        position: 51,
      });
      expect(res.error?.code).toBe('23503');
    });

    it(`sections | insert own business_id with other page_id | ${d.who} | refused by foreign key (23503)`, async () => {
      const own = d.own(world)[0];
      const target = d.target(world);
      const res = await client.from('sections').insert({
        page_id: target.pageId,
        business_id: own?.businessId,
        type: 'hero',
        position: 51,
        content: {},
      });
      expect(res.error?.code).toBe('23503');
    });

    if (d.tables.includes('business_members')) {
      it(`business_members | select | ${d.who} | only her own membership rows`, async () => {
        const rows = rowsOf(await client.from('business_members').select('*'));
        const actor = d.actor(world);
        expect(rows.filter((row) => row.user_id !== actor.id)).toEqual([]);
        expect(rows.map((row) => row.business_id)).toEqual(
          expect.arrayContaining(d.own(world).map((b) => b.businessId)),
        );
      });
    }

    it(`profiles | select | ${d.who} | exactly her own profile`, async () => {
      const rows = rowsOf(await client.from('profiles').select('*'));
      expect(rows).toHaveLength(1);
      expect(rows[0]?.id).toBe(d.actor(world).id);
    });
  });
}
