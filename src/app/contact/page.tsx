import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "문의",
  description: "강연·협업·컨설팅 등 어떤 제안이든 편하게 남겨주세요.",
};

const inquiryTypes = ["일반 문의", "상담 신청", "제휴 문의", "강연/협업"];

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export default function ContactPage() {
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
        <form className="space-y-5" aria-label="문의 양식">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">이름</label>
              <input id="name" type="text" placeholder="홍길동" className={fieldClass} />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">이메일</label>
              <input id="email" type="email" placeholder="you@example.com" className={fieldClass} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">문의 유형</label>
            <select id="type" className={fieldClass} defaultValue={inquiryTypes[0]}>
              {inquiryTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">제목</label>
            <input id="subject" type="text" placeholder="문의 제목" className={fieldClass} />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">내용</label>
            <textarea
              id="message"
              rows={6}
              placeholder="문의 내용을 적어주세요."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <button type="button" className={buttonVariants({ variant: "default", className: "h-11 w-full text-base" })}>
            문의 보내기
          </button>
          <p className="text-xs text-muted-foreground">
            * 현재는 데모입니다. 전송 기능은 백엔드(Resend) 연동 단계에서 활성화됩니다.
          </p>
        </form>
      </section>
    </>
  );
}
