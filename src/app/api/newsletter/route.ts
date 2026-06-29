// 뉴스레터 구독 Route Handler — 홈 화면(HomeEnhancer)의 폼이 fetch로 호출한다.
// newsletter_subscribers 테이블에 저장(이메일 unique). 중복은 graceful 처리.

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logActivity } from "@/lib/log";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let email = "";
  try {
    const body = (await req.json()) as { email?: string };
    email = String(body.email || "").trim();
  } catch {
    return Response.json({ ok: false, message: "잘못된 요청입니다." }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, message: "올바른 이메일 주소를 입력해 주세요." }, { status: 400 });
  }
  if (!isSupabaseConfigured) {
    return Response.json({ ok: false, message: "잠시 후 다시 시도해 주세요." }, { status: 503 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email });

  if (error) {
    if (error.code === "23505") {
      return Response.json({ ok: true, message: "이미 구독 중이에요. 감사합니다!" });
    }
    await logActivity({
      action: "newsletter.subscribe",
      level: "error",
      message: error.message,
      metadata: { email },
    });
    return Response.json(
      { ok: false, message: "구독에 실패했어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  await logActivity({ action: "newsletter.subscribe", message: "뉴스레터 구독", metadata: { email } });
  return Response.json({ ok: true, message: "구독 완료! 새 소식이 준비되면 이메일로 보내드릴게요." });
}
