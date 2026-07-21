import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { submitContact } from "./actions";

export const metadata: Metadata = {
  title: "문의",
  description: "강연·협업·컨설팅 등 어떤 제안이든 편하게 남겨주세요.",
};

const inquiryTypes = ["일반 문의", "상담 신청", "제휴 문의", "강연/협업"];

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string; type?: string }>;
}) {
  const { success, error, type } = await searchParams;
  const defaultType = type && inquiryTypes.includes(type) ? type : inquiryTypes[0];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            함께 만들 일이 <span className="serif-accent text-primary">있으신가요?</span>
          </>
        }
        subtitle="강연·협업·컨설팅 등 어떤 제안이든 편하게 남겨주세요. 영업일 기준 2일 내에 답변드립니다."
      />

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 md:py-20">
        {success ? (
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6 text-center">
            <p className="font-heading text-xl font-semibold text-primary">문의가 접수되었습니다 ✦</p>
            <p className="mt-2 text-sm text-muted-foreground">
              영업일 기준 2일 내에 입력하신 이메일로 답변드릴게요. 감사합니다!
            </p>
            <Link href="/" className={buttonVariants({ variant: "outline", className: "mt-5" })}>
              홈으로
            </Link>
          </div>
        ) : (
          <form action={submitContact} className="space-y-5" aria-label="문의 양식">
            {error ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">이름</label>
                <input id="name" name="name" type="text" required placeholder="홍길동" className={fieldClass} />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">이메일</label>
                <input id="email" name="email" type="email" required placeholder="you@example.com" className={fieldClass} />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                연락처 <span className="text-xs font-normal text-muted-foreground">(선택)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                maxLength={30}
                autoComplete="tel"
                placeholder="010-1234-5678 — 빠른 연락이 필요할 때만 남겨주세요"
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">문의 유형</label>
              <select id="type" name="type" className={fieldClass} defaultValue={defaultType}>
                {inquiryTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">제목</label>
              <input id="subject" name="subject" type="text" placeholder="문의 제목" className={fieldClass} />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">내용</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                placeholder="문의 내용을 적어주세요."
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            {/* 허니팟 — 사람 눈에는 보이지 않는 필드. 봇이 채우면 서버에서 걸러낸다. */}
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="website">홈페이지(입력하지 마세요)</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <SubmitButton pendingText="보내는 중…" className="h-11 w-full text-base">
              문의 보내기
            </SubmitButton>

            <p className="text-center text-xs text-muted-foreground">
              보내주신 내용은 문의 응대 목적으로만 사용하며, 알림을 위해 이메일 발송 서비스(Resend)와
              카카오톡으로 전달됩니다. 자세한 내용은{" "}
              <Link href="/privacy" className="underline hover:text-foreground">
                개인정보처리방침
              </Link>
              에서 확인하실 수 있어요.
            </p>
          </form>
        )}
      </section>
    </>
  );
}
