import { BRACELET_PALETTES } from "@/data/bracelet-palettes";
import { drawQrOnCanvas } from "@/lib/qr";

/**
 * The two shareable images, drawn on the seller's own device.
 *
 * Rendering these server-side would spend the seller's data on something they
 * did not agree to spend it on, and would put a round-trip in front of the one
 * action most likely to produce a first sale.
 *
 * Every coordinate below is authored at the final export size and the canvas is
 * scaled with a transform, so the small on-screen preview and the full-size
 * download come out of exactly one function. Two renderers would drift.
 */

export const STORY_WIDTH = 1080;
export const STORY_HEIGHT = 1920;
export const SQUARE_SIZE = 1080;
export const PACK_COUNT = 4;

/** How long to wait for webfonts before drawing anyway. */
const FONT_TIMEOUT_MS = 2000;

const PAPER = "#FFFDFB";
const CREAM = "#F2EDE7";
const CREAM_SOFT = "rgba(242,237,231,.72)";
const SUN = "#FF7F5C";
const DEEP_TOP = "#065C5A";
const DEEP_BOTTOM = "#012E2D";
const QR_DARK_ON_DEEP = "#012E2D";

export type StoryRenderData = Readonly<{
  shopName: string;
  productTitle: string;
  price: string;
  /** Display form of the link, drawn under "Scan to buy". */
  linkText: string;
  /** Absolute URL; the only string the QR encodes. */
  shopUrl: string;
  /** One line covering mobile money and the protection promise. */
  paymentNote: string;
  scanLabel: string;
}>;

/**
 * Canvas does not wait for webfonts. Drawing before they load silently falls
 * back to a system font, and the seller only finds out once the image is posted.
 *
 * The timeout matters as much as the wait: a font that never resolves must not
 * be able to block a download.
 */
export async function waitForFonts(timeoutMs: number = FONT_TIMEOUT_MS): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return;
  try {
    await Promise.race([
      document.fonts.ready,
      new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
    ]);
  } catch {
    // A font failure is never a reason to withhold the image.
  }
}

function displayFont(weight: number, size: number): string {
  return `${weight} ${size}px Bricolage, Figtree, sans-serif`;
}

function bodyFont(weight: number, size: number): string {
  return `${weight} ${size}px Figtree, sans-serif`;
}

/**
 * Break text onto at most `maxLines` lines, measuring against the live canvas
 * context so a long Kinyarwanda product name wraps instead of running off the
 * edge of the image.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
      continue;
    }
    lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) break;
  }

  if (current && lines.length < maxLines) lines.push(current);
  return lines.slice(0, maxLines);
}

/**
 * The product scene. Drawn rather than photographed so the pack always has four
 * distinct images even before the seller has four real photos.
 */
function drawBracelet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  paletteIndex: number,
  beads: number,
): void {
  const palette = BRACELET_PALETTES[paletteIndex % BRACELET_PALETTES.length];
  if (!palette) return;

  ctx.fillStyle = palette.bg;
  ctx.fillRect(x, y, size, size);

  const cx = x + size / 2;
  const cy = y + size / 2;
  const ring = size * 0.27;
  const beadRadius = size * 0.062;

  ctx.strokeStyle = "rgba(255,255,255,.22)";
  ctx.lineWidth = Math.max(1, size * 0.008);
  ctx.beginPath();
  ctx.arc(cx, cy, ring, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < beads; i += 1) {
    const angle = (i / beads) * Math.PI * 2 - Math.PI / 2;
    const bx = cx + Math.cos(angle) * ring;
    const by = cy + Math.sin(angle) * ring;
    const gradient = ctx.createRadialGradient(
      bx - beadRadius * 0.3,
      by - beadRadius * 0.35,
      beadRadius * 0.1,
      bx,
      by,
      beadRadius,
    );
    gradient.addColorStop(0, palette.light);
    gradient.addColorStop(1, palette.dark);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(bx, by, beadRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * The status picture, 1080x1920.
 *
 * One image that works as a WhatsApp status, an Instagram story and a TikTok
 * background, and whose QR survives being screenshotted and re-shared.
 *
 * `width`/`height` set the output size; the drawing itself is always authored
 * at 1080x1920 and scaled to fit.
 */
export function renderStory(
  canvas: HTMLCanvasElement,
  data: StoryRenderData,
  width: number = STORY_WIDTH,
  height: number = STORY_HEIGHT,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = width;
  canvas.height = height;

  const scale = width / STORY_WIDTH;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

  const backdrop = ctx.createLinearGradient(0, 0, STORY_WIDTH, STORY_HEIGHT);
  backdrop.addColorStop(0, DEEP_TOP);
  backdrop.addColorStop(1, DEEP_BOTTOM);
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = CREAM;
  ctx.font = displayFont(800, 44);
  ctx.fillText(data.shopName.toUpperCase(), 90, 190);

  ctx.fillStyle = SUN;
  ctx.fillRect(90, 214, 120, 8);

  drawBracelet(ctx, 90, 300, 900, 0, 16);

  ctx.fillStyle = CREAM;
  ctx.font = displayFont(800, 76);
  const titleLines = wrapText(ctx, data.productTitle.toUpperCase(), 900, 2);
  titleLines.forEach((line, index) => {
    ctx.fillText(line, 90, 1330 + index * 82);
  });

  ctx.fillStyle = SUN;
  ctx.font = displayFont(800, 92);
  ctx.fillText(data.price, 90, 1540);

  ctx.fillStyle = CREAM_SOFT;
  ctx.font = bodyFont(500, 40);
  const [noteLine] = wrapText(ctx, data.paymentNote, 900, 1);
  ctx.fillText(noteLine ?? data.paymentNote, 90, 1610);

  // White quiet zone against the deep background; contrast is what makes it scan.
  drawQrOnCanvas(ctx, data.shopUrl, 90, 1660, 200, QR_DARK_ON_DEEP, PAPER);

  ctx.fillStyle = CREAM;
  ctx.font = displayFont(800, 46);
  ctx.fillText(data.scanLabel.toUpperCase(), 330, 1740);

  ctx.fillStyle = CREAM_SOFT;
  ctx.font = bodyFont(600, 36);
  ctx.fillText(data.linkText, 330, 1795);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/**
 * One image from the pack, 1080x1080.
 *
 * The bar along the bottom is deliberately modest: enough that a reposted image
 * still leads somewhere, not so much that nobody wants to repost it.
 */
export function renderSquare(
  canvas: HTMLCanvasElement,
  data: StoryRenderData,
  index: number,
  size: number = SQUARE_SIZE,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = size;
  canvas.height = size;

  const scale = size / SQUARE_SIZE;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, SQUARE_SIZE, SQUARE_SIZE);

  drawBracelet(ctx, 0, 0, SQUARE_SIZE, index, 12 + index);

  ctx.fillStyle = "rgba(1,46,45,.72)";
  ctx.fillRect(0, 960, SQUARE_SIZE, 120);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = CREAM;
  ctx.font = displayFont(800, 40);
  ctx.fillText(data.shopName.toUpperCase(), 44, 1012);

  ctx.fillStyle = CREAM_SOFT;
  ctx.font = bodyFont(500, 32);
  ctx.fillText(`${data.linkText} · ${data.price}`, 44, 1054);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/** Render off-screen and hand back a PNG blob, ready to save or share. */
async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas PNG export failed"));
    }, "image/png");
  });
}

export async function storyBlob(data: StoryRenderData): Promise<Blob> {
  await waitForFonts();
  const canvas = document.createElement("canvas");
  renderStory(canvas, data);
  return canvasToBlob(canvas);
}

export async function squareBlob(data: StoryRenderData, index: number): Promise<Blob> {
  await waitForFonts();
  const canvas = document.createElement("canvas");
  renderSquare(canvas, data, index);
  return canvasToBlob(canvas);
}

/** All four pack images. Fonts are awaited once rather than per image. */
export async function packBlobs(data: StoryRenderData): Promise<Blob[]> {
  await waitForFonts();
  const blobs: Blob[] = [];
  for (let i = 0; i < PACK_COUNT; i += 1) {
    const canvas = document.createElement("canvas");
    renderSquare(canvas, data, i);
    blobs.push(await canvasToBlob(canvas));
  }
  return blobs;
}

export function blobToFile(blob: Blob, filename: string): File {
  return new File([blob], filename, { type: "image/png" });
}

/**
 * Save a blob to the seller's downloads.
 *
 * The object URL is revoked on a delay rather than immediately: revoking it in
 * the same tick cancels the download on several Android browsers.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(href), 4000);
}

/** Spacing between saves; browsers block a burst of same-tick downloads. */
export const PACK_DOWNLOAD_STAGGER_MS = 260;

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
