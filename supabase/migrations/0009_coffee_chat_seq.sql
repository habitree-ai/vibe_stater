-- =====================================================================
-- 0009_coffee_chat_seq.sql — 커피챗 신청 순번(고유번호) 채번
-- 신청 시 "몇 번째 신청자"인지 영구·고유 번호를 자동 부여하고 관리/표시한다.
-- 기존 테스트 데이터는 전체 삭제하고 1번부터 시작(사용자 승인).
-- =====================================================================

-- 1) 기존 테스트 데이터 정리 ----------------------------------------
delete from public.coffee_chat_requests;

-- 2) 채번 시퀀스 ----------------------------------------------------
create sequence if not exists public.coffee_chat_seq start with 1;

-- 3) seq 컬럼(자동 채번, 고유) --------------------------------------
alter table public.coffee_chat_requests
  add column if not exists seq bigint not null default nextval('public.coffee_chat_seq');

alter sequence public.coffee_chat_seq owned by public.coffee_chat_requests.seq;

create unique index if not exists coffee_chat_requests_seq_key
  on public.coffee_chat_requests (seq);

-- 4) 빈 테이블 기준 시퀀스 초기화(다음 nextval = 1) ------------------
select setval('public.coffee_chat_seq', 1, false);
