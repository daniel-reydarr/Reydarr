// GUARD-OWNED: do not edit. Request changes through the architect.
// Proves the create_business function: what it builds, its exact errors, and that a
// person's second business stays hidden from other people.

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { anonClient, serviceClient, signedInClient, type Db } from '../src/clients';
import { getWorld, rowsOf, type World } from '../src/fixtures';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe('create_business', () => {
  let world: World;
  let service: Db;
  let clientA: Db;
  let clientB: Db;
  let createdId: string;
  const extraIds: string[] = [];

  beforeAll(async () => {
    world = getWorld();
    service = serviceClient();
    clientA = await signedInClient(world.userA.email, world.userA.password);
    clientB = await signedInClient(world.userB.email, world.userB.password);

    const res = await clientA.rpc('create_business', {
      p_name: 'Isolation Created',
      p_category: 'general',
    });
    createdId = typeof res.data === 'string' ? res.data : '';
    if (createdId !== '') {
      extraIds.push(createdId);
    }
  });

  // Keeps user A's visible businesses at A1 and A2 for the other files.
  afterAll(async () => {
    if (extraIds.length > 0) {
      await service.from('businesses').delete().in('id', extraIds);
    }
  });

  it('create_business | rpc | user A | returns a uuid', () => {
    expect(createdId).toMatch(UUID);
  });

  it('business_members | after create_business | privileged | exactly one owner row for the caller', async () => {
    const rows = rowsOf(await service.from('business_members').select('*').eq('business_id', createdId));
    expect(rows).toHaveLength(1);
    expect(rows[0]?.role).toBe('owner');
    expect(rows[0]?.user_id).toBe(world.userA.id);
  });

  it('sites | after create_business | privileged | exactly one site row', async () => {
    const rows = rowsOf(await service.from('sites').select('id').eq('business_id', createdId));
    expect(rows).toHaveLength(1);
  });

  it('businesses | after create_business | privileged | created_by equals the caller', async () => {
    const rows = rowsOf(await service.from('businesses').select('*').eq('id', createdId));
    expect(rows).toHaveLength(1);
    expect(rows[0]?.created_by).toBe(world.userA.id);
  });

  it('create_business | one character name | user A | fails with invalid_name (22023)', async () => {
    const res = await clientA.rpc('create_business', { p_name: 'x', p_category: 'general' });
    expect(res.error?.code).toBe('22023');
    expect(res.error?.message).toBe('invalid_name');
  });

  it('create_business | bad category | user A | fails with invalid_category (22023)', async () => {
    const res = await clientA.rpc('create_business', {
      p_name: 'Isolation Bad Category',
      p_category: 'not_a_category',
    });
    expect(res.error?.code).toBe('22023');
    expect(res.error?.message).toBe('invalid_category');
  });

  it('create_business | name with surrounding whitespace | user A | stored trimmed', async () => {
    const res = await clientA.rpc('create_business', {
      p_name: '  Isolation Trim  ',
      p_category: 'general',
    });
    expect(res.error).toBeNull();
    const id = typeof res.data === 'string' ? res.data : '';
    expect(id).toMatch(UUID);
    extraIds.push(id);

    const rows = rowsOf(await service.from('businesses').select('name').eq('id', id));
    expect(rows[0]?.name).toBe('Isolation Trim');
  });

  it('create_business | rpc | anonymous | refused', async () => {
    const res = await anonClient().rpc('create_business', {
      p_name: 'Anonymous Attempt',
      p_category: 'general',
    });
    expect(res.error).not.toBeNull();
    expect(res.data).toBeNull();
  });

  it('businesses | second business | user A | works and user B cannot see it', async () => {
    const own = rowsOf(
      await clientA.from('businesses').select('id').in('id', [world.a2.businessId, createdId]),
    );
    expect(own).toHaveLength(2);

    const other = await clientB
      .from('businesses')
      .select('id')
      .in('id', [world.a2.businessId, createdId]);
    expect(other.error).toBeNull();
    expect(rowsOf(other)).toEqual([]);
  });

  it('profiles | sign-up trigger | privileged | a profile row exists for each new user', async () => {
    const rows = rowsOf(
      await service.from('profiles').select('id').in('id', [world.userA.id, world.userB.id]),
    );
    expect(rows).toHaveLength(2);
  });
});
