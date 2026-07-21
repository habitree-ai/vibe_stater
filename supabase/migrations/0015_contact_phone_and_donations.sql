-- 0015: ① 문의 연락처(선택) ② 후원 내역 기록
--
-- ① contact_messages.phone — 선택 입력. 익명 INSERT 정책이 컬럼 길이를 검증하도록 정책을 갱신한다.
-- ② donations — Polar 웹훅으로 들어온 결제 완료 기록. 알림 중복 발송을 막는 근거(order_id unique)도 겸한다.

-- ① 문의 연락처 ------------------------------------------------------
alter table public.contact_messages
  add column if not exists phone text;

-- 정책 재정의: 기존 검증 + phone 길이 제한(최대 30자)
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
    and char_length(coalesce(phone, '')) <= 30
  );

-- ② 후원 내역 --------------------------------------------------------
create table if not exists public.donations (
  id              uuid primary key default gen_random_uuid(),
  order_id        text not null unique,      -- Polar order id — 웹훅 재전송 시 중복 알림 방지
  amount_cents    integer not null default 0,
  currency        text not null default 'usd',
  customer_name   text,
  customer_email  text,
  product_name    text,
  status          text not null default 'paid',
  raw             jsonb,                     -- 원본 페이로드(진단용)
  notified_at     timestamptz,               -- 카카오·메일 알림 발송 시각
  created_at      timestamptz not null default now()
);

alter table public.donations enable row level security;
-- 정책 없음: service_role(웹훅·관리자 화면)만 읽고 쓴다. 후원자 개인정보가 담기므로 공개 금지.

create index if not exists donations_created_at_idx
  on public.donations (created_at desc);
