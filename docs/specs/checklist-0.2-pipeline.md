# Checklist 0.2: Pipeline (Code does this)

Never paste a key, token or secret into any chat. Enter them only in the Vercel and Supabase dashboards.

Do this after package 0.1 is merged to `main`.

## A. GitHub

1. Create a private repository named `reydarr` on your GitHub account. Do not add a README or license there (the repo already has them).
2. In your terminal, from the Reydarr folder, add the remote and push `main`.
3. Push the branch `phase-0/0.1-scaffold` and open a pull request into `main`. Merge it after the architect signs off the evidence pack.
4. Branch protection on `main`: whether it is available on a free private repository is to verify. If it is, require a pull request before merging. If not, follow the AGENTS.md rule yourself: never commit to `main` directly.

## B. Vercel

1. Import the `reydarr` repository into a new Vercel project.
2. Set the project's Root Directory to `apps/web`. Keep the setting that allows source files outside the root directory (the workspace needs it). The exact option name is to verify in the dashboard.
3. Framework preset: Next.js. Production branch: `main`.
4. Confirm the first deployment succeeds and the preview page shows the text "Reydarr".
5. Plan: Hobby for now. It is non-commercial only, so move to Pro before the first trial customer.

## C. Supabase (two projects, EU West)

You have a development project and a test project. Note the exact region name of each in the table at the end.

1. In each project, copy the project URL, anon key and service role key into a private password manager, not into any file in the repo and not into chat.
2. In the Vercel project settings, add environment variables with these names:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`
3. Set them for the Preview and Development environments using the development project's values. Production is left empty for now.
4. The test project's values are used only by the isolation test, run from your terminal in package 0.4. Do not put them in Vercel.
5. In the development project's Auth settings, set the Site URL to your Vercel production URL for this project. Add the redirect URLs for preview deployments. Whether Supabase accepts a wildcard pattern for Vercel preview URLs is to verify. If it does, use one pattern. If it does not, add URLs one at a time as needed.
6. Leave email (magic link) enabled. Google sign-in is set up in package 0.5, and I will give you steps then.
7. Dashboard check: the free plan pauses a project after a week of inactivity. If the app suddenly fails, check the project is awake.

## D. Record for me (no secrets)

| Item | Value |
| --- | --- |
| Dev project region | |
| Test project region | |
| Vercel production URL | |
| GitHub repo name | |
| Node and pnpm versions | |

Paste the filled table back to the architect when done.
