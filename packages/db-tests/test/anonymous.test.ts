// GUARD-OWNED: do not edit. Request changes through the architect.
// Proves that a visitor with no session can read or write nothing.
//
// TODO (to verify): the codes asserted here are the ones PostgREST returns for a missing
// table privilege. The spec gives no code for the function calls, so those only assert an
// error and no data.

import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { anonClient } from '../src/clients';
import { TABLES } from '../src/fixtures';

describe('anonymous visitor', () => {
  for (const table of TABLES) {
    it(`${table} | select | anonymous | refused (42501)`, async () => {
      const res = await anonClient().from(table).select('*').limit(1);
      expect(res.error?.code).toBe('42501');
      expect(res.data).toBeNull();
    });

    it(`${table} | insert | anonymous | refused (42501)`, async () => {
      const res = await anonClient().from(table).insert({ id: randomUUID() });
      expect(res.error?.code).toBe('42501');
    });
  }

  it('create_business | rpc | anonymous | refused', async () => {
    const res = await anonClient().rpc('create_business', {
      p_name: 'Anonymous Attempt',
      p_category: 'general',
    });
    expect(res.error).not.toBeNull();
    expect(res.data).toBeNull();
  });

  it('is_business_member | rpc | anonymous | refused', async () => {
    const res = await anonClient().rpc('is_business_member', { p_business_id: randomUUID() });
    expect(res.error).not.toBeNull();
    expect(res.data).toBeNull();
  });
});
