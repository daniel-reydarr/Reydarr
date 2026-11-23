// GUARD-OWNED: do not edit. Request changes through the architect.
// Loads the test environment and refuses to run against any project other than the test
// project. The tests create and delete users with the privileged key, so a wrong project
// here would be destructive. No value is ever printed.
//
// TODO (to verify): import.meta.url resolves to a file URL under vitest 5.1.1.

import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface TestEnv {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
  projectRef: string;
}

const REQUIRED_NAMES = [
  'TEST_SUPABASE_URL',
  'TEST_SUPABASE_ANON_KEY',
  'TEST_SUPABASE_SERVICE_ROLE_KEY',
  'TEST_SUPABASE_PROJECT_REF',
] as const;

type EnvName = (typeof REQUIRED_NAMES)[number];

let cached: TestEnv | undefined;

function read(name: EnvName): string {
  return (process.env[name] ?? '').trim();
}

// Resolved from this file and not from the working directory, so the path is the same
// whichever folder the command is run from.
export function envFilePath(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), '..', '.env.test');
}

export function loadEnv(): TestEnv {
  if (cached) {
    return cached;
  }

  const file = envFilePath();
  if (existsSync(file)) {
    process.loadEnvFile(file);
  }

  const missing = REQUIRED_NAMES.filter((name) => read(name) === '');
  if (missing.length > 0) {
    throw new Error(
      `Missing test environment variables: ${missing.join(', ')}. ` +
        'Copy env.test.example to .env.test in packages/db-tests and fill it in.',
    );
  }

  const projectRef = read('TEST_SUPABASE_PROJECT_REF');
  if (!/^[a-z0-9-]+$/.test(projectRef)) {
    throw new Error('TEST_SUPABASE_PROJECT_REF must use lowercase letters, digits and hyphens only.');
  }

  let parsed: URL;
  try {
    parsed = new URL(read('TEST_SUPABASE_URL'));
  } catch {
    throw new Error('TEST_SUPABASE_URL is not a valid URL.');
  }

  // The host must be exactly the test project's host. This is the guard that stops the
  // run from touching any other project, so it must not be loosened.
  if (parsed.protocol !== 'https:' || parsed.host !== `${projectRef}.supabase.co`) {
    throw new Error(
      'Refusing to start: TEST_SUPABASE_URL does not point at the project named by ' +
        'TEST_SUPABASE_PROJECT_REF. Check that both belong to the TEST project.',
    );
  }

  cached = {
    url: parsed.toString(),
    anonKey: read('TEST_SUPABASE_ANON_KEY'),
    serviceRoleKey: read('TEST_SUPABASE_SERVICE_ROLE_KEY'),
    projectRef,
  };
  return cached;
}
