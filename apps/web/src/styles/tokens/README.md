# Design tokens

Decided in spec 0.6. Change values only through the architect.

Files, loaded in this order by the root layout:

1. `palette.css` holds every raw color. It is the only stylesheet that may contain hex values.
2. `themes.css` maps colors to roles for light and dark. Components use these roles.
3. `scale.css` holds type, spacing, radius, layers and motion. These do not change with the theme.

Rules:

- Components read role tokens (`--bg-surface`, `--text-primary`, `--action-bg` and so on) and the scale tokens. They never read `--palette-*` and never contain hex values. `contrast.test.ts` enforces this.
- Every role exists in both themes. Add a role to both blocks or the test fails.
- `--text-brand` (Ping Deep on light) is allowed on `--bg-page` and `--bg-surface` only.
- `--text-disabled` is exempt from contrast rules because it marks disabled controls.
- Color alone never carries meaning. Success, danger, warning and info always come with an icon or a text label.
- Ping is used sparingly, about a tenth of a screen (R126). Ink text on Ping fills.
- Chrome is a finish for logos, badges and hero moments, not a text or fill color (R125).

Breakpoints (CSS variables cannot be used in media queries, so write these values in the query):

| Name | Min width | Use |
| --- | --- | --- |
| sm | 40rem (640px) | large phones, small tablets |
| md | 48rem (768px) | tablets |
| lg | 64rem (1024px) | laptops |
| xl | 80rem (1280px) | large screens |

Design phone first. Phones, tablets and laptops are equally important (R19).
