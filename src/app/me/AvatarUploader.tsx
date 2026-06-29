"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// 프로필 사진 업로드 — 기기의 이미지를 Supabase Storage(avatars/{userId}/...)에 올리고
// 공개 URL을 같은 폼의 avatar_url 필드에 채운다. 저장은 부모 폼의 updateProfile 서버액션이 담당.
export function AvatarUploader({
  userId,
  initialUrl,
  name,
}: {
  userId: string;
  initialUrl: string;
  name: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!ACCEPTED.includes(file.type)) {
      setError("JPG·PNG·WEBP·GIF 이미지만 업로드할 수 있어요.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("이미지 용량은 5MB 이하여야 해요.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = EXT[file.type] ?? "jpg";
      const path = `${userId}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      // 같은 경로 덮어쓰기라 URL이 동일 → 캐시 무효화용 쿼리스트링 추가.
      const publicUrl = `${data.publicUrl}?v=${Date.now()}`;
      setUrl(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        프로필 사진
      </span>

      <div className="flex items-center gap-4">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={name}
            className="size-16 shrink-0 rounded-full border border-border object-cover"
          />
        ) : (
          <div className="grid size-16 shrink-0 place-items-center rounded-full bg-muted text-xl font-semibold text-muted-foreground">
            {name.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPTED.join(",")}
            onChange={handleFile}
            disabled={uploading}
            className="hidden"
            id="avatar-file"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className={cn(
              buttonVariants({ variant: "outline", className: "h-10" }),
              uploading && "pointer-events-none opacity-70"
            )}
          >
            {uploading ? "업로드 중…" : "사진 변경"}
          </button>
          {url ? (
            <button
              type="button"
              onClick={() => setUrl("")}
              disabled={uploading}
              className="ml-2 text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              제거
            </button>
          ) : null}
          <p className="text-xs text-muted-foreground">JPG·PNG·WEBP·GIF, 5MB 이하</p>
        </div>
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      {/* 직접 URL 입력(선택) — 외부 이미지 주소를 붙여넣어도 됩니다. */}
      <div className="space-y-1">
        <label htmlFor="avatar_url" className="text-xs text-muted-foreground">
          또는 이미지 URL 직접 입력
        </label>
        <input
          id="avatar_url"
          name="avatar_url"
          type="url"
          inputMode="url"
          placeholder="https://example.com/avatar.png"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
    </div>
  );
}
