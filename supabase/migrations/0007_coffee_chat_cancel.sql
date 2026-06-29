-- =====================================================================
-- 0007_coffee_chat_cancel.sql — 본인 커피챗 신청 취소 허용
-- 마이페이지에서 사용자가 'pending' 상태의 본인 신청을 'canceled'로만 변경 가능.
-- (다른 상태 전이/타인 신청 변경은 차단. 관리자는 service_role로 RLS 우회.)
-- =====================================================================

drop policy if exists "coffee_chat_update_own_cancel" on public.coffee_chat_requests;
create policy "coffee_chat_update_own_cancel"
  on public.coffee_chat_requests for update
  using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id and status = 'canceled');
