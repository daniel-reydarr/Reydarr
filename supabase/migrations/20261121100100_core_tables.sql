-- GUARD-OWNED: do not edit. Request changes through the architect.
-- Spec 0.3 migration 2 (with amendment 1): core tables, indexes and triggers.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length
    check (display_name is null or char_length(display_name) <= 80)
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  subdomain text unique,
  status text not null default 'active',
  deletion_requested_at timestamptz,
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint businesses_name_length
    check (char_length(btrim(name, E' \t\r\n')) between 2 and 80),
  constraint businesses_category_valid
    check (category in ('education', 'food_hospitality', 'beauty_wellness',
                        'health', 'professional_services', 'general')),
  constraint businesses_subdomain_format
    check (subdomain is null or subdomain ~ '^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])$'),
  constraint businesses_status_valid
    check (status in ('active', 'suspended', 'pending_deletion'))
);

create table public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  constraint business_members_role_valid check (role in ('owner', 'staff')),
  constraint business_members_business_user_key unique (business_id, user_id)
);

-- One owner per business in v1 (R88). Staff rows are not limited.
create unique index business_members_one_owner_idx
  on public.business_members (business_id) where role = 'owner';

create table public.sites (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null unique references public.businesses (id) on delete cascade,
  recipe jsonb not null default '{}'::jsonb,
  section_library_version text,
  published_version_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sites_id_business_key unique (id, business_id)
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  business_id uuid not null references public.businesses (id) on delete cascade,
  slug text not null,
  title text not null,
  "position" integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pages_site_business_fkey
    foreign key (site_id, business_id)
    references public.sites (id, business_id) on delete cascade,
  constraint pages_slug_format
    check (slug ~ '^[a-z0-9]([a-z0-9-]{0,58}[a-z0-9])?$'),
  constraint pages_title_length check (char_length(title) <= 120),
  constraint pages_site_slug_key unique (site_id, slug),
  constraint pages_id_business_key unique (id, business_id)
);

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null,
  business_id uuid not null references public.businesses (id) on delete cascade,
  "type" text not null,
  variant text,
  "position" integer not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sections_page_business_fkey
    foreign key (page_id, business_id)
    references public.pages (id, business_id) on delete cascade,
  constraint sections_type_length check (char_length("type") <= 60),
  constraint sections_variant_length check (variant is null or char_length(variant) <= 60),
  constraint sections_page_position_key
    unique (page_id, "position") deferrable initially deferred
);

create table public.site_versions (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  business_id uuid not null references public.businesses (id) on delete cascade,
  kind text not null,
  version_number integer not null,
  snapshot jsonb not null,
  section_library_version text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint site_versions_site_business_fkey
    foreign key (site_id, business_id)
    references public.sites (id, business_id) on delete cascade,
  constraint site_versions_kind_valid check (kind in ('published', 'draft_autosave')),
  constraint site_versions_site_kind_number_key unique (site_id, kind, version_number),
  constraint site_versions_id_business_key unique (id, business_id)
);

-- The published version must belong to the same business as the site. The column-list
-- form of SET NULL needs PostgreSQL 15 or later. TODO (to verify): the server version.
-- On an older server the fallback is RESTRICT, which can block business erasure if the
-- cascade reaches site_versions before sites. Check pg_constraint after applying.
do $$
begin
  if current_setting('server_version_num')::integer >= 150000 then
    execute 'alter table public.sites add constraint sites_published_version_fkey '
      || 'foreign key (published_version_id, business_id) '
      || 'references public.site_versions (id, business_id) '
      || 'on delete set null (published_version_id)';
  else
    execute 'alter table public.sites add constraint sites_published_version_fkey '
      || 'foreign key (published_version_id, business_id) '
      || 'references public.site_versions (id, business_id) '
      || 'on delete restrict';
    raise notice 'sites_published_version_fkey uses ON DELETE RESTRICT (server older than 15). Report to the architect.';
  end if;
end;
$$;

create table public.usage_ledger (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  entry_type text not null,
  meter text not null,
  quantity integer not null,
  cost_kobo bigint not null default 0,
  model text,
  prompt_version text,
  idempotency_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint usage_ledger_entry_type_valid check (entry_type in ('usage', 'credit')),
  constraint usage_ledger_meter_valid
    check (meter in ('ai_text', 'ai_image', 'ai_video', 'regeneration',
                     'email_send', 'top_up_image', 'top_up_video')),
  constraint usage_ledger_quantity_positive check (quantity > 0),
  constraint usage_ledger_cost_kobo_nonnegative check (cost_kobo >= 0)
);

create unique index usage_ledger_business_idempotency_key_idx
  on public.usage_ledger (business_id, idempotency_key)
  where idempotency_key is not null;

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  actor_type text not null,
  actor_user_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  "before" jsonb,
  "after" jsonb,
  created_at timestamptz not null default now(),
  constraint audit_log_actor_type_valid
    check (actor_type in ('owner', 'zuri', 'system', 'admin')),
  constraint audit_log_action_length check (char_length(action) <= 80),
  constraint audit_log_entity_type_length check (char_length(entity_type) <= 60)
);

-- Spec 0.3 section 5 asks for an index on every business_id column, so some of
-- these overlap with unique indexes above.
create index business_members_business_id_idx on public.business_members (business_id);
create index business_members_user_id_idx on public.business_members (user_id);
create index sites_business_id_idx on public.sites (business_id);
create index pages_business_id_idx on public.pages (business_id);
create index pages_site_id_idx on public.pages (site_id);
create index sections_business_id_idx on public.sections (business_id);
create index sections_page_id_idx on public.sections (page_id);
create index site_versions_business_id_idx on public.site_versions (business_id);
create index site_versions_site_id_created_at_idx
  on public.site_versions (site_id, created_at desc);
create index usage_ledger_business_id_idx on public.usage_ledger (business_id);
create index usage_ledger_business_id_created_at_idx
  on public.usage_ledger (business_id, created_at desc);
create index audit_log_business_id_idx on public.audit_log (business_id);
create index audit_log_business_id_created_at_idx
  on public.audit_log (business_id, created_at desc);

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger businesses_set_updated_at before update on public.businesses
  for each row execute function public.set_updated_at();
create trigger sites_set_updated_at before update on public.sites
  for each row execute function public.set_updated_at();
create trigger pages_set_updated_at before update on public.pages
  for each row execute function public.set_updated_at();
create trigger sections_set_updated_at before update on public.sections
  for each row execute function public.set_updated_at();

create trigger site_versions_block_update before update on public.site_versions
  for each row execute function public.block_update();
create trigger usage_ledger_block_update before update on public.usage_ledger
  for each row execute function public.block_update();
create trigger audit_log_block_update before update on public.audit_log
  for each row execute function public.block_update();