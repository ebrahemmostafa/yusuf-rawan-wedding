-- =========================================================
-- Wedding RSVP – run once in Supabase → SQL Editor.
-- Only creates the tables "yusufRawanWedding" and
-- "yusufRawanWedding_failedLogins" and the function
-- yusuf_rawan_wedding_responses; nothing else in the project is touched.
--
-- BEFORE RUNNING: replace CHANGE-ME-PASSCODE (near the bottom)
-- with the passcode you'll type on the responses page.
-- Use a long one (12+ characters, not a name or date) – it is the
-- only thing protecting the guest list.
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
  -- cf-connecting-ip is set by Supabase's edge and can't be forged by the caller;
  -- x-forwarded-for is only a fallback.
  ip text := coalesce(
    nullif(current_setting('request.headers', true)::json->>'cf-connecting-ip', ''),
    nullif(trim(split_part(current_setting('request.headers', true)::json->>'x-forwarded-for', ',', 1)), ''),
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

  if p_passcode is distinct from 'CHANGE-ME-PASSCODE' then
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
