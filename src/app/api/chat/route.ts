// AI 챗봇 — Anthropic Messages API(raw HTTP)로 응답을 생성하는 Route Handler.
// 키는 서버에서만 사용(클라이언트 비노출). 모델: Claude Haiku 4.5(공개 위젯용, 저비용).
//
// 필요한 환경변수 (.env.local / Cloudflare 빌드·시크릿):
//   ANTHROPIC_API_KEY — Anthropic API 키 (서버 전용, 커밋 금지)
//   ANTHROPIC_MODEL   — (선택) 모델 ID 오버라이드. 기본 "claude-haiku-4-5"

export const dynamic = "force-dynamic";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";

const PERSONA = `당신은 'Creator Link Hub'의 친절한 AI 어시스턴트입니다. 이 사이트는 'AI보다 읽는 사람'이 운영하는, 누구나 쉽게 시작하는 배움 공간으로 AI·바이브코딩·독서를 다룹니다. 운영자는 제조기업 ERP PM이자 AX(AI 전환) 담당자이며, 바이브코딩을 가르치는 강사가 아니라 같이 공부하고 기록을 나누는 동료입니다(실명은 공개하지 않습니다).
주요 서비스 — LINKMAP: 구글 계정 하나로 3분 만에 배포하는 바이브코딩 플랫폼(서비스 맵 시각화, 연결 체크리스트, 환경변수 AES-256 관리, 30개 이상 서비스 연동). ReadTree: 읽고 기록하면 독서나무가 자라는 독서 습관 플랫폼(독서 기록·통계, AI 채팅·OCR 필사·AI 리포트, 독서 그룹). YouTube 채널도 운영합니다.
무료 교육 자료 — '바이브코딩으로 시작하는 1인 SaaS' 전자책, 'LINKMAP 실전 강의', 'Creator Platform 템플릿', '1:1 커피챗'은 모두 교육 목적으로 무료 공개됩니다. 비용 대신 자율 후원(USD 1~10000, 강요 없음, 후원과 무관하게 자료는 항상 무료)으로 응원할 수 있습니다.
규칙: 항상 한국어로, 따뜻하고 간결하게 2~4문장으로 답하세요. 모르면 솔직히 말하고 문의나 후원 페이지를 안내하세요. 사이트와 무관한 질문은 정중히 본 주제로 안내하세요.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  let messages: ChatMessage[] = [];
  try {
    const body = (await req.json()) as { messages?: ChatMessage[] };
    messages = Array.isArray(body.messages) ? body.messages : [];
  } catch {
    return Response.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  // 정제: role 검증 + 길이 제한(최근 20턴, 각 4000자)
  const clean = messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (clean.length === 0 || clean[clean.length - 1].role !== "user") {
    return Response.json({ error: "사용자 메시지가 필요합니다." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        reply:
          "지금은 AI 답변을 불러올 수 없어요. (관리자: ANTHROPIC_API_KEY 설정이 필요합니다.) 그동안 무료 자료와 후원 페이지를 둘러보세요!",
        configured: false,
      },
      { status: 200 }
    );
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 512,
        system: PERSONA,
        messages: clean,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Anthropic 오류:", res.status, detail);
      return Response.json(
        { reply: "잠시 문제가 생겼어요. 잠시 후 다시 시도해 주세요." },
        { status: 200 }
      );
    }

    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
      stop_reason?: string;
    };
    if (data.stop_reason === "refusal") {
      return Response.json(
        { reply: "그 주제에는 답변드리기 어려워요. 사이트나 서비스에 대해 무엇이든 물어보세요!" },
        { status: 200 }
      );
    }
    const text =
      data.content
        ?.filter((b) => b.type === "text")
        .map((b) => b.text || "")
        .join("")
        .trim() || "음, 다시 한 번 질문해 주시겠어요?";

    return Response.json({ reply: text });
  } catch (e) {
    console.error("챗봇 연동 오류:", e);
    return Response.json(
      { reply: "지금은 답변을 불러올 수 없어요. 잠시 후 다시 시도해 주세요." },
      { status: 200 }
    );
  }
}
