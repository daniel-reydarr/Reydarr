// GUARD-OWNED: do not edit. Request changes through the architect.
// Proves the page slug rules as user A experiences them on A1.

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { serviceClient, signedInClient, type Db } from '../src/clients';
import { getWorld, type World } from '../src/fixtures';

const BAD_SLUGS: { label: string; slug: string }[] = [
  { label: 'empty slug', slug: '' },
  { label: 'slug with a space and capitals', slug: 'Bad Slug' },
  { label: 'slug of 61 characters', slug: 'a'.repeat(61) },
];

describe('page slug constraints as user A on A1', () => {
  let world: World;
  let client: Db;

  beforeAll(async () => {
    world = getWorld();
    client = await signedInClient(world.userA.email, world.userA.password);
  });

  // The good slug is removed so later files see only the seeded page.
  afterAll(async () => {
    await serviceClient().from('pages').delete().eq('site_id', world.a1.siteId).eq('slug', 'home-2');
  });

  function page(slug: string, position: number) {
    return {
      site_id: world.a1.siteId,
      business_id: world.a1.businessId,
      slug,
      title: 'Constraint test',
      position,
    };
  }

  for (const { label, slug } of BAD_SLUGS) {
    it(`pages | insert ${label} | user A | rejected (23514)`, async () => {
      const res = await client.from('pages').insert(page(slug, 70));
      expect(res.error?.code).toBe('23514');
    });
  }

  it('pages | insert slug home-2 | user A | works', async () => {
    const res = await client.from('pages').insert(page('home-2', 71));
    expect(res.error).toBeNull();
  });

  it('pages | insert duplicate slug in the same site | user A | rejected (23505)', async () => {
    // The seeded page already uses the slug home.
    const res = await client.from('pages').insert(page('home', 72));
    expect(res.error?.code).toBe('23505');
  });
});
