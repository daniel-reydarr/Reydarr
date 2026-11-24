# 02 Typography

Fonts (R129): Manrope 600 and 700 for headings, the wordmark and big numbers. DM Sans 400, 500, 600 for body and interface. Both from `next/font/google`, served from our own domain, Latin subset, `display: swap`. No other web fonts.

Monospace for IDs, URLs and code uses the system stack `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`. No mono webfont (performance).

## Composite text styles

Components use these styles, not loose size and weight values. Each is one class or one set of variables: family, size, line height, weight, tracking.

| Style | Family | Size (phone to laptop) | Line height | Weight | Tracking | Use |
| --- | --- | --- | --- | --- | --- | --- |
| display-xl | Manrope | clamp(2.75rem, 1.6rem + 5vw, 5.5rem) | 1.05 | 700 | -0.03em | Marketing hero only |
| display-lg | Manrope | clamp(2.25rem, 1.5rem + 3vw, 4rem) | 1.08 | 700 | -0.03em | Marketing section openers |
| h1 | Manrope | clamp(1.75rem, 1.5rem + 1vw, 2rem) | 1.2 | 700 | -0.02em | Page title in the app |
| h2 | Manrope | clamp(1.375rem, 1.25rem + 0.5vw, 1.5rem) | 1.25 | 700 | -0.02em | Section and card titles |
| h3 | Manrope | 1.125rem | 1.45 | 600 | -0.01em | Subsection, card heading |
| h4 | Manrope | 1rem | 1.5 | 600 | 0 | Row titles |
| body-lg | DM Sans | 1.125rem, 1.25rem on marketing | 1.6 | 400 | 0 | Marketing paragraphs |
| body | DM Sans | 1rem | 1.5 | 400 | 0 | Reading text, descriptions, input text |
| ui | DM Sans | 0.875rem | 1.4 | 500 | 0 | Labels, nav, buttons, table cells, chips |
| ui-strong | DM Sans | 0.875rem | 1.4 | 600 | 0 | Emphasis inside ui |
| caption | DM Sans | 0.75rem | 1.35 | 500 | 0.01em | Meta, timestamps, helper text |
| eyebrow | DM Sans | 0.8125rem | 1.4 | 600 | 0.08em, uppercase | Marketing labels only |
| stat | Manrope | clamp(1.75rem, 1.4rem + 1.5vw, 2.5rem) | 1.1 | 700 | -0.02em, tabular | Big numbers on dashboards |

Phone rules: body copy is 16px or larger. `ui` text is allowed at 14px for chrome and labels only. Text inputs are always 16px so iOS does not zoom.

## Rules

- Sentence case everywhere. All caps only in eyebrow.
- Headings use `text-wrap: balance`. Paragraphs use `text-wrap: pretty`.
- Reading measure 45 to 75 characters. Use `max-width: 65ch` for paragraphs.
- Numbers in tables, money, stats and timers use tabular figures (`data-numeric`). Big Manrope numbers need it too, not only body text.
- Use `font-optical-sizing: auto`. If DM Sans optical size is loaded it must be through the font config. To verify at build: DM Sans optical size axis and tabular figure support in both fonts.
- Use at most two weights in one component.
- Never fake bold or italic. Italic is not loaded and not used.
- Fallback stack uses `ui-sans-serif, system-ui, sans-serif`. `next/font` adjusts fallback metrics so there is no layout shift.
- Links in running text: text-primary, underlined, offset 0.2em. Links in chrome: no underline, hover underline.
- Truncate with an ellipsis only in lists, never in titles on phones. Titles wrap.

## Wordmark

The wordmark is an outlined logo file (R135), not live text. Never typeset "Reydarr" in Manrope to imitate it in the app. On marketing, the word in body copy is plain text.
