-- 0013: 알림 채널 토큰 저장소 (카카오 '나에게 보내기' 등)
--
-- access 토큰은 수 시간짜리라 env에 둘 수 없고, refresh 토큰은 갱신 시 회전되므로
-- 런타임에 쓸 수 있는 저장소(DB)가 필요하다. RLS를 켜고 정책을 만들지 않는다
-- → anon/authenticated 접근 불가, service_role 전용.

create table if not exists public.notification_tokens (
  id text primary key,               -- 'kakao'
  access_token text,
  refresh_token text,
  access_expires_at timestamptz,     -- access 토큰 만료 시각
  updated_at timestamptz not null default now()
);

alter table public.notification_tokens enable row level security;
-- 정책 없음: service_role만 읽고 쓴다.
