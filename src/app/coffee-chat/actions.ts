"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logActivity } from "@/lib/log";

function enc(s: string) {
  return encodeURIComponent(s);
}

export async function submitCoffeeChat(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const topic = String(formData.get("topic") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email) {
    redirect("/coffee-chat?error=" + enc("이름과 이메일을 입력해 주세요."));
  }
  if (!isSupabaseConfigured) {
    redirect("/coffee-chat?error=" + enc("아직 서버가 설정되지 않았습니다. 잠시 후 다시 시도해 주세요."));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("coffee_chat_requests").insert({
    user_id: user?.id ?? null,
    name,
    email,
    topic: topic || null,
    message: message || null,
  });

  if (error) {
    await logActivity({
      action: "coffee_chat.submit",
      level: "error",
      userId: user?.id ?? null,
      message: error.message,
      metadata: { email },
    });
    redirect("/coffee-chat?error=" + enc("신청 저장에 실패했습니다. 잠시 후 다시 시도해 주세요."));
  }

  await logActivity({
    action: "coffee_chat.submit",
    level: "info",
    userId: user?.id ?? null,
    targetType: "coffee_chat_request",
    message: `${name} 커피챗 신청`,
    metadata: { email, topic },
  });

  redirect("/coffee-chat?success=1");
}
