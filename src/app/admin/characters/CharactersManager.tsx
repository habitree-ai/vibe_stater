"use client";

import { useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/ui/SubmitButton";
import {
  uploadCharacter,
  updateCharacter,
  toggleCharacterActive,
  deleteUploadedCharacter,
} from "./actions";

// 캐릭터 자산 대시보드(클라이언트) — 필터·검색·복사·업로드·수정.
// 데이터는 서버 컴포넌트(page.tsx)가 내려주고, 쓰기는 전부 서버 액션이 수행한다.

export type AssetRow = {
  num: number;
  code: string;
  name: string;
  group: string;
  section: string;
  char_label: string;
  src: string;
  width: number | null;
  height: number | null;
  tags: string[];
  origin: "repo" | "upload";
  active: boolean;
  note: string | null;
};

const GROUP_LABEL: Record<string, string> = {
  man: "메이커",
  otter: "오터",
  prop: "소품",
  scene: "상황",
  custom: "업로드",
};

const field =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const checker =
  "repeating-conic-gradient(color-mix(in oklch, var(--muted), transparent 20%) 0 25%, transparent 0 50%)";

export function CharactersManager({ rows, canWrite }: { rows: AssetRow[]; canWrite: boolean }) {
  const [group, setGroup] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const groups = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of rows) counts.set(r.group, (counts.get(r.group) ?? 0) + 1);
    return counts;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (group !== "all" && r.group !== group) return false;
      if (!q) return true;
      return (
        r.code.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.section.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [rows, group, query]);

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
    } catch {
      /* clipboard 미지원 환경은 무시 */
    }
  };

  return (
    <div className="mt-6 space-y-5">
      {/* 요약 + 채번 규칙 */}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            총 {rows.length}개
          </Badge>
          {[...groups.entries()].map(([g, n]) => (
            <span key={g} className="text-muted-foreground">
              {GROUP_LABEL[g] ?? g} {n}
            </span>
          ))}
          <span className="text-xs text-muted-foreground">
            · 채번은 등록 순 자동 발급, 번호는 재사용하지 않아요
          </span>
        </div>
        {canWrite && (
          <button
            type="button"
            onClick={() => setShowUpload((v) => !v)}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {showUpload ? "업로드 닫기" : "+ 새 이미지 등록(채번)"}
          </button>
        )}
      </div>

      {/* 업로드 폼 */}
      {showUpload && canWrite && <UploadForm />}

      {/* 필터 */}
      <div className="flex flex-wrap items-center gap-2">
        {["all", "man", "otter", "prop", "scene", "custom"].map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGroup(g)}
            className={
              "rounded-full border px-3 py-1.5 text-sm transition-colors " +
              (group === g
                ? "border-primary bg-primary/10 font-semibold text-primary"
                : "border-border text-muted-foreground hover:text-foreground")
            }
          >
            {g === "all" ? "전체" : (GROUP_LABEL[g] ?? g)}
            {g !== "all" && groups.has(g) ? ` ${groups.get(g)}` : ""}
          </button>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="코드·이름·섹션·태그 검색 (예: HT-042, 표정)"
          className={field + " ml-auto max-w-xs"}
        />
      </div>

      {/* 그리드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((r) => (
          <article
            key={r.num}
            className={
              "flex flex-col overflow-hidden rounded-xl border bg-card " +
              (r.active ? "border-border" : "border-dashed border-border opacity-60")
            }
          >
            {/* 미리보기 */}
            <div
              className="relative grid h-40 place-items-center"
              style={{ background: checker, backgroundSize: "18px 18px" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- 관리 화면 원본 미리보기 */}
              <img
                src={r.src}
                alt={`${r.code} ${r.name}`}
                loading="lazy"
                className="max-h-36 max-w-[90%] object-contain"
              />
              <span className="absolute left-2 top-2 rounded-md bg-foreground/80 px-1.5 py-0.5 font-mono text-[0.7rem] font-bold text-background">
                {r.code}
              </span>
              {!r.active && (
                <span className="absolute right-2 top-2 rounded-md bg-background/85 px-1.5 py-0.5 text-[0.7rem] text-muted-foreground">
                  숨김
                </span>
              )}
            </div>

            {/* 정보 */}
            <div className="flex flex-1 flex-col gap-1.5 p-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-sm font-semibold">{r.name}</h3>
                <span className="shrink-0 text-[0.7rem] text-muted-foreground">
                  {r.width && r.height ? `${r.width}×${r.height}` : "—"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1 text-[0.7rem] text-muted-foreground">
                <Badge variant="outline" className="px-1.5 py-0 text-[0.65rem]">
                  {GROUP_LABEL[r.group] ?? r.group}
                </Badge>
                <span>{r.section}</span>
                {r.origin === "upload" && <span className="text-primary">· 업로드</span>}
              </div>

              {/* 사용(복사) */}
              <div className="mt-1 flex flex-wrap gap-1.5">
                <CopyBtn
                  label={copied === r.code + ":url" ? "복사됨!" : "주소 복사"}
                  onClick={() => copy(r.code + ":url", `${location.origin}/c/${r.code}`)}
                />
                <CopyBtn
                  label={copied === r.code + ":img" ? "복사됨!" : "<img> 복사"}
                  onClick={() =>
                    copy(
                      r.code + ":img",
                      `<img src="/c/${r.code}" alt="${r.name}" width="${r.width ?? ""}" height="${r.height ?? ""}" />`
                    )
                  }
                />
                <CopyBtn
                  label={copied === r.code + ":md" ? "복사됨!" : "MD 복사"}
                  onClick={() => copy(r.code + ":md", `![${r.name}](/c/${r.code})`)}
                />
              </div>

              {/* 관리 */}
              {canWrite && (
                <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditing(editing === r.num ? null : r.num)}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    {editing === r.num ? "닫기" : "수정"}
                  </button>
                  <form action={toggleCharacterActive}>
                    <input type="hidden" name="num" value={r.num} />
                    <input type="hidden" name="next" value={String(!r.active)} />
                    <button
                      type="submit"
                      className="text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      {r.active ? "숨김" : "노출"}
                    </button>
                  </form>
                  {r.origin === "upload" && (
                    <form
                      action={deleteUploadedCharacter}
                      onSubmit={(e) => {
                        if (!confirm(`${r.code} 를 삭제할까요? 번호는 결번으로 남습니다.`)) {
                          e.preventDefault();
                        }
                      }}
                      className="ml-auto"
                    >
                      <input type="hidden" name="num" value={r.num} />
                      <button
                        type="submit"
                        className="text-xs font-medium text-destructive/80 hover:text-destructive"
                      >
                        삭제
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* 수정 폼 */}
              {editing === r.num && canWrite && (
                <form action={updateCharacter} className="mt-2 space-y-2 rounded-lg bg-muted/40 p-2">
                  <input type="hidden" name="num" value={r.num} />
                  <input name="name" defaultValue={r.name} className={field} placeholder="이름" />
                  <input
                    name="section"
                    defaultValue={r.section}
                    className={field}
                    placeholder="섹션"
                  />
                  <input
                    name="tags"
                    defaultValue={r.tags.join(", ")}
                    className={field}
                    placeholder="태그(쉼표 구분)"
                  />
                  <input
                    name="note"
                    defaultValue={r.note ?? ""}
                    className={field}
                    placeholder="메모(선택)"
                  />
                  <SubmitButton className="h-8 w-full text-xs">저장</SubmitButton>
                </form>
              )}
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          조건에 맞는 자산이 없어요.
        </p>
      )}
    </div>
  );
}

function CopyBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-border px-2 py-1 text-[0.7rem] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
    >
      {label}
    </button>
  );
}

// ------------------------------------------------------------------ 업로드 폼
function UploadForm() {
  const dimsRef = useRef<{ w: number; h: number } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 파일 선택 시 원본 크기를 읽어 hidden 필드로 전달(서버에서 이미지 파싱 생략)
  const onFile = (file: File | null, form: HTMLFormElement | null) => {
    if (preview) URL.revokeObjectURL(preview);
    dimsRef.current = null;
    setPreview(null);
    if (!file || !form) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      dimsRef.current = { w: img.naturalWidth, h: img.naturalHeight };
      (form.elements.namedItem("width") as HTMLInputElement).value = String(img.naturalWidth);
      (form.elements.namedItem("height") as HTMLInputElement).value = String(img.naturalHeight);
      setPreview(url);
    };
    img.src = url;
  };

  return (
    <form
      action={uploadCharacter}
      className="grid gap-3 rounded-xl border border-primary/30 bg-primary/[0.04] p-4 sm:grid-cols-2"
    >
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          이미지 파일 <span className="text-destructive">*</span>
          <input
            type="file"
            name="file"
            accept="image/png,image/jpeg,image/webp"
            required
            onChange={(e) => onFile(e.target.files?.[0] ?? null, e.target.form)}
            className={field + " mt-1.5 file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-primary"}
          />
        </label>
        <p className="text-xs text-muted-foreground">
          PNG(투명 배경 권장)·JPG·WebP, 최대 5MB. 가능한 한 고화질 원본을 올려주세요 — 번호가
          자동 채번되고 <code>/c/HT-###</code> 주소가 생깁니다.
        </p>
        {preview && (
          <div
            className="grid h-28 w-28 place-items-center rounded-lg border border-border"
            style={{ background: checker, backgroundSize: "16px 16px" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- 로컬 미리보기 */}
            <img src={preview} alt="미리보기" className="max-h-24 max-w-24 object-contain" />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <input name="name" required maxLength={80} placeholder="이름(필수) — 예: 오터 · 하이파이브" className={field} />
        <select name="group" defaultValue="custom" className={field}>
          <option value="custom">업로드(기본)</option>
          <option value="man">메이커</option>
          <option value="otter">오터</option>
          <option value="prop">소품</option>
          <option value="scene">상황</option>
        </select>
        <input name="section" placeholder="섹션(선택) — 예: 표정" className={field} />
        <input name="tags" placeholder="태그(쉼표 구분, 선택)" className={field} />
        <input type="hidden" name="width" />
        <input type="hidden" name="height" />
        <SubmitButton className="w-full">등록하고 번호 받기</SubmitButton>
      </div>
    </form>
  );
}
