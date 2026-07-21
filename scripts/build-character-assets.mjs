// 캐릭터 자산 플랫폼 — 원본 가이드 시트에서 개별 컷을 고화질로 분리하는 스크립트.
//
//   node scripts/build-character-assets.mjs
//
// 입력:  img/man1.png, img/sd_1.png (1536x1024 캐릭터 가이드 시트)
// 출력:  public/characters/HT-###.png   — Real-ESRGAN 4x 초해상 → 2x 다운스케일 고화질 컷
//        (SR 실행 파일 없으면 란초스 2x 폴백)
//        src/data/characters.json       — 자산 레지스트리(채번·이름·그룹·크기·출처 좌표)
//        scripts/out/characters-contact.html — 검증용 라벨 콘택트시트(브라우저로 확인)
//
// 채번 규칙: HT-001부터 시트 정의 순서대로 부여. 이 스크립트는 결정적(deterministic)이라
// 재실행해도 같은 번호가 같은 컷에 부여된다. 번호 체계는 doc/17_character_platform.md 참조.

import { mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const OUT_DIR = "public/characters";
const REGISTRY = "src/data/characters.json";
const CONTACT = "scripts/out/characters-contact.html";

// ------------------------------------------ AI 초해상(Real-ESRGAN) 시트 준비
// 시트를 통째로 4x 초해상한 뒤 거기서 컷을 뜨면, 란초스 업스케일과는 차원이 다른
// 선명한 라인이 나온다. 실행 파일이 없으면 기존 란초스 경로로 자동 폴백.
// (실행 파일: local/tools/realesrgan/ — gitignore, README_windows.md 참조)
const SR_SCALE = 4;
const SR_DIR = "local/tools/sr";
const SR_EXE = "local/tools/realesrgan/realesrgan-ncnn-vulkan.exe";

export function ensureSrSheet(src) {
  const base = src.split("/").pop().replace(/\.png$/, "");
  const out = `${SR_DIR}/${base}_x${SR_SCALE}.png`;
  if (existsSync(out)) return out;
  if (!existsSync(SR_EXE)) return null;
  mkdirSync(SR_DIR, { recursive: true });
  console.log(`… ${src} 초해상(${SR_SCALE}x) 생성 중`);
  const r = spawnSync(SR_EXE, ["-i", src, "-o", out, "-n", "realesrgan-x4plus-anime", "-s", String(SR_SCALE)], {
    stdio: "ignore",
  });
  if (r.status !== 0 || !existsSync(out)) return null;
  return out;
}
export { SR_SCALE };

// ---------------------------------------------------------------- 배경 제거
// 가장자리에서 flood fill 해 '바깥 크림색 배경'만 투명 처리한다.
// (build-about-assets.mjs와 동일 로직 — 내부 흰색(노트북 화면 등)은 보존)
//
// 2단 플러드필:
//   1차(엄격) 거의 순백(≥248)만 — 시트의 진짜 배경.
//   2차(완화) 1차 배경에 맞닿은 곳에서만 연한 무채색(≥224)까지 확장 — 원본 시트가
//            캐릭터 발밑에 깔아 둔 드롭섀도를 걷어낸다. 이게 남으면 색이 있는 배경
//            위에 얹었을 때 '뿌연 얼룩'으로 비친다.
// 2차는 라인아트(흰 몸통 + 연회색 윤곽) 컷에서 윤곽이 끊기면 몸통까지 먹을 수 있어,
// 불투명 면적이 절반 밑으로 떨어지면 1차 결과로 되돌린다.
export async function cutout(buf) {
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
  // 드롭섀도는 #F0F0E8~#F8F8F8 언저리의 연한 무채색. 캐릭터 크림색 배(#FFF3E0 계열)는
  // 채도가 높아(mx-mn>22) 여기 걸리지 않는다.
  const shadowLike = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mn = Math.min(r, g, b);
    const mx = Math.max(r, g, b);
    return mn >= 224 && mx - mn <= 22;
  };

  const seen = new Uint8Array(w * h);
  const flood = (pred, seeds) => {
    const stack = seeds.slice();
    while (stack.length) {
      const p = stack.pop();
      if (seen[p] || !pred(p * 4)) continue;
      seen[p] = 1;
      const x = p % w, y = (p / w) | 0;
      if (x > 0) stack.push(p - 1);
      if (x < w - 1) stack.push(p + 1);
      if (y > 0) stack.push(p - w);
      if (y < h - 1) stack.push(p + w);
    }
  };

  const border = [];
  for (let x = 0; x < w; x++) border.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) border.push(y * w, y * w + w - 1);
  flood(bgLike, border);

  const strictBg = seen.reduce((n, v) => n + v, 0);
  const strictOnly = Uint8Array.from(seen);
  const seeds = [];
  for (let p = 0; p < w * h; p++) {
    if (!seen[p]) continue;
    const x = p % w, y = (p / w) | 0;
    if (x > 0) seeds.push(p - 1);
    if (x < w - 1) seeds.push(p + 1);
    if (y > 0) seeds.push(p - w);
    if (y < h - 1) seeds.push(p + w);
  }
  flood(shadowLike, seeds);

  // 안전장치: 2차가 몸통까지 먹었으면(남는 면적 < 1차의 절반) 1차 결과 사용
  const softBg = seen.reduce((n, v) => n + v, 0);
  const keptStrict = w * h - strictBg;
  if (w * h - softBg < keptStrict * 0.5) seen.set(strictOnly);

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

// ------------------------------------------------- 크롭 자동 확장(잘림 방지)
// 시트 정의 rect가 캐릭터를 살짝 물고 있으면(꼬리·귀·팔이 변에 걸림) 컷의 한쪽이
// 칼로 자른 듯 평평해진다. 각 변을 '캐릭터 몸이 그 변에서 사라질 때까지' 넓힌다.
//
// 쫓아가는 대상은 아무 잉크가 아니라 '셀 한가운데에서 이어진 한 덩어리'다. 그래서
// 캡션 글자(시트가 셀 밑에 달아 둔 라벨)나 옆 컷 조각은 아무리 변에 걸려 있어도
// 확장을 유발하지 않는다 — SHEETS의 y 범위가 캡션을 일부러 잘라낸 의도를 지킨다.
const EXPAND_MAX = 10; // 변당 최대 확장(원본 시트 px)

// 캐릭터 잉크 = 어둡거나 채도가 있는 픽셀. 흰 배경·연한 드롭섀도는 잉크가 아니다.
function isInk(d, i) {
  const r = d[i], g = d[i + 1], b = d[i + 2];
  const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
  return mn < 234 || mx - mn > 20;
}

export function autoExpand(sheet, rect, max = EXPAND_MAX) {
  const { width: W, height: H, data } = sheet;
  const [ox, oy, ow, oh] = rect;

  // 탐색 범위: 원래 rect를 max만큼 넓힌 창(시트 밖으로는 안 나감)
  const wx0 = Math.max(0, ox - max), wy0 = Math.max(0, oy - max);
  const wx1 = Math.min(W, ox + ow + max), wy1 = Math.min(H, oy + oh + max);
  const ww = wx1 - wx0, wh = wy1 - wy0;

  // 셀 안쪽 60% 구간의 잉크를 씨앗으로 캐릭터 덩어리를 채운다
  const body = new Uint8Array(ww * wh);
  const stack = [];
  const ix0 = ox + ((ow * 0.2) | 0), ix1 = ox + ow - ((ow * 0.2) | 0);
  const iy0 = oy + ((oh * 0.2) | 0), iy1 = oy + oh - ((oh * 0.2) | 0);
  for (let y = iy0; y < iy1; y++) {
    for (let x = ix0; x < ix1; x++) {
      const q = (y - wy0) * ww + (x - wx0);
      if (!body[q] && isInk(data, (y * W + x) * 4)) { body[q] = 1; stack.push(q); }
    }
  }
  while (stack.length) {
    const p = stack.pop();
    const x = p % ww, y = (p / ww) | 0;
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= ww || ny >= wh) continue;
      const q = ny * ww + nx;
      if (body[q] || !isInk(data, ((ny + wy0) * W + nx + wx0) * 4)) continue;
      body[q] = 1;
      stack.push(q);
    }
  }

  let [x, y, w, h] = rect;
  const grew = { l: 0, r: 0, t: 0, b: 0 };
  const at = (px, py) => body[(py - wy0) * ww + (px - wx0)];
  const colBody = (cx) => {
    for (let yy = y; yy < y + h; yy++) if (at(cx, yy)) return true;
    return false;
  };
  const rowBody = (ry) => {
    for (let xx = x; xx < x + w; xx++) if (at(xx, ry)) return true;
    return false;
  };
  for (let i = 0; i < max * 4; i++) {
    let moved = false;
    if (grew.l < max && x > wx0 && colBody(x)) { x--; w++; grew.l++; moved = true; }
    if (grew.r < max && x + w < wx1 && colBody(x + w - 1)) { w++; grew.r++; moved = true; }
    if (grew.t < max && y > wy0 && rowBody(y)) { y--; h++; grew.t++; moved = true; }
    if (grew.b < max && y + h < wy1 && rowBody(y + h - 1)) { h++; grew.b++; moved = true; }
    if (!moved) break;
  }
  return { rect: [x, y, w, h], grew };
}

// 확장으로 딸려 들어온 옆 컷 조각을 지운다.
// 확장 뒤에도 테두리에 닿아 있는 '주력이 아닌' 성분 = 프레임 밖으로 이어지는 남의 몸.
// 반짝임·하트·전구처럼 컷 안에 온전히 들어 있는 장식은 테두리에 닿지 않아 살아남는다.
export async function dropIntruders(buf) {
  const img = sharp(buf).ensureAlpha();
  const { width: w, height: h } = await img.metadata();
  const data = await img.raw().toBuffer();

  const label = new Int32Array(w * h).fill(-1);
  const comps = [];
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
        if (Math.abs((q % w) - x) > 1) continue; // 좌우 랩 방지
        if (label[q] === -1 && data[q * 4 + 3] > 0) { label[q] = id; stack.push(q); }
      }
    }
    comps.push({ area, touches });
  }
  if (comps.length < 2) return buf;
  const maxArea = Math.max(...comps.map((c) => c.area));
  const kill = comps.map((c) => c.area !== maxArea && c.touches);
  if (!kill.some(Boolean)) return buf;
  for (let p = 0; p < w * h; p++) if (label[p] !== -1 && kill[label[p]]) data[p * 4 + 3] = 0;
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

// ------------------------------------------------- 경계 슬리버 자동 제거
// 셀 경계에 걸친 옆 컷의 조각(팔·소품 일부)을 지운다.
// 규칙 1: '이미지 테두리에 닿아 있고' 면적이 최대 성분의 8% 미만인 성분 제거.
// 규칙 2: 가장자리 8% 구간에 있는 '얇은 세로줄'(폭 ≤2%·높이 ≥50%) 제거
//         — 시트 셀 구분선이 크롭 안쪽으로 1~2px 들어온 경우(테두리 미접촉이라 규칙 1로 안 잡힘).
export async function dropEdgeSlivers(buf) {
  const img = sharp(buf).ensureAlpha();
  const { width: w, height: h } = await img.metadata();
  const data = await img.raw().toBuffer();

  const label = new Int32Array(w * h).fill(-1);
  const comps = []; // {area, touches, bbox}
  for (let p0 = 0; p0 < w * h; p0++) {
    if (data[p0 * 4 + 3] === 0 || label[p0] !== -1) continue;
    const id = comps.length;
    let area = 0, touches = false;
    let minx = w, maxx = 0, miny = h, maxy = 0;
    const stack = [p0];
    label[p0] = id;
    while (stack.length) {
      const p = stack.pop();
      area++;
      const x = p % w, y = (p / w) | 0;
      if (x < minx) minx = x;
      if (x > maxx) maxx = x;
      if (y < miny) miny = y;
      if (y > maxy) maxy = y;
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
    comps.push({ area, touches, minx, maxx, miny, maxy });
  }
  if (comps.length < 2) return buf;
  const maxArea = Math.max(...comps.map((c) => c.area));
  const kill = comps.map((c) => {
    if (c.area === maxArea) return false;
    if (c.touches && c.area < maxArea * 0.08) return true; // 규칙 1
    const bw = c.maxx - c.minx + 1;
    const bh = c.maxy - c.miny + 1;
    // 규칙 2a: 좌우 20% 구간의 얇은 세로줄(셀 테두리 유입)
    if ((c.minx <= w * 0.2 || c.maxx >= w * 0.8) && bw <= Math.max(4, w * 0.025) && bh >= h * 0.5) return true;
    // 규칙 2b: 상하 20% 구간의 얇은 가로줄
    if ((c.miny <= h * 0.2 || c.maxy >= h * 0.8) && bh <= Math.max(4, h * 0.025) && bw >= w * 0.5) return true;
    // 규칙 3: 속이 빈 사각 프레임/모서리(셀 테두리 상자) — bbox는 크고 면적은 얇은 획뿐
    if (bw >= w * 0.6 && bh >= h * 0.6 && c.area <= bw * bh * 0.06) return true;
    return false;
  });
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
export const SHEETS = [
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
          [28, 106], [110, 184], [194, 264], [282, 348],
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
        edges: [[18, 100], [104, 176], [190, 252], [254, 335]],
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
export function cellsOf(row) {
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

// 확대 + 언샤프 — 선화가 흐려지지 않게 2배까지만 키운다. (SR 미가용 시 폴백용)
export function crisp(pipeline, scale, w) {
  return pipeline
    .resize({ width: Math.round(w * scale), kernel: "lanczos3" })
    .sharpen({ sigma: 0.7, m1: 0.4, m2: 2.2 });
}

// 시트에서 셀 하나를 잘라 배경 제거·슬리버 정리·트림까지 마친 컷 버퍼를 만든다.
// mult: 좌표 배율(원본 시트=1, 4x 초해상 시트=4). cover도 같이 배율 적용.
// rect/grew는 autoExpand가 넓힌 좌표(원본 시트 기준). cover는 원래 rect 기준이라
// 넓어진 만큼 밀어 준다.
export async function extractCut(img, cell, mult = 1, rect = cell.rect, grew = { l: 0, t: 0 }) {
  const [left, top, width, height] = rect.map((v) => v * mult);
  let pipeline = img.clone().extract({ left, top, width, height });
  if (cell.cover) {
    pipeline = sharp(await pipeline.png().toBuffer()).composite(
      cell.cover.map(([cx, cy, cw, ch]) => ({
        input: {
          create: {
            width: cw * mult, height: ch * mult, channels: 4,
            background: { r: 252, g: 252, b: 252, alpha: 255 },
          },
        },
        left: (cx + grew.l) * mult,
        top: (cy + grew.t) * mult,
      }))
    );
  }
  const raw = await pipeline.png().toBuffer();
  const clean = await dropEdgeSlivers(await dropIntruders(await cutout(raw)));
  return sharp(clean).trim({ threshold: 1 }).png().toBuffer();
}

// autoExpand용 원본 시트 픽셀(1x) 로더
async function loadSheetPixels(src) {
  const img = sharp(src).ensureAlpha();
  const { width, height } = await img.metadata();
  return { width, height, data: await img.raw().toBuffer() };
}

async function main() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir("scripts/out", { recursive: true });

  const registry = [];
  let num = 0;

  for (const sheet of SHEETS) {
    // AI 초해상 시트 우선(품질 ↑↑) — 없으면 원본 시트 + 란초스 폴백
    const srPath = ensureSrSheet(sheet.src);
    const img = sharp(sheet.src);
    const srImg = srPath ? sharp(srPath) : null;
    if (!srPath) console.warn(`! ${sheet.src}: 초해상 시트 없음 → 란초스 폴백(품질 낮음)`);
    const pixels = await loadSheetPixels(sheet.src);

    for (const row of sheet.rows) {
      for (const cell of cellsOf(row)) {
        num += 1;
        const code = `HT-${String(num).padStart(3, "0")}`;
        // 변에 걸린 캐릭터가 있으면 그만큼 크롭을 넓혀 잘림을 없앤다
        const { rect, grew } = autoExpand(pixels, cell.rect);

        let out;
        if (srImg) {
          // 4x 초해상 시트에서 컷 → 절반 다운스케일 = 기존과 같은 2x 크기, 라인은 SR 품질
          const cut4 = await extractCut(srImg, cell, SR_SCALE, rect, grew);
          const m4 = await sharp(cut4).metadata();
          out = await sharp(cut4)
            .resize({ width: Math.round(m4.width / 2), kernel: "lanczos3" })
            .png({ compressionLevel: 9 })
            .toBuffer();
        } else {
          const cut = await extractCut(img, cell, 1, rect, grew);
          const meta = await sharp(cut).metadata();
          out = await crisp(sharp(cut), row.scale ?? 2, meta.width)
            .png({ compressionLevel: 9 })
            .toBuffer();
        }
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

// 직접 실행 시에만 빌드 수행(다른 스크립트에서 import 가능하도록 가드)
import { pathToFileURL } from "node:url";
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
