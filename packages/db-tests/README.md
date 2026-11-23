<!-- GUARD-OWNED: do not edit. Request changes through the architect. -->
# @reydarr/db-tests

Automated proof that one business can never read or change another business's data, and that an anonymous visitor sees nothing. It runs against the TEST Supabase project only.

## Safety

- The tests create and delete users with the privileged key. Use the TEST project's values only, never the development or production project.
- The run refuses to start unless the host of `TEST_SUPABASE_URL` is exactly `<TEST_SUPABASE_PROJECT_REF>.supabase.co`.
- Test users use `isolation-<random>-<a|b>@example.invalid` emails and random passwords. Nothing secret is printed or written to a file.
- `.env.test` is git-ignored. Never commit it, and never paste its contents into a chat.

## Run

1. Copy `env.test.example` to `.env.test` in this folder and type the four values for the TEST project.
2. From the repo root run `pnpm test:isolation`. The script is not named `test` on purpose, so `pnpm test` never touches the network.
3. A pass means every case is green and the output ends with zero failed and zero skipped.

Before each run a sweep deletes leftover users whose email starts with `isolation-` and ends with `@example.invalid`. The world is built once per run and deleted afterwards. Businesses are deleted first (this cascades), then users, because `businesses.created_by` is `on delete restrict`.

## What each file proves

| File | Proves |
| --- | --- |
| `src/env.ts` | Loads `.env.test`, checks the variables, and enforces the project guard. |
| `src/clients.ts` | Builds the anon, service and per-user clients and cleans up test users. |
| `src/fixtures.ts` | Builds the shared world: users A and B, businesses A1, B1 and A2, one row in each business-owned table. |
| `test/anonymous.test.ts` | A visitor with no session cannot select or insert on any of the nine tables or call the two functions. |
| `test/tenant-isolation.test.ts` | User A cannot read, update, delete or insert into B1, and user B cannot do the same to A1. Members and profiles show only their own rows. |
| `test/column-and-write-limits.test.ts` | An owner cannot insert or delete businesses, write the append-only tables, or change status, subdomain, creator or parent ids. Allowed columns still work. |
| `test/business-status.test.ts` | Suspended businesses stay readable and reject writes. Pending-deletion businesses disappear for the owner. |
| `test/create-business.test.ts` | `create_business` builds one owner row and one site, returns the exact errors, trims names, and a second business is hidden from others. |
| `test/append-only-and-service-role.test.ts` | Server code cannot update the three append-only tables, can insert and delete, and the owner, published-version and idempotency rules hold. |
| `test/constraints.test.ts` | Page slug rules and the unique slug per site. |

## Manual trigger check (run once, in the SQL editor of the TEST project)

The update-blocking trigger cannot be reached by the privileged key, because that role has no update grant on the three tables. Prove the trigger with this block, run as the `postgres` role. It ends with a deliberate error that rolls everything back and shows the result. Paste that error into the evidence pack.

Expected error text: `trigger check result: site_versions=append_only (42501); usage_ledger=append_only (42501); audit_log=append_only (42501);`

```sql
-- TEST project only. TODO (to verify): the editor accepts a direct insert into auth.users.
do $$
declare
  v_user uuid := gen_random_uuid();
  v_business uuid;
  v_site uuid;
  v_row uuid;
  v_result text := '';
begin
  insert into auth.users (id, email) values (v_user, 'trigger-check@example.invalid');
  insert into public.businesses (name, category, created_by)
    values ('Trigger Check', 'general', v_user) returning id into v_business;
  insert into public.sites (business_id) values (v_business) returning id into v_site;

  insert into public.site_versions (site_id, business_id, kind, version_number, snapshot)
    values (v_site, v_business, 'published', 1, '{}'::jsonb) returning id into v_row;
  begin
    update public.site_versions set snapshot = '{"changed":true}'::jsonb where id = v_row;
    v_result := v_result || 'site_versions=NOT BLOCKED; ';
  exception when others then
    v_result := v_result || 'site_versions=' || sqlerrm || ' (' || sqlstate || '); ';
  end;
  delete from public.site_versions where id = v_row;

  insert into public.usage_ledger (business_id, entry_type, meter, quantity)
    values (v_business, 'usage', 'ai_text', 1) returning id into v_row;
  begin
    update public.usage_ledger set quantity = 2 where id = v_row;
    v_result := v_result || 'usage_ledger=NOT BLOCKED; ';
  exception when others then
    v_result := v_result || 'usage_ledger=' || sqlerrm || ' (' || sqlstate || '); ';
  end;
  delete from public.usage_ledger where id = v_row;

  insert into public.audit_log (business_id, actor_type, action, entity_type)
    values (v_business, 'system', 'trigger_check', 'test') returning id into v_row;
  begin
    update public.audit_log set action = 'changed' where id = v_row;
    v_result := v_result || 'audit_log=NOT BLOCKED; ';
  exception when others then
    v_result := v_result || 'audit_log=' || sqlerrm || ' (' || sqlstate || '); ';
  end;
  delete from public.audit_log where id = v_row;

  delete from public.businesses where id = v_business;
  delete from auth.users where id = v_user;

  -- Deliberate: rolls back everything and shows the result in the editor.
  raise exception 'trigger check result: %', v_result;
end;
$$;
```

## Manual cleanup after a crashed run

The next run sweeps leftovers by itself. To clean by hand, run this in the SQL editor of the TEST project:

```sql
select id, email from auth.users where email like 'isolation-%';

delete from public.businesses
  where created_by in (select id from auth.users where email like 'isolation-%@example.invalid');
delete from auth.users where email like 'isolation-%@example.invalid';
```

Then run the first query again. It must return no rows.

## Open items marked TODO (to verify)

- Password sign-in is enabled on the TEST project, and its password rules and sign-in rate limit allow the test users.
- Admin user creation accepts `example.invalid` addresses.
- The `auth.users` sign-up trigger creates a profile row for every new user.
- The vitest 5.1.1 option names and the global setup and provide APIs used here.
- `@supabase/supabase-js` runs on Node 22 with no extra WebSocket package. The builder records the installed version.
