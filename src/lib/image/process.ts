export type ProcessedImageResult = Readonly<{
  blob: Blob;
  originalFileSize: number;
  compressedFileSize: number;
  mimeType: string;
  exifApplied: boolean;
}>;

export type ProcessImageMessage = Readonly<{
  id: string;
  buffer: ArrayBuffer;
  mimeType: string;
  maxEdge: number;
  quality: number;
}>;

export type ProcessImageResponse = Readonly<{
  id: string;
  ok: true;
  buffer: ArrayBuffer;
  mimeType: string;
  originalFileSize: number;
  compressedFileSize: number;
  exifApplied: boolean;
} | {
  id: string;
  ok: false;
  error: string;
}>;

let worker: Worker | null = null;

function getWorker(): Worker | null {
  if (typeof Worker === "undefined") return null;
  if (!worker) {
    try {
      worker = new Worker(
        new URL("../../workers/image-processor.ts", import.meta.url),
        { type: "module" },
      );
    } catch {
      return null;
    }
  }
  return worker;
}

/** Fallback on main thread when Worker unavailable (degraded, not module scope throw). */
export async function processImageOnMainThread(
  file: File,
  maxEdge = 1600,
  quality = 0.82,
): Promise<ProcessedImageResult> {
  const { readExifOrientation, orientationTransform } = await import("./exif");
  const buffer = await file.arrayBuffer();
  const orientation = readExifOrientation(buffer);
  const transform = orientationTransform(orientation);
  const bitmap = await createImageBitmap(file);
  let w = bitmap.width;
  let h = bitmap.height;
  const long = Math.max(w, h);
  if (long > maxEdge) {
    const scale = maxEdge / long;
    w = Math.round(w * scale);
    h = Math.round(h * scale);
  }
  if (transform.swapDimensions) {
    [w, h] = [h, w];
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate((transform.rotate * Math.PI) / 180);
  ctx.scale(transform.scaleX, transform.scaleY);
  ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2, bitmap.width, bitmap.height);
  ctx.restore();
  bitmap.close();

  const tryWebp = canvas.toBlob ? await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", quality);
  }) : null;
  const blob =
    tryWebp ??
    (await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Encode failed"))), "image/jpeg", quality);
    }));

  return {
    blob,
    originalFileSize: file.size,
    compressedFileSize: blob.size,
    mimeType: blob.type || "image/jpeg",
    exifApplied: orientation !== 1,
  };
}

export async function processImageFile(
  file: File,
  maxEdge = 1600,
  quality = 0.82,
): Promise<ProcessedImageResult> {
  const w = getWorker();
  if (!w) {
    return processImageOnMainThread(file, maxEdge, quality);
  }

  const id = crypto.randomUUID();
  const buffer = await file.arrayBuffer();

  return new Promise((resolve, reject) => {
    const onMessage = (ev: MessageEvent<ProcessImageResponse>) => {
      if (ev.data.id !== id) return;
      w.removeEventListener("message", onMessage);
      if (ev.data.ok) {
        resolve({
          blob: new Blob([ev.data.buffer], { type: ev.data.mimeType }),
          originalFileSize: ev.data.originalFileSize,
          compressedFileSize: ev.data.compressedFileSize,
          mimeType: ev.data.mimeType,
          exifApplied: ev.data.exifApplied,
        });
      } else {
        reject(new Error(ev.data.error));
      }
    };
    w.addEventListener("message", onMessage);
    w.postMessage(
      { id, buffer, mimeType: file.type, maxEdge, quality } satisfies ProcessImageMessage,
      [buffer],
    );
  });
}
