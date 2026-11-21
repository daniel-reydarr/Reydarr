# Spec 0.1: Repo scaffold

Lane: builder (FreeBuff or DeepSeek). Read AGENTS.md first. Stop and ask if anything here is unclear or fails.

## 1. Inputs from the master plan

- R8: full rebuild. Do not copy anything from the old Zuri project.
- R150: repo layout is a pnpm workspace with `apps/web`, `packages/zuri-core`, a separate `sites/` renderer folder inside `apps/web/src`, `supabase/migrations`, and `docs/specs`.
- Layer 10 conventions: money in whole kobo, times in UTC, random unique IDs.
- Fonts: Manrope and DM Sans served from our own site (installed in package 0.6, not here).
- AGENTS.md sections 3, 4 and 6 apply.

## 2. Preconditions (Code does these, not you)

- An empty folder named `reydarr` with `git init` done and a remote added.
- Node and pnpm installed. Record the exact versions you see (`node -v`, `pnpm -v`). Required minimum versions are to verify against the current Next.js docs.

## 3. Decisions fixed by this spec (do not change)

- Package manager: pnpm workspaces.
- Test runner: Vitest.
- Formatting: Prettier. Linting: ESLint (the Next.js config).
- Styling: plain CSS with CSS custom properties and CSS Modules. No Tailwind and no UI kit in this package.
- No other dependencies. If you think one is needed, stop and ask.

## 4. Steps

1. At the repo root, create these files exactly as described in section 5.
2. Create the Next.js app in `apps/web` with the current create-next-app: TypeScript, ESLint, App Router, `src/` directory, import alias `@/*`, pnpm, no Tailwind. Run the tool's `--help` first and use the flags that match these options. If a flag differs, report it, do not improvise.
3. Create `packages/zuri-core` as described in section 5.
4. Create the empty folders listed in section 5 with a `.gitkeep` file each.
5. Copy `AGENTS.md` and `Reydarr_Master_Plan.md` into the repo root if not already there. Do not edit them.
6. Create `docs/specs/` and `docs/decisions-log.md`.
7. Run the commands in section 7 and collect the output.
8. Commit on a branch named `phase-0/0.1-scaffold`. Do not commit to `main`.

## 5. Files and folders

**Root**
- `package.json`: name `reydarr`, `private: true`, `packageManager` set to the pnpm version recorded. Scripts: `dev` (runs `apps/web` dev), `build`, `lint`, `typecheck`, `test`, `format`. Each delegates to the workspace packages with pnpm's recursive filters.
- `pnpm-workspace.yaml`: lists `apps/*` and `packages/*`.
- `tsconfig.base.json`: `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`, `forceConsistentCasingInFileNames: true`, module settings compatible with Next.js and Vitest. Both packages extend it.
- `.gitignore`: `node_modules`, `.next`, `dist`, `.turbo`, `.vercel`, coverage output, OS files, and every `.env*` file except `.env.example`.
- `.env.example`: names only, no values, grouped with a comment line each:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server only, guard-owned code only)
  - `NEXT_PUBLIC_APP_URL`
- `.prettierrc` with: single quotes off, semicolons on, 2 spaces, 100 print width, trailing commas all.
- `README.md`: what Reydarr is in two lines, the repo layout, the scripts, a pointer to AGENTS.md and docs/specs. No secrets, no setup instructions beyond installing and running scripts.

**apps/web**
- Standard create-next-app output, adjusted so `tsconfig.json` extends `../../tsconfig.base.json`.
- Replace the default home page with a plain page that renders the text "Reydarr" and nothing else. Remove default boilerplate styles and images.
- `src/sites/.gitkeep`
- `src/components/.gitkeep`
- `src/lib/.gitkeep`
- `src/styles/tokens/.gitkeep`
- `src/app/globals.css` reduced to a minimal reset. No colors yet. Tokens arrive in package 0.6.

**packages/zuri-core**
- `package.json`: name `@reydarr/zuri-core`, `private: true`, TypeScript, Vitest as the only dev dependency.
- `tsconfig.json` extending the base.
- `src/index.ts` exporting nothing yet but a constant `ZURI_CORE_VERSION = '0.0.0'`.
- `test/smoke.test.ts` that asserts the constant equals `'0.0.0'`.
- Rule: this package must not import from `apps/web`.

**supabase**
- `migrations/.gitkeep`
- `seed/.gitkeep`

**docs**
- `specs/.gitkeep` (Code will move spec files here)
- `decisions-log.md` with a heading and the line "Entries are copied here from the architect's log, starting at R1."

## 6. Do not

- Do not add Tailwind, a component library, an ORM, auth libraries, Supabase clients or any package not listed.
- Do not create database files, migrations, routes beyond the home page, or API routes.
- Do not create or fill any `.env` file.
- Do not edit AGENTS.md or the master plan.
- Do not reformat or change anything outside the files listed here.

## 7. Evidence to return

1. `node -v`, `pnpm -v` and the exact versions of Next.js, React, TypeScript, Vitest, ESLint and Prettier installed.
2. Full output of: `pnpm install`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`.
3. A directory tree of the repo, excluding `node_modules` and `.next`.
4. Output of a search proving no `.env` file other than `.env.example` is tracked (`git ls-files` filtered for `.env`).
5. The create-next-app command and flags actually used.
6. Any blocking questions or deviations.

## 8. Done when

All five commands pass, the tree matches section 5, no extra dependencies exist, and the branch is ready for Code to push and open a pull request.
