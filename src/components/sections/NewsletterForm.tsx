"use client";

import { useActionState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { subscribeNewsletter, type NewsletterState } from "./Newsletter.actions";

export function NewsletterForm({ cta }: { cta: string }) {
  const [state, action, pending] = useActionState<NewsletterState, FormData>(
    subscribeNewsletter,
    null
  );

  if (state?.ok) {
    return (
      <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
        {state.message}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <form action={action} className="flex flex-col gap-3 sm:flex-row" aria-label="뉴스레터 구독">
        <label htmlFor="newsletter-email" className="sr-only">
          이메일 주소
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="h-12 flex-1 rounded-xl border border-border bg-background/80 px-4 text-sm outline-none backdrop-blur focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className={cn(
            buttonVariants({ variant: "default" }),
            "h-12 px-7 text-base shadow-[0_0_30px_-8px_var(--primary)]",
            pending && "pointer-events-none opacity-70"
          )}
        >
          {pending ? "구독 중…" : cta}
        </button>
      </form>
      {state && !state.ok ? <p className="text-xs text-destructive">{state.message}</p> : null}
    </div>
  );
}
