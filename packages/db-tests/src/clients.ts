// GUARD-OWNED: do not edit. Request changes through the architect.
// Clients and test-user helpers. Only the test project is ever reached, because every
// client is built from loadEnv(), which enforces the project guard.
//
// TODO (to verify): @supabase/supabase-js runs on Node 22 with its native fetch and
// WebSocket and no extra package. The builder records the installed version.
// TODO (to verify): the test project allows email and password sign-in. The product has
// no passwords (R92), so this is for test users only.
// TODO (to verify): admin user creation accepts example.invalid addresses and the
// project's password rules accept the generated passwords.
// TODO (to verify): the test project's sign-in rate limit allows about ten sign-ins
// per run.

import { randomBytes } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { loadEnv } from './env';

export type Db = SupabaseClient;

export interface TestUser {
  id: string;
  email: string;
  password: string;
}

export const TEST_EMAIL_PREFIX = 'isolation-';
export const TEST_EMAIL_SUFFIX = '@example.invalid';

const CLIENT_OPTIONS = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
};

export function anonClient(): Db {
  const env = loadEnv();
  return createClient(env.url, env.anonKey, CLIENT_OPTIONS);
}

export function serviceClient(): Db {
  const env = loadEnv();
  return createClient(env.url, env.serviceRoleKey, CLIENT_OPTIONS);
}

// Only a code or status is reported. Messages can echo row values.
export function stepError(
  step: string,
  error?: { code?: string; status?: number } | null,
): Error {
  const detail = error?.code ?? (error?.status !== undefined ? String(error.status) : undefined);
  return new Error(detail ? `${step} failed (${detail}).` : `${step} failed.`);
}

export function isTestEmail(email: string | undefined): boolean {
  return (
    email !== undefined &&
    email.startsWith(TEST_EMAIL_PREFIX) &&
    email.endsWith(TEST_EMAIL_SUFFIX)
  );
}

export async function createTestUser(role: string): Promise<TestUser> {
  const email = `${TEST_EMAIL_PREFIX}${randomBytes(6).toString('hex')}-${role}${TEST_EMAIL_SUFFIX}`;
  // The fixed ending is there to satisfy common password strength rules.
  const password = `${randomBytes(24).toString('base64url')}Aa1!`;
  const { data, error } = await serviceClient().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) {
    throw stepError('Creating a test user', error);
  }
  return { id: data.user.id, email, password };
}

export async function signedInClient(email: string, password: string): Promise<Db> {
  const client = anonClient();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    throw stepError('Signing in a test user (is password sign-in enabled on the test project?)', error);
  }
  return client;
}

// Businesses go first because businesses.created_by is "on delete restrict" and would
// block the user deletion. Deleting a business cascades to all of its rows.
export async function deleteTestUser(userId: string): Promise<void> {
  const service = serviceClient();
  const businesses = await service.from('businesses').delete().eq('created_by', userId);
  if (businesses.error) {
    throw stepError('Deleting test businesses', businesses.error);
  }
  const user = await service.auth.admin.deleteUser(userId);
  if (user.error) {
    throw stepError('Deleting a test user', user.error);
  }
}

// Removes leftovers from crashed runs. The email must both start with the test prefix
// and end with the reserved test domain, so a real user can never match.
export async function sweepLeftovers(): Promise<void> {
  const service = serviceClient();
  const perPage = 200;
  const leftoverIds: string[] = [];

  for (let page = 1; ; page += 1) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw stepError('Listing users for the leftover sweep', error);
    }
    for (const user of data.users) {
      if (isTestEmail(user.email)) {
        leftoverIds.push(user.id);
      }
    }
    if (data.users.length < perPage) {
      break;
    }
  }

  for (const id of leftoverIds) {
    await deleteTestUser(id);
  }
}
