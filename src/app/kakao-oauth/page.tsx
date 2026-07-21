import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { CodeBox } from "./CodeBox";

// 카카오 OAuth 리다이렉트 착지 페이지 — 관리자가 '나에게 보내기' 토큰을 발급받을 때만 쓴다.
// 카카오가 돌려준 인가 코드(1회용)를 화면에 보여주고 실행할 명령까지 만들어 준다.
// 코드 자체는 URL 파라미터로 오는 값이라 여기서 새로 노출되는 정보는 없다. (doc/18 §3)
export const metadata: Metadata = {
  title: "카카오 연동",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

// 자주 만나는 카카오 오류 코드의 실제 해결책
const ERROR_HINTS: Record<string, string> = {
  KOE004:
    "카카오 로그인이 비활성화된 앱입니다. 개발자 콘솔 > 제품 설정 > 카카오 로그인 > 활성화 설정을 ON 으로 바꿔주세요.",
  KOE006:
    "등록되지 않은 Redirect URI 입니다. 카카오 로그인 > Redirect URI 에 https://vibe.habitree.io/kakao-oauth 를 정확히 등록해주세요.",
  KOE101: "REST API 키가 올바르지 않습니다. 앱 키 화면의 REST API 키를 다시 확인해주세요.",
  KOE205:
    "동의항목이 설정되지 않았습니다. 카카오 로그인 > 동의항목 > 카카오톡 메시지 전송(talk_message)을 선택 동의로 설정해주세요.",
};

export default async function KakaoOAuthPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string; error_description?: string }>;
}) {
  const { code, error, error_description } = await searchParams;

  const hintKey = Object.keys(ERROR_HINTS).find((k) =>
    `${error ?? ""} ${error_description ?? ""}`.includes(k)
  );

  return (
    <>
      <PageHeader
        eyebrow="Kakao"
        title="카카오 연동"
        subtitle="문의 알림을 카카오톡으로 받기 위한 1회용 연동 화면입니다."
      />
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        {code ? (
          <div className="space-y-6 rounded-2xl border border-primary/30 bg-primary/[0.04] p-6 sm:p-8">
            <div>
              <p className="font-heading text-lg font-semibold text-primary">
                인가 코드를 받았어요
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                아래 명령을 프로젝트 폴더에서 실행하면 토큰이 저장되고 연동이 끝납니다. 코드는
                <b> 한 번만 </b> 쓸 수 있어요.
              </p>
            </div>
            <CodeBox code={code} />
            <p className="text-xs text-muted-foreground">
              실행 후 <code className="rounded bg-muted px-1.5 py-0.5">/admin/settings</code> 의
              &lsquo;알림 테스트 발송&rsquo; 으로 카카오톡 수신을 확인하세요.
            </p>
          </div>
        ) : error ? (
          <div className="space-y-4 rounded-2xl border border-destructive/30 bg-destructive/[0.06] p-6 sm:p-8">
            <p className="font-heading text-lg font-semibold text-destructive">
              연동에 실패했어요
            </p>
            <p className="text-sm text-muted-foreground">
              {hintKey ? ERROR_HINTS[hintKey] : (error_description ?? error)}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {error}
              {error_description ? ` · ${error_description}` : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              설정을 고친 뒤 <code className="rounded bg-muted px-1.5 py-0.5">node scripts/kakao-connect.mjs</code>{" "}
              를 다시 실행해 인증 주소를 새로 받아 주세요.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="font-heading text-lg font-semibold">연동 대기 중</p>
            <p className="mt-2 text-sm text-muted-foreground">
              이 페이지는 카카오 동의 후 자동으로 이동해 오는 곳이에요. 직접 열면 표시할 코드가
              없습니다.
            </p>
            <Link href="/" className={buttonVariants({ variant: "outline", className: "mt-5" })}>
              홈으로
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
