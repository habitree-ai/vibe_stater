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

// 문의 삭제 — 관리자 전용. 되돌릴 수 없으므로 삭제 전 내용을 활동로그에 남겨 추적 가능하게 한다.
export async function deleteContactMessage(formData: FormData) {
  const id = String(formData.get("id") || "").trim();

  const adminId = await getAdminUserId();
  if (!adminId) {
    redirect("/me?error=" + enc("권한이 없습니다."));
  }
  if (!id) {
    redirect("/admin/contact?error=" + enc("잘못된 요청입니다."));
  }

  const service = createServiceClient();
  if (!service) {
    redirect("/admin/contact?error=" + enc("서버 설정 오류(서비스 키 없음)."));
  }

  // 삭제 전 요약 확보(누가 무엇을 지웠는지 로그에 남긴다)
  const { data: row } = await service!
    .from("contact_messages")
    .select("name, email, subject, created_at")
    .eq("id", id)
    .maybeSingle<{ name: string; email: string; subject: string | null; created_at: string }>();

  const { error } = await service!.from("contact_messages").delete().eq("id", id);
  if (error) {
    await logActivity({
      action: "admin.contact.delete",
      level: "error",
      userId: adminId,
      targetType: "contact_message",
      targetId: id,
      message: error.message,
    });
    redirect("/admin/contact?error=" + enc("삭제에 실패했습니다."));
  }

  await logActivity({
    action: "admin.contact.delete",
    level: "issue", // 되돌릴 수 없는 작업이라 눈에 띄게 남긴다
    userId: adminId,
    targetType: "contact_message",
    targetId: id,
    message: row
      ? `문의 삭제 — ${row.name}(${row.email})${row.subject ? ` / ${row.subject}` : ""}`
      : "문의 삭제(대상 정보 없음)",
    metadata: row ?? undefined,
  });

  revalidatePath("/admin/contact");
  redirect("/admin/contact?success=" + enc("문의를 삭제했습니다."));
}
