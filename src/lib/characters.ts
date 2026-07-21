import registryJson from "@/data/characters.json";

// 캐릭터 자산 플랫폼 — 채번(HT-###) 기반 레지스트리 헬퍼.
// · 리포 추출 자산(HT-001~)은 scripts/build-character-assets.mjs 가 생성한 JSON이 원본.
// · 업로드 자산은 Supabase character_assets 테이블에만 존재한다(대시보드에서 채번).
// · 어디서든 /c/HT-### 로 번호만으로 이미지를 참조할 수 있다. (doc/17_character_platform.md)

export type CharacterGroup = "man" | "otter" | "prop" | "scene" | "custom";

export type CharacterAsset = {
  num: number;
  code: string; // HT-### — 영구 식별자
  name: string;
  group: CharacterGroup;
  section: string;
  char: string; // 캐릭터 라벨(메이커/오터)
  file: string; // 이미지 경로(/characters/HT-###.png)
  width: number;
  height: number;
};

export const characterGroupLabel: Record<CharacterGroup, string> = {
  man: "메이커",
  otter: "오터",
  prop: "소품",
  scene: "상황",
  custom: "업로드",
};

export const characterRegistry: CharacterAsset[] =
  registryJson as unknown as CharacterAsset[];

// 코드 정규화: "ht-1" · "1" · "HT-001" → "HT-001"
// 999 초과는 자릿수 자연 확장(HT-1000) — DB code 생성식(greatest 패딩)과 동일 규칙.
export function normalizeCharacterCode(input: string): string | null {
  const raw = decodeURIComponent(input).trim().toUpperCase();
  const m = raw.match(/^(?:HT-?)?0*(\d{1,6})$/);
  if (!m) return null;
  return `HT-${m[1].padStart(3, "0")}`;
}

export function findCharacter(code: string): CharacterAsset | undefined {
  const norm = normalizeCharacterCode(code);
  if (!norm) return undefined;
  return characterRegistry.find((c) => c.code === norm);
}

// 번호 기반 공식 참조 URL — 파일 위치가 바뀌어도 이 주소는 유지된다.
export function characterUrl(code: string): string {
  return `/c/${normalizeCharacterCode(code) ?? code}`;
}
