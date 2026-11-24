# 04 Motion

Motion explains something: where a thing came from, where it went, that a state changed, or that work is happening (R122, R131). If you cannot write the reason in one sentence in the PR, do not animate it.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| duration-instant | 80ms | Press feedback |
| duration-fast | 120ms | Hover, color, small state |
| duration-base | 200ms | Menus, toggles, tabs, most transitions |
| duration-slow | 320ms | Sheets, dialogs, page-level change |
| duration-enter | 480ms | Marketing entrance only |
| ease-standard | cubic-bezier(0.2, 0, 0, 1) | Default |
| ease-enter | cubic-bezier(0, 0, 0.2, 1) | Things arriving |
| ease-exit | cubic-bezier(0.4, 0, 1, 1) | Things leaving, always faster than entering |
| ease-spring | linear() spring curve, fallback ease-standard | Marketing and Zuri moments only |

Exit duration is about 70% of enter duration.

## What may animate

Only `transform`, `opacity`, `color`, `background-color`, `border-color`, `box-shadow`. Never width, height, top, left, margin or padding. Use `transform: translate` for position and `grid-template-rows` for height reveals if needed. This also fixes the 0.6 motion demo, which animated `left`.

Distances: small shifts 4 to 8px, sheets and panels move their own height, page entrances 16px at most. Scale between 0.96 and 1. No bounce in the app.

## Patterns

| Pattern | Spec |
| --- | --- |
| Button press | Scale 0.98, 80ms |
| Hover | Color change 120ms, no movement |
| Menu or popover | Fade plus 4px shift, 200ms enter, 140ms exit, origin at trigger |
| Dialog | Overlay fades 200ms, panel fades and scales from 0.98, 200ms |
| Bottom sheet | Slides from bottom 320ms enter, 220ms exit, drag follows finger |
| Toast | Slides up 8px and fades, 200ms, leaves in 140ms |
| Tab change | Underline slides 200ms, content cross-fades 120ms |
| Lists | New items fade in. Stagger 40ms, max 6 items. Never stagger on reload. |
| Skeleton | Static by default. Optional slow shimmer on laptops only. |
| Progress | Determinate bars move with the work. Indeterminate only for unknown waits over 1s. |
| Zuri typing | Three dots, opacity pulse, stops when text starts |
| Brand ping | The mark's rings may expand once on first load of marketing or when a site goes live. Max 3 repeats. Never loop. |

## Reduced motion and weak phones

- `prefers-reduced-motion: reduce`: durations become 0.01ms, translate and scale are removed, opacity changes stay. Parallax, springs and ring pulses stop completely.
- `data-motion='lite'` (set later by capability detection, nothing sets it yet): duration-base and duration-slow become 120ms, springs become ease-standard, shimmer and entrance staggers are off, blur and backdrop filters are off.
- Never use `backdrop-filter` on large areas. Never animate filters.
- Keep animations off the main thread. No JavaScript-driven animation libraries without a spec.
- Frame budget: no dropped frames on a mid-range Android profile in the throttled run.

## Page transitions

None in v1. The app navigates instantly. Use `loading` skeletons for waits. The View Transitions API may be proposed in a later spec.
