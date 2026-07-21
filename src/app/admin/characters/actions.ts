"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/admin";
import { getAdminUserId } from "@/lib/admin";
import { logActivity } from "@/lib/log";

// 캐릭터 자산 관리 서버 액션 — 관리자 전용, service_role로 RLS 우회.
// 채번(HT-###)은 DB identity가 담당한다: 업로드 시 번호를 지정하지 않고 발급받는다.

function enc(s: string) {
  return encodeURIComponent(s);
}

function fail(msg: string): never {
  redirect("/admin/characters?error=" + enc(msg));
}

const VALID_GROUPS = ["man", "otter", "prop", "scene", "custom"] as const;
const VALID_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};
const MAX_BYTES = 5 * 1024 * 1024; // 5MB (next.config serverActions.bodySizeLimit와 함께 조정)

async function requireAdminOr(msg: string): Promise<string> {
  const adminId = await getAdminUserId();
  if (!adminId) redirect("/me?error=" + enc(msg));
  return adminId!;
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 10);
}

// ---------------------------------------------------------- 신규 업로드(채번)
export async function uploadCharacter(formData: FormData) {
  const adminId = await requireAdminOr("권한이 없습니다.");

  const name = String(formData.get("name") || "").trim();
  const group = String(formData.get("group") || "custom").trim();
  const section = String(formData.get("section") || "").trim() || "업로드";
  const tagsRaw = String(formData.get("tags") || "").trim();
  const width = Number(formData.get("width")) || null;
  const height = Number(formData.get("height")) || null;
  const file = formData.get("file");

  if (name.length < 1 || name.length > 80) fail("이름은 1~80자로 입력해 주세요.");
  if (!VALID_GROUPS.includes(group as (typeof VALID_GROUPS)[number])) {
    fail("잘못된 그룹입니다.");
  }
  if (!(file instanceof File) || file.size === 0) fail("이미지 파일을 선택해 주세요.");
  const ext = VALID_TYPES[file.type];
  if (!ext) fail("PNG·JPG·WebP 이미지만 업로드할 수 있어요.");
  if (file.size > MAX_BYTES) fail("파일이 너무 큽니다(최대 5MB).");

  const service = createServiceClient();
  if (!service) fail("서버 설정 오류(서비스 키 없음).");

  // 1) 행 생성 → identity가 번호를 채번하고 code(HT-###)가 파생된다.
  const { data: row, error: insErr } = await service!
    .from("character_assets")
    .insert({
      name,
      group,
      section,
      char_label: "업로드",
      tags: parseTags(tagsRaw),
      src: "pending:" + name, // 업로드 완료 후 실제 URL로 교체
      width,
      height,
      origin: "upload",
    })
    .select("num, code")
    .single();
  if (insErr || !row) fail("등록 실패: " + (insErr?.message ?? "알 수 없는 오류"));

  // 2) 스토리지 업로드 — 파일명은 채번 코드로 고정
  const path = `uploads/${row.code}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: upErr } = await service!.storage
    .from("characters")
    .upload(path, bytes, { contentType: file.type, upsert: true });
  if (upErr) {
    // 업로드 실패 시 행 회수(결번이 되지만 재사용하지 않는 것이 채번 원칙)
    await service!.from("character_assets").delete().eq("num", row.num);
    fail("스토리지 업로드 실패: " + upErr.message);
  }

  // 3) 공개 URL로 src 교체 — 실패 시 스토리지 객체·행을 회수(고아 'pending' 행 방지)
  const { data: pub } = service!.storage.from("characters").getPublicUrl(path);
  const { error: updErr } = await service!
    .from("character_assets")
    .update({ src: pub.publicUrl, updated_at: new Date().toISOString() })
    .eq("num", row.num);
  if (updErr) {
    await service!.storage.from("characters").remove([path]);
    await service!.from("character_assets").delete().eq("num", row.num);
    fail("등록 마무리 실패(다시 시도해 주세요): " + updErr.message);
  }

  await logActivity({
    action: "admin.characters.upload",
    userId: adminId,
    targetType: "character_asset",
    targetId: row.code,
    message: `${row.code} ${name} 업로드`,
  });

  revalidatePath("/admin/characters");
  redirect("/admin/characters?notice=" + enc(`${row.code} 번으로 등록했어요.`));
}

// ------------------------------------------------------------- 메타데이터 수정
export async function updateCharacter(formData: FormData) {
  const adminId = await requireAdminOr("권한이 없습니다.");

  const num = Number(formData.get("num"));
  const name = String(formData.get("name") || "").trim();
  const section = String(formData.get("section") || "").trim();
  const tagsRaw = String(formData.get("tags") || "").trim();
  const note = String(formData.get("note") || "").trim();

  if (!Number.isInteger(num) || num < 1) fail("잘못된 번호입니다.");
  if (name.length < 1 || name.length > 80) fail("이름은 1~80자로 입력해 주세요.");

  const service = createServiceClient();
  if (!service) fail("서버 설정 오류(서비스 키 없음).");

  const { error } = await service!
    .from("character_assets")
    .update({
      name,
      section,
      tags: parseTags(tagsRaw),
      note: note || null,
      updated_at: new Date().toISOString(),
    })
    .eq("num", num);
  if (error) fail("수정 실패: " + error.message);

  await logActivity({
    action: "admin.characters.update",
    userId: adminId,
    targetType: "character_asset",
    targetId: String(num),
    message: `#${num} 메타데이터 수정`,
  });

  revalidatePath("/admin/characters");
  redirect("/admin/characters?notice=" + enc("수정했어요."));
}

// ------------------------------------------------------------- 노출 토글
export async function toggleCharacterActive(formData: FormData) {
  const adminId = await requireAdminOr("권한이 없습니다.");

  const num = Number(formData.get("num"));
  const next = String(formData.get("next")) === "true";
  if (!Number.isInteger(num) || num < 1) fail("잘못된 번호입니다.");

  const service = createServiceClient();
  if (!service) fail("서버 설정 오류(서비스 키 없음).");

  const { error } = await service!
    .from("character_assets")
    .update({ active: next, updated_at: new Date().toISOString() })
    .eq("num", num);
  if (error) fail("변경 실패: " + error.message);

  await logActivity({
    action: "admin.characters.toggle",
    userId: adminId,
    targetType: "character_asset",
    targetId: String(num),
    message: `#${num} ${next ? "노출" : "숨김"}`,
  });

  revalidatePath("/admin/characters");
  redirect("/admin/characters");
}

// ------------------------------------- 업로드 자산 삭제(리포 자산은 숨김만 가능)
export async function deleteUploadedCharacter(formData: FormData) {
  const adminId = await requireAdminOr("권한이 없습니다.");

  const num = Number(formData.get("num"));
  if (!Number.isInteger(num) || num < 1) fail("잘못된 번호입니다.");

  const service = createServiceClient();
  if (!service) fail("서버 설정 오류(서비스 키 없음).");

  const { data: row } = await service!
    .from("character_assets")
    .select("num, code, origin, src")
    .eq("num", num)
    .maybeSingle();
  if (!row) fail("자산을 찾을 수 없어요.");
  if (row.origin !== "upload") {
    fail("시트 추출 자산은 삭제할 수 없어요. 숨김으로 전환해 주세요.");
  }

  // 스토리지 정리(경로는 업로드 규칙으로 재구성) → 행 삭제. 번호는 결번으로 남긴다.
  const m = row.src.match(/\/characters\/(uploads\/[^?]+)$/);
  if (m) await service!.storage.from("characters").remove([m[1]]);
  const { error } = await service!.from("character_assets").delete().eq("num", num);
  if (error) fail("삭제 실패: " + error.message);

  await logActivity({
    action: "admin.characters.delete",
    userId: adminId,
    targetType: "character_asset",
    targetId: row.code,
    message: `${row.code} 삭제(결번 처리)`,
  });

  revalidatePath("/admin/characters");
  redirect("/admin/characters?notice=" + enc(`${row.code} 를 삭제했어요(번호는 결번으로 유지).`));
}
