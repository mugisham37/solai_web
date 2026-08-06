/**
 * QR encoder — byte mode, error correction level M, versions 1-6.
 *
 * Level M tolerates roughly 15% damage, which is the right trade for a code that
 * will be photocopied, taped to a wall and rained on. Level L is too fragile for
 * print; level H makes the code denser than it needs to be at shop-URL lengths.
 *
 * Versions 1-6 encode up to 108 bytes, comfortably more than any `solai.shop/<slug>`
 * URL. `qrMatrix` throws above that rather than silently producing an unscannable code.
 */

type EccConfig = { data: number; blocks: number; ec: number };

const ECC: Record<number, EccConfig> = {
  1: { data: 16, blocks: 1, ec: 10 },
  2: { data: 28, blocks: 1, ec: 16 },
  3: { data: 44, blocks: 1, ec: 26 },
  4: { data: 64, blocks: 2, ec: 18 },
  5: { data: 86, blocks: 2, ec: 24 },
  6: { data: 108, blocks: 4, ec: 16 },
};

const ALIGN: Record<number, readonly number[]> = {
  1: [],
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
};

/** Modules of white space around the code. Below four, scanners fail to lock on. */
export const QUIET_ZONE = 4;

const MAX_VERSION = 6;

function utf8Bytes(text: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i += 1) {
    const c = text.charCodeAt(i);
    if (c < 0x80) {
      bytes.push(c);
    } else if (c < 0x800) {
      bytes.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    } else {
      bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
  }
  return bytes;
}

/* ---- GF(256) arithmetic for Reed-Solomon ---- */

const EXP: number[] = new Array<number>(512).fill(0);
const LOG: number[] = new Array<number>(256).fill(0);

(() => {
  let x = 1;
  for (let i = 0; i < 255; i += 1) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i += 1) EXP[i] = EXP[i - 255] ?? 0;
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[(LOG[a] ?? 0) + (LOG[b] ?? 0)] ?? 0;
}

function generatorPoly(degree: number): number[] {
  let g = [1];
  for (let d = 0; d < degree; d += 1) {
    const next = new Array<number>(g.length + 1).fill(0);
    for (let m = 0; m < g.length; m += 1) {
      const coeff = g[m] ?? 0;
      next[m] = (next[m] ?? 0) ^ coeff;
      next[m + 1] = (next[m + 1] ?? 0) ^ gfMul(coeff, EXP[d] ?? 0);
    }
    g = next;
  }
  return g;
}

function reedSolomon(block: readonly number[], ecLength: number): number[] {
  const g = generatorPoly(ecLength);
  const res = [...block, ...new Array<number>(ecLength).fill(0)];
  for (let m = 0; m < block.length; m += 1) {
    const factor = res[m] ?? 0;
    if (factor === 0) continue;
    for (let t = 0; t < g.length; t += 1) {
      res[m + t] = (res[m + t] ?? 0) ^ gfMul(g[t] ?? 0, factor);
    }
  }
  return res.slice(block.length);
}

/* ---- mask evaluation ---- */

function maskAt(mask: number, r: number, c: number): boolean {
  switch (mask) {
    case 0:
      return (r + c) % 2 === 0;
    case 1:
      return r % 2 === 0;
    case 2:
      return c % 3 === 0;
    case 3:
      return (r + c) % 3 === 0;
    case 4:
      return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
    case 5:
      return ((r * c) % 2) + ((r * c) % 3) === 0;
    case 6:
      return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
    default:
      return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
  }
}

const FINDER_PATTERN_A = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
const FINDER_PATTERN_B = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];

function matchesPattern(run: readonly number[], pattern: readonly number[]): boolean {
  for (let i = 0; i < pattern.length; i += 1) {
    if (run[i] !== pattern[i]) return false;
  }
  return true;
}

function penalty(grid: readonly (readonly number[])[], size: number): number {
  let score = 0;

  const scoreRun = (run: number) => (run >= 5 ? 3 + (run - 5) : 0);

  for (let r = 0; r < size; r += 1) {
    let run = 1;
    for (let c = 1; c < size; c += 1) {
      if (grid[r]?.[c] === grid[r]?.[c - 1]) run += 1;
      else {
        score += scoreRun(run);
        run = 1;
      }
    }
    score += scoreRun(run);
  }

  for (let c = 0; c < size; c += 1) {
    let run = 1;
    for (let r = 1; r < size; r += 1) {
      if (grid[r]?.[c] === grid[r - 1]?.[c]) run += 1;
      else {
        score += scoreRun(run);
        run = 1;
      }
    }
    score += scoreRun(run);
  }

  for (let r = 0; r < size - 1; r += 1) {
    for (let c = 0; c < size - 1; c += 1) {
      const a = grid[r]?.[c];
      if (a === grid[r]?.[c + 1] && a === grid[r + 1]?.[c] && a === grid[r + 1]?.[c + 1]) {
        score += 3;
      }
    }
  }

  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c <= size - 11; c += 1) {
      const seg: number[] = [];
      for (let i = 0; i < 11; i += 1) seg.push(grid[r]?.[c + i] ?? 0);
      if (matchesPattern(seg, FINDER_PATTERN_A) || matchesPattern(seg, FINDER_PATTERN_B)) {
        score += 40;
      }
    }
  }

  for (let c = 0; c < size; c += 1) {
    for (let r = 0; r <= size - 11; r += 1) {
      const seg: number[] = [];
      for (let i = 0; i < 11; i += 1) seg.push(grid[r + i]?.[c] ?? 0);
      if (matchesPattern(seg, FINDER_PATTERN_A) || matchesPattern(seg, FINDER_PATTERN_B)) {
        score += 40;
      }
    }
  }

  let dark = 0;
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) dark += grid[r]?.[c] ?? 0;
  }
  const pct = (dark * 100) / (size * size);
  score += Math.floor(Math.abs(pct - 50) / 5) * 10;

  return score;
}

/** Format information bits for EC level M (0b00) with the chosen mask. */
function formatBits(mask: number): number {
  const fmt = (0 << 3) | mask;
  let d = fmt << 10;
  const gen = 0x537;
  for (let i = 4; i >= 0; i -= 1) {
    if (d & (1 << (i + 10))) d ^= gen << i;
  }
  return ((fmt << 10) | d) ^ 0x5412;
}

/**
 * Encode `text` as a QR module matrix. `true` is a dark module.
 * Throws when the payload exceeds version 6 capacity.
 */
export function qrMatrix(text: string): boolean[][] {
  const bytes = utf8Bytes(text);

  let version = 0;
  for (let v = 1; v <= MAX_VERSION; v += 1) {
    const cfg = ECC[v];
    if (cfg && bytes.length + 2 <= cfg.data) {
      version = v;
      break;
    }
  }
  const cfg = ECC[version];
  if (!version || !cfg) {
    throw new Error(`QR payload of ${bytes.length} bytes exceeds version ${MAX_VERSION} capacity`);
  }

  const size = 17 + 4 * version;

  /* ---- bit stream ---- */
  const bits: number[] = [];
  const put = (value: number, length: number) => {
    for (let b = length - 1; b >= 0; b -= 1) bits.push((value >> b) & 1);
  };

  put(4, 4); // byte mode
  put(bytes.length, 8); // character count indicator, versions 1-9
  for (const byte of bytes) put(byte, 8);

  const capacity = cfg.data * 8;
  for (let i = 0; i < 4 && bits.length < capacity; i += 1) bits.push(0);
  while (bits.length % 8) bits.push(0);
  const pads = [0xec, 0x11];
  let padIndex = 0;
  while (bits.length < capacity) {
    put(pads[padIndex % 2] ?? 0, 8);
    padIndex += 1;
  }

  const dataCodewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j += 1) byte = (byte << 1) | (bits[i + j] ?? 0);
    dataCodewords.push(byte);
  }

  /* ---- error correction blocks, interleaved ---- */
  const perBlock = cfg.data / cfg.blocks;
  const dataBlocks: number[][] = [];
  const ecBlocks: number[][] = [];
  for (let i = 0; i < cfg.blocks; i += 1) {
    const block = dataCodewords.slice(i * perBlock, (i + 1) * perBlock);
    dataBlocks.push(block);
    ecBlocks.push(reedSolomon(block, cfg.ec));
  }

  const codewords: number[] = [];
  for (let i = 0; i < perBlock; i += 1) {
    for (let b = 0; b < cfg.blocks; b += 1) codewords.push(dataBlocks[b]?.[i] ?? 0);
  }
  for (let i = 0; i < cfg.ec; i += 1) {
    for (let b = 0; b < cfg.blocks; b += 1) codewords.push(ecBlocks[b]?.[i] ?? 0);
  }

  /* ---- function patterns ---- */
  const modules: number[][] = [];
  const reserved: number[][] = [];
  for (let i = 0; i < size; i += 1) {
    modules.push(new Array<number>(size).fill(0));
    reserved.push(new Array<number>(size).fill(0));
  }

  const setFunction = (r: number, c: number, on: boolean) => {
    const row = modules[r];
    const flags = reserved[r];
    if (!row || !flags) return;
    row[c] = on ? 1 : 0;
    flags[c] = 1;
  };

  const finder = (r: number, c: number) => {
    for (let dr = -1; dr <= 7; dr += 1) {
      for (let dc = -1; dc <= 7; dc += 1) {
        const rr = r + dr;
        const cc = c + dc;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        const inRing =
          (dr >= 0 && dr <= 6 && (dc === 0 || dc === 6)) ||
          (dc >= 0 && dc <= 6 && (dr === 0 || dr === 6));
        const inCore = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        setFunction(rr, cc, inRing || inCore);
      }
    }
  };

  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);

  for (let i = 8; i < size - 8; i += 1) {
    setFunction(6, i, i % 2 === 0);
    setFunction(i, 6, i % 2 === 0);
  }

  const alignments = ALIGN[version] ?? [];
  for (const ar of alignments) {
    for (const ac of alignments) {
      const nearFinder =
        (ar <= 7 && ac <= 7) || (ar <= 7 && ac >= size - 8) || (ar >= size - 8 && ac <= 7);
      if (nearFinder) continue;
      for (let dr = -2; dr <= 2; dr += 1) {
        for (let dc = -2; dc <= 2; dc += 1) {
          setFunction(ar + dr, ac + dc, Math.max(Math.abs(dr), Math.abs(dc)) !== 1);
        }
      }
    }
  }

  setFunction(size - 8, 8, true); // the always-dark module

  for (let i = 0; i < 9; i += 1) {
    const rowEight = reserved[8];
    const rowI = reserved[i];
    if (rowEight && !rowEight[i]) rowEight[i] = 1;
    if (rowI && !rowI[8]) rowI[8] = 1;
  }
  for (let i = 0; i < 8; i += 1) {
    const rowEight = reserved[8];
    const rowTail = reserved[size - 1 - i];
    if (rowEight) rowEight[size - 1 - i] = 1;
    if (rowTail) rowTail[8] = 1;
  }

  /* ---- place data in the zigzag ---- */
  const totalBits = codewords.length * 8;
  const dataBit = (n: number) => (n < totalBits ? ((codewords[n >> 3] ?? 0) >> (7 - (n & 7))) & 1 : 0);

  let bitIndex = 0;
  let upward = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col -= 1;
    for (let t = 0; t < size; t += 1) {
      const row = upward ? size - 1 - t : t;
      for (let s = 0; s < 2; s += 1) {
        const c = col - s;
        if (reserved[row]?.[c]) continue;
        const target = modules[row];
        if (!target) continue;
        target[c] = dataBit(bitIndex);
        bitIndex += 1;
      }
    }
    upward = !upward;
  }

  /* ---- choose the mask with the lowest penalty ---- */
  const placeFormat = (grid: number[][], mask: number) => {
    const f = formatBits(mask);
    for (let i = 0; i < 15; i += 1) {
      const bit = (f >> i) & 1;
      if (i < 6) {
        const row = grid[i];
        if (row) row[8] = bit;
      } else if (i === 6) {
        const row = grid[7];
        if (row) row[8] = bit;
      } else if (i === 7) {
        const row = grid[8];
        if (row) row[8] = bit;
      } else if (i === 8) {
        const row = grid[8];
        if (row) row[7] = bit;
      } else {
        const row = grid[8];
        if (row) row[14 - i] = bit;
      }

      if (i < 8) {
        const row = grid[8];
        if (row) row[size - 1 - i] = bit;
      } else {
        const row = grid[size - 15 + i];
        if (row) row[8] = bit;
      }
    }
    const darkRow = grid[size - 8];
    if (darkRow) darkRow[8] = 1;
  };

  let best: number[][] | null = null;
  let bestScore = Infinity;

  for (let mask = 0; mask < 8; mask += 1) {
    const candidate: number[][] = modules.map((row) => [...row]);
    for (let r = 0; r < size; r += 1) {
      for (let c = 0; c < size; c += 1) {
        if (!reserved[r]?.[c] && maskAt(mask, r, c)) {
          const row = candidate[r];
          if (row) row[c] = (row[c] ?? 0) ^ 1;
        }
      }
    }
    placeFormat(candidate, mask);
    const score = penalty(candidate, size);
    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  const chosen = best ?? modules;
  return chosen.map((row) => row.map((cell) => cell === 1));
}

/** Ink token `#0b2322`. Hard-coded because a QR is not a themeable surface. */
export const QR_DARK = "#0B2322";
/** Pure white, not the paper token — scanners need maximum contrast. */
export const QR_LIGHT = "#FFFFFF";

/**
 * Render `url` as a standalone SVG string, including the quiet zone.
 * The viewBox is in module units, so the caller sizes it with CSS.
 */
export function qrSvgString(url: string, dark: string = QR_DARK, light: string = QR_LIGHT): string {
  const matrix = qrMatrix(url);
  const n = matrix.length;
  const size = n + QUIET_ZONE * 2;

  let path = "";
  for (let r = 0; r < n; r += 1) {
    const row = matrix[r];
    if (!row) continue;
    for (let c = 0; c < n; c += 1) {
      if (row[c]) path += `M${c + QUIET_ZONE} ${r + QUIET_ZONE}h1v1h-1z`;
    }
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">` +
    `<rect width="${size}" height="${size}" fill="${light}"/>` +
    `<path d="${path}" fill="${dark}"/>` +
    `</svg>`
  );
}

/**
 * Paint a QR straight onto a canvas by iterating the module matrix.
 *
 * Deliberately avoids round-tripping an SVG through an `Image`: that is slower and
 * fails outright under a strict `img-src` content security policy.
 */
export function drawQrOnCanvas(
  ctx: CanvasRenderingContext2D,
  url: string,
  x: number,
  y: number,
  side: number,
  dark: string = QR_DARK,
  light: string = QR_LIGHT,
): void {
  const matrix = qrMatrix(url);
  const n = matrix.length;
  const total = n + QUIET_ZONE * 2;
  const unit = side / total;

  ctx.fillStyle = light;
  ctx.fillRect(x, y, side, side);
  ctx.fillStyle = dark;

  for (let r = 0; r < n; r += 1) {
    const row = matrix[r];
    if (!row) continue;
    for (let c = 0; c < n; c += 1) {
      if (!row[c]) continue;
      ctx.fillRect(
        x + (c + QUIET_ZONE) * unit,
        y + (r + QUIET_ZONE) * unit,
        Math.ceil(unit),
        Math.ceil(unit),
      );
    }
  }
}

/** Print-shop resolution for the downloadable PNG. */
export const QR_PNG_SIZE = 1200;

/**
 * Render the QR to a PNG blob at print resolution.
 * Smoothing is disabled so module edges stay hard at any scale.
 */
export async function qrPngBlob(url: string, size: number = QR_PNG_SIZE): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.imageSmoothingEnabled = false;
  drawQrOnCanvas(ctx, url, 0, 0, size);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas PNG export failed"));
    }, "image/png");
  });
}
