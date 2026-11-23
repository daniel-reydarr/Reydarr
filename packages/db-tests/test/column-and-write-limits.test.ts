// GUARD-OWNED: do not edit. Request changes through the architect.
// Proves what an owner's browser session may and may not write on her own business A1,
// including the column-level limits.

import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { signedInClient, type Db } from '../src/clients';
import { getWorld, restoreFixtures, rowsOf, type World } from '../src/fixtures';

interface Outcome {
  error: { code?: string } | null;
}

interface RefusedCase {
  title: string;
  run: (client: Db, world: World) => Promise<Outcome>;
}

const REFUSED: RefusedCase[] = [
  {
    title: 'businesses | insert | user A | refused (42501)',
    run: async (c, w) =>
      c.from('businesses').insert({ name: 'Direct Insert', category: 'general', created_by: w.userA.id }),
  },
  {
    title: 'businesses | delete | user A | refused (42501)',
    run: async (c, w) => c.from('businesses').delete().eq('id', w.a1.businessId),
  },
  {
    title: 'business_members | insert | user A | refused (42501)',
    run: async (c, w) =>
      c.from('business_members').insert({
        business_id: w.a1.businessId,
        user_id: w.userA.id,
        role: 'staff',
      }),
  },
  {
    title: 'site_versions | insert | user A | refused (42501)',
    run: async (c, w) =>
      c.from('site_versions').insert({
        site_id: w.a1.siteId,
        business_id: w.a1.businessId,
        kind: 'published',
        version_number: 99,
        snapshot: {},
      }),
  },
  {
    title: 'usage_ledger | insert | user A | refused (42501)',
    run: async (c, w) =>
      c.from('usage_ledger').insert({
        business_id: w.a1.businessId,
        entry_type: 'credit',
        meter: 'top_up_image',
        quantity: 1,
      }),
  },
  {
    title: 'audit_log | insert | user A | refused (42501)',
    run: async (c, w) =>
      c.from('audit_log').insert({
        business_id: w.a1.businessId,
        actor_type: 'owner',
        action: 'direct_insert',
        entity_type: 'test',
      }),
  },
  {
    title: 'businesses | update status | user A | refused (42501)',
    run: async (c, w) => c.from('businesses').update({ status: 'suspended' }).eq('id', w.a1.businessId),
  },
  {
    title: 'businesses | update subdomain | user A | refused (42501)',
    run: async (c, w) =>
      c.from('businesses').update({ subdomain: 'isolation-direct' }).eq('id', w.a1.businessId),
  },
  {
    title: 'businesses | update created_by | user A | refused (42501)',
    run: async (c, w) =>
      c.from('businesses').update({ created_by: w.userB.id }).eq('id', w.a1.businessId),
  },
  {
    title: 'pages | update site_id | user A | refused (42501)',
    run: async (c, w) => c.from('pages').update({ site_id: w.a2.siteId }).eq('id', w.a1.pageId),
  },
  {
    title: 'pages | update business_id | user A | refused (42501)',
    run: async (c, w) =>
      c.from('pages').update({ business_id: w.a2.businessId }).eq('id', w.a1.pageId),
  },
  {
    title: 'sections | update page_id | user A | refused (42501)',
    run: async (c, w) => c.from('sections').update({ page_id: w.a2.pageId }).eq('id', w.a1.sectionId),
  },
  {
    title: 'sections | update business_id | user A | refused (42501)',
    run: async (c, w) =>
      c.from('sections').update({ business_id: w.a2.businessId }).eq('id', w.a1.sectionId),
  },
];

describe('user A on her own business A1: write and column limits', () => {
  let world: World;
  let client: Db;

  beforeAll(async () => {
    world = getWorld();
    client = await signedInClient(world.userA.email, world.userA.password);
  });

  // Puts A1 back even when a case fails halfway.
  afterEach(async () => {
    await restoreFixtures(world);
  });

  for (const refused of REFUSED) {
    it(refused.title, async () => {
      const res = await refused.run(client, world);
      expect(res.error?.code).toBe('42501');
    });
  }

  it('businesses | update name | user A | works', async () => {
    const res = await client
      .from('businesses')
      .update({ name: 'Isolation A One Renamed' })
      .eq('id', world.a1.businessId)
      .select('id,name');
    expect(res.error).toBeNull();
    expect(rowsOf(res).map((row) => row.name)).toEqual(['Isolation A One Renamed']);
  });

  it('businesses | update category | user A | works', async () => {
    const res = await client
      .from('businesses')
      .update({ category: 'professional_services' })
      .eq('id', world.a1.businessId)
      .select('id,category');
    expect(res.error).toBeNull();
    expect(rowsOf(res).map((row) => row.category)).toEqual(['professional_services']);
  });

  it('sites | update recipe | user A | works', async () => {
    const res = await client
      .from('sites')
      .update({ recipe: { layout: 'isolation' } })
      .eq('id', world.a1.siteId)
      .select('id,recipe');
    expect(res.error).toBeNull();
    expect(rowsOf(res).map((row) => row.recipe)).toEqual([{ layout: 'isolation' }]);
  });

  it('pages | update title | user A | works', async () => {
    const res = await client
      .from('pages')
      .update({ title: 'Isolation page changed' })
      .eq('id', world.a1.pageId)
      .select('id,title');
    expect(res.error).toBeNull();
    expect(rowsOf(res).map((row) => row.title)).toEqual(['Isolation page changed']);
  });

  it('sections | update content | user A | works', async () => {
    const res = await client
      .from('sections')
      .update({ content: { text: 'changed' } })
      .eq('id', world.a1.sectionId)
      .select('id,content');
    expect(res.error).toBeNull();
    expect(rowsOf(res).map((row) => row.content)).toEqual([{ text: 'changed' }]);
  });

  it('profiles | update display_name | user A | works', async () => {
    const res = await client
      .from('profiles')
      .update({ display_name: 'Isolation Tester' })
      .eq('id', world.userA.id)
      .select('id,display_name');
    expect(res.error).toBeNull();
    expect(rowsOf(res).map((row) => row.display_name)).toEqual(['Isolation Tester']);
  });
});
