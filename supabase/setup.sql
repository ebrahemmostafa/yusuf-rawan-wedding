-- =========================================================
-- Wedding RSVP – run once in Supabase → SQL Editor.
-- Only creates objects whose names start with "yusufRawanWedding" /
-- "yusuf_rawan_wedding"; nothing else in the project is touched.
--
-- The passcode for responses.html is NOT in this file (this file is in
-- the public repo). After running it, set the passcode separately in the
-- SQL Editor – see "SET THE PASSCODE" at the bottom.
-- =========================================================

create table if not exists public."yusufRawanWedding" (
  id               bigint generated always as identity primary key,
  created_at       timestamptz not null default now(),
  attending        boolean     not null,
  name             text        not null check (char_length(name) between 1 and 120),
  guest_count      smallint    not null default 0 check (guest_count between 0 and 10),
  guests           jsonb       not null default '[]'::jsonb    -- [{ "name": "...", "dietary": "..." }]
                   check (jsonb_typeof(guests) = 'array'
                          and jsonb_array_length(guests) <= 10
                          and pg_column_size(guests) <= 4000),
  children         boolean     not null default false,
  children_details text        check (char_length(children_details) <= 300),
  message          text        check (char_length(message) <= 2000)
);

-- Lock the table down: guests may only INSERT, nobody may read it with the public key.
alter table public."yusufRawanWedding" enable row level security;

drop policy if exists "yusufRawanWedding: guests can submit" on public."yusufRawanWedding";
create policy "yusufRawanWedding: guests can submit"
  on public."yusufRawanWedding"
  for insert
  to anon, authenticated
  with check (true);

revoke all on public."yusufRawanWedding" from anon, authenticated;
grant insert (attending, name, guest_count, guests, children, children_details, message)
  on public."yusufRawanWedding" to anon, authenticated;

-- The responses-page passcode, stored only as a SHA-256 hash.
create table if not exists public."yusufRawanWedding_settings" (
  id            boolean primary key default true check (id),   -- single row
  passcode_hash text not null
);
alter table public."yusufRawanWedding_settings" enable row level security;
revoke all on public."yusufRawanWedding_settings" from anon, authenticated;

create or replace function public.yusuf_rawan_wedding_set_passcode(p_passcode text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if char_length(coalesce(p_passcode, '')) < 16 then
    raise exception 'Passcode must be at least 16 characters';
  end if;
  insert into public."yusufRawanWedding_settings" (id, passcode_hash)
  values (true, encode(sha256(convert_to(p_passcode, 'UTF8')), 'hex'))
  on conflict (id) do update set passcode_hash = excluded.passcode_hash;
end;
$$;
-- Only the project owner (SQL Editor) may set the passcode.
revoke all on function public.yusuf_rawan_wedding_set_passcode(text) from public, anon, authenticated;

-- Failed passcode attempts, used to lock the responses page after too many guesses.
create table if not exists public."yusufRawanWedding_failedLogins" (
  attempted_at timestamptz not null default now(),
  client_ip    text        not null default 'unknown'
);
alter table public."yusufRawanWedding_failedLogins"
  add column if not exists client_ip text not null default 'unknown';
alter table public."yusufRawanWedding_failedLogins" enable row level security;
revoke all on public."yusufRawanWedding_failedLogins" from anon, authenticated;

-- Reading responses goes through this function, which checks the passcode.
-- After 10 wrong passcodes within 15 minutes from the same IP address, that address is
-- refused until the window passes (other visitors, e.g. the couple, are not affected).
-- Returns {"ok": true, "rows": [...]} or {"ok": false, "error": "..."}.
drop function if exists public.yusuf_rawan_wedding_responses(text);
create function public.yusuf_rawan_wedding_responses(p_passcode text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_failures int;
  stored_hash text;
  -- cf-connecting-ip is set by Supabase's edge and can't be forged by the caller.
  -- (x-forwarded-for is deliberately not used: callers can put anything in it.)
  ip text := coalesce(
    nullif(current_setting('request.headers', true)::json->>'cf-connecting-ip', ''),
    'unknown');
begin
  delete from public."yusufRawanWedding_failedLogins"
   where attempted_at < now() - interval '1 day';

  select count(*) into recent_failures
    from public."yusufRawanWedding_failedLogins"
   where client_ip = ip
     and attempted_at > now() - interval '15 minutes';

  if recent_failures >= 10 then
    return jsonb_build_object('ok', false, 'error', 'locked');
  end if;

  select passcode_hash into stored_hash from public."yusufRawanWedding_settings";
  if stored_hash is null then
    return jsonb_build_object('ok', false, 'error', 'passcode not set');
  end if;

  if encode(sha256(convert_to(coalesce(p_passcode, ''), 'UTF8')), 'hex') <> stored_hash then
    insert into public."yusufRawanWedding_failedLogins" (client_ip) values (left(ip, 64));
    return jsonb_build_object('ok', false, 'error', 'invalid passcode');
  end if;

  return jsonb_build_object(
    'ok', true,
    'rows', coalesce((
      select jsonb_agg(to_jsonb(r) order by r.created_at desc)
        from public."yusufRawanWedding" r
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.yusuf_rawan_wedding_responses(text) from public;
grant execute on function public.yusuf_rawan_wedding_responses(text) to anon, authenticated;

-- =========================================================
-- SET THE PASSCODE – run this separately in the SQL Editor
-- (don't save it in this file). Use 16+ random characters,
-- e.g. from a password generator. Run it again to change it.
--
--   select public.yusuf_rawan_wedding_set_passcode('your-long-random-passcode');
-- =========================================================
