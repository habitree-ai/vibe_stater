-- 0014: 문의 스팸/알림 폭탄 방지용 IP 해시 + 조회 인덱스
--
-- 배경: /contact 는 비로그인 누구나 제출할 수 있고, 제출마다 운영자에게 메일·카카오톡이 나간다.
-- 반복 제출로 알림 쿼터를 소진시키면 '진짜 문의' 알림이 묻히는 무력화(blinding)가 가능하다.
-- 원문 IP는 개인정보이므로 저장하지 않고, 서버 전용 솔트로 해시한 값만 남겨 빈도 판정에만 쓴다.

alter table public.contact_messages
  add column if not exists ip_hash text;

-- 최근 N초 내 동일 IP 건수 조회용 (service_role 전용 경로에서만 사용)
create index if not exists contact_messages_ip_hash_created_idx
  on public.contact_messages (ip_hash, created_at desc);
