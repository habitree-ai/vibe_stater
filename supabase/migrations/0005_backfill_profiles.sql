-- 0005_backfill_profiles.sql — 기존 auth.users에 대한 프로필 백필
-- 0001_profiles의 handle_new_user 트리거는 "신규" 가입에만 동작하므로,
-- 트리거 도입 이전에 가입한 사용자는 프로필이 없다. 이를 일괄 생성한다.
-- 관리자 이메일(ADMIN_EMAIL)은 role='admin'으로 부여한다.

insert into public.profiles (id, email, name, role)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data ->> 'name', split_part(u.email, '@', 1)),
  case when u.email = 'habitree.ai@gmail.com' then 'admin' else 'user' end
from auth.users u
on conflict (id) do nothing;
