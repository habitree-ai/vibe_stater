"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { logout } from "@/app/auth/actions";
import { navItems, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header({ isAuthed = false }: { isAuthed?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6",
          scrolled && "mt-3 max-w-5xl rounded-2xl border border-border/60 bg-background/70 px-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl"
        )}
      >
        <Link href="/" className="flex items-center" aria-label={site.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/habitree-logo.png" alt="Habitree" className="h-9 w-auto" />
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
          aria-label="주요 메뉴"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthed ? (
            <>
              <Link
                href="/me"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}
              >
                마이페이지
              </Link>
              <form action={logout} className="hidden sm:block">
                <button type="submit" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}
            >
              로그인
            </Link>
          )}
          <Link
            href="/support"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "shadow-[0_0_24px_-6px_var(--primary)]"
            )}
          >
            응원하기
          </Link>
        </div>
      </div>
    </header>
  );
}
