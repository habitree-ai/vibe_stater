"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/admin";
import { getAdminUserId } from "@/lib/admin";
import { logActivity } from "@/lib/log";

function enc(s: string) {
  return encodeURIComponent(s);
}

const VALID_STATUS = ["pending", "scheduled", "done", "canceled"] as const;

// 커피챗 신청 상태 변경 — 관리자 전용. service_role로 RLS 우회 업데이트.
export async function updateCoffeeChatStatus(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const status = String(formData.get("status") || "").trim();

  const adminId = await getAdminUserId();
  if (!adminId) {
    redirect("/me?error=" + enc("권한이 없습니다."));
  }
  if (!id || !VALID_STATUS.includes(status as (typeof VALID_STATUS)[number])) {
    redirect("/admin/coffee-chat?error=" + enc("잘못된 요청입니다."));
  }

  const service = createServiceClient();
  if (!service) {
    redirect("/admin/coffee-chat?error=" + enc("서버 설정 오류(서비스 키 없음)."));
  }

  const { error } = await service!.from("coffee_chat_requests").update({ status }).eq("id", id);
  if (error) {
    await logActivity({
      action: "admin.coffee_chat.update_status",
      level: "error",
      userId: adminId,
      targetType: "coffee_chat_request",
      targetId: id,
      message: error.message,
    });
    redirect("/admin/coffee-chat?error=" + enc("상태 변경에 실패했습니다."));
  }

  await logActivity({
    action: "admin.coffee_chat.update_status",
    userId: adminId,
    targetType: "coffee_chat_request",
    targetId: id,
    message: `상태 변경 → ${status}`,
  });
  revalidatePath("/admin/coffee-chat");
  redirect("/admin/coffee-chat?success=" + enc("상태를 변경했습니다."));
}
