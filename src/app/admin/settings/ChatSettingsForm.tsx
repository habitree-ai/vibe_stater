"use client";

import { useState } from "react";
import { MODELS, findModel } from "@/lib/chat-models";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { updateChatSettings } from "./actions";

// 챗봇 설정 폼 — 모델 선택에 따라 temperature 입력 가능 여부가 달라지므로 클라이언트 컴포넌트.
// (실제 검증·저장은 서버액션 updateChatSettings 에서 다시 수행한다. 여기 UI는 편의용.)

type Props = {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  enabled: boolean;
};

const field =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ChatSettingsForm(props: Props) {
  const [model, setModel] = useState(props.model);
  const [temperature, setTemperature] = useState(String(props.temperature));

  const spec = findModel(model);
  const tempLocked = spec ? !spec.supportsTemperature : false;

  // temperature 미지원 모델로 바꾸면 값을 1로 고정한다(그대로 두면 저장 시 거절됨).
  const onModelChange = (next: string) => {
    setModel(next);
    const nextSpec = findModel(next);
    if (nextSpec && !nextSpec.supportsTemperature) setTemperature("1");
  };

  return (
    <form action={updateChatSettings} className="mt-6 space-y-6">
      {/* 사용 여부 */}
      <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
        <input
          type="checkbox"
          name="enabled"
          defaultChecked={props.enabled}
          className="mt-0.5 size-4 accent-primary"
        />
        <span>
          <span className="block text-sm font-medium">AI 어시스턴트 사용</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            끄면 위젯이 안내 문구만 보여주고 OpenAI를 호출하지 않습니다(비용 차단).
          </span>
        </span>
      </label>

      {/* 모델 */}
      <div className="space-y-1.5">
        <label htmlFor="model" className="block text-sm font-medium">
          모델
        </label>
        <select
          id="model"
          name="model"
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          className={field}
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label} — {m.note}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          공개 위젯이라 누구나 호출할 수 있습니다. 비용이 걱정되면 mini 계열을 권장합니다.
        </p>
      </div>

      {/* temperature */}
      <div className="space-y-1.5">
        <label htmlFor="temperature" className="block text-sm font-medium">
          temperature (창의성) — 낮을수록 일관됨
        </label>
        <input
          id="temperature"
          name="temperature"
          type="number"
          step="0.1"
          min="0"
          max="2"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          readOnly={tempLocked}
          aria-describedby="temperature-help"
          className={`${field} ${tempLocked ? "cursor-not-allowed opacity-60" : ""}`}
        />
        <p id="temperature-help" className="text-xs text-muted-foreground">
          {tempLocked
            ? `${spec?.label}은(는) temperature 조절을 지원하지 않아 1로 고정됩니다.`
            : "0~2. 안내 챗봇은 0.4~0.7을 권장합니다."}
        </p>
      </div>

      {/* max tokens */}
      <div className="space-y-1.5">
        <label htmlFor="max_tokens" className="block text-sm font-medium">
          최대 응답 길이(토큰)
        </label>
        <input
          id="max_tokens"
          name="max_tokens"
          type="number"
          step="1"
          min="64"
          max="4096"
          defaultValue={props.maxTokens}
          className={field}
        />
        <p className="text-xs text-muted-foreground">64~4096. 길수록 답변이 길어지고 비용도 늘어납니다.</p>
      </div>

      {/* 기본지침 */}
      <div className="space-y-1.5">
        <label htmlFor="system_prompt" className="block text-sm font-medium">
          기본지침 (시스템 프롬프트)
        </label>
        <textarea
          id="system_prompt"
          name="system_prompt"
          rows={14}
          defaultValue={props.systemPrompt}
          maxLength={8000}
          className={`${field} font-mono text-xs leading-relaxed`}
        />
        <p className="text-xs text-muted-foreground">
          챗봇의 말투·역할·금지사항을 정의합니다. 최대 8000자.
        </p>
      </div>

      <SubmitButton pendingText="저장 중…">설정 저장</SubmitButton>
    </form>
  );
}
