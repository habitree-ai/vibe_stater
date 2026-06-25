-- 활동/이슈 데이터 로그 — 운영 중 발생 이벤트·이슈를 간단히 기록(추후 문제 추적용)
create table if not exists public.activity_logs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete set null,
  action       text not null,                 -- 예: coffee_chat.submit, auth.signup
  level        text not null default 'info',  -- info | issue | error
  target_type  text,
  target_id    text,
  message      text,
  metadata     jsonb,
  created_at   timestamptz not null default now()
);

alter table public.activity_logs enable row level security;
-- 기록은 서버(service_role)만 수행/조회 → 일반/익명 접근은 정책 없음(기본 차단).
-- service_role 키는 RLS를 우회하므로 별도 정책 불필요.

create index if not exists activity_logs_created_at_idx on public.activity_logs (created_at desc);
create index if not exists activity_logs_level_idx on public.activity_logs (level);
