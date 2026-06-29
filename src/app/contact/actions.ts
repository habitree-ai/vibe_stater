"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logActivity } from "@/lib/log";

function enc(s: string) {
  return encodeURIComponent(s);
}

// 문의 접수 — contact_messages 테이블에 저장(RLS: contact_insert_valid).
// 이메일 발송은 RESEND 키 설정 후 후속. 지금은 DB 저장으로 유실 없이 보존.
export async function submitContact(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const type = String(formData.get("type") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    redirect("/contact?error=" + enc("이름·이메일·내용을 입력해 주세요."));
  }
  if (!isSupabaseConfigured) {
    redirect("/contact?error=" + enc("아직 서버가 설정되지 않았습니다. 잠시 후 다시 시도해 주세요."));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("contact_messages").insert({
    user_id: user?.id ?? null,
    name,
    email,
    type: type || null,
    subject: subject || null,
    message,
  });

  if (error) {
    await logActivity({
      action: "contact.submit",
      level: "error",
      userId: user?.id ?? null,
      message: error.message,
      metadata: { email },
    });
    redirect("/contact?error=" + enc("전송에 실패했습니다. 잠시 후 다시 시도해 주세요."));
  }

  await logActivity({
    action: "contact.submit",
    userId: user?.id ?? null,
    targetType: "contact_message",
    message: `${name} 문의`,
    metadata: { email, type },
  });
  redirect("/contact?success=1");
}
