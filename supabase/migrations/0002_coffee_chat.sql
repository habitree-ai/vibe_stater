-- 1:1 커피챗 신청 데이터
create table if not exists public.coffee_chat_requests (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  name        text not null,
  email       text not null,
  topic       text,
  message     text,
  status      text not null default 'pending',  -- pending | scheduled | done | canceled
  created_at  timestamptz not null default now()
);

alter table public.coffee_chat_requests enable row level security;

-- 누구나(비로그인 포함) 신청 가능
drop policy if exists "coffee_chat_insert_anyone" on public.coffee_chat_requests;
create policy "coffee_chat_insert_anyone"
  on public.coffee_chat_requests for insert
  with check (true);

-- 본인 신청 내역만 조회 (관리자는 service_role로 RLS 우회)
drop policy if exists "coffee_chat_select_own" on public.coffee_chat_requests;
create policy "coffee_chat_select_own"
  on public.coffee_chat_requests for select
  using (auth.uid() = user_id);

create index if not exists coffee_chat_requests_created_at_idx
  on public.coffee_chat_requests (created_at desc);
