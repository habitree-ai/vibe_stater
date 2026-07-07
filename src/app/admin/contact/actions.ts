"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/admin";
import { getAdminUserId } from "@/lib/admin";
import { logActivity } from "@/lib/log";

function enc(s: string) {
  return encodeURIComponent(s);
}

const VALID_STATUS = ["new", "read", "done"] as const;

// 문의 상태 변경 — 관리자 전용. service_role로 RLS 우회 업데이트.
export async function updateContactStatus(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const status = String(formData.get("status") || "").trim();

  const adminId = await getAdminUserId();
  if (!adminId) {
    redirect("/me?error=" + enc("권한이 없습니다."));
  }
  if (!id || !VALID_STATUS.includes(status as (typeof VALID_STATUS)[number])) {
    redirect("/admin/contact?error=" + enc("잘못된 요청입니다."));
  }

  const service = createServiceClient();
  if (!service) {
    redirect("/admin/contact?error=" + enc("서버 설정 오류(서비스 키 없음)."));
  }

  const { error } = await service!.from("contact_messages").update({ status }).eq("id", id);
  if (error) {
    await logActivity({
      action: "admin.contact.update_status",
      level: "error",
      userId: adminId,
      targetType: "contact_message",
      targetId: id,
      message: error.message,
    });
    redirect("/admin/contact?error=" + enc("상태 변경에 실패했습니다."));
  }

  await logActivity({
    action: "admin.contact.update_status",
    userId: adminId,
    targetType: "contact_message",
    targetId: id,
    message: `문의 상태 변경 → ${status}`,
  });
  revalidatePath("/admin/contact");
  redirect("/admin/contact?success=" + enc("상태를 변경했습니다."));
}
