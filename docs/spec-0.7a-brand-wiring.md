# Spec 0.7a: Brand wiring

Depends on: 0.6b merged to `main` (the home page uses the `type-body-lg` class from `type.css`).
Branch: `phase-0/0.7a-brand`, created from an up-to-date `main`.
Read first: `AGENTS.md` section 3a and `docs/design/07-logo-and-brand-usage.md`.

## What this package does

Puts the real Reydarr identity into the app with no new dependency: logo files, a theme-aware `Logo` component, the Zuri mark behind one component, the favicon, the Apple icon, the web manifest, and a branded holding page. The Lucide icons, the first components and the rebuilt `/design` page come in spec 0.7b.

## Files (copy verbatim, do not edit)

| Path (under `apps/web`) | Purpose |
| --- | --- |
| `public/brand/*.svg` (14 files) | The logo and Zuri files the app uses. The rest stay in the brand pack. |
| `public/icons/*.png` (3 files) | Manifest icons: 192, 512, maskable 512 |
| `src/app/icon.svg` | Favicon (compact mark, readable on light and dark tabs) |
| `src/app/favicon.ico` | Replaces the default Next favicon |
| `src/app/apple-icon.png` | Apple touch icon, 180 |
| `src/app/manifest.ts` | Web manifest |
| `src/app/page.tsx`, `page.module.css` | Branded holding page. Replaces the plain home page. |
| `src/components/brand/files.ts` | Single list of brand file paths |
| `src/components/brand/ThemedImage.tsx` and `.module.css` | Internal: light and dark image swap by CSS, no JavaScript |
| `src/components/brand/Logo.tsx` | Lockup, mark and wordmark. Mark detail follows size. |
| `src/components/brand/ZuriMark.tsx` and `.module.css` | `ZuriMark` and `ZuriAvatar`. The only place the Zuri mark renders (R144). |
| `src/components/brand/files.test.ts` | Checks every brand path exists and is a safe SVG |

## Steps

1. Create the branch from an up-to-date `main`.
2. Copy the files in at the same paths. If your scaffold has its own `src/app/favicon.ico` or `public/*.svg` defaults, the favicon is replaced and the others are left alone.
3. Run typecheck, lint, test and build. Report the test count. Do not edit a delivered file to make a check pass. Write a change request instead.
4. Check in the browser, in light and dark:
   - Home page shows the lockup in the right color for each theme, with no flash on reload.
   - Browser tab shows the Reydarr favicon.
   - `/manifest.webmanifest` returns JSON with three icons.
   - `/apple-icon.png` and `/icon.svg` open.
5. Commit on the branch. Open a pull request. Do not merge until the Vercel preview and checks are green.

## Evidence

Command outputs (typecheck, lint, test with count, build), the Vercel preview URL, four screenshots of the home page (375 and 1280 wide, light and dark), and the list of files created or changed.

## To verify

- Whether Next prints a warning for fractional or `unoptimized` SVG images. Report any.
- Whether the lockup is crisp at 48px height on a phone.
- The manifest `theme_color` is the light value. Report if a dark theme color is wanted.
- The holding page uses the existing site description as its only line. The tagline "Run the map." is not shown yet because the trademark search is still pending (R115).
