# Spec 0.8: App shell and Today preview

Depends on: 0.7b merged to `main`.
Branch: `phase-0/0.8-shell`, created from an up-to-date `main`.
Read first: `AGENTS.md` section 3a, then `docs/design/03-layout-and-density.md` and `06-components.md`.

## What this package does

Builds the visual frame of the app and shows it on a development-only preview route, with no new dependency, no new route outside `/design`, and no data or login:

- `AppShell`: bottom tab bar on phones, icon rail on tablets, sidebar on laptops, and a right panel from 1280px.
- `PageHeader`, `ListGroup` and `ListRow`, `ZuriPanel` and `ZuriMessage`.
- `/design/shell`: a sample Today screen built from these parts, with illustrative content only.

The real app routes, sign in and data come later in their own specs. This keeps routing and authentication decisions out of a design package.

## Files (copy verbatim, do not edit)

| Path (under `apps/web/src`) | Purpose |
| --- | --- |
| `components/shell/AppShell.tsx`, `.module.css` | The frame and its three navigation forms |
| `components/shell/PageHeader.tsx`, `.module.css` | Title, description, at most one action |
| `components/shell/ListGroup.tsx`, `.module.css` | Hairline list card and rows |
| `components/shell/ZuriPanel.tsx`, `.module.css` | Zuri chat surface, visual only |
| `app/design/shell/page.tsx`, `shell.module.css` | Dev-only preview, returns not found on production |

## Steps

1. Create the branch from an up-to-date `main`.
2. Copy the files in at the same paths.
3. Run typecheck, lint, test and build. Report the test count. Do not edit a delivered file to make a check pass. Write a change request instead.
4. Open `/design/shell` in the browser and check, in light and dark:
   - 375px wide: bottom tab bar with four items, the Ping dot on Today only, content clear of the bar, no sideways scroll.
   - 768px: icon rail, no tab bar.
   - 1024px: sidebar with the lockup, no rail.
   - 1280px: right Zuri panel appears and the "Ask Zuri" bar in the page hides.
   - Tab through the page: every link and button shows a focus ring.
5. Commit on the branch and open a pull request. Do not merge until the Vercel preview is green.

## Do not

Do not add dependencies, routes outside `/design`, auth, data fetching or real links. Do not edit delivered files. Do not change tokens.

## Evidence

Command outputs with the test count, the Vercel preview URL, eight screenshots of `/design/shell` (375, 768, 1024 and 1280 wide, light and dark), a keyboard note, and the list of files.

## To verify

- The tab bar clears the home indicator on a real iPhone-style safe area. Report if it can be tested.
- The active tab dot position at 360px.
- Title attribute tooltips on the rail show on hover. Report if they do not.
- Sticky sidebar and panel behave while the page scrolls.
