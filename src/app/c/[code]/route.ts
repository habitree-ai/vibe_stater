import { NextResponse } from "next/server";
import { findCharacter, normalizeCharacterCode } from "@/lib/characters";
import { createServiceClient } from "@/lib/supabase/admin";

// 캐릭터 자산 번호 참조 라우트 — /c/HT-001 (또는 /c/1, /c/ht-1) → 실제 이미지로 리다이렉트.
// 채번된 번호가 곧 영구 주소가 되므로, 파일 위치가 바뀌어도 참조는 깨지지 않는다.
// · 1순위: character_assets 테이블(대시보드 관리 상태 반영 — active=false면 404)
// · 2순위(DB 미가용 시): 리포 레지스트리 JSON 폴백
// 참조: doc/17_character_platform.md

export const dynamic = "force-dynamic";

function redirectTo(src: string, req: Request, maxAge: number) {
  const target = src.startsWith("http") ? src : new URL(src, req.url).toString();
  return NextResponse.redirect(target, {
    status: 308,
    headers: { "Cache-Control": `public, max-age=${maxAge}` },
  });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const norm = normalizeCharacterCode(code);
  if (!norm) return new NextResponse("잘못된 코드 형식", { status: 400 });

  // 1) DB — 대시보드에서 관리하는 상태(비활성·업로드 자산 포함)가 진실원본
  const service = createServiceClient();
  if (service) {
    const { data, error } = await service
      .from("character_assets")
      .select("src, active")
      .eq("code", norm)
      .maybeSingle();
    if (!error) {
      if (data?.active && data.src) return redirectTo(data.src, req, 300);
      if (data && !data.active) {
        return new NextResponse("비활성 처리된 자산입니다: " + norm, { status: 404 });
      }
      // data 없음 → 폴백으로
    }
  }

  // 2) 레지스트리 폴백 — DB 미가용/미등록이어도 리포 자산은 항상 열린다
  const repo = findCharacter(norm);
  if (repo) return redirectTo(repo.file, req, 3600);

  return new NextResponse("등록되지 않은 캐릭터 코드입니다: " + norm, { status: 404 });
}
