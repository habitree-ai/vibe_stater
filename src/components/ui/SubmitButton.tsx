"use client";

import { useFormStatus } from "react-dom";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 폼 제출 버튼 — 서버액션 처리 중(useFormStatus.pending) 자동 비활성화 + 라벨 전환.
// 더블클릭/연속 제출로 인한 중복 저장을 막는다. 부모 <form> 안에서만 동작.
export function SubmitButton({
  children,
  pendingText = "처리 중…",
  className,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        buttonVariants({ variant: "default" }),
        className,
        pending && "pointer-events-none opacity-70"
      )}
    >
      {pending ? pendingText : children}
    </button>
  );
}
