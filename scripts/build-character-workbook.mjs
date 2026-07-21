// 캐릭터 자산 로컬 워크북 빌더 — 내부 관리용, 배포·커밋과 무관.
//
//   node scripts/build-character-workbook.mjs
//
// 출력(모두 gitignore 되는 local/ 아래):
//   local/characters/index.html        — 단독 실행 관리 워크북(브라우저로 열기)
//   local/characters/data.js           — 자산 상세 데이터(디테일 고도화 버전)
//   local/characters/img/native/*.png  — 1x 무손실 컷(리사이즈·샤픈 없음, 진짜 원본)
//   local/characters/img/x2/*.png      — 표준 2x (사이트와 동일 품질)
//   local/characters/img/x3/*.png      — 고화질 3x (로컬 활용 최대 해상도)
//   local/characters/README.md         — 로컬 관리 방법 안내
//
// 시트 좌표·배경 제거 로직은 build-character-assets.mjs 를 그대로 import 하므로
// 사이트 자산과 항상 같은 컷 정의를 공유한다(이중 관리 없음).

import { mkdir, rm, writeFile, copyFile } from "node:fs/promises";
import sharp from "sharp";
import {
  SHEETS,
  cellsOf,
  cutout,
  dropEdgeSlivers,
  crisp,
} from "./build-character-assets.mjs";

const OUT = "local/characters";

// ---------------------------------------------------- 섹션별 활용 가이드
const USAGE = {
  "메이커|히어로": "랜딩·소개 페이지의 메인 비주얼, 카드 대표 이미지. 노트북·머그가 포함된 데스크 신이라 '작업 중' 맥락 전달에 최적.",
  "메이커|턴어라운드": "캐릭터 일관성 기준 자료(정면·측면·후면). 굿즈 시안, 새 컷 제작 시 비율·복장 레퍼런스로 사용. 화면 노출용보다는 제작 가이드용.",
  "메이커|표정": "글·카드의 리액션 강조, 챗봇 상태 아이콘, 유튜브 썸네일의 감정 포인트. 얼굴 클로즈업이라 96px 이하로 줄여도 잘 읽힌다.",
  "메이커|상황 모션": "블로그 글 헤더, 기능 소개 카드, 교육 자료 삽화. 상황이 명확해 텍스트 없이도 문맥을 전달한다.",
  "메이커|미니멀 라인": "아이콘·스티커·빈 상태(empty state)·목록 불릿. 배경이 단순해 작은 크기, 어두운 배경 위에서도 활용 가능.",
  "메이커|소품(메이커)": "목록 불릿, 기능 아이콘, 섹션 구분 장식. 캐릭터 없이 오브젝트만 필요할 때.",
  "오터|히어로": "ReadTree·독서 관련 메인 비주얼, 환영 카드. 책을 든 시그니처 포즈라 브랜드 인지에 가장 강력.",
  "오터|표정": "21종 감정 세트 — 리액션 스티커, 알림 토스트, 상태 메시지(성공=활짝 웃음, 오류=당황, 대기=졸림 등)에 매핑해 시스템 전반의 감정 표현 통일.",
  "오터|포즈 · 각도": "온보딩 스텝 안내(발표하기·아이디어), 응원 배너(응원·파이팅), 진행 상태(걷기·달리기). 각도 6종은 제작 레퍼런스.",
  "오터|라인 스타일": "테마별 변형 기준 — 풀컬러(기본), 미니멀 라인(밝은 배경 보조), 모노톤(비활성 상태), 화이트 라인(어두운 배경·다크모드).",
  "오터|미니멀 라인": "파비콘·작은 아이콘·로딩 표시·이모지 대용. 흰 몸통이라 컬러 배경 위에 자연스럽다.",
  "오터|소품(오터)": "리스트 장식, 기능 뱃지 배경. 오터 씬과 톤이 같은 소프트 컬러 오브젝트.",
  "오터|상황 일러스트": "섹션 배경, OG 이미지 소재, 뉴스레터 헤더. 유일하게 배경이 있는 컷이라 카드 전체를 채우는 용도에 적합.",
};

// 기존 사이트 에셋(public/img/about/*)과 동일한 원본 컷 대응표
const ABOUT_EQUIV = {
  "HT-016": "public/img/about/man-read.png",
  "HT-021": "public/img/about/man-code.png",
  "HT-022": "public/img/about/man-record.png",
  "HT-069": "public/img/about/otter-read.png",
  "HT-071": "public/img/about/otter-idea.png",
  "HT-073": "public/img/about/otter-cheer.png",
  "HT-077": "public/img/about/otter-coffee.png",
  "HT-001": "public/img/about-characters.png (듀오 좌측)",
  "HT-041": "public/img/about-characters.png (듀오 우측 원본)",
};

const GROUP_LABEL = { man: "메이커", otter: "오터", prop: "소품", scene: "상황", custom: "업로드" };

async function variantOf(cut, scale, file) {
  const meta = await sharp(cut).metadata();
  let buf;
  if (scale === 1) {
    buf = await sharp(cut).png({ compressionLevel: 9 }).toBuffer();
  } else {
    buf = await crisp(sharp(cut), scale, meta.width).png({ compressionLevel: 9 }).toBuffer();
  }
  const m = await sharp(buf).metadata();
  await writeFile(file, buf);
  return { w: m.width, h: m.height, kb: Math.max(1, Math.round(buf.length / 1024)) };
}

async function main() {
  await rm(OUT, { recursive: true, force: true });
  for (const d of ["", "/img/native", "/img/x2", "/img/x3"]) {
    await mkdir(OUT + d, { recursive: true });
  }

  const assets = [];
  let num = 0;

  for (const sheet of SHEETS) {
    const img = sharp(sheet.src);
    for (const row of sheet.rows) {
      for (const cell of cellsOf(row)) {
        num += 1;
        const code = `HT-${String(num).padStart(3, "0")}`;
        const [left, top, width, height] = cell.rect;
        const group = row.group ?? sheet.group;

        // 시트 추출 파이프라인(사이트와 동일) → 무손실 컷 확보
        let pipeline = img.clone().extract({ left, top, width, height });
        if (cell.cover) {
          pipeline = sharp(await pipeline.png().toBuffer()).composite(
            cell.cover.map(([cx, cy, cw, ch]) => ({
              input: { create: { width: cw, height: ch, channels: 4, background: { r: 252, g: 252, b: 252, alpha: 255 } } },
              left: cx, top: cy,
            }))
          );
        }
        const raw = await pipeline.png().toBuffer();
        const clean = await dropEdgeSlivers(await cutout(raw));
        const cut = await sharp(clean).trim({ threshold: 1 }).png().toBuffer();

        // 3단계 화질 생성
        const variants = {
          native: await variantOf(cut, 1, `${OUT}/img/native/${code}.png`),
          x2: await variantOf(cut, 2, `${OUT}/img/x2/${code}.png`),
          x3: await variantOf(cut, 3, `${OUT}/img/x3/${code}.png`),
        };
        for (const [k, v] of Object.entries(variants)) v.file = `img/${k === "native" ? "native" : k}/${code}.png`;

        const usageKey = `${sheet.char}|${row.section}`;
        assets.push({
          num, code,
          name: cell.name,
          group,
          section: row.section,
          char: sheet.char,
          tags: [...new Set([sheet.char, row.section, GROUP_LABEL[group], cell.name].filter(Boolean))],
          source: sheet.src,
          rect: cell.rect,
          variants,
          usage: USAGE[usageKey] ?? "활용 가이드 미작성 섹션 — data.js 의 USAGE 에 추가하세요.",
          alt: `${sheet.char} 캐릭터 — ${cell.name}${row.section !== "히어로" ? ` (${row.section})` : ""}`,
          siteUrl: `https://vibe.habitree.io/c/${code}`,
          repoPath: `public/characters/${code}.png`,
          aboutEquiv: ABOUT_EQUIV[code] ?? null,
        });
        if (num % 20 === 0) console.log(`… ${code} 까지 처리`);
      }
    }
  }

  const dataJs =
    "// 캐릭터 자산 워크북 데이터 — build-character-workbook.mjs 가 생성 (직접 수정 가능하지만 재생성 시 덮어씀)\n" +
    "window.CHARACTER_DATA = " +
    JSON.stringify(
      {
        generatedAt: new Date().toISOString().slice(0, 10),
        groupLabel: GROUP_LABEL,
        assets,
      },
      null,
      1
    ) +
    ";\n";
  await writeFile(`${OUT}/data.js`, dataJs);
  await copyFile("scripts/character-workbook-template.html", `${OUT}/index.html`);

  await writeFile(
    `${OUT}/README.md`,
    `# 캐릭터 자산 워크북 (내부 관리용)

- **열기**: 이 폴더의 \`index.html\` 을 브라우저로 연다(서버 불필요, 오프라인 동작).
- **화질 3단계**: \`img/native\`(1x 무손실) · \`img/x2\`(사이트 동일) · \`img/x3\`(최대 해상도).
- **메모·즐겨찾기**: 브라우저(localStorage)에 저장 — 상단 "메모 내보내기"로 JSON 백업.
- **재생성**: 리포 루트에서 \`node scripts/build-character-workbook.mjs\` (이 폴더를 전부 덮어씀 — 메모는 브라우저에 있으므로 안전).
- 이 폴더(\`local/\`)는 .gitignore 대상 — 커밋·배포되지 않는다.
`
  );

  const total = assets.reduce(
    (a, x) => a + x.variants.native.kb + x.variants.x2.kb + x.variants.x3.kb,
    0
  );
  console.log(`\n✓ ${assets.length}컷 × 3화질 생성 (${(total / 1024).toFixed(1)}MB) → ${OUT}/`);
}

await main();
