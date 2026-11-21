# Reydarr

Reydarr builds and runs small business websites in Nigeria, with an assistant named Zuri writing the
copy and the owner approving it before it goes live.
The product is spelled Reydarr; the domain is reydarr.com.

## Repo layout

| Path | What lives there |
| --- | --- |
| `apps/web` | The Next.js app. The dashboard and, under `src/sites`, the customer site renderer. |
| `packages/zuri-core` | Zuri's logic. Must not import from `apps/web`. |
| `supabase/migrations` | Database migrations. |
| `supabase/seed` | Seed data. |
| `docs/specs` | Specs for each work package. |
| `docs/decisions-log.md` | Decisions copied from the architect's log. |

## Scripts

Run from the repo root:

| Command | What it does |
| --- | --- |
| `pnpm dev` | Starts the web app in development. |
| `pnpm build` | Builds the web app. |
| `pnpm lint` | Lints the web app. |
| `pnpm typecheck` | Type-checks every workspace package. |
| `pnpm test` | Runs the workspace tests. |
| `pnpm format` | Formats the repo with Prettier. |

Read `AGENTS.md` before making changes. It covers the build standards, the two lanes and the delivery
rules. Specs live in `docs/specs`.
