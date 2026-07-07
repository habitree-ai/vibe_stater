import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "이용약관",
  description: "Habitree 서비스 이용약관.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Terms"
        title="이용약관"
        subtitle="서비스 이용에 관한 약관입니다."
      />
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="font-heading text-lg font-semibold">내용 준비 중입니다</p>
          <p className="mt-2 text-sm text-muted-foreground">
            정식 이용약관을 준비하고 있어요. 궁금한 점은 문의로 남겨주시면 안내드리겠습니다.
          </p>
          <Link href="/contact" className={buttonVariants({ variant: "outline", className: "mt-5" })}>
            문의하기
          </Link>
        </div>
      </section>
    </>
  );
}
