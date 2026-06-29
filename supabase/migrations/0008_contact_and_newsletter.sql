-- =====================================================================
-- 0008_contact_and_newsletter.sql — 문의 메시지 + 뉴스레터 구독 저장
-- /contact 폼과 홈 뉴스레터 섹션을 실제 동작(DB 저장)으로 전환한다.
-- (이메일 발송은 RESEND 키 설정 후 후속 — 데이터는 유실 없이 보존.)
-- =====================================================================

-- 1) 문의 메시지 ----------------------------------------------------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  name        text not null,
  email       text not null,
  type        text,
  subject     text,
  message     text not null,
  status      text not null default 'new',  -- new | read | done
  created_at  timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- 누구나(비로그인 포함) 형식이 맞는 문의를 남길 수 있다. 조회는 관리자(service_role)만.
drop policy if exists "contact_insert_valid" on public.contact_messages;
create policy "contact_insert_valid"
  on public.contact_messages for insert
  with check (
    status = 'new'
    and (user_id is null or user_id = auth.uid())
    and char_length(btrim(name)) between 1 and 100
    and char_length(btrim(email)) between 3 and 200
    and email like '%_@_%.__%'
    and char_length(btrim(message)) between 1 and 5000
    and char_length(coalesce(subject, '')) <= 200
    and char_length(coalesce(type, '')) <= 50
  );

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

-- 2) 뉴스레터 구독 --------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  created_at  timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

-- 누구나 구독 가능(형식 검증). 중복 이메일은 unique 제약으로 차단 → 액션에서 graceful 처리.
drop policy if exists "newsletter_insert_valid" on public.newsletter_subscribers;
create policy "newsletter_insert_valid"
  on public.newsletter_subscribers for insert
  with check (
    char_length(btrim(email)) between 3 and 200
    and email like '%_@_%.__%'
  );
