"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logActivity } from "@/lib/log";

export type NewsletterState = { ok: boolean; message: string } | null;

// 뉴스레터 구독 — newsletter_subscribers 테이블에 저장(이메일 unique).
// 중복 이메일(23505)은 이미 구독 중으로 graceful 처리. useActionState용 시그니처.
export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const email = String(formData.get("email") || "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "올바른 이메일 주소를 입력해 주세요." };
  }
  if (!isSupabaseConfigured) {
    return { ok: false, message: "잠시 후 다시 시도해 주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email });

  if (error) {
    if (error.code === "23505") {
      return { ok: true, message: "이미 구독 중이에요. 감사합니다!" };
    }
    await logActivity({
      action: "newsletter.subscribe",
      level: "error",
      message: error.message,
      metadata: { email },
    });
    return { ok: false, message: "구독에 실패했어요. 잠시 후 다시 시도해 주세요." };
  }

  await logActivity({ action: "newsletter.subscribe", message: "뉴스레터 구독", metadata: { email } });
  return { ok: true, message: "구독 완료! 새 소식이 준비되면 이메일로 보내드릴게요." };
}
