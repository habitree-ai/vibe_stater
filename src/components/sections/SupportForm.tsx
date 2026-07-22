"use client";

import { useEffect, useState } from "react";
import { support } from "@/data/sample";
import { cn } from "@/lib/utils";

export function SupportForm() {
  const [amount, setAmount] = useState<number>(support.defaultAmount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    // 마운트 후 window(외부 시스템) 기반 값 동기화 — 1회성.
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setShareUrl(window.location.origin + "/support");
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "success") setSucceeded(true);
  }, []);

  const clamp = (n: number) => Math.min(support.max, Math.max(support.min, n));

  async function donate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error || "후원을 처리하지 못했습니다.");
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard 권한 없음 — 무시 */
    }
  }

  if (succeeded) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-primary/30 bg-primary/[0.06] p-10 text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary text-2xl text-primary-foreground">
          ♥
        </div>
        <h2 className="font-heading text-2xl font-semibold tracking-tight">후원해 주셔서 감사합니다</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          보내주신 응원은 더 많은 무료 자료를 만드는 데 쓰입니다. 덕분에 계속 이어갈 수 있어요.
        </p>
        <button
          onClick={() => {
            setSucceeded(false);
            window.history.replaceState({}, "", "/support");
          }}
          className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          다시 후원하기
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* 후원 금액 카드 */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] sm:p-8">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-semibold">후원 금액</span>
          <span className="text-xs text-muted-foreground">
            {support.currency} · ${support.min} – ${support.max.toLocaleString()}
          </span>
        </div>

        {/* 프리셋 칩 */}
        <div className="mt-4 grid grid-cols-4 gap-2.5">
          {support.presets.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(p)}
              className={cn(
                "rounded-xl border py-3 text-sm font-semibold transition-colors",
                amount === p
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted"
              )}
            >
              ${p.toLocaleString()}
            </button>
          ))}
        </div>

        {/* 직접 입력 + 슬라이더 */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-4">
            <span className="text-muted-foreground">$</span>
            <input
              type="number"
              min={support.min}
              max={support.max}
              value={amount}
              onChange={(e) => setAmount(clamp(Number(e.target.value) || support.min))}
              className="h-12 w-24 bg-transparent text-lg font-semibold outline-none"
              aria-label="후원 금액 직접 입력"
            />
          </div>
          <div className="flex-1">
            <input
              type="range"
              min={support.min}
              max={support.max}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
              aria-label="후원 금액 슬라이더"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>${support.min}</span>
              <span>${support.max.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 후원 버튼 */}
        <button
          onClick={donate}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-[0_0_40px_-8px_var(--primary)] transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          <span aria-hidden>♥</span>
          {loading ? "처리 중…" : `$${amount.toLocaleString()} 후원하기`}
        </button>

        {error && <p className="mt-3 text-center text-sm text-destructive">{error}</p>}

        <p className="mt-3 text-center text-xs text-muted-foreground">
          <span className="text-primary">◉</span> <strong className="text-foreground">Polar</strong>로
          안전하게 결제 · 카드 · 간편결제
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
          {support.assurances.map((a) => (
            <span key={a}>✓ {a}</span>
          ))}
        </div>
      </div>

      {/* 공유 섹션 */}
      <div className="rounded-3xl border border-dashed border-border bg-card/40 p-6 text-center">
        <h3 className="font-display text-base font-semibold tracking-tight">
          {support.share.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{support.share.description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            🔗 {copied ? "복사됨!" : "링크 복사"}
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("교육 목적으로 무료 공개되는 자료를 응원해요 — Habitree")}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            𝕏 X
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <span className="text-[#1877F2]">f</span> Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
