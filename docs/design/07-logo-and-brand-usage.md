# 07 Logo and brand usage

Assets come from `reydarr-brand.zip`. The app ships only a small subset in `public/brand/` and in the Next.js file-convention locations. The rest stays in the brand pack.

## Which file for which background

| Background | Use | File |
| --- | --- | --- |
| Bone, white, light surfaces | Light lockup (peach rings, Ink wordmark) | reydarr-lockup-light |
| Ink, Night, dark surfaces | Dark lockup (Ping rings, Bone wordmark) | reydarr-lockup-dark |
| Ping fill | Ink version made for Ping surfaces | reydarr-lockup-orange (confirm naming) |
| One-color print or embossing | Mono Ink or Mono Bone | reydarr-lockup-mono-ink, reydarr-lockup-mono-bone |
| Square placements 32px and below | Compact mark | reydarr-mark-compact-* |
| 16px and favicons | Micro mark | reydarr-mark-micro-* |

Files named "mark-orange" and "compact-orange" render in Ink. They are assumed to be for orange backgrounds. Confirm before using them anywhere else.

## Theme-aware component

One `Logo` component picks the correct file for the current theme and size. Variants: `lockup`, `mark`, `wordmark`. Product code never references a logo file path directly. It renders SVG with `alt="Reydarr"` for the lockup, and empty alt where the name sits next to it.

## Clear space and minimum size

- Clear space equals the diameter of the Ping dot on all sides (R135).
- Minimum lockup height 24px. Below that use the mark alone.
- Mark: full mark 40px and up, compact 17 to 39px, micro 16px and below.
- Nav and app header: lockup at 28px height on laptops. Phone header uses the mark at 28px with the page title beside it.

## Do not

Recolor, stretch, rotate, outline, add shadows or glow, place on busy photos without a solid scrim, retype the wordmark, put chrome on text, or crop the rings. Do not place the Zuri mark beside the Reydarr mark at equal size. Reydarr is the platform and leads.

## Metadata and app icons

Use Next.js file conventions: `app/icon.svg` (micro or compact mark), `app/favicon.ico` from the pack, `app/apple-icon.png` (180), a web manifest with the 192 and 512 icons and the maskable 512, and a social image 1200 by 630 (Ink background, lockup, tagline "Run the map."). Theme color equals bg-page.

## Zuri mark

- The current Zuri icon is a placeholder. A redesign is planned, so build for replacement.
- Exactly one component, `ZuriMark`, renders it. Everything else uses `ZuriMark` or `ZuriAvatar`. When the new mark arrives, only the files behind that component change.
- Avatar: Ink on Bone in light, Bone on Ink in dark.
- No "ZURI" lettering in the app and no gold edge (R133).
- The 3D-tilt versions are for marketing moments, not the app.

## Chrome

Chrome is a finish for hero moments and badges (R125, R128). It is never a text color or a fill for UI. The current chrome and 3D files are basic and are not final. Do not build features on them. A better chrome finish will be designed with the Zuri update and the plan badges.

## Brand motion

The rings may expand once on marketing load or when a site goes live (04). No looping logos. No spinning or morphing.
