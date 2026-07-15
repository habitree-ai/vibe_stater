import { createServiceClient } from "@/lib/supabase/admin";

// AI 챗봇 설정 공용 모듈 — /admin/settings(저장)와 /api/chat(사용)이 함께 쓴다.
// 설정값은 public.chat_settings 단일 행(id=1)에 저장한다. API 키는 여기 없다(환경변수 전용).
// ⚠ 서버 전용(service_role) — 클라이언트 컴포넌트에서 import 금지.
//   모델 카탈로그가 필요하면 서버 의존성이 없는 @/lib/chat-models 를 쓸 것.

export type ChatSettings = {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  enabled: boolean;
  updatedAt: string | null;
};

export const DEFAULT_SYSTEM_PROMPT = `당신은 'Habitree'의 친절한 AI 어시스턴트입니다. 항상 한국어로, 따뜻하고 간결하게 2~4문장으로 답하세요.`;

// DB를 못 읽을 때(서비스 키 없음/장애) 챗봇이 죽지 않도록 쓰는 안전값.
export const FALLBACK_SETTINGS: ChatSettings = {
  model: "gpt-4o-mini",
  temperature: 0.6,
  maxTokens: 512,
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  enabled: true,
  updatedAt: null,
};

type Row = {
  model: string;
  temperature: number;
  max_tokens: number;
  system_prompt: string;
  enabled: boolean;
  updated_at: string;
};

// 저장된 설정을 읽는다. 실패해도 예외를 던지지 않고 기본값으로 폴백한다.
export async function getChatSettings(): Promise<ChatSettings> {
  const service = createServiceClient();
  if (!service) return FALLBACK_SETTINGS;

  const { data, error } = await service
    .from("chat_settings")
    .select("model, temperature, max_tokens, system_prompt, enabled, updated_at")
    .eq("id", 1)
    .single();

  if (error || !data) return FALLBACK_SETTINGS;

  const row = data as Row;
  return {
    model: row.model,
    temperature: row.temperature,
    maxTokens: row.max_tokens,
    systemPrompt: row.system_prompt,
    enabled: row.enabled,
    updatedAt: row.updated_at,
  };
}
