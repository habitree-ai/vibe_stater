-- =====================================================================
-- 0001_profiles.sql — 사용자 프로필 + RLS (로드맵 Step 3 / 기획서 6.1·13장)
-- auth.users 와 1:1로 연결되는 public.profiles.
-- Supabase 대시보드 SQL Editor 또는 `supabase db push`로 적용한다.
-- =====================================================================

-- 1) 테이블 ----------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  name        text,
  avatar_url  text,
  role        text not null default 'user'   check (role   in ('user', 'admin')),
  status      text not null default 'active' check (status in ('active', 'blocked', 'deleted')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 2) 관리자 판별 (security definer → RLS 우회로 정책 내 재귀 방지) ----
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'active'
  );
$$;

-- 3) RLS 정책 -------------------------------------------------------
-- 읽기: 본인 또는 관리자
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

-- 수정: 본인 또는 관리자 (role/status 변경은 아래 트리거로 추가 제한)
drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles
  for update using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- 직접 insert는 관리자만(일반 가입은 아래 트리거가 자동 생성)
drop policy if exists "profiles_insert_admin" on public.profiles;
create policy "profiles_insert_admin" on public.profiles
  for insert with check (public.is_admin());

-- 4) updated_at 자동 갱신 -------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 5) 비관리자의 role/status 변경 방지(권한 상승 차단) ----------------
create or replace function public.prevent_role_escalation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    new.role   := old.role;
    new.status := old.status;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_no_escalation on public.profiles;
create trigger trg_profiles_no_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

-- 6) 신규 가입 시 프로필 자동 생성 ----------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
