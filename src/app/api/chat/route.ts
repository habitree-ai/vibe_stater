// AI 챗봇 — OpenAI Chat Completions API(raw HTTP)로 응답을 생성하는 Route Handler.
// 키는 서버에서만 사용(클라이언트 비노출).
//
// 모델·temperature·기본지침은 하드코딩이 아니라 DB(public.chat_settings)에서 읽는다.
// → 관리자가 /admin/settings 에서 저장하면 다음 요청부터 즉시 반영된다.
//
// 필요한 환경변수 (.env.local / 배포 시크릿):
//   OPENAI_API_KEY            — OpenAI API 키 (서버 전용, 커밋 금지)
//   SUPABASE_SERVICE_ROLE_KEY — 설정 조회용. 없으면 코드 기본값으로 폴백.

import { getChatSettings } from "@/lib/chat-settings";
import { findModel } from "@/lib/chat-models";

export const dynamic = "force-dynamic";

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

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        reply:
          "지금은 AI 답변을 불러올 수 없어요. (관리자: OPENAI_API_KEY 설정이 필요합니다.) 그동안 무료 자료와 응원 페이지를 둘러보세요!",
        configured: false,
      },
      { status: 200 }
    );
  }

  const settings = await getChatSettings();

  // 관리자가 챗봇을 꺼둔 경우 — 키가 있어도 호출하지 않는다(비용 차단).
  if (!settings.enabled) {
    return Response.json(
      { reply: "AI 어시스턴트가 잠시 쉬는 중이에요. 문의 페이지로 남겨주시면 답변드릴게요!", enabled: false },
      { status: 200 }
    );
  }

  // 모델마다 허용 파라미터가 다르다(카탈로그 참고). 모르는 모델이면 보수적으로 gpt-4 계열 규칙을 쓴다.
  const spec = findModel(settings.model);
  const tokenParam = spec?.tokenParam ?? "max_tokens";

  const payload: Record<string, unknown> = {
    model: settings.model,
    messages: [{ role: "system", content: settings.systemPrompt }, ...clean],
    [tokenParam]: settings.maxTokens,
  };
  // temperature 미지원 모델(gpt-5 초기)에는 아예 보내지 않는다 — 보내면 400.
  if (spec?.supportsTemperature !== false) {
    payload.temperature = settings.temperature;
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("OpenAI 오류:", res.status, detail);
      return Response.json(
        { reply: "잠시 문제가 생겼어요. 잠시 후 다시 시도해 주세요." },
        { status: 200 }
      );
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string; refusal?: string | null }; finish_reason?: string }[];
    };

    const choice = data.choices?.[0];
    if (choice?.message?.refusal) {
      return Response.json(
        { reply: "그 주제에는 답변드리기 어려워요. 사이트나 서비스에 대해 무엇이든 물어보세요!" },
        { status: 200 }
      );
    }

    const text = choice?.message?.content?.trim() || "음, 다시 한 번 질문해 주시겠어요?";
    return Response.json({ reply: text });
  } catch (e) {
    console.error("챗봇 연동 오류:", e);
    return Response.json(
      { reply: "지금은 답변을 불러올 수 없어요. 잠시 후 다시 시도해 주세요." },
      { status: 200 }
    );
  }
}
