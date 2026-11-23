# Spec 0.6: Design tokens, fonts and theme switching

Lane: builder (FreeBuff or DeepSeek). Read AGENTS.md first. Then read `apps/web/AGENTS.md` and the Next.js guides in `node_modules/next/dist/docs/` that cover fonts, the root layout and the viewport export. Stop and ask if anything here is unclear or fails.
Save as `docs/specs/spec-0.6-design-tokens.md`. Depends on: 0.1 merged to `main`.
Branch: `phase-0/0.6-tokens`, created from an up-to-date `main`.

## 1. Inputs from the master plan

- R116, R126: brand palette (Ink `#0A0F1F`, Night `#151B30`, Bone `#F5F2EA`, Ping `#FF5A2C`, Ping Deep `#C73A0F`, Slate `#3A4052`). No second brand accent. Ping is used sparingly, about a tenth of a screen. Ink text on Ping fills. Ping Deep is the orange text color on light backgrounds. A separate functional set (success, danger, warning, info) must not be confusable with Ping.
- R119, R130: light and dark themes from day one, through tokens. Components read role tokens only, never raw colors.
- R125: chrome is a finish for logos, badges and hero moments, never a text or fill color.
- R129: Manrope 600 to 700 for headings, DM Sans for body and interface, tabular figures for numbers. Fonts are served from our own site.
- R122, R131: motion must explain something, uses shared easings and durations, and has a reduced-motion version and a lighter version for weaker devices.
- R124: Framer's dashboard feel is the UI reference.
- R19: phones, tablets and laptops are equally important. Design phone first.
- The master plan names the tokens file but gives no values for the neutral scale, functional colors, type scale, spacing, radius, shadows or motion. Those values are decided in this spec and delivered in the files below.

## 2. Files delivered by the architect (copy verbatim, do not edit)

`0.6-files.zip` holds these files. Extract it at the repo root so the paths below are created.

- `apps/web/src/styles/tokens/palette.css` (all raw colors)
- `apps/web/src/styles/tokens/themes.css` (role tokens for light and dark)
- `apps/web/src/styles/tokens/scale.css` (type, spacing, radius, layers, motion)
- `apps/web/src/styles/tokens/contrast.test.ts` (contrast and roles-only tests)
- `apps/web/src/styles/tokens/README.md` (rules and breakpoints)
- `apps/web/src/lib/theme.ts` (theme API and the early theme script)
- `apps/web/vitest.config.mts`

If a value in these files looks wrong, or a test fails, do not change the file. Write a "Change request for architect" and stop that part. The `.gitkeep` in `src/styles/tokens/` can stay.

## 3. Decisions fixed by this spec (do not change)

- Plain CSS custom properties, three layers: palette, roles, scale. No Tailwind, CSS-in-JS or UI kit.
- Fonts come from `next/font/google`. Next downloads them at build time and serves them from our own domain, which meets R129. Manrope uses weights 600 and 700 with the variable name `--font-manrope`. DM Sans uses weights 400, 500 and 600 with the variable name `--font-dm-sans`. Latin subset only, `display: 'swap'`. No other fonts.
- The theme is applied by a script in `<head>` that runs before first paint. A saved choice wins, otherwise the device setting decides. Without JavaScript the page is light.
- One new dev dependency in `apps/web`: `vitest`, pinned exactly to 5.1.1 (the version `zuri-core` already uses). Nothing else is added.
- Motion capability detection is not built. Only the CSS hooks exist (`prefers-reduced-motion`, and `data-motion='lite'`, which nothing sets yet).
- The chart palette (R126) is deferred to the first spec that draws a chart. This package does not define chart colors.
- Plan badges and chrome finishes (R128) are out of scope.
- Logos, the wordmark and icons are not used in this package (they arrive in 0.7).

## 4. Steps

1. Create the branch `phase-0/0.6-tokens` from an up-to-date `main`.
2. Extract `0.6-files.zip` at the repo root.
3. In `apps/web/package.json` add the script `"test": "vitest run"` and the dev dependency `vitest` at exactly `5.1.1`. Run `pnpm install` from the repo root and report the resolved version.
4. Edit `apps/web/src/app/layout.tsx` as described in section 5.
5. Replace `apps/web/src/app/globals.css` as described in section 6.
6. Create the design page as described in section 7.
7. Run the checks in section 9 and collect the evidence.
8. Commit on the branch. Do not commit to `main`.

## 5. Root layout (`apps/web/src/app/layout.tsx`)

Read the existing file first and keep its `metadata` export unchanged. The result must be equivalent to this:

```tsx
import type { Viewport } from 'next';
import { DM_Sans, Manrope } from 'next/font/google';
import { THEME_COLORS, THEME_INIT_SCRIPT } from '@/lib/theme';
import '@/styles/tokens/palette.css';
import '@/styles/tokens/themes.css';
import '@/styles/tokens/scale.css';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-manrope',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-dm-sans',
});

// keep the existing `metadata` export here, unchanged

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: THEME_COLORS.light },
    { media: '(prefers-color-scheme: dark)', color: THEME_COLORS.dark },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

Match the existing file's typing for `children` if it differs. If the Next version rejects a plain `<script>` in `<head>`, or the import order fails, stop and report. Do not switch approach.

## 6. Global styles (`apps/web/src/app/globals.css`), exact content

```css
/* Base styles. Tokens come from src/styles/tokens, loaded in layout.tsx. No hex values here. */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  background: var(--bg-page);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: var(--text-base-size);
  line-height: var(--text-base-line);
  font-weight: var(--weight-regular);
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3,
h4 {
  margin: 0;
  font-family: var(--font-heading);
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-heading);
}

h3,
h4 {
  font-weight: var(--weight-semibold);
}

a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

button,
input,
select,
textarea {
  font: inherit;
  color: inherit;
}

img,
svg,
video {
  max-width: 100%;
}

:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

[data-numeric] {
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

Do not change the home page (`src/app/page.tsx`). It stays a plain page that shows the word "Reydarr".

## 7. Design page (a style guide for checking the tokens)

Files:

- `apps/web/src/app/design/page.tsx` (server component)
- `apps/web/src/app/design/ThemeButtons.tsx` (`'use client'`)
- `apps/web/src/app/design/design.module.css`

Rules for the page:

- It must return `notFound()` when `process.env.VERCEL_ENV === 'production'`, so it never shows on the live site. Whether `VERCEL_ENV` is set during the build is to verify. Report what you observe.
- Export `metadata` with the title "Design tokens" and `robots: { index: false, follow: false }`.
- Every color comes from a role token, except Section 1 below, which may read `--palette-*`. The files in `src/app/design/` are the only place allowed to do that.
- No hex values in any file. No horizontal scroll at 390px wide. Buttons are at least `var(--tap-min)` tall.
- Plain and tidy. It is a checking tool and not a marketing page.

Sections, in this order:

1. **Theme.** `ThemeButtons` renders three buttons: Light, Dark and System. Light and Dark call `setTheme`. System calls `clearThemePreference`. Show the current theme (from `getTheme`) after the component mounts.
2. **Palette.** Every `--palette-*` color from `palette.css` as a swatch with its name. Keep the list of names in `page.tsx`.
3. **Roles.** Every role from `themes.css` (backgrounds, borders, text, action, focus ring, functional) as a swatch with its name and a short sample of text where it applies.
4. **Typography.** Each size from xs to 5xl in the heading font (sample text "Run the map.") and in the body font (a sentence). Weights 400, 500, 600 and 700 where available. A tabular-figures check: two columns of numbers (for example 1,234.50, 11,111.11 and 8,888.88), one with `data-numeric` and one without.
5. **Spacing, radius and shadow.** Bars for each spacing step, boxes for each radius, three cards for the three shadows.
6. **Motion.** Three boxes that move on a "Play" button press, using `--duration-fast`, `--duration-base` and `--duration-slow` with `--ease-standard`. They must be instant when reduced motion is on.
7. **Controls.** A primary button (Ping, Ink text) with hover, pressed and disabled looks. A secondary button with a `--border-strong` border. A text input with a `--border-strong` border. Four status chips (success, danger, warning, info), each with an icon glyph (use ✓ ✕ ! i, marked `aria-hidden`) and a text label.

## 8. Do not

- Do not edit the delivered files. Do not edit `AGENTS.md`, `next.config.ts`, `page.tsx` (home) or any guard-owned file.
- Do not add dependencies other than `vitest` 5.1.1. Do not add Tailwind, an animation library, an icon library or more fonts.
- Do not use hex values or `--palette-*` outside the allowed places. The tests enforce this.
- Do not set `data-motion` anywhere. Do not build device detection.
- Do not add routes other than `/design`. Do not create or fill any `.env*` file.

## 9. Evidence required

1. `node -v`, `pnpm -v`, and the resolved versions of `vitest` and Next.
2. Full output of `pnpm install`, `pnpm typecheck`, `pnpm lint`, `pnpm test` and `pnpm build`. `pnpm test` must run the `apps/web` tests and show them passing. The architect's own run of `contrast.test.ts` reported 79 passing tests. A different count means something differs, so report it.
3. The route list from `pnpm build`, which must include `/design`.
4. The Vercel preview URL of the branch and four full-page screenshots of `/design` at 390px and 1280px wide, each in light and dark. If Vercel is not connected yet, screenshots from `pnpm dev` are accepted for this package, and Code can take them.
5. Theme behavior, each reported as observed:
   - With the device set to dark and no saved choice, the page loads dark with no light flash.
   - After clicking Light and reloading, it stays light.
   - After clicking System, it follows the device again.
   - No hydration warning appears in the browser console.
6. Font check: from the browser's Network tab, the file names and sizes of the font files, which must be served from the site's own domain (not from Google). Report whether numbers line up in both fonts in the tabular-figures sample. DM Sans and Manrope support for tabular figures is to verify.
7. A list of files created or changed, with a one-line reason each, and any blocking questions or deviations.

## 10. Done when

All five commands pass, the tests pass, `/design` shows every section correctly at both widths in both themes, the theme behavior matches section 9 item 5, no new dependency beyond `vitest` exists, and the branch is ready for Code to push.
