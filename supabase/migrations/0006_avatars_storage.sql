-- =====================================================================
-- 0006_avatars_storage.sql — 프로필 사진 업로드용 Storage 버킷 + RLS
-- 마이페이지(/me)에서 사용자가 기기의 이미지를 업로드해 프로필 사진으로 사용.
-- 경로 규칙: avatars/{auth.uid()}/<파일명>  → 본인 폴더에만 쓰기 가능, 읽기는 공개.
-- =====================================================================

-- 1) 버킷 (공개 읽기) -------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- 2) RLS 정책 (storage.objects) -------------------------------------
-- 공개 읽기: avatars 버킷의 객체는 누구나 조회 가능(공개 URL 노출).
drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

-- 업로드: 로그인 사용자가 자신의 uid 폴더에만.
drop policy if exists "avatars_insert_own" on storage.objects;
create policy "avatars_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 수정(덮어쓰기): 본인 폴더만.
drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 삭제: 본인 폴더만.
drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_delete_own" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
