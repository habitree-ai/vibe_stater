import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

// 커스텀 404 — 존재하지 않는 경로를 브랜드 톤으로 안내한다.
export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center sm:px-6">
      <p className="font-display text-6xl font-bold tracking-tight text-primary">404</p>
      <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight">
        페이지를 찾을 수 없어요
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        주소가 바뀌었거나 삭제된 페이지일 수 있어요.
      </p>
      <div className="mt-6 flex gap-2">
        <Link href="/" className={buttonVariants({ variant: "default" })}>
          홈으로
        </Link>
        <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
          문의하기
        </Link>
      </div>
    </section>
  );
}
