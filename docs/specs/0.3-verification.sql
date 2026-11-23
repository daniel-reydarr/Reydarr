-- GUARD-OWNED: do not edit. Request changes through the architect.
-- Spec 0.3 evidence queries (amendment 2 adds query 10). Run each query on its own
-- (to verify: the dashboard editor may show only the last result of a multi-statement run).
-- Run on the development project, then on the test project.

-- 1. RLS enabled and forced.
-- Expect exactly 9 rows (audit_log, business_members, businesses, pages, profiles,
-- sections, site_versions, sites, usage_ledger). Every row: true, true.
select c.relname as table_name,
       c.relrowsecurity as rls_enabled,
       c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind in ('r', 'p')
order by c.relname;

-- 2. Every policy.
-- Expect 18 rows. Every row: roles = {authenticated}.
-- profiles 2 (select, update), businesses 2 (select, update), business_members 1 (select),
-- sites 2 (select, update), pages 4, sections 4, site_versions 1, usage_ledger 1,
-- audit_log 1 (all select). Select policies use only is_business_member or id = auth.uid().
select tablename, policyname, cmd, roles, qual as using_expression, with_check
from pg_policies
where schemaname = 'public'
order by tablename, cmd, policyname;

-- 3. Table-level privileges held by anon and authenticated (includes PUBLIC grants).
-- Expect zero rows for anon. For authenticated, exactly:
-- profiles select; businesses select; business_members select; sites select;
-- pages select, insert, delete; sections select, insert, delete;
-- site_versions select; usage_ledger select; audit_log select.
select c.relname as table_name, r.role_name, p.privilege
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
cross join (values ('anon'), ('authenticated')) as r(role_name)
cross join (values ('select'), ('insert'), ('update'), ('delete'),
                   ('truncate'), ('references'), ('trigger')) as p(privilege)
where n.nspname = 'public'
  and c.relkind in ('r', 'p')
  and has_table_privilege(r.role_name, c.oid, p.privilege)
order by c.relname, r.role_name, p.privilege;

-- 4. Column-level grants on businesses, profiles and sites.
-- Expect only: businesses.name and businesses.category, profiles.display_name,
-- sites.recipe. Each acl shows authenticated=w/<owner>. No anon entries.
select c.relname as table_name, a.attname as column_name, a.attacl
from pg_attribute a
join pg_class c on c.oid = a.attrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('businesses', 'profiles', 'sites')
  and a.attnum > 0 and not a.attisdropped
  and a.attacl is not null
order by c.relname, a.attname;

-- 5. Functions in public: security type, settings and execute rights.
-- Expect:
-- block_update       invoker, search_path empty, anon false
-- create_business    definer, search_path empty, anon false, authenticated true
-- handle_new_user    definer, search_path empty, anon false, authenticated false
-- is_business_member definer, search_path empty, anon false, authenticated true
-- set_updated_at     invoker, search_path empty, anon false
select p.proname as function_name,
       pg_get_function_identity_arguments(p.oid) as arguments,
       case when p.prosecdef then 'definer' else 'invoker' end as security_type,
       p.proconfig as settings,
       has_function_privilege('anon', p.oid, 'execute') as anon_can_execute,
       has_function_privilege('authenticated', p.oid, 'execute') as authenticated_can_execute,
       p.proacl as acl
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
order by p.proname;

-- 6. Policies whose expression is a bare true.
-- Expect zero rows.
select tablename, policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and (btrim(coalesce(qual, '')) in ('true', '(true)')
       or btrim(coalesce(with_check, '')) in ('true', '(true)'));

-- 7. Owners of the security definer functions and their RLS bypass flag.
-- Expect 3 rows. For each, rolbypassrls = true or rolsuper = true.
-- If both are false the helper recurses. Stop and report.
select p.proname as function_name,
       pg_get_userbyid(p.proowner) as owner_role,
       r.rolbypassrls,
       r.rolsuper
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
left join pg_roles r on r.oid = p.proowner
where n.nspname = 'public'
  and p.proname in ('is_business_member', 'create_business', 'handle_new_user')
order by p.proname;

-- 8. Triggers on the append-only tables.
-- Expect 3 rows: one before-update row-level trigger per table running
-- public.block_update(). No delete triggers.
select c.relname as table_name, t.tgname as trigger_name,
       pg_get_triggerdef(t.oid) as definition
from pg_trigger t
join pg_class c on c.oid = t.tgrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('site_versions', 'usage_ledger', 'audit_log')
  and not t.tgisinternal
order by c.relname, t.tgname;

-- 9. Column-level grants on pages and sections.
-- Expect only: pages.slug, pages.title, pages.position;
-- sections.type, sections.variant, sections.position, sections.content.
-- Each acl shows authenticated=w/<owner>. No anon entries.
select c.relname as table_name, a.attname as column_name, a.attacl
from pg_attribute a
join pg_class c on c.oid = a.attrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('pages', 'sections')
  and a.attnum > 0 and not a.attisdropped
  and a.attacl is not null
order by c.relname, a.attname;

-- 10. Table privileges held by service_role (amendment 2).
-- Expect 9 rows (audit_log, business_members, businesses, pages, profiles, sections,
-- site_versions, sites, usage_ledger). can_select, can_insert and can_delete true on all.
-- can_update true on profiles, businesses, business_members, sites, pages, sections,
-- and false on site_versions, usage_ledger, audit_log. can_truncate false everywhere.
select c.relname as table_name,
       has_table_privilege('service_role', c.oid, 'select') as can_select,
       has_table_privilege('service_role', c.oid, 'insert') as can_insert,
       has_table_privilege('service_role', c.oid, 'update') as can_update,
       has_table_privilege('service_role', c.oid, 'delete') as can_delete,
       has_table_privilege('service_role', c.oid, 'truncate') as can_truncate
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by c.relname;
