"use client";

import { useState } from "react";

// 인가 코드 복사 UI — 주소창에서 긁을 필요 없이 버튼 한 번으로 복사한다.
export function CodeBox({ code }: { code: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard 미지원(비보안 컨텍스트 등) — 수동 선택 폴백
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        return;
      }
      document.body.removeChild(ta);
    }
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
  };

  const command = `node scripts/kakao-connect.mjs ${code}`;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          인가 코드
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <code className="min-w-0 flex-1 break-all rounded-lg border border-border bg-muted/50 px-3 py-2 font-mono text-sm">
            {code}
          </code>
          <button
            type="button"
            onClick={() => copy(code, "code")}
            className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {copied === "code" ? "복사됨!" : "복사"}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          실행할 명령
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <code className="min-w-0 flex-1 break-all rounded-lg border border-border bg-foreground/90 px-3 py-2 font-mono text-xs text-background">
            {command}
          </code>
          <button
            type="button"
            onClick={() => copy(command, "cmd")}
            className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            {copied === "cmd" ? "복사됨!" : "명령 복사"}
          </button>
        </div>
      </div>
    </div>
  );
}
