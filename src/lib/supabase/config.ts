// Supabase 환경설정 공통 모듈.
// 키가 아직 없어도 빌드/런타임이 깨지지 않도록 placeholder fallback + 설정여부 플래그를 제공한다.
// 실제 값은 .env.local(로컬) / Cloudflare 빌드변수(배포)에 등록한다. (.env.example 참고)

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// 실제 환경변수가 모두 채워졌을 때만 true. 미설정 시 Auth 호출을 건너뛴다.
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
