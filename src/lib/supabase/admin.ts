import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

// 서버 전용 Supabase 클라이언트(service_role) — RLS 우회. 절대 클라이언트 번들에 노출 금지.
// SUPABASE_SERVICE_ROLE_KEY 가 없으면 null 반환(가드).
export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
