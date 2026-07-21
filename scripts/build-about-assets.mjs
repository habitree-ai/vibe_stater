// 소개(About) 페이지용 캐릭터 컷 생성 스크립트.
//
//   node scripts/build-about-assets.mjs
//
// 입력: img/man1.png, img/sd_1.png (캐릭터 가이드 시트, 각 1536x1024)
//       + local/tools/sr/*_x4.png (Real-ESRGAN 초해상 캐시 — 있으면 고품질 경로)
// 출력: public/img/about-characters.png (인트로용 듀오) + public/img/about/*.png (섹션 장식용 컷)
//
// 배경 제거·초해상 캐시는 build-character-assets.mjs 와 공유한다.
// SR 캐시가 있으면 4x 시트에서 잘라 목표 크기로 '다운스케일'하므로(업스케일 없음)
// 라인이 뭉개지지 않는다. 없으면 기존 란초스+언샤프 폴백.

import { mkdir } from "node:fs/promises";
import sharp from "sharp";
import { cutout, dropEdgeSlivers, ensureSrSheet, SR_SCALE } from "./build-character-assets.mjs";

const OUT_DIR = "public/img/about";

// 시트 소스 준비: SR 캐시가 있으면 {img, mult:4}, 없으면 {img, mult:1}
function srcOf(path) {
  const sr = ensureSrSheet(path);
  if (!sr) console.warn(`! ${path}: 초해상 캐시 없음 → 원본+란초스 폴백`);
  return sr ? { img: sharp(sr), mult: SR_SCALE } : { img: sharp(path), mult: 1 };
}

// 원본 좌표 rect를 소스 배율에 맞춰 잘라 배경 제거·트림까지 마친 컷 버퍼.
async function cutFrom(src, rect, cover) {
  const [l, t, w, h] = rect.map((v) => v * src.mult);
  let pipeline = src.img.clone().extract({ left: l, top: t, width: w, height: h });
  if (cover) {
    pipeline = sharp(await pipeline.png().toBuffer()).composite(
      cover.map(([cx, cy, cw, ch]) => ({
        input: {
          create: {
            width: cw * src.mult, height: ch * src.mult, channels: 4,
            background: { r: 252, g: 252, b: 252, alpha: 255 },
          },
        },
        left: cx * src.mult,
        top: cy * src.mult,
      }))
    );
  }
  const raw = await pipeline.png().toBuffer();
  const clean = await dropEdgeSlivers(await cutout(raw));
  return sharp(clean).trim({ threshold: 1 }).png().toBuffer();
}

// 목표 크기로 정리: SR(다운스케일)은 그대로, 폴백(업스케일)은 언샤프로 보정
function finalize(buf, resizeOpt, mult) {
  let p = sharp(buf).resize({ ...resizeOpt, kernel: "lanczos3" });
  if (mult === 1) p = p.sharpen({ sigma: 0.7, m1: 0.4, m2: 2.2 });
  return p.png({ compressionLevel: 9 }).toBuffer();
}

// -------------------------------------------------- 1) 인트로용 듀오 이미지
// 남자 캐릭터(크게, 노트북·머그 포함) + 수달 마스코트(작게, 앞쪽)
async function buildDuo() {
  const man1 = srcOf("img/man1.png");
  const sd1 = srcOf("img/sd_1.png");

  // 좌상단에 걸리는 로고/태그라인 텍스트는 배경색으로 덮는다.
  const manCut = await cutFrom(man1, [232, 8, 242, 292], [[0, 0, 96, 150]]);
  const otterCut = await cutFrom(sd1, [78, 96, 214, 278]);

  const man = await finalize(manCut, { width: 627 }, man1.mult);
  const otter = await finalize(otterCut, { width: 243 }, sd1.mult);
  const manMeta = await sharp(man).metadata();
  const otterMeta = await sharp(otter).metadata();

  const W = 768, H = 768;
  await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: man, left: W - manMeta.width, top: Math.max(0, H - manMeta.height - 26) },
      { input: otter, left: 18, top: H - otterMeta.height - 19 },
    ])
    .png({ compressionLevel: 9 })
    .toFile("public/img/about-characters.png");

  console.log("✓ public/img/about-characters.png 768x768");
}

// ------------------------------------------------- 2) 섹션 장식용 캐릭터 컷
// man1 §03 "상황별 다양한 모션" 행 / sd_1 §02 "다양한 포즈 & 각도" 행에서 뽑는다.
// height 는 각 컷 아래 한글 캡션에 닿지 않도록 잘라 둔 값이다.
// out: 화면 표시 높이(CSS px)의 2배.
const CUTS = [
  { name: "man-code", src: "img/man1.png", left: 838, top: 322, width: 132, height: 134, out: 288 },
  { name: "man-read", src: "img/man1.png", left: 52, top: 334, width: 142, height: 122, out: 288 },
  { name: "man-record", src: "img/man1.png", left: 1016, top: 322, width: 138, height: 134, out: 288 },
  { name: "otter-read", src: "img/sd_1.png", left: 1060, top: 174, width: 84, height: 94, out: 224 },
  { name: "otter-idea", src: "img/sd_1.png", left: 1233, top: 168, width: 77, height: 100, out: 288 },
  { name: "otter-cheer", src: "img/sd_1.png", left: 1427, top: 174, width: 65, height: 94, out: 256 },
  { name: "otter-coffee", src: "img/sd_1.png", left: 1326, top: 298, width: 76, height: 92, out: 256 },
];

async function buildCuts() {
  await mkdir(OUT_DIR, { recursive: true });
  const sources = new Map();
  const dims = {};
  for (const c of CUTS) {
    if (!sources.has(c.src)) sources.set(c.src, srcOf(c.src));
    const src = sources.get(c.src);
    const cut = await cutFrom(src, [c.left, c.top, c.width, c.height]);
    const out = await finalize(cut, { height: c.out, fit: "inside" }, src.mult);
    const meta = await sharp(out).metadata();
    await sharp(out).toFile(`${OUT_DIR}/${c.name}.png`);
    dims[c.name] = { w: meta.width, h: meta.height };
    console.log(`✓ ${OUT_DIR}/${c.name}.png ${meta.width}x${meta.height} ${(out.length / 1024) | 0}KB`);
  }
  console.log("\n페이지 width/height 갱신용:", JSON.stringify(dims));
}

await buildDuo();
await buildCuts();
