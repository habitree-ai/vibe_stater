import Link from "next/link";
import { footerColumns, site } from "@/lib/site";
import { profile } from "@/data/sample";

export function Footer() {
  return (
    <footer className="relative grain overflow-hidden border-t border-border/60 bg-card">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 py-16 md:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 font-display text-lg font-semibold">
              <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-[0_0_20px_-4px_var(--primary)]">
                {site.brandShort}
              </span>
              {site.name}
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              코딩을 몰라도 만드는 우리의 온라인 공간.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {profile.socials.map((s) => {
                const external = /^https?:\/\//.test(s.href);
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {s.label}
                  </a>
                );
              })}
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title} className="space-y-3">
              <h3 className="font-display text-sm font-semibold">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 대형 워드마크 */}
        <div className="relative select-none overflow-hidden">
          <p className="font-display text-[18vw] font-bold leading-none tracking-tighter text-foreground/[0.04] md:text-[12rem]">
            LINK HUB
          </p>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/60 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 {profile.name} · {site.name}. All rights reserved.</p>
          <p className="font-mono">Built with Next.js · Supabase · Stripe · Vercel</p>
        </div>
      </div>
    </footer>
  );
}
