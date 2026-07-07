"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

// 전역 에러 바운더리 — 서버/클라이언트 렌더 오류를 브랜드 톤으로 안내한다.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center sm:px-6">
      <p className="font-display text-sm font-medium uppercase tracking-[0.2em] text-primary">
        Error
      </p>
      <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight">
        문제가 발생했어요
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        일시적인 오류일 수 있어요. 잠시 후 다시 시도해 주세요.
      </p>
      <div className="mt-6 flex gap-2">
        <button onClick={() => reset()} className={buttonVariants({ variant: "default" })}>
          다시 시도
        </button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          홈으로
        </Link>
      </div>
    </section>
  );
}
