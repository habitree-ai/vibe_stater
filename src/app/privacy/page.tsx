import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "Habitree 개인정보처리방침.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="개인정보처리방침"
        subtitle="수집하는 개인정보와 이용에 관한 안내입니다."
      />
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="font-heading text-lg font-semibold">내용 준비 중입니다</p>
          <p className="mt-2 text-sm text-muted-foreground">
            정식 개인정보처리방침을 준비하고 있어요. 현재는 커피챗·문의·뉴스레터 신청 시 입력하신
            이름·이메일 등 최소한의 정보만 수집·보관합니다.
          </p>
          <Link href="/contact" className={buttonVariants({ variant: "outline", className: "mt-5" })}>
            문의하기
          </Link>
        </div>
      </section>
    </>
  );
}
