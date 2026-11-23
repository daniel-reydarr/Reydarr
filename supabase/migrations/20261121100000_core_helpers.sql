-- GUARD-OWNED: do not edit. Request changes through the architect.
-- Spec 0.3 migration 1: helper functions.

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Append-only tables must reject updates from every caller. Deletes are not blocked
-- because business erasure cascades and the retention job prunes old site versions.
create function public.block_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'append_only' using errcode = '42501';
end;
$$;