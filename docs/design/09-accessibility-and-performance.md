# 09 Accessibility and performance

## Accessibility: WCAG 2.2 AA is the floor

| Area | Rule |
| --- | --- |
| Contrast | Text 4.5:1 (3:1 at 24px and above). UI parts and focus 3:1. Use the table in 01. Disabled controls are exempt but stay readable. |
| Focus | Always visible: 2px focus-ring with 2px offset. Never remove outlines. Focus is never hidden behind sticky bars (scroll-padding). |
| Keyboard | Everything works without a mouse. Logical order. Menus use arrow keys, escape closes, focus returns to the trigger. Dialogs trap focus. |
| Targets | 24px minimum anywhere. 44px on coarse pointers. |
| Color | Never the only cue. Status has icon plus text. Links in text are underlined. |
| Forms | Real labels tied to inputs. Errors tied with `aria-describedby`. Autocomplete attributes set. Error summary on submit failures. |
| Semantics | Real buttons and links. Headings in order. One h1 per page. Landmarks for nav, main, aside. |
| Images and icons | Meaningful images have alt text. Decorative icons are `aria-hidden`. Icon-only buttons have `aria-label`. |
| Motion | Reduced motion honored (04). No auto-playing motion over 5 seconds without a pause. |
| Zoom and text | Works at 200% zoom and 320px width with no loss. Respect user font-size settings, so sizes use rem. |
| Themes | Both themes pass contrast. `color-scheme` set. `forced-colors` mode keeps borders and focus visible. Support `prefers-contrast: more` by using border-strong for hairlines. |
| Language | `lang="en"`. Content in plain English helps screen readers and low literacy alike. |
| Toasts and live regions | `role=status` for success, `role=alert` for errors. |
| Touch gestures | Anything done by dragging has a button alternative. |

## Performance: reference device and budgets

Reference: mid-range Android, Chrome, throttled to Slow 4G with 4x CPU slowdown. These numbers are targets set in this design pass, to be checked and adjusted against real runs. Treat them as release gates until revised.

| Metric | Target on the reference profile |
| --- | --- |
| LCP | 2.5s or less |
| CLS | 0.1 or less, no font or image shift |
| INP | 200ms or less |
| Marketing route JavaScript | 100KB gzipped or less on first load |
| App route JavaScript | 170KB gzipped or less on first load, then lazy load per route |
| Fonts | Two families, Latin subset only, preloaded by next/font, 5 weights total |
| Icons | Only used icons ship |
| Images | `next/image`, modern formats, explicit size, lazy below the fold |

Rules:

- Server components by default. Client components only for interactivity.
- No animation library, no UI kit, no CSS-in-JS runtime without a spec.
- No `backdrop-filter` on large areas. No large box-shadow blur on scrolling lists.
- Skeletons keep layout stable. Reserve space for everything that loads.
- Respect `Save-Data`: skip decorative motion and defer non-essential images when it is on.
- Cache static assets with long lifetimes. Brand SVGs are small and inlined or cached.
- Theme script is tiny and runs before paint. It must also set the browser theme-color for a manual choice.
- Customer sites have their own, stricter budgets in the site engine spec.

## Evidence matrix (every UI package)

| Check | Tool | Pass |
| --- | --- | --- |
| Visual | Screenshots at 375, 768, 1280 in light and dark, plus overflow checks at 360 and 320 | No overflow, no clipping, matches the design page |
| Accessibility | Axe on each route in both themes | Zero serious or critical |
| Keyboard | Manual tab pass recorded | Every control reachable, focus always visible |
| Performance | Lighthouse mobile, throttled profile | Meets table above |
| Motion | Reduced motion on and off | Both work |

Automating this matrix (Playwright screenshots and axe in CI) needs its own spec because it adds dependencies. Until then the builder records it by hand in the evidence pack.

## Reydarr-specific realities

- Many owners use low-cost Android phones, sometimes on expensive or unstable data. Fast first paint matters more than animation.
- WhatsApp is how many customers reach owners. Make WhatsApp actions one tap and show them as first-class.
- Power cuts and weak signal: show clear offline and retry states, never lose a draft, autosave forms.
