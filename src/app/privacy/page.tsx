import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "Habitree가 수집하는 개인정보 항목·이용 목적·보유기간·처리위탁 안내.",
};

// 처리방침은 실제 코드 동작과 반드시 일치해야 한다.
// 수집: /contact(문의) · /coffee-chat(커피챗) · 뉴스레터 구독 · 로그인(Supabase Auth)
// 위탁: Supabase(저장), Vercel(호스팅), Resend(알림 메일·국외), Kakao(알림 메시지)
//   — 문의 알림 파이프라인은 doc/18_contact_notifications.md 참조.
const UPDATED_AT = "2026년 7월 21일";

const sections = [
  {
    title: "1. 수집하는 항목과 목적",
    body: [
      "문의하기: 이름·이메일·문의 유형·제목·내용 — 문의 확인과 답변을 위해 수집합니다.",
      "커피챗 신청: 이름·이메일·신청 내용 — 세션 안내와 추첨 진행을 위해 수집합니다.",
      "뉴스레터: 이메일 — 새 글·자료 소식 발송을 위해 수집합니다.",
      "회원가입·로그인: 이메일, 프로필 정보(선택) — 계정 식별과 마이페이지 제공을 위해 수집합니다.",
      "스팸 방지: 접속 IP를 그대로 저장하지 않고, 복원할 수 없는 해시값으로 변환해 짧은 시간의 반복 제출 여부 판단에만 사용합니다.",
    ],
  },
  {
    title: "2. 보유 기간",
    body: [
      "문의·커피챗 기록: 응대 완료 후 1년간 보관하고 지체 없이 파기합니다.",
      "뉴스레터 구독 정보: 구독 해지 시 즉시 파기합니다.",
      "계정 정보: 회원 탈퇴 시 즉시 파기합니다.",
      "법령에 별도 보존 의무가 있는 경우 해당 기간 동안 보관합니다.",
    ],
  },
  {
    title: "3. 처리 위탁 및 국외 이전",
    body: [
      "Supabase — 데이터 보관·인증 (서버 위치: 대한민국 서울 리전)",
      "Vercel — 웹사이트 호스팅·서버 실행 (국외, 미국)",
      "Resend — 문의 알림 메일 발송 (국외, 미국) · 이전 항목: 이름·이메일·문의 내용 · 이전 시점: 문의 접수 즉시",
      "Kakao — 운영자 알림 메시지 발송 (대한민국) · 이전 항목: 이름·마스킹된 이메일·문의 내용 일부(앞 80자)",
      "위탁받은 업체는 위탁 목적 외의 용도로 개인정보를 이용할 수 없습니다.",
    ],
  },
  {
    title: "4. 이용자의 권리",
    body: [
      "언제든지 본인의 개인정보 열람·정정·삭제·처리정지를 요구하실 수 있습니다.",
      "요청은 아래 문의하기 또는 habitree.ai@gmail.com 으로 보내주시면 지체 없이 처리합니다.",
    ],
  },
  {
    title: "5. 안전성 확보 조치",
    body: [
      "모든 통신은 HTTPS로 암호화하며, API 키와 접근 토큰은 서버 환경에만 보관합니다.",
      "데이터베이스는 행 수준 보안(RLS)으로 보호하며, 관리자만 문의 내용을 조회할 수 있습니다.",
      "접속 IP는 원문을 저장하지 않고 해시값만 사용합니다.",
    ],
  },
  {
    title: "6. 개인정보 보호책임자",
    body: ["책임자: Habitree 운영자", "연락처: habitree.ai@gmail.com"],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="개인정보처리방침"
        subtitle="수집하는 개인정보와 이용에 관한 안내입니다."
      />
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <p className="text-sm text-muted-foreground">
          Habitree(이하 &lsquo;사이트&rsquo;)는 이용자의 개인정보를 소중히 다루며, 개인정보 보호법에 따라
          아래와 같이 처리 사항을 안내합니다. 시행일: {UPDATED_AT}
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <div key={s.title} className="space-y-3">
              <h2 className="font-heading text-lg font-semibold tracking-tight">{s.title}</h2>
              <ul className="space-y-2">
                {s.body.map((line) => (
                  <li key={line} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            궁금한 점이 있으면 언제든 물어보세요. 제가 직접 읽고 답장드립니다.
          </p>
          <Link href="/contact" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
            문의하기
          </Link>
        </div>
      </section>
    </>
  );
}
