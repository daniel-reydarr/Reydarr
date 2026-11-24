/* Guards the brand files. Every path in files.ts must exist in public and be a plain SVG
   with no script, text or external references. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { BRAND } from './files';

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'public');

const paths = Object.values(BRAND).flatMap((a) => [a.light, a.dark]);

describe('brand files', () => {
  it.each(paths)('%s exists and is a safe SVG', (p) => {
    const file = join(publicDir, p);
    expect(existsSync(file)).toBe(true);
    const svg = readFileSync(file, 'utf8');
    expect(svg.trimStart().startsWith('<svg')).toBe(true);
    expect(svg).not.toMatch(/<script|<text|<image|href=/);
  });

  it('keeps width and height matching each file viewBox', () => {
    for (const a of Object.values(BRAND)) {
      const svg = readFileSync(join(publicDir, a.light), 'utf8');
      const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
      expect(m).not.toBeNull();
      expect(Number(m?.[1])).toBeCloseTo(a.width, 1);
      expect(Number(m?.[2])).toBeCloseTo(a.height, 1);
    }
  });
});
