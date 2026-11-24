# Design tokens

Tokens v2, delivered by spec 0.6b. The design rules behind these values live in `docs/design/` (start with `00-principles-and-rubric.md`). Change values only through the architect.

Files, loaded in this order by the root layout:

1. `palette.css` holds every raw color. It is the only stylesheet that may contain hex values.
2. `themes.css` maps colors to roles for light and dark. Components use these roles.
3. `scale.css` holds fonts, spacing, layout, radius, layers and motion. These do not change with the theme.
4. `type.css` holds the composite text styles. Use `font: var(--type-h1)` with `letter-spacing: var(--type-h1-tracking)`, or the matching class.

Rules:

- Components read role tokens (`--bg-surface`, `--text-primary`, `--action-bg` and so on) and the scale tokens. They never read `--palette-*` and never contain hex values. `contrast.test.ts` enforces this.
- Every role exists in both themes. Add a role to both blocks or the test fails.
- `--text-brand` (Ping Deep on light) is allowed on `--bg-page` and `--bg-surface` only.
- `--text-tertiary` is for placeholders and meta text only.
- `--text-disabled` is exempt from contrast rules because it marks disabled controls.
- The primary button carries `--action-edge` as a 1px border. Ping against Bone is 2.78:1, so the edge keeps the button visible.
- Light separates cards with hairline borders. Dark separates them with lighter surfaces, a border and `--edge-highlight`. Use `--elev-1`, `--elev-2` and `--elev-3`, not raw shadows.
- Color alone never carries meaning. Success, danger, warning and info always come with an icon or a text label.
- One Ping primary action per screen. Ping is about a tenth of a screen (R126). Ink text on Ping fills.
- Chrome is a finish for logos, badges and hero moments, not a text or fill color (R125).
- Only transform, opacity and colors animate. Use the motion tokens only.
- `--control-sm`, `--control-md` and `--control-lg` give compact heights for mouse and 44px for touch. Use them for control heights, not fixed pixel values.

Theme choice has three states: light, dark and system. `src/lib/theme.ts` owns them. System follows the device live.

Breakpoints (CSS variables cannot be used in media queries, so write these values in the query):

| Name | Min width | Use |
| --- | --- | --- |
| floor | 20rem (320px) | Must not break |
| phone | 22.5rem (360px) | Most common Android width, must look right |
| sm | 40rem (640px) | Large phones, small tablets |
| md | 48rem (768px) | Tablets, icon rail |
| lg | 64rem (1024px) | Laptops, sidebar |
| xl | 80rem (1280px) | Large screens, Zuri side panel |

Design phone first. Phones, tablets and laptops are equally important (R19). Evidence screenshots are taken at 375, 768 and 1280.
