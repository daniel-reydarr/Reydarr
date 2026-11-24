# AGENTS.md: Reydarr Build Standards

Read this file fully at the start of every task. It overrides your defaults.
Product context lives in Reydarr_Master_Plan.md (decisions R1 to R145, plus later entries in the decisions log). Spell the product "Reydarr" with a capital R in copy and lowercase in the domain (reydarr.com). The assistant is "Zuri".

## 1. The prime rule: do not guess

- Build only what the spec for the current task says. If the spec is silent, ambiguous or contradicts this file or the master plan, STOP and write a short question under the heading "Blocking questions". Do not choose a default and continue.
- Do not add features, libraries, files, tables, env vars or refactors that the spec does not list.
- Never invent facts about the product, prices, limits or provider behavior. If a spec says "to verify", leave a clearly marked TODO and report it.
- If a test cannot be made to pass without changing the spec, stop and report. Do not weaken or delete the test.

## 2. Two lanes

**Guard-owned files** are written only by the code-guard account and delivered as complete files. The builder (you, if you are DeepSeek or FreeBuff) must not create, edit, rename or delete them. Every guard-owned file starts with the header comment `// GUARD-OWNED: do not edit. Request changes through the architect.` The guard lane covers:

- Row-level security policies and migrations that define them, and the isolation test
- Authentication, session and device-list handling
- Flutterwave webhooks, payment state and idempotency logic
- Hostname resolution (mapping a request host to a business or site)
- The usage ledger and plan entitlement checks
- The Zuri output checkers (slot limits, em-dash check, fact check against the business profile)
- Any code that reads or writes secrets, tokens or encrypted fields

**Builder files** are everything else: UI, forms, dashboards, layout, plumbing, copy, non-security tests.

If a builder task needs a change to a guard-owned file, write a "Change request for guard" note (what, why, exact interface needed) and stop that part of the task.

## 3. Stack and conventions

- Stack: Next.js (App Router), TypeScript, Supabase (Postgres, auth, storage), Vercel. Pin exact versions when installing and record them in the PR description. Latest stable versions: to verify at install time.
- Next.js: this version differs from what you may remember. Before writing Next.js code, read `apps/web/AGENTS.md` and the guides in `node_modules/next/dist/docs/` as it directs. If it conflicts with this file, this file wins. Do not enable experimental Next.js flags unless a spec says so.
- TypeScript `strict: true`. No `any` without a comment explaining why. No `@ts-ignore`.
- One codebase serves the dashboard and customer sites by hostname. The site renderer must stay separate from the dashboard code so serving sites can move later.
- Proposed repo layout (confirmed in the Phase 0 brief): a workspace with `apps/web` and `packages/zuri-core`. Zuri lives in `packages/zuri-core` and must not import from `apps/web`.
- Money: whole kobo as integers. Never floats.
- Time: store UTC, display in Africa/Lagos.
- IDs: random unique IDs (UUID). No sequential IDs exposed.
- Every business-owned table has a `business_id` and row-level security. No query may bypass RLS from client code. The service role key is used only in guard-owned server code.
- All AI calls go through the model gateway. No direct provider SDK calls elsewhere. Every call logs model, prompt version and cost to the usage ledger.
- Text rules for any Zuri output: facts only from the business profile, no invented reviews or numbers, no em-dashes, natural Nigerian English, owner approval before publish.
- Fonts: Manrope (headings) and DM Sans (body), served from our own site. Components read design-token roles only, never raw hex values.
- Performance: customer sites must stay small and fast on throttled mobile connections. No heavy client scripts. Phones, tablets and laptops are equally important.

## 3a. Design standards

- Before any UI work, read `docs/design/00-principles-and-rubric.md` and the file for your area in `docs/design/`. They override your own design instincts. If a spec and these files disagree, stop and ask.
- They apply to the Reydarr app and marketing site only. Customer sites use the site system (R118).
- Components read role and scale tokens only. No raw hex, no one-off sizes, no new colors, no new fonts, no inline styles for color.
- One Ping primary action per screen. Ping is about a tenth of a screen.
- Design phone first. Floor 360px, evidence at 375, 768 and 1280, light and dark. Touch targets 44px on coarse pointers.
- Motion uses transform and opacity only, with tokens, and must have a reduced-motion version.
- Icons come only through the `Icon` wrapper. Logos only through `Logo`. The Zuri mark only through `ZuriMark`.
- UI copy follows `docs/design/08-ui-writing.md`.
- UI work is not done without the evidence matrix in `docs/design/09-accessibility-and-performance.md` and a design review list scored against the rubric in 00.

## 4. Secrets and safety

- Never write a key, token, password or secret into code, tests, logs, comments, commit messages or chat.
- Env var NAMES go in `.env.example` with empty values. Real values live in Vercel and Supabase environment settings only. `.env*` files other than `.env.example` must be in `.gitignore`.
- Do not log personal data (phone numbers, emails, request contents).
- No new third-party service or package without it being named in the spec.

## 5. Tests and evidence

- Every task ends with an evidence pack. Do not say "done" without it:
  1. Commands run and their full output (typecheck, lint, tests, build).
  2. For database work: the SQL run and its result.
  3. For UI work: the preview URL, screenshots at 375, 768 and 1280 wide in light and dark themes, overflow checks at 360 and 320, and the evidence matrix and rubric review from `docs/design/09-accessibility-and-performance.md`.
  4. A list of files created or changed, with a one-line reason each.
  5. Any "Blocking questions" and any TODO marked "to verify".
- Tests are required for logic that has rules (hostname parsing, entitlements, checkers). A failing or skipped test means the task is not done.

## 6. Git and delivery

- One branch per work package. Small commits with clear messages. No force pushes. No commits to `main`.
- Never commit generated or secret files. Never commit `node_modules` or build output.
- Deliver by pull request. A guard pass and the architect's sign-off are required before merge.

## 7. Writing rules for everything you write

- Plain, direct prose. Minimize em-dashes everywhere, including comments and docs.
- Code comments explain why, not what.
- Error messages shown to owners are polite, plain English, and never expose internals.

## 8. Report format when you finish a task

1. Summary in three lines or fewer.
2. Evidence pack (section 5).
3. Blocking questions, if any.
4. Deviations from the spec, if any (there should be none).
