"use client";

import { useFormStatus } from "react-dom";

// 문의 삭제 버튼 — 되돌릴 수 없으므로 확인을 한 번 받는다.
// (부모 <form action={deleteContactMessage}> 안에서만 동작)
export function DeleteButton({ name }: { name: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      onClick={(e) => {
        if (!confirm(`${name} 님의 문의를 삭제할까요? 되돌릴 수 없습니다.`)) {
          e.preventDefault();
        }
      }}
      className="rounded-lg px-3 py-1.5 text-xs font-medium text-destructive/80 transition-colors hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? "삭제 중…" : "삭제"}
    </button>
  );
}
