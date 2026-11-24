# 06 Components

All components read role and scale tokens only. Every component ships with every state below, and every state appears on the design page. "Coarse" means `pointer: coarse`.

## States every interactive component has

default, hover (fine pointer only), pressed, focus-visible (2px focus-ring, 2px offset), disabled (text-disabled on bg-subtle, no pointer events, still readable), loading (spinner or skeleton, keeps its size, announces busy), error (danger border plus icon plus message), selected where it applies.

## Inventory

| Component | Variants and sizes | Key rules |
| --- | --- | --- |
| Button | primary (Ping), secondary (outlined, border-strong), ghost, destructive. Sizes: sm 32, md 36, lg 44. Coarse: always 44. Icon-only: square. | Primary: action-bg, text-on-action, 1px action-edge, one per screen. Destructive uses danger-solid, never Ping. Loading keeps width and shows a spinner. Label is a verb. Radius md. |
| Input | text, search, textarea, with prefix or suffix | 16px text. Height 40 laptop, 44 coarse. Border-strong, focus border and ring. Label above, helper below. Placeholder is text-tertiary and never a label. |
| Select | native on phones, styled menu on laptops | Native on coarse pointers for reliability and speed. |
| Checkbox, Radio | 20px box, 44px hit area on coarse | Checked uses text-primary fill, not Ping. |
| Switch | 44 by 24 | On state: text-primary track. Always has a text label. |
| Segmented control | 2 to 4 options | Used for Light, Dark, System and short filters. |
| Tabs | underline | Active: text-primary with a 2px Ping underline. Scrolls horizontally on phones with edge fade. |
| Card | plain, settings card, list group | Elevation 1. Radius lg. Padding from the scale. |
| Badge and chip | neutral, success, danger, warning, info, plan | Subtle fill and text role, icon plus label, radius full, 24px tall. Plan badges later (R128). |
| Avatar | Zuri, business, person | See 05. |
| List row | simple, with icon, with trailing control | 56px minimum on touch. Whole row is the target. |
| Table | compact, comfortable | Tabular numbers, sticky header on laptops, becomes cards below 768. |
| Menu, Popover | items with icons, groups, separators | Elevation 2. Item height 36 fine, 44 coarse. Keyboard arrows, type-ahead, escape closes. |
| Dialog | small, large | Elevation 3. Focus trap. Escape closes. Title always present. Destructive confirms name the thing being removed. |
| Bottom sheet | phones only | Drag handle, 16px top radius, safe area. |
| Toast | success, error, info | Bottom center on phones above the tab bar, bottom right on laptops. 5s default, error stays until dismissed. `role=status` or `alert`. |
| Banner | info, warning, danger | Inline at top of a page or card. Icon, text, optional action. |
| Tooltip | laptops only | 600ms delay. Never the only place a label exists. |
| Skeleton | line, block, avatar | Matches final layout. Static by default. |
| Progress | bar, step | Ping fill only for the one active progress. Text percentage or step label always. |
| Empty state | with illustration | See 05 and 03. |
| Page header | title, description, action | Described in 03. |
| Nav | bottom tab bar, rail, sidebar | Described in 03. |
| Zuri message | Zuri, owner, suggestion card | Zuri bubble on bg-surface with hairline. Owner bubble on bg-subtle. Suggestion cards carry an Approve action. Typing indicator in 04. |
| Command menu | later | Laptop only, opens with Ctrl or Cmd K. |

## Naming and structure

- One folder per component with the component file, its CSS module and its test or story data.
- Props describe intent (`variant`, `size`, `tone`), never raw styles.
- No component accepts a color prop. Tone maps to roles inside the component.
- No component sets its own breakpoints for page layout. Layout belongs to patterns in 03.

## Design page (`/design`)

Rebuilt as a real style guide: sticky section navigation, theme switcher with Light, Dark, System, palette as scale rows, roles with live samples, type styles, spacing and radius, elevation in both themes, motion demos using transform, and every component with every state. It is development only and returns not found on production.
