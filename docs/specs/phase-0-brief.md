# Phase 0 Brief: Foundations

Level 2 plan. Save as `docs/specs/phase-0-brief.md`. Status: draft, awaiting Code's confirmation of section 7.

## 1. Goal

By the end of Phase 0, Code can open a deployed preview, sign up and log in, and see an empty dashboard shell in light and dark themes. The database holds the core tables with row-level security, and an automated test proves one business cannot read or change another's data. Nothing about Zuri, onboarding, billing or site rendering is built yet.

Duration: about 2 weeks at 5 to 10 hours a week.

## 2. In scope

- Repo scaffold in the agreed layout (R150)
- Preview deployments from GitHub through Vercel
- Two Supabase projects: development and test
- Core tables with RLS: user profiles, businesses, business members, sites, pages, sections, site versions, usage ledger, audit log
- Login by Google or email magic link, sessions, signed-in device list
- Design tokens for both themes, fonts, and the app shell (login page, empty dashboard, business switcher stub, theme toggle)
- Isolation test and evidence pack

## 3. Out of scope (do not build, do not stub beyond what is listed)

- Zuri, model gateway, task router (Phase 1)
- Hostname resolution and site rendering (Phase 2). Note: an earlier message said Phase 0 would include a hostname resolver with a dev fallback. Nothing in Phase 0 serves sites, so it moves to the start of Phase 2.
- Onboarding, verification steps, trial logic, plans, entitlements, payments, Flutterwave (Phase 3)
- Content engine, push, email sending (Phase 4)
- Requests, analytics events, tracked links, Search Console (Phases 2 and 5)
- Admin area and feature flags (Phase 6, tables only if the spec for a later phase asks)
- Business creation flow beyond a bare insert used by tests and the shell

## 4. Decisions inherited from the master plan

| Ref | Decision |
| --- | --- |
| R8 | Full rebuild. Nothing migrated from old Zuri. |
| R16, R85, R89 | One person, many businesses. Nothing shared except login and profile. |
| R88 | One owner per business in v1. Data model allows staff later. |
| R87 | Business switcher in the dashboard. |
| R92 | Login by Google or email magic link. No passwords. |
| R94 | Login email change needs confirmation at old and new address. |
| R101 | Signed-in device list with remote sign-out, and sign-out of all devices after a login email change. |
| R119, R130 | Light and dark themes from day one through tokens. Components read roles only. |
| R126, R129 | Palette rules and typography (Manrope, DM Sans, tabular figures). |
| R124 | Framer's dashboard feel is the UI reference. |
| R19 | Phones, tablets and laptops equally important. |
| Layer 10 | Money in kobo, times in UTC shown in Africa/Lagos, random IDs, every record belongs to one business, database rules stop cross-business reads. |
| R144 to R152 | AGENTS.md, two lanes, specs self-contained, guard writes security-critical files. |

## 5. Work packages

| Pkg | What | Lane | Depends on |
| --- | --- | --- | --- |
| 0.1 | Repo scaffold: layout, pnpm workspace, TypeScript strict, lint, `.env.example`, `.gitignore`, README | Builder | None |
| 0.2 | Pipeline: GitHub to Vercel previews, Supabase dev and test projects, env settings set in the dashboards (Code does this with my checklist) | Code | 0.1 |
| 0.3 | Core schema and RLS, written together as migrations | Guard | 0.2 |
| 0.4 | Isolation test | Guard | 0.3 |
| 0.5 | Auth: Google and magic link, sessions, device list | Guard | 0.3 |
| 0.6 | Design tokens, fonts, theme switching | Builder | 0.1 |
| 0.7 | App shell: login page, empty dashboard, business switcher stub, theme toggle | Builder | 0.5, 0.6 |

Order: 0.1, then 0.2 and 0.6 in parallel, then 0.3, 0.4, 0.5, then 0.7.

## 6. Done-when tests and required evidence

| Test | Evidence |
| --- | --- |
| Fresh clone installs, typechecks, lints and builds | Full terminal output of install, typecheck, lint and build |
| A push to a branch produces a Vercel preview that loads | The preview URL and a screenshot |
| Migrations apply cleanly to a new empty database | Migration command output on the test project |
| Every business-owned table has RLS enabled | SQL query listing tables and their RLS flag, with the result |
| Isolation: business A cannot select, insert, update or delete business B's rows, and anonymous users see nothing | Test run output, one case per table per operation |
| A user can sign up and log in with Google and with a magic link on a preview | Screenshots of each flow ending on the dashboard |
| The device list shows the current session and a remote sign-out ends another session | Screenshots, plus a query or log showing the session was revoked |
| The shell works at phone and laptop width in light and dark themes | Four screenshots (two widths by two themes) |
| No secrets in the repo | Output of a secret scan or grep across the repo, plus `.gitignore` showing env files excluded |

## 7. Decisions to confirm before specs are written

1. **Membership model.** I recommend a `business_members` table from day one, with one row per business at role `owner`, and all RLS policies written through membership. This matches R88 ("data model allows staff later") and avoids rewriting every policy when staff arrive. The trade-off is one extra join in every policy. The alternative, an `owner_id` column on `businesses`, is simpler now but costs a policy rewrite later.
2. **Supabase region of the two projects.** The region cannot be changed after creation. Which region did you choose? The closest region to Nigeria is to verify.

## 8. Risks

- Supabase Free pauses a project after a week of inactivity, so a pause can look like a bug. Wake it from the dashboard if the app suddenly fails.
- Vercel Hobby is non-commercial only. That is fine until the first trial customer, so move to Pro before Phase 6 beta.
- Google sign-in needs an OAuth client set up in Google Cloud. Production approval takes time, so Phase 0 uses it in testing mode with your own account as the test user. This setup is to verify when we write 0.5.
- The guard cannot see builder code. Interfaces between lanes must be exact in the specs.
- Old keys: nothing from old Zuri may be reused (section 18.3).

## 9. What I need from Code for 0.2

I will write a checklist. It will never ask for secrets. You enter all keys directly in the Vercel and Supabase dashboards.
