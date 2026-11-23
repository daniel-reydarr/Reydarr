/* Guards the design tokens. It fails when a color pair drops below WCAG contrast,
   when a theme is missing a role, or when a component reaches past the roles (R130).
   Change token values only through the architect. */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const tokensDir = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(tokensDir, '..', '..');

const paletteCss = readFileSync(join(tokensDir, 'palette.css'), 'utf8');
const themesCss = readFileSync(join(tokensDir, 'themes.css'), 'utf8');

type Theme = 'light' | 'dark';

function parsePalette(css: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const m of css.matchAll(/--palette-([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    map.set(m[1] as string, (m[2] as string).toLowerCase());
  }
  return map;
}

function block(css: string, selector: string): string {
  const start = css.indexOf(selector);
  if (start === -1) {
    throw new Error(`Selector not found in themes.css: ${selector}`);
  }
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  if (open === -1 || close === -1) {
    throw new Error(`Block not closed in themes.css: ${selector}`);
  }
  return css.slice(open + 1, close);
}

function roleNames(body: string): string[] {
  return [...body.matchAll(/--([a-z0-9-]+)\s*:/g)].map((m) => m[1] as string).sort();
}

function roleToPalette(body: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const m of body.matchAll(/--([a-z0-9-]+)\s*:\s*var\(--palette-([a-z0-9-]+)\)\s*;/g)) {
    map.set(m[1] as string, m[2] as string);
  }
  return map;
}

const palette = parsePalette(paletteCss);
const bodies: Record<Theme, string> = {
  light: block(themesCss, ':root {'),
  dark: block(themesCss, ":root[data-theme='dark'] {"),
};
const roles: Record<Theme, Map<string, string>> = {
  light: roleToPalette(bodies.light),
  dark: roleToPalette(bodies.dark),
};

function hex(theme: Theme, role: string): string {
  const name = roles[theme].get(role);
  if (name === undefined) {
    throw new Error(`Role --${role} is not mapped to a palette color in the ${theme} theme.`);
  }
  const value = palette.get(name);
  if (value === undefined) {
    throw new Error(`Palette color --palette-${name} (role --${role}) does not exist.`);
  }
  return value;
}

function channel(v: number): number {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(color: string): number {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

const functional = ['success', 'danger', 'warning', 'info'] as const;

/* Text pairs need 4.5. Interface pairs (borders, focus ring, solid fills) need 3. */
const textPairs: Array<[string, string]> = [
  ['text-primary', 'bg-page'],
  ['text-primary', 'bg-surface'],
  ['text-primary', 'bg-subtle'],
  ['text-secondary', 'bg-page'],
  ['text-secondary', 'bg-surface'],
  ['text-secondary', 'bg-subtle'],
  ['text-brand', 'bg-page'],
  ['text-brand', 'bg-surface'],
  ['text-on-action', 'action-bg'],
  ['text-on-action', 'action-bg-hover'],
  ['text-on-action', 'action-bg-pressed'],
  ['text-on-inverse', 'bg-inverse'],
  ...functional.flatMap((f): Array<[string, string]> => [
    [`${f}-on-solid`, `${f}-solid`],
    [`${f}-text`, `${f}-subtle`],
    [`${f}-text`, 'bg-page'],
    [`${f}-text`, 'bg-surface'],
  ]),
];

const interfacePairs: Array<[string, string]> = [
  ['border-strong', 'bg-page'],
  ['border-strong', 'bg-surface'],
  ['border-strong', 'bg-subtle'],
  ['focus-ring', 'bg-page'],
  ['focus-ring', 'bg-surface'],
  ...functional.map((f): [string, string] => [`${f}-solid`, 'bg-page']),
];

describe('palette', () => {
  it('holds the brand colors from the master plan (R116)', () => {
    expect(palette.get('ink')).toBe('#0a0f1f');
    expect(palette.get('night')).toBe('#151b30');
    expect(palette.get('bone')).toBe('#f5f2ea');
    expect(palette.get('ping')).toBe('#ff5a2c');
    expect(palette.get('ping-deep')).toBe('#c73a0f');
    expect(palette.get('slate')).toBe('#3a4052');
  });
});

describe('themes', () => {
  it('define exactly the same roles in light and dark', () => {
    expect(roleNames(bodies.dark)).toEqual(roleNames(bodies.light));
  });

  it('map every palette-backed role to an existing palette color', () => {
    for (const theme of ['light', 'dark'] as const) {
      for (const role of roles[theme].keys()) {
        expect(() => hex(theme, role)).not.toThrow();
      }
    }
  });
});

describe.each(['light', 'dark'] as const)('%s theme contrast', (theme) => {
  it.each(textPairs)('text: --%s on --%s is at least 4.5', (fg, bg) => {
    expect(contrast(hex(theme, fg), hex(theme, bg))).toBeGreaterThanOrEqual(4.5);
  });

  it.each(interfacePairs)('interface: --%s against --%s is at least 3', (fg, bg) => {
    expect(contrast(hex(theme, fg), hex(theme, bg))).toBeGreaterThanOrEqual(3);
  });
});

describe('components read roles only (R130)', () => {
  const files = (readdirSync(srcRoot, { recursive: true }) as string[])
    .map((f) => f.split(sep).join('/'))
    .filter((f) => /\.(css|ts|tsx)$/.test(f));

  it('keeps hex values out of every stylesheet except palette.css', () => {
    const offenders = files
      .filter((f) => f.endsWith('.css') && f !== 'styles/tokens/palette.css')
      .filter((f) => /#[0-9a-fA-F]{3,8}\b/.test(readFileSync(join(srcRoot, f), 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('keeps --palette-* out of everything except tokens and the design page', () => {
    const allowed = (f: string) =>
      f === 'styles/tokens/palette.css' ||
      f === 'styles/tokens/themes.css' ||
      f === 'styles/tokens/contrast.test.ts' ||
      f.startsWith('app/design/');
    const offenders = files
      .filter((f) => !allowed(f))
      .filter((f) => readFileSync(join(srcRoot, f), 'utf8').includes('--palette-'));
    expect(offenders).toEqual([]);
  });
});
