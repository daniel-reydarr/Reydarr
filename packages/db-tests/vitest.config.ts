// GUARD-OWNED: do not edit. Request changes through the architect.
// TODO (to verify): the option names below (globalSetup, fileParallelism, allowOnly,
// reporters) against the pinned vitest 5.1.1.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    // Builds the shared world once per run and deletes it afterwards.
    globalSetup: ['./src/fixtures.ts'],
    // The files share businesses and change A1's status, so they must never overlap.
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 120_000,
    allowOnly: false,
    // Prints every case name, which the evidence pack needs.
    reporters: ['verbose'],
  },
});
