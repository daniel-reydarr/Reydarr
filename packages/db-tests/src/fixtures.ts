// GUARD-OWNED: do not edit. Request changes through the architect.
// The shared world (users A and B, businesses A1, B1 and A2 with one row in each
// business-owned table). It is built once per run by vitest's global setup, which loads
// this file, and handed to the test files through provide and inject.
//
// TODO (to verify): against vitest 5.1.1, that globalSetup accepts the named exports
// setup and teardown, that the setup argument has a provide method, and that the
// ProvidedContext augmentation below is the right way to type inject.
// TODO (to verify): the sign-up trigger creates a profile for every new user. If it does
// not, creating a business fails with a foreign key error (23503) in setup.

import { inject } from 'vitest';
import {
  createTestUser,
  deleteTestUser,
  serviceClient,
  signedInClient,
  stepError,
  sweepLeftovers,
  type Db,
  type TestUser,
} from './clients';
import { loadEnv } from './env';

export const TABLES = [
  'profiles',
  'businesses',
  'business_members',
  'sites',
  'pages',
  'sections',
  'site_versions',
  'usage_ledger',
  'audit_log',
] as const;

export type TableName = (typeof TABLES)[number];
export type Row = Record<string, unknown>;
export type BusinessStatus = 'active' | 'suspended' | 'pending_deletion';

export interface BusinessWorld {
  businessId: string;
  name: string;
  category: string;
  siteId: string;
  pageId: string;
  sectionId: string;
  versionId: string;
  ledgerId: string;
  auditId: string;
}

export interface World {
  userA: TestUser;
  userB: TestUser;
  a1: BusinessWorld;
  b1: BusinessWorld;
  a2: BusinessWorld;
}

declare module 'vitest' {
  interface ProvidedContext {
    isolationWorld: World;
  }
}

export function getWorld(): World {
  return inject('isolationWorld');
}

export function rowsOf(res: { data: unknown }): Row[] {
  return Array.isArray(res.data) ? (res.data as Row[]) : [];
}

// The column that ties a row to its owner: the profile or business itself, or business_id.
export function ownerColumn(table: TableName): string {
  return table === 'profiles' || table === 'businesses' ? 'id' : 'business_id';
}

// How to find one specific fixture row of a business in a table.
export function rowFilter(
  table: TableName,
  business: BusinessWorld,
  user: TestUser,
): { column: string; value: string } {
  switch (table) {
    case 'profiles':
      return { column: 'id', value: user.id };
    case 'businesses':
      return { column: 'id', value: business.businessId };
    case 'business_members':
      return { column: 'business_id', value: business.businessId };
    case 'sites':
      return { column: 'id', value: business.siteId };
    case 'pages':
      return { column: 'id', value: business.pageId };
    case 'sections':
      return { column: 'id', value: business.sectionId };
    case 'site_versions':
      return { column: 'id', value: business.versionId };
    case 'usage_ledger':
      return { column: 'id', value: business.ledgerId };
    case 'audit_log':
      return { column: 'id', value: business.auditId };
  }
}

// Reads rows with the privileged client, so tests can prove a row did not change.
export async function snapshot(table: TableName, column: string, value: string): Promise<Row[]> {
  const res = await serviceClient().from(table).select('*').eq(column, value);
  if (res.error) {
    throw stepError(`Reading ${table}`, res.error);
  }
  return rowsOf(res);
}

async function mustSucceed(
  step: string,
  query: PromiseLike<{ error: { code?: string } | null }>,
): Promise<void> {
  const res = await query;
  if (res.error) {
    throw stepError(step, res.error);
  }
}

export async function setBusinessStatus(businessId: string, status: BusinessStatus): Promise<void> {
  await mustSucceed(
    'Changing a business status',
    serviceClient()
      .from('businesses')
      .update({
        status,
        deletion_requested_at: status === 'pending_deletion' ? new Date().toISOString() : null,
      })
      .eq('id', businessId),
  );
}

// Puts every column that any test may change on A1 and A's profile back to its seeded
// value, so a case that fails halfway cannot leak into the next one.
export async function restoreFixtures(world: World): Promise<void> {
  const service = serviceClient();
  const { a1, userA } = world;
  await mustSucceed(
    'Restoring the business',
    service
      .from('businesses')
      .update({
        name: a1.name,
        category: a1.category,
        status: 'active',
        deletion_requested_at: null,
        subdomain: null,
        created_by: userA.id,
      })
      .eq('id', a1.businessId),
  );
  await mustSucceed(
    'Restoring the site',
    service.from('sites').update({ recipe: {}, published_version_id: null }).eq('id', a1.siteId),
  );
  await mustSucceed(
    'Restoring the page',
    service
      .from('pages')
      .update({ slug: 'home', title: 'Isolation page', position: 0 })
      .eq('id', a1.pageId),
  );
  await mustSucceed(
    'Restoring the section',
    service
      .from('sections')
      .update({ type: 'hero', variant: null, position: 0, content: { text: 'original' } })
      .eq('id', a1.sectionId),
  );
  await mustSucceed(
    'Restoring the profile',
    service.from('profiles').update({ display_name: null }).eq('id', userA.id),
  );
}

function idOf(step: string, res: { data: unknown; error: { code?: string } | null }): string {
  const row = res.data as { id?: unknown } | null;
  if (res.error || !row || typeof row.id !== 'string') {
    throw stepError(step, res.error);
  }
  return row.id;
}

async function seedBusiness(
  service: Db,
  owner: Db,
  name: string,
  category: string,
): Promise<BusinessWorld> {
  const created = await owner.rpc('create_business', { p_name: name, p_category: category });
  if (created.error || typeof created.data !== 'string') {
    throw stepError('Creating a seed business', created.error);
  }
  const businessId: string = created.data;

  const siteId = idOf(
    'Reading the seed site',
    await service.from('sites').select('id').eq('business_id', businessId).single(),
  );
  const pageId = idOf(
    'Creating the seed page',
    await service
      .from('pages')
      .insert({
        site_id: siteId,
        business_id: businessId,
        slug: 'home',
        title: 'Isolation page',
        position: 0,
      })
      .select('id')
      .single(),
  );
  const sectionId = idOf(
    'Creating the seed section',
    await service
      .from('sections')
      .insert({
        page_id: pageId,
        business_id: businessId,
        type: 'hero',
        position: 0,
        content: { text: 'original' },
      })
      .select('id')
      .single(),
  );
  const versionId = idOf(
    'Creating the seed site version',
    await service
      .from('site_versions')
      .insert({
        site_id: siteId,
        business_id: businessId,
        kind: 'published',
        version_number: 1,
        snapshot: { seed: true },
      })
      .select('id')
      .single(),
  );
  const ledgerId = idOf(
    'Creating the seed ledger row',
    await service
      .from('usage_ledger')
      .insert({
        business_id: businessId,
        entry_type: 'usage',
        meter: 'ai_text',
        quantity: 1,
        cost_kobo: 0,
        model: 'test-model',
        prompt_version: 'test-1',
      })
      .select('id')
      .single(),
  );
  const auditId = idOf(
    'Creating the seed audit row',
    await service
      .from('audit_log')
      .insert({
        business_id: businessId,
        actor_type: 'system',
        action: 'seed',
        entity_type: 'test',
      })
      .select('id')
      .single(),
  );

  return { businessId, name, category, siteId, pageId, sectionId, versionId, ledgerId, auditId };
}

const createdUserIds: string[] = [];

async function newUser(role: string): Promise<TestUser> {
  const user = await createTestUser(role);
  createdUserIds.push(user.id);
  return user;
}

async function buildWorld(): Promise<World> {
  const service = serviceClient();
  const userA = await newUser('a');
  const userB = await newUser('b');
  const clientA = await signedInClient(userA.email, userA.password);
  const clientB = await signedInClient(userB.email, userB.password);

  const a1 = await seedBusiness(service, clientA, 'Isolation A One', 'general');
  const b1 = await seedBusiness(service, clientB, 'Isolation B One', 'education');
  const a2 = await seedBusiness(service, clientA, 'Isolation A Two', 'health');
  return { userA, userB, a1, b1, a2 };
}

async function cleanup(): Promise<void> {
  const ids = createdUserIds.splice(0);
  for (const id of ids) {
    await deleteTestUser(id);
  }
}

interface SetupContext {
  provide(key: 'isolationWorld', value: World): void;
}

// Global setup. The project guard runs first, before any network call.
export async function setup(context: SetupContext): Promise<void> {
  loadEnv();
  await sweepLeftovers();
  try {
    context.provide('isolationWorld', await buildWorld());
  } catch (error) {
    await cleanup();
    throw error;
  }
}

export async function teardown(): Promise<void> {
  await cleanup();
}
