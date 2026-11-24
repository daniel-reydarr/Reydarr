# 01 Color

Brand values are locked by R116 and R126. Everything else here was decided in the design direction and is checked for contrast. Components read roles only (R130).

## Layers

1. `palette.css`: raw values. The only file with hex.
2. `themes.css`: roles for light and dark. Every role exists in both.
3. Components: roles only.

## Palette v2

Brand: Ink `#0A0F1F`, Night `#151B30`, Bone `#F5F2EA`, Ping `#FF5A2C`, Ping Deep `#C73A0F`, Slate `#3A4052`, White `#FFFFFF`.

| Scale | Steps (name: value) |
| --- | --- |
| Navy (dark surfaces, secondary text) | 950 `#0A0F1F`, 900 `#151B30`, 800 `#1E263E`, 700 `#2A3248`, 600 `#3A4052`, 500 `#5A6072`, 450 `#60677A` (new), 400 `#6B7186`, 350 `#8A90A5` (new), 300 `#B9BDCB` |
| Bone (light surfaces, borders) | 50 `#FBFAF6`, 100 `#F5F2EA`, 150 `#EFEBE1` (new), 200 `#EBE7DB`, 300 `#D8D3C5`, 500 `#7C7767` |
| Ping | 400 `#FF7448`, 500 `#FF5A2C`, 600 `#F0481A`, 700 `#E64515` (was 650), 800 `#C73A0F`. Step 550 is dropped, it sat 3% from 600. |
| Green, Rose, Amber, Blue | Unchanged from 0.6: 100, 300, 400, 600, 700, 950 (Amber uses 800 for light text) |

Functional hues stay away from Ping (R126). Chart palette is deferred. When defined it must use six categorical colors that are distinguishable by lightness as well as hue, never use Ping as the first series, and never reuse the functional colors for plain data.

## Roles

| Role | Light | Dark |
| --- | --- | --- |
| bg-page | bone-100 | navy-950 |
| bg-surface (cards) | bone-50 | navy-900 |
| bg-subtle (wells, footers) | bone-200 | navy-800 |
| bg-hover | bone-150 | navy-800 |
| bg-selected | bone-200 | navy-700 |
| bg-raised (menus, popovers, sheets) | bone-50 | navy-800 |
| bg-inverse | navy-950 | bone-100 |
| border-subtle | bone-300 | navy-700 |
| border-strong (inputs, outlined buttons) | bone-500 | navy-400 |
| text-primary | navy-950 | bone-100 |
| text-secondary | navy-500 | navy-300 |
| text-tertiary (new: placeholder, meta) | navy-450 | navy-350 |
| text-disabled | navy-400 | navy-400 |
| text-on-inverse | bone-100 | navy-950 |
| text-brand | ping-800 | ping-500 |
| text-on-action | navy-950 | navy-950 |
| action-bg | ping-500 | ping-500 |
| action-bg-hover | ping-600 | ping-400 |
| action-bg-pressed | ping-700 | ping-600 |
| action-edge (new: 1px border on primary) | ping-800 | ping-500 |
| focus-ring | ping-800 | ping-500 |
| edge-highlight (new) | none | inset 0 1px 0 rgba(245,242,234,0.06) |
| Functional | Unchanged from 0.6: solid, on-solid, subtle, text for success, danger, warning, info |
| overlay | rgba(10,15,31,0.5) | rgba(0,0,0,0.6) |

## Contrast table (checked)

| Pair | Ratio | Rule |
| --- | --- | --- |
| text-secondary on bg-page (light) | about 5.6 | OK |
| text-tertiary on bg-page / bg-subtle (light) | 5.05 / 4.57 | OK, never below 4.5 |
| text-tertiary on bg-surface / bg-subtle (dark) | above 5 / 4.72 | OK |
| text-brand on bg-page / bg-surface (light) | 4.65 / 4.98 | Allowed here only |
| text-brand on bg-subtle (light) | 4.20 | Not allowed |
| Ink text on Ping fill | 6.13 | Always |
| Ink on hover 600 / pressed 700 | 5.13 / 4.75 | OK |
| Ping fill against bone-100 | 2.78 | Below 3:1, so the primary button always carries action-edge (ping-800, 4.65) |
| border-strong on bone-50 | 4.29 | OK for inputs |
| border-subtle on bone-50 | 1.43 | Decorative hairline only, never the only cue for an input |
| border-subtle on surface (dark) | 1.34 | Hairline only |

## Elevation

| Level | Use | Light | Dark |
| --- | --- | --- | --- |
| 0 | Page | bg-page | bg-page |
| 1 | Cards, list groups | bg-surface, 1px border-subtle, no shadow | bg-surface, 1px border-subtle, edge-highlight |
| 2 | Menus, popovers | bg-raised, border, shadow-md | bg-raised, border, shadow-md, edge-highlight |
| 3 | Dialogs, sheets | bg-raised, border, shadow-lg over overlay | same |

Shadows do not separate dark surfaces. A black shadow on near-black is invisible.

## Ping rules

Allowed: the one primary action, small active indicators (a dot, a progress bar, a selected tab underline), focus ring, brand moments on marketing (hero rings, one accent word), eyebrow text in text-brand.
Not allowed: large fills in the app, destructive actions, status meaning, the first chart series, body text, links in running text (links use text-primary with underline).

## Other rules

- Color never carries meaning alone. Status always has an icon or text label.
- Chrome is a finish for logos, badges and hero moments only (R125).
- Do not blend or tint roles inline. If a needed color is missing, write a change request for the architect.
- `theme-color` meta values equal bg-page in each theme. They follow the OS setting, so also update them from the theme script when the user picks a theme manually (see 09).
- Page, card and input all use `color-scheme` so native controls match.

## Theme behavior

Three states: Light, Dark, System. System is a real saved state, not only an applied theme. When System is active, follow live OS changes. Switching themes must not animate every property: briefly suppress transitions while switching so nothing flashes or lags.
