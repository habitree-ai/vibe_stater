// 캐릭터 자산 플랫폼 — 원본 가이드 시트에서 개별 컷을 고화질로 분리하는 스크립트.
//
//   node scripts/build-character-assets.mjs
//
// 입력:  img/man1.png, img/sd_1.png (1536x1024 캐릭터 가이드 시트)
// 출력:  public/characters/HT-###.png   — 배경 투명 + 2x 업스케일(란초스+언샤프) 고화질 컷
//        src/data/characters.json       — 자산 레지스트리(채번·이름·그룹·크기·출처 좌표)
//        scripts/out/characters-contact.html — 검증용 라벨 콘택트시트(브라우저로 확인)
//
// 채번 규칙: HT-001부터 시트 정의 순서대로 부여. 이 스크립트는 결정적(deterministic)이라
// 재실행해도 같은 번호가 같은 컷에 부여된다. 번호 체계는 doc/17_character_platform.md 참조.

import { mkdir, rm, writeFile } from "node:fs/promises";
import sharp from "sharp";

const OUT_DIR = "public/characters";
const REGISTRY = "src/data/characters.json";
const CONTACT = "scripts/out/characters-contact.html";

// ---------------------------------------------------------------- 배경 제거
// 가장자리에서 flood fill 해 '바깥 크림색 배경'만 투명 처리한다.
// (build-about-assets.mjs와 동일 로직 — 내부 흰색(노트북 화면 등)은 보존)
async function cutout(buf) {
  const img = sharp(buf).ensureAlpha();
  const { width: w, height: h } = await img.metadata();
  const data = await img.raw().toBuffer();

  const bgLike = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mn = Math.min(r, g, b);
    const mx = Math.max(r, g, b);
    // 시트 배경은 250~254의 거의 순수한 화이트. 임계를 엄격히 잡아
    // 밝은 회색 라인·흰 몸통(내부)이 배경으로 오인되지 않게 한다.
    return mn >= 248 && mx - mn <= 7;
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
  // 경계 한 겹은 반투명 처리로 부드럽게
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

// ------------------------------------------------- 경계 슬리버 자동 제거
// 셀 경계에 걸친 옆 컷의 조각(팔·소품 일부)을 지운다.
// 규칙: 알파>0 연결 성분 중 '이미지 테두리에 닿아 있고' 면적이 최대 성분의 8% 미만이면 제거.
async function dropEdgeSlivers(buf) {
  const img = sharp(buf).ensureAlpha();
  const { width: w, height: h } = await img.metadata();
  const data = await img.raw().toBuffer();

  const label = new Int32Array(w * h).fill(-1);
  const comps = []; // {area, touches}
  for (let p0 = 0; p0 < w * h; p0++) {
    if (data[p0 * 4 + 3] === 0 || label[p0] !== -1) continue;
    const id = comps.length;
    let area = 0, touches = false;
    const stack = [p0];
    label[p0] = id;
    while (stack.length) {
      const p = stack.pop();
      area++;
      const x = p % w, y = (p / w) | 0;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) touches = true;
      for (const q of [p - 1, p + 1, p - w, p + w]) {
        if (q < 0 || q >= w * h) continue;
        const qx = q % w;
        if (Math.abs(qx - x) > 1) continue; // 좌우 랩 방지
        if (label[q] === -1 && data[q * 4 + 3] > 0) {
          label[q] = id;
          stack.push(q);
        }
      }
    }
    comps.push({ area, touches });
  }
  if (comps.length < 2) return buf;
  const maxArea = Math.max(...comps.map((c) => c.area));
  const kill = comps.map((c) => c.touches && c.area < maxArea * 0.08);
  if (!kill.some(Boolean)) return buf;
  for (let p = 0; p < w * h; p++) {
    if (label[p] !== -1 && kill[label[p]]) data[p * 4 + 3] = 0;
  }
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

// ------------------------------------------------------------ 시트 정의(밴드)
// row 형식:
//   { section, names[], y:[y0,y1], edges:[[x0,x1],...] }  — 열 경계 명시
//   { section, names[], y:[y0,y1], band:[x0,x1] }         — names 수만큼 균등 분할
//   { section, cells:[{name, rect:[x,y,w,h]}] }           — 개별 지정(히어로 등)
// group 생략 시 시트 기본 group. scale 생략 시 2.
const SHEETS = [
  {
    src: "img/man1.png",
    group: "man",
    char: "메이커",
    rows: [
      {
        section: "히어로",
        // 좌상단에 걸리는 로고/태그라인 텍스트는 cover로 덮는다(배경색 페인트).
        cells: [
          { name: "히어로 · 노트북 데스크", rect: [232, 8, 242, 292], cover: [[0, 0, 96, 150]] },
        ],
      },
      {
        section: "턴어라운드",
        y: [58, 242],
        edges: [[648, 745], [748, 840], [845, 930], [932, 1010]],
        names: ["정면", "3/4 좌", "측면", "후면"],
      },
      {
        section: "표정",
        y: [54, 134], // 캡션(y≈140~) 제외
        band: [1044, 1512],
        names: ["기본", "웃음", "생각", "놀람", "집중"],
      },
      {
        section: "표정",
        y: [162, 242],
        edges: [[1048, 1132], [1136, 1224], [1228, 1316], [1320, 1412], [1416, 1506]],
        names: ["기쁨", "고민", "피곤", "감사", "확신"],
      },
      {
        section: "상황 모션",
        y: [316, 458],
        edges: [
          [28, 192], [196, 362], [366, 534], [538, 688], [690, 832],
          [836, 972], [1008, 1160], [1170, 1314], [1318, 1512],
        ],
        // 첫 칸은 섹션 헤더 텍스트(y≈316~330)를 피해 y를 내린다.
        overrides: { 0: [28, 334, 164, 124] },
        names: [
          "독서 시간", "노트 정리", "노트북 작업", "아이디어 떠올리기", "화이트보드 기획",
          "코딩 작업", "유튜브 녹화", "커피 한 잔", "산책 · 사색",
        ],
      },
      {
        section: "미니멀 라인",
        y: [522, 602], // 캡션(y≈608~) 제외
        edges: [
          [720, 808], [810, 895], [898, 985], [988, 1078],
          [1080, 1168], [1170, 1256], [1258, 1348], [1400, 1512],
        ],
        // 프로필은 점선 원 프레임 전체가 들어오게 확장
        overrides: { 7: [1403, 512, 108, 100] },
        names: ["추천", "핵심", "생각 중", "작업 중", "독서 중", "성취", "안녕", "프로필"],
      },
      {
        section: "소품(메이커)",
        group: "prop",
        y: [516, 604],
        edges: [
          [28, 106], [110, 184], [194, 264], [282, 342],
          [358, 420], [436, 498], [508, 606], [630, 660],
        ],
        names: ["노트북", "머그컵", "책", "노트", "백팩", "카메라", "키보드", "식물"],
      },
    ],
  },
  {
    src: "img/sd_1.png",
    group: "otter",
    char: "오터",
    rows: [
      {
        section: "히어로",
        cells: [{ name: "히어로 · 책 읽기", rect: [78, 96, 214, 278] }],
      },
      {
        section: "표정",
        y: [54, 130], // 캡션(y≈136~) 제외
        edges: [
          [434, 516], [521, 601], [607, 687], [696, 775],
          [781, 861], [867, 947], [953, 1035],
        ],
        names: ["기본(행복)", "활짝 웃음", "신남", "생각 집중", "궁금함", "우와", "감동"],
      },
      {
        section: "표정",
        y: [166, 246],
        band: [432, 1038],
        names: ["의욕 충전", "자신감", "고민", "피곤", "졸림", "당황", "걱정"],
      },
      {
        section: "표정",
        y: [284, 366],
        band: [432, 1038],
        names: ["부끄러움", "설렘", "감사", "감격", "실망", "지침", "으쓱"],
      },
      {
        section: "포즈 · 각도",
        y: [54, 136], // 캡션 제외
        band: [1056, 1512],
        names: ["정면", "3/4 좌", "좌측면", "후면", "우측면", "3/4 우"],
      },
      {
        section: "포즈 · 각도",
        y: [164, 268],
        edges: [[1056, 1148], [1150, 1230], [1231, 1312], [1314, 1418], [1420, 1500]],
        names: ["책 읽기", "노트 작성", "아이디어", "발표하기", "응원"],
      },
      {
        section: "포즈 · 각도",
        y: [286, 384], // 캡션(y≈390~) 제외
        edges: [[1056, 1150], [1152, 1246], [1248, 1322], [1324, 1404], [1406, 1500]],
        names: ["걷기", "달리기", "가방 착용", "커피 한 잔", "휴식"],
      },
      {
        section: "라인 스타일",
        y: [482, 658], // 상단 라벨(y≈465~478) 제외
        band: [1058, 1512],
        names: ["풀컬러", "미니멀 라인", "모노톤", "화이트 라인"],
      },
      {
        section: "미니멀 라인",
        y: [700, 780],
        band: [15, 400],
        names: ["추천", "핵심", "생각 중", "작업 중", "독서 중"],
      },
      {
        section: "미니멀 라인",
        y: [798, 878],
        edges: [[18, 100], [104, 182], [186, 252], [254, 335]],
        names: ["인사", "파이팅", "OK", "프로필"],
      },
      {
        section: "소품(오터)",
        group: "prop",
        y: [456, 528], // 캡션(y≈534~) 제외
        edges: [
          [430, 500], [502, 564], [566, 630], [630, 664], [666, 740],
          [742, 816], [818, 882], [884, 938], [940, 1038],
        ],
        names: ["노트북", "책", "노트", "펜", "머그컵", "카메라", "백팩", "식물", "화이트보드"],
      },
      {
        section: "상황 일러스트",
        group: "scene",
        y: [552, 652],
        band: [430, 1040],
        names: ["독서 시간", "아이디어 회의", "코딩 작업", "자연 산책", "카페 휴식"],
      },
    ],
  },
];

// row 정의 → cell 목록으로 평탄화
function cellsOf(row) {
  if (row.cells) {
    return row.cells.map((c) => ({ name: c.name, rect: c.rect, cover: c.cover }));
  }
  const [y0, y1] = row.y;
  let edges = row.edges;
  if (!edges) {
    const [x0, x1] = row.band;
    const wCol = (x1 - x0) / row.names.length;
    edges = row.names.map((_, i) => [
      Math.round(x0 + i * wCol),
      Math.round(x0 + (i + 1) * wCol),
    ]);
  }
  return row.names.map((name, i) => ({
    name,
    rect: row.overrides?.[i] ?? [edges[i][0], y0, edges[i][1] - edges[i][0], y1 - y0],
  }));
}

// 확대 + 언샤프 — 선화가 흐려지지 않게 2배까지만 키운다.
function crisp(pipeline, scale, w) {
  return pipeline
    .resize({ width: Math.round(w * scale), kernel: "lanczos3" })
    .sharpen({ sigma: 0.7, m1: 0.4, m2: 2.2 });
}

async function main() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir("scripts/out", { recursive: true });

  const registry = [];
  let num = 0;

  for (const sheet of SHEETS) {
    const img = sharp(sheet.src);
    for (const row of sheet.rows) {
      for (const cell of cellsOf(row)) {
        num += 1;
        const code = `HT-${String(num).padStart(3, "0")}`;
        const [left, top, width, height] = cell.rect;

        let pipeline = img.clone().extract({ left, top, width, height });
        // cover: 셀 안에 침범한 시트 텍스트를 배경색으로 덮는다(셀 로컬 좌표).
        if (cell.cover) {
          pipeline = sharp(await pipeline.png().toBuffer()).composite(
            cell.cover.map(([cx, cy, cw, ch]) => ({
              input: {
                create: {
                  width: cw, height: ch, channels: 4,
                  background: { r: 252, g: 252, b: 252, alpha: 255 },
                },
              },
              left: cx,
              top: cy,
            }))
          );
        }
        const raw = await pipeline.png().toBuffer();
        const clean = await dropEdgeSlivers(await cutout(raw));
        const cut = await sharp(clean).trim({ threshold: 1 }).png().toBuffer();
        const meta = await sharp(cut).metadata();
        const scale = row.scale ?? 2;
        const out = await crisp(sharp(cut), scale, meta.width)
          .png({ compressionLevel: 9 })
          .toBuffer();
        const outMeta = await sharp(out).metadata();
        await writeFile(`${OUT_DIR}/${code}.png`, out);

        registry.push({
          num,
          code,
          name: cell.name,
          group: row.group ?? sheet.group,
          section: row.section,
          char: sheet.char,
          file: `/characters/${code}.png`,
          width: outMeta.width,
          height: outMeta.height,
          bytes: out.length,
          source: sheet.src,
          rect: cell.rect,
        });
        console.log(
          `✓ ${code} ${cell.name} (${row.section}) ${outMeta.width}x${outMeta.height} ${(out.length / 1024) | 0}KB`
        );
      }
    }
  }

  await writeFile(REGISTRY, JSON.stringify(registry, null, 2) + "\n");
  console.log(`\n총 ${registry.length}개 자산 → ${REGISTRY}`);

  // ---------------------------------------------------- 검증용 콘택트시트
  const groups = [...new Set(registry.map((r) => `${r.char} · ${r.section}`))];
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"/>
<style>
  body{font-family:'Malgun Gothic',sans-serif;background:#f5f6f4;margin:20px;}
  h2{font-size:16px;margin:26px 0 8px;}
  .grid{display:flex;flex-wrap:wrap;gap:10px;}
  .cell{background:#fff;border:1px solid #ddd;border-radius:8px;padding:6px;width:150px;text-align:center;}
  .thumb{height:120px;display:grid;place-items:center;background:
    repeating-conic-gradient(#e8e8e8 0 25%,#f8f8f8 0 50%) 0 0/16px 16px;border-radius:6px;}
  .thumb img{max-width:140px;max-height:116px;}
  .code{font-weight:700;font-size:12px;color:#0a7a5a;margin-top:5px;}
  .name{font-size:11px;color:#333;}
  .dim{font-size:10px;color:#999;}
</style></head><body>
${groups
  .map(
    (g) => `<h2>${g}</h2><div class="grid">${registry
      .filter((r) => `${r.char} · ${r.section}` === g)
      .map(
        (r) => `<div class="cell"><div class="thumb"><img src="../../public${r.file}"/></div>
<div class="code">${r.code}</div><div class="name">${r.name}</div><div class="dim">${r.width}×${r.height}</div></div>`
      )
      .join("")}</div>`
  )
  .join("\n")}
</body></html>`;
  await writeFile(CONTACT, html);
  console.log(`콘택트시트 → ${CONTACT}`);
}

await main();
