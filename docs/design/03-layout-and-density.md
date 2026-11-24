# 03 Layout and density

## Widths

| Name | Width | Role |
| --- | --- | --- |
| floor | 320 | Must not break. No horizontal scroll, nothing clipped. |
| phone | 360 | Most common Android width. Must look right. |
| phone-ref | 375 | Screenshot width for evidence. |
| sm | 640 | Large phones, small tablets |
| md | 768 | Tablets |
| lg | 1024 | Laptops |
| xl | 1280 | Large screens, screenshot width for laptop evidence |

Write media queries in `min-width` with these values: 40rem, 48rem, 64rem, 80rem. Do not fix widths. Layouts are fluid and use `rem`, `%`, `fr` and `minmax`. Content max width is 72rem. Reading and settings pages are 47.5rem (760px).

## Spacing

4px base. Steps: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96. Use only these.

| Semantic | Phone | Tablet | Laptop |
| --- | --- | --- | --- |
| Page gutter | 16 | 24 | 32 to 40 |
| Card padding | 16 | 20 | 20 to 24 |
| Gap between cards | 16 | 16 | 20 |
| Section gap | 32 | 40 | 48 |

## Radius

| Token | Value | Use |
| --- | --- | --- |
| sm | 6px | Chips inside rows, small tags |
| md | 8px | Buttons, inputs, menus items |
| lg | 12px | Cards, list groups |
| xl | 16px | Dialogs, sheets, large panels |
| 2xl | 24px | Marketing panels |
| full | 9999px | Pills, avatars, switches |

## App shell

| Width | Navigation | Notes |
| --- | --- | --- |
| below 768 | Bottom tab bar, 4 items: Today, Site, Requests, Zuri | Height 64px plus safe area inset. Labels always shown. Active item: text-primary and a small Ping dot. |
| 768 to 1023 | Icon rail, 72px | Labels in tooltips and on focus |
| 1024 and up | Sidebar, 232px | Grouped items, search, account at the bottom |

Zuri is a first-class destination on phones and a right-hand panel (320px) on laptops from 1280. Below that it is a sheet.

The top of each page has a title, one line of description, and at most one primary action. On phones the primary action sits at the bottom of the content area within thumb reach, or in a sticky bar above the tab bar.

## Touch targets and density

- Coarse pointer (touch): every control is at least 44px tall and wide. Spacing between targets at least 8px.
- Fine pointer (mouse): controls use compact heights, 32 (sm), 36 (md), 40 (lg). The 44px rule does not apply but 24px is the minimum.
- Set heights by `@media (pointer: coarse)`, not by screen width. A tablet with touch gets 44px.
- Default density is comfortable on phones and tablets, compact on laptops. Never use compact density on touch.

## Safe areas

Use `viewport-fit=cover` and `env(safe-area-inset-*)` for the bottom bar, sticky action bars and sheets. Use `100dvh`, never `100vh`, for full-height layouts.

## Patterns

**Settings card (from the Vercel pattern).** Card with title (h2), one line description (ui, text-secondary), the control, and a footer on bg-subtle with help text on the left and the Save button on the right. Save is disabled until something changes. On phones the footer stacks: help text above, full-width Save below.

**List group.** One card, rows separated by hairlines, 56px minimum row height on touch. Row: leading icon, title (h4), description (ui, text-secondary), trailing chip or chevron.

**Tables.** On laptops: real table, tabular numbers, sticky header. Below 768: each row becomes a card with label and value pairs. Never scroll a table sideways on a phone.

**Forms.** One column. Label above the field. Helper text under the field. Errors replace helper text, in danger-text with an icon. Required is the default. Mark optional fields "Optional".

**Empty, loading, error.** Every list has all three. Loading uses skeletons that match the final layout, not spinners, unless the wait is under 300ms. Empty states carry one illustration (05), one sentence and one action.

**Sheets and dialogs.** Phones: bottom sheet, rounded top corners 16px, drag handle, safe area padding. Laptops: centered dialog, max width 28rem or 40rem. Closing returns focus to the trigger.

## Z-index

base 0, dropdown 10, sticky 20, overlay 30, modal 40, toast 50. No other values.

## Stress tests

Every screen must survive: 320px width, 200% text zoom, long business names (60 characters), a Naira amount of ₦9,999,999, empty data, 200 list items, and slow loading.
