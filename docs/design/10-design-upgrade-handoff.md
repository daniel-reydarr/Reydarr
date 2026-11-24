# 10 Design upgrade: handoff

Status: deferred by Code on 24 Nov 2026. Do this before the Phase 3 onboarding screens are built, because the live preview moment is part of it. Read 00 first.

## Where things stand

Done and previewed on Vercel: tokens v2 (0.6b), brand wiring (0.7a), icons and first components and the rebuilt `/design` page (0.7b), app shell and a sample Today screen at `/design/shell` (0.8).

The system is sound. The product does not yet look distinctive. Strict ratings after 0.8, before accessibility and performance checks:

| Area | Score |
| --- | --- |
| System engineering | 8 |
| Color in use | 6.5 |
| Typography | 5.5 |
| Layout and structure | 6 |
| Components | 5 |
| Icons | 7 |
| Brand expression | 3 |
| Zuri as a character | 2 |
| Motion | 3 |
| Content and hierarchy | 3 |
| Distinctive and intentional feel | 3 |
| Overall against world-class | 4.5 |

## Why it feels generic

1. The structure follows developer tools (Vercel). That gives competence, not identity.
2. There is no signature idea. The rings exist in the logo only.
3. Placeholder content. A "drafts ready" card with no draft or photo is hollow.
4. We designed rules, not the moments that matter.
5. Every block has the same visual weight. No hero, no big numerals.

## The plan

Design five moments at full fidelity with real-looking content, on one hosted board, before building their screens:

1. Onboarding with the live preview of the owner's own site (R74).
2. Today, with the 30-second photo capture and real-looking post drafts (R41).
3. Reviewing and approving a draft.
4. "Your site is live", with the rings expanding from a dot.
5. A request tied back to the post that brought it (R66).

Pick one signature idea, the ping, and use it throughout: loading, success, empty states, progress, and large tabular numerals for stats. Give Zuri a real character: a better mark, a voice, and a place in each moment. Add richer type moments (display sizes, big numbers). Use Nigerian owners' familiar patterns (WhatsApp Business, Instagram, Moniepoint, Kuda) as the benchmark for ease.

## What Code needs to supply

1. Five screens in any apps that feel intentional, with what Code likes about each.
2. Three personality words, such as confident, warm, sharp, playful or calm.
3. Three to five real photos from a Nigerian small business such as food, a salon or a shop.
4. A decision on time: this upgrade is worth about a week before Phase 3.

## Still unverified from the 0.6 to 0.8 work

- Tabular figures: do digits line up in Manrope and DM Sans?
- Font files: names, sizes, and that they come from the site's own domain.
- Browser console: any hydration warning, and what the Issues badge reports.
- Light stays after reload, and System follows a Windows theme change live.
- Dark-mode elevation looked right in the shell. Axe, keyboard pass and Lighthouse on the throttled profile are not run yet.
- The Zuri avatar stretching on phones is fixed by a small patch to `shell.module.css` (see the 0.8 notes).
- The wordmark in the sidebar may be too small at 28px height. Check at the upgrade.
- The Zuri mark is a placeholder and a redesign is planned (R144).
