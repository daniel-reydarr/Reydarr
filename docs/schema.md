<!-- GUARD-OWNED: do not edit. Request changes through the architect. -->
# Core schema contract (spec 0.3, amendments 1 and 2)

Matches migrations 20261121100000, 20261121100100, 20261121100200 and 20261121100300. If this file and the SQL differ, the SQL wins and the architect must be told.

## Ground rules
- The browser signs in as `authenticated`. `anon` has no access to any table or function.
- The browser cannot insert businesses, site versions, ledger rows or audit rows. Only server code using the privileged key writes `site_versions`, `usage_ledger` and `audit_log`.
- Create businesses only with `create_business`. The browser cannot insert, delete or change the status of a business.
- Ids are random uuids. Times are `timestamptz` in UTC. Money is `bigint` whole kobo.
- Business status: `active` (members read and write), `suspended` (members read, all writes blocked), `pending_deletion` (the client sees nothing).
- Deleting a business removes all its rows, including audit rows.

## Tables
**profiles**: `id` uuid (auth user id, no default), `display_name` text null (max 80), `created_at`, `updated_at`.
- Created by a trigger on sign-up. Browser: read own row, update `display_name` on own row. No insert or delete.

**businesses**: `id`, `name` text (trimmed length 2 to 80; trim removes space, tab, CR, LF), `category` text (`education`, `food_hospitality`, `beauty_wellness`, `health`, `professional_services`, `general`), `subdomain` text null unique (3 to 63 chars, lowercase letters, digits, hyphens, no leading or trailing hyphen), `status` text default `active`, `deletion_requested_at` timestamptz null, `created_by` uuid (profiles, on delete restrict), `created_at`, `updated_at`.
- Browser: read as member. Update `name` and `category` only, as member, only when `active`. No insert or delete.

**business_members**: `id`, `business_id`, `user_id`, `role` (`owner`, `staff`), `created_at`. Unique (`business_id`, `user_id`). At most one `owner` per business.
- Browser: read rows of businesses you belong to. No writes.

**sites**: `id`, `business_id` (unique), `recipe` jsonb default `{}`, `section_library_version` text null, `published_version_id` uuid null, `created_at`, `updated_at`.
- Created by `create_business`. Browser: read as member. Update `recipe` only, as member, only when `active`. No insert or delete.
- `published_version_id` is set by server code only. It must point at a version of the same business. On delete of that version it becomes null (PostgreSQL 15 and later).

**pages**: `id`, `site_id`, `business_id`, `slug` text, `title` text (max 120), `position` integer, `created_at`, `updated_at`.
- `slug`: 1 to 60 chars, `a-z 0-9 -`, no leading or trailing hyphen, never empty. The home page uses `home`.
- Unique (`site_id`, `slug`). (`site_id`, `business_id`) must match a site.
- Browser: read as member. Insert and delete as member when `active`. Update `slug`, `title`, `position` only. `site_id` and `business_id` cannot change after insert.

**sections**: `id`, `page_id`, `business_id`, `type` text (max 60), `variant` text null (max 60), `position` integer, `content` jsonb default `{}`, `created_at`, `updated_at`.
- Unique (`page_id`, `position`), checked at commit, so reorder inside one transaction. (`page_id`, `business_id`) must match a page.
- Browser: read as member. Insert and delete as member when `active`. Update `type`, `variant`, `position`, `content` only.

**site_versions**: `id`, `site_id`, `business_id`, `kind` (`published`, `draft_autosave`), `version_number` integer, `snapshot` jsonb, `section_library_version` text null, `created_by` uuid null, `created_at`.
- Unique (`site_id`, `kind`, `version_number`). Browser: read as member only.

**usage_ledger**: `id`, `business_id`, `entry_type` (`usage`, `credit`), `meter` (`ai_text`, `ai_image`, `ai_video`, `regeneration`, `email_send`, `top_up_image`, `top_up_video`), `quantity` integer (> 0), `cost_kobo` bigint (>= 0, default 0), `model` text null, `prompt_version` text null, `idempotency_key` text null, `metadata` jsonb default `{}`, `created_at`.
- Unique (`business_id`, `idempotency_key`) when the key is not null. Browser: read as member only.

**audit_log**: `id`, `business_id`, `actor_type` (`owner`, `zuri`, `system`, `admin`), `actor_user_id` uuid null, `action` text (max 80), `entity_type` text (max 60), `entity_id` uuid null, `before` jsonb null, `after` jsonb null, `created_at`.
- Browser: read as member only.

## Append-only
`site_versions`, `usage_ledger` and `audit_log` reject every update, from any caller, with error `append_only` (SQLSTATE 42501). Deletes are not blocked by a trigger.

## create_business
`public.create_business(p_name text, p_category text) returns uuid`. Call as an RPC with named arguments `p_name` and `p_category`. Signed-in users only.
- In one transaction it creates the business (`created_by` is the caller), the `owner` member row and an empty site. It returns the business id.
- Errors: `not_authenticated` (SQLSTATE 28000), `invalid_name` (22023), `invalid_category` (22023).

## Other errors the builder will see
- Insert blocked by a policy: 42501 "new row violates row-level security policy".
- Update or delete on a row the policy hides: no error, zero rows affected. Check the count.
- Column not granted: 42501 "permission denied".
- Check constraint: 23514. Unique: 23505. Foreign key: 23503.
- Map every error to a plain, polite owner message. Never show the raw text.

## Server code (service role)
Server code uses the privileged key, which bypasses RLS but still needs table grants. Grants are explicit and per table (migration 20261121100300). Default privileges are not relied on.

| Table | service_role privileges |
| --- | --- |
| profiles, businesses, business_members, sites, pages, sections | select, insert, update, delete |
| site_versions, usage_ledger, audit_log | select, insert, delete |

- No truncate, references or trigger. No grants on functions or sequences.
- Server code must never update `site_versions`, `usage_ledger` or `audit_log`. Insert a new row instead. Delete is for business erasure and the version retention job only.
- Every future migration that creates a table must grant `service_role` its privileges explicitly.

## Builder must not
- Call the privileged key from client code or public routes.
- Update `site_versions`, `usage_ledger` or `audit_log` rows. Insert new rows instead.
- Send `business_id` from the client without the server checking membership. Policies enforce it, but do not rely on errors for flow control.
