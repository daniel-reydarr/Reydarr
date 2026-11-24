# 05 Icons and illustration

R132: one outline icon set, and illustration only in empty states.

## Icon set

- Set: Lucide. Chosen for consistency, a clean outline style and a permissive license. Pin the exact version at install time and record it in the PR. The dependency needs its own spec because AGENTS.md forbids unnamed packages.
- If after real screens Lucide feels too generic, the fallback is Phosphor Light. Decide once, then never mix sets.
- The icons on the direction board were hand-drawn stand-ins. Do not copy them. Use the set.

## Rules

| Rule | Value |
| --- | --- |
| Stroke | 1.5px at 20px size, round caps and joins, scales with size |
| Sizes | 16 (inside dense rows and chips), 20 (default), 24 (tab bar, empty state headers). No other sizes. |
| Color | `currentColor` only. Icons take the text role of their context. |
| Import | Single named imports through our `Icon` wrapper. No `import *`, no full-set imports. Only icons that are used ship. |
| Meaning | Icon alone only for universal actions (close, search, menu, back). Everything else has a text label. Icon-only buttons need an `aria-label` and a tooltip on laptops. |
| Decorative | `aria-hidden="true"` when a label sits next to it |
| Status | Success, danger, warning, info each have one fixed icon, always with text |
| Nav | Tab bar and sidebar use the same icon per destination |

## The Icon wrapper

One component, `Icon`, takes `name`, `size` (16, 20, 24) and an optional label. It owns the registry of allowed icons, so a new icon is a one-line change reviewed once. The Zuri mark and Reydarr logos are not in this registry (see 07).

## Illustration (empty states only)

- Where: empty states, first-run states, and success moments such as "Your site is live". Nowhere else in the app.
- Style: simple line and flat shapes built from the brand: concentric rings, the angular Zuri form, calm geometry. Two neutrals plus at most one touch of Ping.
- Palette: role tokens only. Illustrations switch correctly in dark mode, so they are SVG using `currentColor` and role variables, never raster.
- Size: 96 to 160px on phones, 160 to 200px on laptops. Weight under 4KB each.
- No people, no stock imagery, no faces, no 3D, no gradients.
- Every empty state: illustration, one sentence saying what goes here, one action.

## Photography

Customer sites use the owner's photos. The Reydarr app and marketing site do not use stock photos. Marketing may show real screenshots of the product in device frames drawn in CSS.

## Avatars

Zuri avatar: the Zuri mark on a rounded square (12px radius at 44px). Business avatar: initials on bg-subtle with a hairline. Sizes 24, 32, 44, 64.
