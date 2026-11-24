/* Guards the icon rule (R140): one registry, and nothing else imports the icon library. */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ICONS } from './registry';

const srcRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

describe('icon registry', () => {
  it('maps every name to a component', () => {
    for (const [name, glyph] of Object.entries(ICONS)) {
      expect(glyph, name).toBeTruthy();
    }
    expect(Object.keys(ICONS).length).toBeGreaterThanOrEqual(20);
  });

  it('is the only file that imports the icon library', () => {
    const files = (readdirSync(srcRoot, { recursive: true }) as string[])
      .map((f) => f.split(sep).join('/'))
      .filter((f) => /\.(ts|tsx)$/.test(f))
      .filter((f) => f !== 'components/icons/registry.ts' && f !== 'components/icons/registry.test.ts');
    const offenders = files.filter((f) => readFileSync(join(srcRoot, f), 'utf8').includes('lucide-react'));
    expect(offenders).toEqual([]);
  });
});
