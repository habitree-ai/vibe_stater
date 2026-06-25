// 응원(Donation) 체크아웃 — Polar 결제 세션 생성 Route Handler.
// 사용자가 선택한 금액($1~$10,000)으로 Polar Checkout을 만들고 결제 URL을 반환한다.
//
// 필요한 환경변수 (.env.local / 배포 변수에 등록):
//   POLAR_ACCESS_TOKEN  — Polar Organization Access Token (서버 전용, 커밋 금지)
//   POLAR_PRODUCT_ID    — "Pay what you want" 가격으로 설정한 응원 상품 ID
//   POLAR_SERVER        — "sandbox" 또는 "production" (기본: production)
//   NEXT_PUBLIC_APP_URL — 결제 성공 후 돌아올 사이트 주소

export const dynamic = "force-dynamic";

const MIN_USD = 1;
const MAX_USD = 10000;

function polarBase() {
  return process.env.POLAR_SERVER === "sandbox"
    ? "https://sandbox-api.polar.sh"
    : "https://api.polar.sh";
}

export async function POST(req: Request) {
  let amount = 0;
  try {
    const body = (await req.json()) as { amount?: number };
    amount = Number(body.amount);
  } catch {
    return Response.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  if (!Number.isFinite(amount) || amount < MIN_USD || amount > MAX_USD) {
    return Response.json(
      { error: `응원 금액은 $${MIN_USD} ~ $${MAX_USD} 사이여야 합니다.` },
      { status: 400 }
    );
  }

  const token = process.env.POLAR_ACCESS_TOKEN;
  const productId = process.env.POLAR_PRODUCT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

  if (!token || !productId) {
    return Response.json(
      {
        error:
          "응원 결제가 아직 설정되지 않았습니다. 관리자에게 Polar 연동(POLAR_ACCESS_TOKEN, POLAR_PRODUCT_ID) 설정을 요청해 주세요.",
        configured: false,
      },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(`${polarBase()}/v1/checkouts/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products: [productId],
        // Pay-what-you-want 상품은 amount(단위: 센트)로 응원 금액을 지정한다.
        amount: Math.round(amount * 100),
        success_url: `${appUrl}/support?status=success`,
        metadata: { kind: "donation", source: "creator-link-hub" },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Polar checkout 실패:", res.status, detail);
      return Response.json(
        { error: "결제 세션 생성에 실패했습니다. 잠시 후 다시 시도해 주세요." },
        { status: 502 }
      );
    }

    const data = (await res.json()) as { url?: string };
    if (!data.url) {
      return Response.json({ error: "결제 URL을 받지 못했습니다." }, { status: 502 });
    }
    return Response.json({ url: data.url });
  } catch (e) {
    console.error("Polar 연동 오류:", e);
    return Response.json({ error: "결제 서버에 연결하지 못했습니다." }, { status: 502 });
  }
}
