// OpenAI 모델 카탈로그 — 서버 전용 import가 없는 순수 데이터 모듈.
// (클라이언트 폼에서도 import 하므로 여기에 Supabase/키 관련 코드를 넣지 말 것.)
//
// 모델마다 허용되는 파라미터가 다르다(실제 API 호출로 확인한 값):
//  · gpt-4 계열   → max_tokens,            temperature 자유
//  · gpt-5(초기)  → max_completion_tokens, temperature 1 고정
//  · gpt-5.4 이후 → max_completion_tokens, temperature 자유
// 잘못된 조합은 OpenAI가 400으로 거절하므로 저장 시점에 검증한다.

export type ModelSpec = {
  id: string;
  label: string;
  note: string;
  tokenParam: "max_tokens" | "max_completion_tokens";
  supportsTemperature: boolean;
};

export const MODELS: ModelSpec[] = [
  {
    id: "gpt-4o-mini",
    label: "GPT-4o mini",
    note: "기본값 · 저비용·빠름. 공개 위젯 권장",
    tokenParam: "max_tokens",
    supportsTemperature: true,
  },
  {
    id: "gpt-4o",
    label: "GPT-4o",
    note: "품질 우선 · 단가 높음",
    tokenParam: "max_tokens",
    supportsTemperature: true,
  },
  {
    id: "gpt-4.1-mini",
    label: "GPT-4.1 mini",
    note: "4o mini 대비 개선형",
    tokenParam: "max_tokens",
    supportsTemperature: true,
  },
  {
    id: "gpt-4.1",
    label: "GPT-4.1",
    note: "고품질 범용",
    tokenParam: "max_tokens",
    supportsTemperature: true,
  },
  {
    id: "gpt-5-mini",
    label: "GPT-5 mini",
    note: "temperature 고정(1) — 이 모델은 창의성 조절 불가",
    tokenParam: "max_completion_tokens",
    supportsTemperature: false,
  },
  {
    id: "gpt-5.4-mini",
    label: "GPT-5.4 mini",
    note: "최신 경량 모델",
    tokenParam: "max_completion_tokens",
    supportsTemperature: true,
  },
];

export function findModel(id: string): ModelSpec | undefined {
  return MODELS.find((m) => m.id === id);
}
