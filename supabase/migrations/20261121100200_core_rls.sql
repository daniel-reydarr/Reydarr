-- GUARD-OWNED: do not edit. Request changes through the architect.
-- Spec 0.3 migration 3 (with amendment 1): membership helper, functions, grants, RLS.

-- TODO (to verify): the owner of the security definer functions below must bypass
-- row-level security. Tables use FORCE ROW LEVEL SECURITY, and is_business_member reads
-- business_members, whose policy calls is_business_member. Without a bypassing owner this
-- recurses and create_business cannot insert. Assumed owner: the migration role
-- (postgres). Run verification query 7 to confirm.

create function public.is_business_member(p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.business_members m
    join public.businesses b on b.id = m.business_id
    where m.business_id = p_business_id
      and m.user_id = auth.uid()
      and b.status <> 'pending_deletion'
  );
$$;

create function public.create_business(p_name text, p_category text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_name text;
  v_business_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_name := btrim(p_name, E' \t\r\n');
  if v_name is null or char_length(v_name) < 2 or char_length(v_name) > 80 then
    raise exception 'invalid_name' using errcode = '22023';
  end if;

  if p_category is null or p_category not in
     ('education', 'food_hospitality', 'beauty_wellness',
      'health', 'professional_services', 'general') then
    raise exception 'invalid_category' using errcode = '22023';
  end if;

  insert into public.businesses (name, category, created_by)
  values (v_name, p_category, v_uid)
  returning id into v_business_id;

  insert into public.business_members (business_id, user_id, role)
  values (v_business_id, v_uid, 'owner');

  insert into public.sites (business_id) values (v_business_id);

  return v_business_id;
end;
$$;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

-- TODO (to verify): whether a migration may create a trigger on auth.users in this
-- project. If this statement fails, stop and report to the architect.
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Table privileges. Everything is closed first, then opened per the spec table.
revoke all on table
  public.profiles, public.businesses, public.business_members, public.sites,
  public.pages, public.sections, public.site_versions, public.usage_ledger,
  public.audit_log
from public, anon, authenticated;

-- TODO (to verify): this changes default privileges for the role running this migration
-- only. Check pg_default_acl for entries held by other roles.
alter default privileges in schema public revoke all on tables from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;

grant select on public.businesses to authenticated;
grant update (name, category) on public.businesses to authenticated;

grant select on public.business_members to authenticated;

grant select on public.sites to authenticated;
grant update (recipe) on public.sites to authenticated;

grant select, insert, delete on public.pages to authenticated;
grant update (slug, title, "position") on public.pages to authenticated;

grant select, insert, delete on public.sections to authenticated;
grant update ("type", variant, "position", content) on public.sections to authenticated;

grant select on public.site_versions to authenticated;
grant select on public.usage_ledger to authenticated;
grant select on public.audit_log to authenticated;

-- Row-level security, forced so table owners are not exempt.
alter table public.profiles enable row level security;
alter table public.profiles force row level security;
alter table public.businesses enable row level security;
alter table public.businesses force row level security;
alter table public.business_members enable row level security;
alter table public.business_members force row level security;
alter table public.sites enable row level security;
alter table public.sites force row level security;
alter table public.pages enable row level security;
alter table public.pages force row level security;
alter table public.sections enable row level security;
alter table public.sections force row level security;
alter table public.site_versions enable row level security;
alter table public.site_versions force row level security;
alter table public.usage_ledger enable row level security;
alter table public.usage_ledger force row level security;
alter table public.audit_log enable row level security;
alter table public.audit_log force row level security;

-- profiles
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = auth.uid());
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- businesses
create policy businesses_select_member on public.businesses
  for select to authenticated
  using (public.is_business_member(id));
create policy businesses_update_member_active on public.businesses
  for update to authenticated
  using (status = 'active' and public.is_business_member(id))
  with check (status = 'active' and public.is_business_member(id));

-- business_members
create policy business_members_select_member on public.business_members
  for select to authenticated
  using (public.is_business_member(business_id));

-- sites
create policy sites_select_member on public.sites
  for select to authenticated
  using (public.is_business_member(business_id));
create policy sites_update_member_active on public.sites
  for update to authenticated
  using (
    public.is_business_member(business_id)
    and exists (select 1 from public.businesses b
                where b.id = sites.business_id and b.status = 'active')
  )
  with check (
    public.is_business_member(business_id)
    and exists (select 1 from public.businesses b
                where b.id = sites.business_id and b.status = 'active')
  );

-- pages
create policy pages_select_member on public.pages
  for select to authenticated
  using (public.is_business_member(business_id));
create policy pages_insert_member_active on public.pages
  for insert to authenticated
  with check (
    public.is_business_member(business_id)
    and exists (select 1 from public.businesses b
                where b.id = pages.business_id and b.status = 'active')
  );
create policy pages_update_member_active on public.pages
  for update to authenticated
  using (
    public.is_business_member(business_id)
    and exists (select 1 from public.businesses b
                where b.id = pages.business_id and b.status = 'active')
  )
  with check (
    public.is_business_member(business_id)
    and exists (select 1 from public.businesses b
                where b.id = pages.business_id and b.status = 'active')
  );
create policy pages_delete_member_active on public.pages
  for delete to authenticated
  using (
    public.is_business_member(business_id)
    and exists (select 1 from public.businesses b
                where b.id = pages.business_id and b.status = 'active')
  );

-- sections
create policy sections_select_member on public.sections
  for select to authenticated
  using (public.is_business_member(business_id));
create policy sections_insert_member_active on public.sections
  for insert to authenticated
  with check (
    public.is_business_member(business_id)
    and exists (select 1 from public.businesses b
                where b.id = sections.business_id and b.status = 'active')
  );
create policy sections_update_member_active on public.sections
  for update to authenticated
  using (
    public.is_business_member(business_id)
    and exists (select 1 from public.businesses b
                where b.id = sections.business_id and b.status = 'active')
  )
  with check (
    public.is_business_member(business_id)
    and exists (select 1 from public.businesses b
                where b.id = sections.business_id and b.status = 'active')
  );
create policy sections_delete_member_active on public.sections
  for delete to authenticated
  using (
    public.is_business_member(business_id)
    and exists (select 1 from public.businesses b
                where b.id = sections.business_id and b.status = 'active')
  );

-- read-only for owners
create policy site_versions_select_member on public.site_versions
  for select to authenticated
  using (public.is_business_member(business_id));
create policy usage_ledger_select_member on public.usage_ledger
  for select to authenticated
  using (public.is_business_member(business_id));
create policy audit_log_select_member on public.audit_log
  for select to authenticated
  using (public.is_business_member(business_id));

-- Function privileges. Trigger functions are not checked for EXECUTE when they fire.
revoke execute on function public.is_business_member(uuid) from public, anon;
grant execute on function public.is_business_member(uuid) to authenticated;

revoke execute on function public.create_business(text, text) from public, anon;
grant execute on function public.create_business(text, text) to authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon;
revoke execute on function public.block_update() from public, anon;