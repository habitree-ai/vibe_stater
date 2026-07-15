"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/admin";
import { getAdminUserId } from "@/lib/admin";
import { logActivity } from "@/lib/log";
import { findModel } from "@/lib/chat-models";

function enc(s: string) {
  return encodeURIComponent(s);
}

function fail(msg: string): never {
  redirect("/admin/settings?error=" + enc(msg));
}

// AI 챗봇 설정 저장 — 관리자 전용. service_role로 RLS 우회 업데이트.
// 저장 즉시 /api/chat 이 새 값을 읽는다(챗봇은 매 요청 DB에서 설정을 조회).
export async function updateChatSettings(formData: FormData) {
  const adminId = await getAdminUserId();
  if (!adminId) {
    redirect("/me?error=" + enc("권한이 없습니다."));
  }

  const model = String(formData.get("model") || "").trim();
  const systemPrompt = String(formData.get("system_prompt") || "").trim();
  const enabled = formData.get("enabled") === "on";
  const temperatureRaw = String(formData.get("temperature") || "").trim();
  const maxTokensRaw = String(formData.get("max_tokens") || "").trim();

  // 카탈로그에 없는 모델은 거절 — 임의 문자열이 그대로 OpenAI로 나가지 않게 한다.
  const spec = findModel(model);
  if (!spec) fail("지원하지 않는 모델입니다.");

  const temperature = Number(temperatureRaw);
  if (!Number.isFinite(temperature) || temperature < 0 || temperature > 2) {
    fail("temperature는 0~2 사이여야 합니다.");
  }
  // gpt-5 초기 모델은 temperature=1만 허용 → 저장 단계에서 막지 않으면 챗봇이 런타임 400으로 죽는다.
  if (!spec!.supportsTemperature && temperature !== 1) {
    fail(`${spec!.label}은(는) temperature 조절을 지원하지 않습니다(1 고정).`);
  }

  const maxTokens = Number(maxTokensRaw);
  if (!Number.isInteger(maxTokens) || maxTokens < 64 || maxTokens > 4096) {
    fail("최대 응답 길이는 64~4096 사이의 정수여야 합니다.");
  }

  if (systemPrompt.length < 1 || systemPrompt.length > 8000) {
    fail("기본지침은 1~8000자 사이여야 합니다.");
  }

  const service = createServiceClient();
  if (!service) fail("서버 설정 오류(서비스 키 없음).");

  const { error } = await service!
    .from("chat_settings")
    .update({
      model,
      temperature,
      max_tokens: maxTokens,
      system_prompt: systemPrompt,
      enabled,
      updated_at: new Date().toISOString(),
      updated_by: adminId,
    })
    .eq("id", 1);

  if (error) {
    await logActivity({
      action: "admin.chat_settings.update",
      level: "error",
      userId: adminId,
      targetType: "chat_settings",
      targetId: "1",
      message: error.message,
    });
    fail("설정 저장에 실패했습니다.");
  }

  await logActivity({
    action: "admin.chat_settings.update",
    userId: adminId,
    targetType: "chat_settings",
    targetId: "1",
    message: `챗봇 설정 저장 → ${model} / temp ${temperature} / ${maxTokens}토큰 / ${enabled ? "사용" : "중지"}`,
    metadata: { model, temperature, maxTokens, enabled },
  });

  revalidatePath("/admin/settings");
  redirect("/admin/settings?success=" + enc("설정을 저장했습니다. 챗봇에 즉시 반영됩니다."));
}
