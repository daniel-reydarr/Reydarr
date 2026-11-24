# Spec 0.7b: Icons, first components and the rebuilt design page

Depends on: 0.6b and 0.7a merged to `main`.
Branch: `phase-0/0.7b-components`, created from an up-to-date `main`.
Read first: `AGENTS.md` section 3a, then `docs/design/05-icons-and-illustration.md` and `06-components.md`.

## What this package does

Adds the icon wrapper, the first real components (Button, IconButton, Input, Card and SettingsCard, Badge), updates the global styles to use the composite text styles, and rebuilds `/design` as a proper style guide with every state shown.

## Named dependency (the only one)

`lucide-react`, added to `apps/web` only, pinned to an exact version. Run `pnpm add -E lucide-react` from `apps/web`. Report the resolved version. Per R140 this is the single approved addition.

## Files (copy verbatim, do not edit)

| Path (under `apps/web/src`) | Purpose |
| --- | --- |
| `components/icons/registry.ts` | The only list of icons. The only file that imports `lucide-react`. |
| `components/icons/Icon.tsx` | Stroke 1.5, sizes 16, 20, 24 |
| `components/icons/registry.test.ts` | Guards the registry rule |
| `components/ui/Button.tsx`, `Button.module.css` | Primary, secondary, ghost, destructive. Sizes. Loading. |
| `components/ui/IconButton.tsx` | Icon-only button with a required label |
| `components/ui/Input.tsx`, `Input.module.css` | Label, helper, error, prefix, optional |
| `components/ui/Card.tsx`, `Card.module.css` | Card and the settings card pattern |
| `components/ui/Badge.tsx`, `Badge.module.css` | Status badges with icon and label |
| `app/globals.css` | Replaced. Uses the composite text styles. |
| `app/design/page.tsx`, `design.module.css` | Replaced. Rebuilt style guide. |
| `app/design/ThemeSwitcher.tsx`, `MotionDemo.tsx` | New client components for the style guide |

## Steps

1. Create the branch from an up-to-date `main`.
2. From `apps/web`, run `pnpm add -E lucide-react`. Report the resolved version.
3. Copy the files in at the same paths, replacing the existing `globals.css`, `design/page.tsx` and `design/design.module.css`.
4. Delete `src/app/design/ThemeButtons.tsx`. The new `ThemeSwitcher.tsx` replaces it.
5. Run typecheck, lint, test and build. Report the test count. Do not edit a delivered file to make a check pass. If an icon name is not found in the installed Lucide version, report the exact error and the nearest name. Do not guess a replacement.
6. Check `/design` in the browser at 375 and 1280, in light and dark. Every section must render, with no horizontal scroll at 375. Report anything that looks off.
7. Confirm in the browser: tabbing reaches every control with a visible focus ring, the Play button moves the four dots, and the theme switcher shows your choice and the applied theme and follows a Windows theme change while System is selected.
8. Commit on the branch and open a pull request. Do not merge until the Vercel preview is green.

## Do not

Do not edit delivered files. Do not add other dependencies. Do not import `lucide-react` outside `registry.ts`. Do not change tokens. Do not set `data-motion`.

## Evidence

Command outputs (typecheck, lint, test with count, build), the resolved `lucide-react` version, the Vercel preview URL, six screenshots of `/design` (375 and 1280, light and dark, plus the Controls section at 375 in both themes), a keyboard tab pass note, and the list of files created, changed or deleted.

## To verify

- Lucide icon names used: ArrowLeft, Check, ChevronDown, ChevronRight, CircleAlert, CircleCheck, CircleX, Globe, House, Inbox, Info, LoaderCircle, Menu, Plus, Search, Send, Settings, Sparkles, TriangleAlert, X.
- `container-type` and the `cqw` unit work in the motion demo on the target browsers.
- Input `:has()` styling for the disabled field renders correctly.
- Tabular figures: report whether the left and right number boxes differ in Manrope and in DM Sans.
- Report the font file names and sizes in the Network tab, and whether they come from the site's own domain.
