-- 커피챗 신청 INSERT 정책 강화
-- 기존 coffee_chat_insert_anyone(with check true)는 익명 삽입은 허용하지만
-- 임의 user_id 사칭·status 조작·쓰레기 데이터까지 무제한 허용 → 신청 형태로 제약한다.
drop policy if exists "coffee_chat_insert_anyone" on public.coffee_chat_requests;
drop policy if exists "coffee_chat_insert_valid" on public.coffee_chat_requests;

create policy "coffee_chat_insert_valid"
  on public.coffee_chat_requests for insert
  with check (
    status = 'pending'                              -- 신규 신청은 pending 고정(상태 조작 차단)
    and (user_id is null or user_id = auth.uid())   -- 타인 user_id 사칭 차단(익명은 null만)
    and char_length(btrim(name)) between 1 and 100
    and char_length(btrim(email)) between 3 and 200
    and email like '%_@_%.__%'                       -- 최소한의 이메일 형식
    and char_length(coalesce(topic, '')) <= 200
    and char_length(coalesce(message, '')) <= 2000
  );
