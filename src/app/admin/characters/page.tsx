import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/admin";
import { characterRegistry } from "@/lib/characters";
import { CharactersManager, type AssetRow } from "./CharactersManager";

export const metadata: Metadata = { title: "캐릭터 자산" };

// 관리 화면은 항상 최신 DB 상태를 보여준다(캐시 금지).
export const dynamic = "force-dynamic";

// DB(진실원본)에서 목록을 읽고, 미가용 시 리포 레지스트리로 폴백한다.
async function loadAssets(): Promise<{ rows: AssetRow[]; dbOk: boolean }> {
  const service = createServiceClient();
  if (service) {
    const { data, error } = await service
      .from("character_assets")
      .select("num, code, name, group, section, char_label, src, width, height, tags, origin, active, note")
      .order("num", { ascending: true });
    if (!error && data) {
      return { rows: data as AssetRow[], dbOk: true };
    }
  }
  // 폴백: 리포 레지스트리(읽기 전용 뷰)
  return {
    rows: characterRegistry.map((c) => ({
      num: c.num,
      code: c.code,
      name: c.name,
      group: c.group,
      section: c.section,
      char_label: c.char,
      src: c.file,
      width: c.width,
      height: c.height,
      tags: [c.char, c.section],
      origin: "repo" as const,
      active: true,
      note: null,
    })),
    dbOk: false,
  };
}

export default async function AdminCharactersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const [{ rows, dbOk }, params] = await Promise.all([loadAssets(), searchParams]);

  return (
    <section className="py-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">캐릭터 자산</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          모든 캐릭터 이미지를 번호(HT-###)로 채번해 관리합니다. 번호 기반 주소{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/c/HT-001</code> 로 어디서든
          참조할 수 있어요.
        </p>
      </div>

      {params.error && (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {params.error}
        </p>
      )}
      {params.notice && (
        <p className="mt-4 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {params.notice}
        </p>
      )}
      {!dbOk && (
        <p className="mt-4 rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          DB에 연결하지 못해 리포 레지스트리(읽기 전용)를 보여주고 있어요. 업로드·수정은 지금 동작하지
          않습니다.
        </p>
      )}

      <CharactersManager rows={rows} canWrite={dbOk} />
    </section>
  );
}
