"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
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

  // 중복 신청 방지 — 동일 사용자/이메일로 아직 처리 대기(pending)인 신청이 있으면 차단.
  // (연속 클릭/재신청으로 인한 쓰레기 데이터 누적 방지. service_role로 RLS 우회 조회.)
  const service = createServiceClient();
  if (service) {
    let dup = service
      .from("coffee_chat_requests")
      .select("id")
      .eq("status", "pending")
      .limit(1);
    dup = user?.id ? dup.eq("user_id", user.id) : dup.eq("email", email);
    const { data: existing } = await dup;
    if (existing && existing.length > 0) {
      redirect(
        "/coffee-chat?error=" +
          enc("이미 접수 대기 중인 신청이 있어요. 결과 안내 후 다시 신청해 주세요.")
      );
    }
  }

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

  // 부여된 신청 순번(고유번호) 조회 — 익명 행은 anon이 select할 수 없어 service_role로 읽는다.
  let seq: number | null = null;
  if (service) {
    let seqQuery = service
      .from("coffee_chat_requests")
      .select("seq")
      .eq("status", "pending");
    seqQuery = user?.id ? seqQuery.eq("user_id", user.id) : seqQuery.eq("email", email);
    const { data: row } = await seqQuery
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    seq = (row?.seq as number | undefined) ?? null;
  }

  await logActivity({
    action: "coffee_chat.submit",
    level: "info",
    userId: user?.id ?? null,
    targetType: "coffee_chat_request",
    message: `${name} 커피챗 신청 (#${seq ?? "?"})`,
    metadata: { email, topic, seq },
  });

  redirect("/coffee-chat?success=1" + (seq ? `&no=${seq}` : ""));
}

// 본인 신청 취소 — pending 상태만 canceled로 변경(RLS: coffee_chat_update_own_cancel).
export async function cancelCoffeeChat(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  if (!id) {
    redirect("/me?error=" + enc("잘못된 요청입니다."));
  }
  if (!isSupabaseConfigured) {
    redirect("/me?error=" + enc("아직 서버가 설정되지 않았습니다."));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?notice=" + enc("로그인이 필요합니다."));
  }

  const { error } = await supabase
    .from("coffee_chat_requests")
    .update({ status: "canceled" })
    .eq("id", id)
    .eq("user_id", user!.id)
    .eq("status", "pending");

  if (error) {
    await logActivity({
      action: "coffee_chat.cancel",
      level: "issue",
      userId: user!.id,
      targetType: "coffee_chat_request",
      targetId: id,
      message: error.message,
    });
    redirect("/me?error=" + enc("취소에 실패했습니다. 잠시 후 다시 시도해 주세요."));
  }

  await logActivity({
    action: "coffee_chat.cancel",
    userId: user!.id,
    targetType: "coffee_chat_request",
    targetId: id,
    message: "커피챗 신청 취소",
  });
  revalidatePath("/me");
  redirect("/me?success=" + enc("신청을 취소했습니다."));
}
