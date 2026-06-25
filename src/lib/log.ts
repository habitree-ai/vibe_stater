import { createServiceClient } from "@/lib/supabase/admin";

export type LogLevel = "info" | "issue" | "error";

type LogInput = {
  action: string;
  level?: LogLevel;
  userId?: string | null;
  targetType?: string;
  targetId?: string;
  message?: string;
  metadata?: Record<string, unknown>;
};

// 활동/이슈 데이터 로그 — best-effort. 실패해도 메인 흐름을 막지 않는다(서버 콘솔에도 남김).
export async function logActivity(input: LogInput): Promise<void> {
  const line = `[${input.level || "info"}] ${input.action}${input.message ? " — " + input.message : ""}`;
  try {
    // 콘솔(서버 로그)에는 항상 기록
    if (input.level === "error") console.error("[activity]", line, input.metadata ?? "");
    else console.log("[activity]", line, input.metadata ?? "");

    const supabase = createServiceClient();
    if (!supabase) return; // 서비스 키 없으면 DB 기록은 생략(콘솔만)
    await supabase.from("activity_logs").insert({
      action: input.action,
      level: input.level || "info",
      user_id: input.userId ?? null,
      target_type: input.targetType ?? null,
      target_id: input.targetId ?? null,
      message: input.message ?? null,
      metadata: input.metadata ?? null,
    });
  } catch (e) {
    console.error("[activity] 로그 기록 실패:", e);
  }
}
