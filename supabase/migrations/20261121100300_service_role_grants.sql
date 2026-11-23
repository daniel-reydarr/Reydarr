-- GUARD-OWNED: do not edit. Request changes through the architect.
-- Spec 0.3 amendment 2: explicit table grants for service_role.
--
-- Server code that uses the privileged key writes site_versions, usage_ledger and
-- audit_log and runs the erasure and retention jobs. Bypassing RLS does not replace
-- table grants, so each privilege is granted here and default privileges are not used.
-- This migration touches service_role only and changes no default privileges.

-- Start from a known state. On a project whose defaults already give service_role
-- broad rights (truncate, or update on the append-only tables), the grants below
-- alone would leave those extras in place and break the intent of amendment 1.
revoke all on table
  public.profiles, public.businesses, public.business_members, public.sites,
  public.pages, public.sections, public.site_versions, public.usage_ledger,
  public.audit_log
from service_role;

grant select, insert, update, delete on table
  public.profiles, public.businesses, public.business_members,
  public.sites, public.pages, public.sections
to service_role;

-- No update grant on the append-only tables, which matches the block_update trigger.
-- Delete stays for business erasure and the site version retention job.
grant select, insert, delete on table
  public.site_versions, public.usage_ledger, public.audit_log
to service_role;
