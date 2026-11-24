# Reydarr design: principles and 10/10 rubric

Status: approved direction (direction board, 23 Nov 2026). This folder is the source of truth for how the Reydarr app and the Reydarr marketing site look and behave. It does not cover customer sites, which have their own system (R118).

Read this file first, then the file for the area you are working on. If a spec contradicts these files, stop and ask. Do not choose a default.

## Index

| File | Covers |
| --- | --- |
| 01-color.md | Palette, roles, light and dark, elevation, Ping rules |
| 02-typography.md | Fonts, scale, composite text styles |
| 03-layout-and-density.md | Breakpoints, shell, grid, spacing, touch targets, patterns |
| 04-motion.md | Durations, easings, what may animate, reduced motion |
| 05-icons-and-illustration.md | Icon set, sizes, empty-state illustration |
| 06-components.md | Component inventory, sizes, states |
| 07-logo-and-brand-usage.md | Logo variants, clear space, Zuri mark, chrome |
| 08-ui-writing.md | Voice, microcopy, Naira, dates, errors |
| 09-accessibility-and-performance.md | WCAG target, perf budget, evidence matrix |
| 10-design-upgrade-handoff.md | Deferred upgrade plan, ratings and open checks |

## Identity in one line

Reydarr looks like a calm, precise instrument panel for a small business: quiet warm surfaces, sharp type, and one bright signal.

## The ten principles

1. **Signal over noise.** Ping is the signal. About a tenth of a screen, and one Ping primary action per screen. Everything else is neutral.
2. **Quiet surfaces.** Hairline borders do the separating, not heavy shadows or fills. Light mode is flat. Dark mode raises surfaces with lighter steps, a border and a faint top highlight.
3. **Phone first, thumb first.** Design at 375, never break at 360, stress test at 320. Primary actions sit within thumb reach. Phones, tablets and laptops are equally important (R19).
4. **Warm, not cold.** Bone and Ink give Reydarr a human feel that developer tools lack. Owners are not developers. Use plain words and generous touch targets on phones.
5. **Plain words.** Say "website address", not "DNS". Short sentences, verbs on buttons, no jargon, no em-dashes.
6. **Motion explains.** Every animation shows cause, place or state. Nothing decorative moves in the app. Reduced motion and weak phones always have a calm version.
7. **One system, no exceptions.** Components read role tokens and scale tokens only. No raw hex, no one-off sizes, no new colors.
8. **Fast on a weak phone.** Mid-range Android on a throttled connection is the reference device. Budgets in 09 are release gates.
9. **Accessible by default.** WCAG 2.2 AA is the floor. Color never carries meaning alone.
10. **Zuri is a character, not decoration.** Zuri appears where help happens (drafts, edits, suggestions). Never as ornament.

## References and what we take from each

| Reference | Take | Do not take |
| --- | --- | --- |
| Vercel dashboard (Geist) | Structure: hairline cards, dense settings cards, grouped sidebar, menus with icons, small radius | Cold monochrome mood, developer jargon, 14px-only density on phones |
| Shopify Polaris, Mercury | Plain language and friendliness for small business owners, mobile-first admin patterns | Their brand colors |
| Linear | Restraint, speed, keyboard polish, tidy empty states | Purple tint, ultra-dense lists on phones |
| Framer, Stripe | Marketing pages, large confident type, motion craft, hero moments | Heavy gradients, effects that cost weak phones |

References inform quality, not appearance. We never copy another product's layout, assets or proprietary design.

## What Reydarr is not

No neon or cyber look. No gradient washes behind content. No heavy glass or blur on large areas. No emoji as icons. No second brand accent. No chrome as a text or fill color (R125). No illustration outside empty states (R132). No shadows as the main way to separate cards in light mode.

## The 10/10 rubric

A screen or package scores 10 only when every row passes with evidence. Scores are given after screenshots, never before. Any failed row caps that category at 7.

| Category | Pass conditions (all required) |
| --- | --- |
| Color | Roles only, no raw hex outside palette.css and the two theme-color values. Every text pair meets the contrast table in 01. One Ping primary action per screen. Both themes reviewed. |
| Typography | Only the composite styles in 02. Inputs 16px on phones. Numbers tabular. No orphaned single-word last lines in headings (balance). |
| Layout and density | Passes at 320, 360, 375, 768, 1024, 1280 with no horizontal scroll. Touch targets 44px on coarse pointers. Spacing from the scale only. Safe areas respected. |
| Motion | Only transform, opacity and color animate. Durations and easings from tokens. Reduced-motion version works. No motion without a reason written in the PR. |
| Components | Every state in 06 exists and is shown on the design page: default, hover, pressed, focus-visible, disabled, loading, error, selected where applicable. |
| Icons and imagery | One icon set, one stroke weight, one size per context. Empty states use the approved illustration style only. |
| Brand | Correct logo variant for the background, clear space kept, nothing recolored, Zuri mark only through the single ZuriMark component. |
| Writing | Passes the checklist in 08. No em-dashes. Errors are polite and say what to do next. |
| Accessibility | Keyboard complete, visible focus, labels, no color-only meaning, axe shows zero serious or critical issues. |
| Performance | Meets the budget in 09 on the throttled profile. No layout shift from fonts or images. |

## Evidence required for any UI work

1. Screenshots at 375, 768 and 1280 wide, light and dark (six images), plus one overflow check at 360 and one at 320.
2. Axe result with zero serious or critical issues.
3. Lighthouse mobile run on the throttled profile for new routes, with LCP, CLS and INP reported.
4. A "design review" list: each rubric category, pass or fail, with the file or screenshot that proves it.

## Open items

- Chart palette (R126): defined by the first spec that draws a chart. Constraints are in 01.
- Chrome finishes and plan badges (R128): later.
- Zuri icon redesign: planned, placeholder rules in 07.
- Secondary text uses the R116 muted value, which reads slightly cool next to Bone. Revisit after real screens exist.
