import { buttonVariants } from "@/components/ui/button";
import { signInWithGoogle } from "@/app/auth/actions";
import { cn } from "@/lib/utils";

// Google 계정으로 계속하기 — 서버 액션(signInWithGoogle)을 호출하는 폼 버튼 + 구분선.
export function GoogleButton({ label = "Google로 계속하기" }: { label?: string }) {
  return (
    <div className="space-y-4">
      <form action={signInWithGoogle}>
        <button
          type="submit"
          className={cn(buttonVariants({ variant: "outline" }), "h-11 w-full gap-2.5 text-base")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#4285F4"
              d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.88-3c-1.08.72-2.45 1.16-4.06 1.16-3.12 0-5.77-2.11-6.71-4.95H1.28v3.09A12 12 0 0 0 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.29 14.3a7.2 7.2 0 0 1 0-4.6V6.61H1.28a12 12 0 0 0 0 10.78l4.01-3.09Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.76 0 3.34.6 4.59 1.79l3.43-3.43C17.95 1.18 15.24 0 12 0A12 12 0 0 0 1.28 6.61l4.01 3.09C6.23 6.86 8.88 4.75 12 4.75Z"
            />
          </svg>
          {label}
        </button>
      </form>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        또는 이메일로
        <span className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}
