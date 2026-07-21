// 소개(About) 페이지용 캐릭터 컷 생성 스크립트.
//
//   node scripts/build-about-assets.mjs
//
// 입력: img/man1.png, img/sd_1.png (캐릭터 가이드 시트, 각 1536x1024)
// 출력: public/img/about-characters.png (인트로용 듀오) + public/img/about/*.png (섹션 장식용 컷)
//
// 가이드 시트는 크림색 배경 위에 캐릭터가 격자로 놓여 있다. 가장자리에서 flood fill 해
// '바깥 배경'만 투명 처리하므로 노트북·책 페이지 같은 내부 흰색은 그대로 남는다.

import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const OUT_DIR = "public/img/about";

// ---------------------------------------------------------------- 배경 제거
async function cutout(buf) {
  const img = sharp(buf).ensureAlpha();
  const { width: w, height: h } = await img.metadata();
  const data = await img.raw().toBuffer();

  const bgLike = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mn = Math.min(r, g, b);
    const mx = Math.max(r, g, b);
    return mn > 226 && mx - mn < 22; // 크림/화이트 계열
  };

  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);

  while (stack.length) {
    const p = stack.pop();
    if (seen[p] || !bgLike(p * 4)) continue;
    seen[p] = 1;
    const x = p % w, y = (p / w) | 0;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - w);
    if (y < h - 1) stack.push(p + w);
  }

  for (let p = 0; p < w * h; p++) if (seen[p]) data[p * 4 + 3] = 0;
  // 경계 한 겹은 반투명으로 부드럽게
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      if (seen[p] || data[p * 4 + 3] === 0) continue;
      if (seen[p - 1] || seen[p + 1] || seen[p - w] || seen[p + w]) {
        const i = p * 4;
        if (Math.min(data[i], data[i + 1], data[i + 2]) > 200) data[i + 3] = 90;
      }
    }
  }

  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

// -------------------------------------------------- 1) 인트로용 듀오 이미지
// 남자 캐릭터(크게, 노트북·머그 포함) + 수달 마스코트(작게, 앞쪽)
async function buildDuo() {
  const MAN = { left: 232, top: 8, width: 242, height: 292 };
  const manSrc = await sharp("img/man1.png")
    .extract(MAN)
    // 좌상단에 걸리는 로고/태그라인 텍스트를 배경색으로 덮는다.
    .composite([
      {
        input: {
          create: { width: 96, height: 150, channels: 4, background: { r: 250, g: 249, b: 245, alpha: 255 } },
        },
        left: 0,
        top: 0,
      },
    ])
    .png()
    .toBuffer();

  const otterSrc = await sharp("img/sd_1.png")
    .extract({ left: 78, top: 96, width: 214, height: 278 })
    .png()
    .toBuffer();

  // 카드 표시 폭(max-w-sm = 384px)의 2배인 768px 캔버스에 맞춰 한 번만 확대한다.
  const man = await sharp(await cutout(manSrc))
    .trim({ threshold: 1 })
    .resize({ width: 627, kernel: "lanczos3" })
    .sharpen({ sigma: 0.7, m1: 0.4, m2: 2.2 })
    .png()
    .toBuffer();
  const otter = await sharp(await cutout(otterSrc))
    .trim({ threshold: 1 })
    .resize({ width: 243, kernel: "lanczos3" })
    .sharpen({ sigma: 0.7, m1: 0.4, m2: 2.2 })
    .png()
    .toBuffer();
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

  console.log("✓ public/img/about-characters.png");
}

// ------------------------------------------------- 2) 섹션 장식용 캐릭터 컷
// man1 §03 "상황별 다양한 모션" 행 / sd_1 §02 "다양한 포즈 & 각도" 행에서 뽑는다.
// height 는 각 컷 아래 한글 캡션에 닿지 않도록 잘라 둔 값이다.
//
// out: 화면 표시 높이(CSS px)의 2배로 한 번만 확대한다. 과하게 키워 두면 브라우저가 다시
// 축소하면서 리샘플이 두 번 일어나 오히려 흐려진다. 선화라 확대 후 언샤프로 윤곽을 세운다.
const CUTS = [
  { name: "man-code", src: "img/man1.png", left: 838, top: 322, width: 132, height: 134, out: 288 },
  { name: "man-read", src: "img/man1.png", left: 52, top: 334, width: 142, height: 122, out: 288 },
  { name: "man-record", src: "img/man1.png", left: 1016, top: 322, width: 138, height: 134, out: 288 },
  { name: "otter-read", src: "img/sd_1.png", left: 1060, top: 174, width: 84, height: 94, out: 224 },
  { name: "otter-idea", src: "img/sd_1.png", left: 1233, top: 168, width: 77, height: 100, out: 288 },
  { name: "otter-cheer", src: "img/sd_1.png", left: 1427, top: 174, width: 65, height: 94, out: 256 },
  { name: "otter-coffee", src: "img/sd_1.png", left: 1326, top: 298, width: 76, height: 92, out: 256 },
];

// 확대 → 언샤프 마스크. 흐릿해진 선과 면 경계를 다시 세운다.
function crisp(pipeline, height) {
  return pipeline
    .resize({ height, kernel: "lanczos3", fit: "inside" })
    .sharpen({ sigma: 0.7, m1: 0.4, m2: 2.2 });
}

async function buildCuts() {
  await mkdir(OUT_DIR, { recursive: true });
  for (const c of CUTS) {
    const raw = await sharp(c.src)
      .extract({ left: c.left, top: c.top, width: c.width, height: c.height })
      .png()
      .toBuffer();
    const trimmed = await sharp(await cutout(raw)).trim({ threshold: 1 }).png().toBuffer();
    const out = await crisp(sharp(trimmed), c.out).png({ compressionLevel: 9 }).toBuffer();
    const meta = await sharp(out).metadata();
    await sharp(out).toFile(`${OUT_DIR}/${c.name}.png`);
    console.log(`✓ ${OUT_DIR}/${c.name}.png ${meta.width}x${meta.height} ${(out.length / 1024) | 0}KB`);
  }
}

await buildDuo();
await buildCuts();
