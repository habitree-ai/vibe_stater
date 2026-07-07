import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

// 관리자 영역 공통 레이아웃 — 가드 1곳 + 상단 관리자 내비.
// /admin/* 모든 하위 라우트는 여기서 관리자 접근을 보장한다.
const adminNav = [
  { href: "/admin/coffee-chat", label: "커피챗" },
  { href: "/admin/contact", label: "문의" },
  { href: "/admin/subscribers", label: "구독자" },
  { href: "/admin/logs", label: "활동로그" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-5xl px-4 pt-24 sm:px-6">
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          관리자
        </span>
        {adminNav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            {n.label}
          </Link>
        ))}
        <Link
          href="/me"
          className="ml-auto rounded-full px-3 py-1.5 text-sm font-medium text-primary hover:underline"
        >
          마이페이지 →
        </Link>
      </div>
      {children}
    </div>
  );
}
