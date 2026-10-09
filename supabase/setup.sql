-- =========================================================
-- Wedding RSVP – run once in Supabase → SQL Editor.
-- Only creates the table "yusufRawanWedding" and the function
-- yusuf_rawan_wedding_responses; nothing else in the project is touched.
--
-- BEFORE RUNNING: replace CHANGE-ME-PASSCODE (near the bottom)
-- with the passcode you'll type on the responses page.
-- =========================================================

create table if not exists public."yusufRawanWedding" (
  id               bigint generated always as identity primary key,
  created_at       timestamptz not null default now(),
  attending        boolean     not null,
  name             text        not null check (char_length(name) between 1 and 120),
  guest_count      smallint    not null default 0 check (guest_count between 0 and 10),
  guests           jsonb       not null default '[]'::jsonb,   -- [{ "name": "...", "dietary": "..." }]
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

-- Reading responses goes through this function, which checks the passcode.
create or replace function public.yusuf_rawan_wedding_responses(p_passcode text)
returns setof public."yusufRawanWedding"
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_passcode is distinct from 'CHANGE-ME-PASSCODE' then
    raise exception 'invalid passcode' using errcode = '28P01';
  end if;
  return query select * from public."yusufRawanWedding" order by created_at desc;
end;
$$;

revoke all on function public.yusuf_rawan_wedding_responses(text) from public;
grant execute on function public.yusuf_rawan_wedding_responses(text) to anon, authenticated;
