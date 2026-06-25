"use client";

import { useEffect, useRef, useState } from "react";

// AI 챗봇 — 참조 디자인의 플로팅 버튼+패널을 복원. 실제 응답은 /api/chat(Anthropic).
type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "LINKMAP은 어떤 서비스인가요?",
  "무료 교육 자료는 어떻게 받나요?",
  "응원은 어떻게 하나요?",
];

const GREETING =
  "안녕하세요! 👋 Creator Link Hub의 AI 어시스턴트예요. LINKMAP·ReadTree, 무료 교육 자료, 응원에 대해 무엇이든 물어보세요.";

const ink = "oklch(0.16 0.012 160)";
const primary = "oklch(0.62 0.14 163)";
const border = "oklch(0.9 0.01 160)";
const muted = "oklch(0.5 0.02 160)";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: t }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string };
      setMessages([
        ...next,
        { role: "assistant", content: data.reply || "음, 다시 한 번 질문해 주시겠어요?" },
      ]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "지금은 답변을 불러올 수 없어요. 잠시 후 다시 시도해 주세요." },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* 런처 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="AI 어시스턴트 열기"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          gap: 10,
          height: 56,
          padding: "0 22px 0 18px",
          border: "none",
          borderRadius: 999,
          cursor: "pointer",
          background: primary,
          color: "#fff",
          boxShadow: "0 14px 44px -8px oklch(0.62 0.14 163 / 0.65)",
          fontFamily: "var(--font-pretendard), system-ui, sans-serif",
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.8-5.9a8.5 8.5 0 0 1-.8-3.6 8.38 8.38 0 0 1 8.5-8.5 8.5 8.5 0 0 1 8.5 8.5Z" />
        </svg>
        {open ? "닫기" : "AI에게 물어보기"}
      </button>

      {/* 패널 */}
      {open ? (
        <div
          style={{
            position: "fixed",
            bottom: 92,
            right: 24,
            zIndex: 61,
            width: 384,
            maxWidth: "calc(100vw - 32px)",
            height: 560,
            maxHeight: "calc(100vh - 120px)",
            display: "flex",
            flexDirection: "column",
            borderRadius: 22,
            overflow: "hidden",
            background: "oklch(1 0 0 / 0.96)",
            backdropFilter: "blur(20px) saturate(140%)",
            border: `1px solid oklch(0.16 0.012 160 / 0.1)`,
            boxShadow: "0 40px 100px -30px rgba(0,0,0,0.45)",
            animation: "chat-pop .25s cubic-bezier(.22,1,.36,1)",
            fontFamily: "var(--font-pretendard), system-ui, sans-serif",
          }}
        >
          {/* 헤더 */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderBottom: `1px solid oklch(0.9 0.01 160 / 0.6)`, background: "linear-gradient(120deg, oklch(0.62 0.14 163 / 0.08), transparent)" }}>
            <span style={{ display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: 12, background: primary, color: "#fff", boxShadow: "0 0 20px -4px oklch(0.62 0.14 163)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2 9.8 8.2 3 9.3l5 4.6L6.6 21 12 17.5 17.4 21 16 13.9l5-4.6-6.8-1.1L12 2Z" /></svg>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontFamily: "var(--font-display), system-ui, sans-serif", fontSize: 15, fontWeight: 600, color: ink }}>AI 어시스턴트</p>
              <p style={{ margin: "1px 0 0", fontSize: 12, color: "oklch(0.5 0.13 163)" }}>
                <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 999, background: primary, marginRight: 5 }} />
                Creator Link Hub 안내
              </p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="닫기" style={{ display: "grid", placeItems: "center", width: 32, height: 32, border: "none", background: "transparent", borderRadius: 8, cursor: "pointer", color: muted }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>

          {/* 메시지 */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            <Bubble role="assistant">{GREETING}</Bubble>
            {messages.length === 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SUGGESTIONS.map((q) => (
                  <button key={q} type="button" onClick={() => send(q)} style={{ borderRadius: 999, border: `1px solid oklch(0.62 0.14 163 / 0.3)`, background: "oklch(0.62 0.14 163 / 0.06)", color: "oklch(0.45 0.12 163)", padding: "7px 12px", fontSize: 12.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                    {q}
                  </button>
                ))}
              </div>
            ) : null}
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role}>{m.content}</Bubble>
            ))}
            {busy ? <Typing /> : null}
          </div>

          {/* 입력 */}
          <div style={{ borderTop: `1px solid oklch(0.9 0.01 160 / 0.6)`, padding: 12, display: "flex", gap: 8, background: "#fff" }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
              placeholder="메시지를 입력하세요…"
              style={{ flex: 1, minWidth: 0, height: 44, padding: "0 14px", borderRadius: 12, border: `1px solid ${border}`, outline: "none", fontFamily: "inherit", fontSize: 14, color: ink }}
            />
            <button type="button" onClick={() => send(input)} disabled={busy} aria-label="보내기" style={{ display: "grid", placeItems: "center", width: 44, height: 44, flex: "none", border: "none", borderRadius: 12, cursor: busy ? "default" : "pointer", background: primary, color: "#fff", opacity: busy ? 0.6 : 1, boxShadow: "0 0 20px -6px oklch(0.62 0.14 163)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" /></svg>
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: "85%",
        background: isUser ? primary : "oklch(0.97 0.005 160)",
        color: isUser ? "#fff" : "oklch(0.2 0.012 160)",
        border: isUser ? "none" : `1px solid oklch(0.9 0.01 160 / 0.6)`,
        borderRadius: isUser ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
        padding: "12px 14px",
        fontSize: 14,
        lineHeight: 1.55,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {children}
    </div>
  );
}

function Typing() {
  return (
    <div style={{ alignSelf: "flex-start", background: "oklch(0.97 0.005 160)", border: `1px solid oklch(0.9 0.01 160 / 0.6)`, borderRadius: "4px 16px 16px 16px", padding: "14px 16px", display: "flex", gap: 5 }}>
      {[0, 1, 2].map((k) => (
        <span key={k} style={{ width: 7, height: 7, borderRadius: 999, background: primary, animation: "chat-blink 1.2s infinite", animationDelay: `${k * 0.18}s` }} />
      ))}
    </div>
  );
}
