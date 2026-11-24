# Spec 0.6b: Design tokens v2

Lane: builder (FreeBuff or DeepSeek). Read AGENTS.md first, including section 3a, then `docs/design/00-principles-and-rubric.md`, `01-color.md`, `02-typography.md` and `04-motion.md`. Stop and ask if anything here is unclear or fails.
Save as `docs/specs/spec-0.6b-tokens-v2.md`. Depends on: 0.6 merged to `main`, and the `docs/design/` files committed.
Branch: `phase-0/0.6b-tokens-v2`, created from an up-to-date `main`.

## Change request for architect (summary)

The design review of 0.6 found the tokens were competent but generic for a Vercel-level standard (R137). This package replaces the token files with values decided in `docs/design/`. The files are architect-owned. They are delivered complete in `0.6b-files.zip` and are copied verbatim. If a value looks wrong or a test fails, do not edit the file. Write a "Change request for architect" and stop that part.

## 1. Files delivered by the architect (copy verbatim, do not edit)

Extract `0.6b-files.zip` at the repo root.

| File | Change |
| --- | --- |
| `apps/web/src/styles/tokens/palette.css` | Replaced. Adds navy-450, navy-350, bone-150. Ping steps are now 400, 500, 600, 700, 800 (550 and 650 removed, 700 holds the old 650 value). |
| `apps/web/src/styles/tokens/themes.css` | Replaced. Adds roles bg-hover, bg-selected, bg-raised, text-tertiary, action-edge, edge-highlight, elev-1, elev-2, elev-3. Pressed Ping is ping-700 in light and ping-600 in dark. |
| `apps/web/src/styles/tokens/scale.css` | Replaced. New radius scale, layout and control tokens, semantic spacing, coarse-pointer control heights, extra motion tokens, spring easing, theme switch guard. Legacy `--text-*` pairs kept for now. |
| `apps/web/src/styles/tokens/type.css` | New. Composite text styles. |
| `apps/web/src/styles/tokens/contrast.test.ts` | Replaced. More contrast pairs, state and surface checks, theme-color check, v2 palette checks. |
| `apps/web/src/styles/tokens/README.md` | Replaced. |
| `apps/web/src/lib/theme.ts` | Replaced. Three-state theme (light, dark, system), live device following, theme-color meta kept in step, transition guard. `setTheme`, `getTheme` and `clearThemePreference` keep working. |
| `apps/web/src/lib/theme.test.ts` | New. Guards the init script. |

## 2. Steps

1. Create the branch from an up-to-date `main`.
2. Extract the zip at the repo root. Do not edit any extracted file.
3. In `apps/web/src/app/layout.tsx`, add `import '@/styles/tokens/type.css';` directly after the `scale.css` import. Nothing else changes in that file.
4. Run `pnpm test`. Report the exact number of tests and any failure. Do not change a test or a token to pass. An unexpected count or failure means a difference to report.
5. Run `pnpm typecheck`, `pnpm lint` and `pnpm build`.
6. Open `/design` in `pnpm dev` and check it still renders in both themes. Report what you see. Known and expected: the Palette section lists `ping-550` and `ping-650`, which no longer exist, so those two swatches appear empty. Do not edit the design page. Spec 0.7 rebuilds it.
7. Theme behavior, each reported as observed:
   - Device dark, no saved choice: loads dark with no light flash.
   - Choose Light, reload: stays light.
   - Choose System: follows the device. Then change the device theme while the page is open and report whether the page follows.
   - No hydration warning in the console.
   - With a manual choice that differs from the device, report the browser theme-color meta values (Elements panel, `meta[name=theme-color]`).
8. Commit on the branch. Do not commit to `main`.

## 3. Do not

- Do not edit delivered files, `AGENTS.md`, `next.config.ts`, `page.tsx` (home), `globals.css` or any design page file.
- Do not add dependencies. Do not add fonts, icons or components.
- Do not use hex values or `--palette-*` outside the allowed places. The tests enforce this.
- Do not set `data-motion` anywhere.

## 4. Evidence required

1. `node -v`, `pnpm -v`, resolved Next and vitest versions.
2. Full output of `pnpm install` (if needed), `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`.
3. Test count compared with the architect's expected count (see section 5).
4. Screenshots of `/design` at 375 and 1280 wide, light and dark, from the Vercel preview or `pnpm dev`.
5. The theme behavior results from step 7.
6. Files created or changed, one line each, and any blocking questions or deviations.

## 5. Notes from the architect side (to verify)

- The architect checked the new token values with an equivalent script (contrast pairs, role parity in both themes, no hex outside `palette.css`, theme-color equality) and all checks passed. The architect did not run vitest itself. The first `pnpm test` run is the real check. Report the test count so the expected number can be recorded.
- `vitest.config.mts` was not in the files reviewed. If its include pattern does not pick up `src/lib/theme.test.ts`, report it. Do not edit the config.
- `linear()` easing and `text-wrap` are used with safe fallbacks. Report if any build warning appears.
- `pointer: coarse` sets 44px controls. Hybrid laptops with a touchscreen may report a fine primary pointer. Note any odd result.

## 6. Done when

All commands pass, the tests pass, `/design` still renders in both themes, the theme behavior matches step 7, no new dependency exists, and the branch is ready for Code to push.
