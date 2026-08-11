import { readExifOrientation, orientationTransform } from "../lib/image/exif";

export type WorkerProcessInput = {
  id: string;
  buffer: ArrayBuffer;
  mimeType: string;
  maxEdge: number;
  quality: number;
};

self.onmessage = async (ev: MessageEvent<WorkerProcessInput>) => {
  const { id, buffer, maxEdge, quality } = ev.data;
  try {
    const orientation = readExifOrientation(buffer);
    const transform = orientationTransform(orientation);
    const blob = new Blob([buffer], { type: ev.data.mimeType || "image/jpeg" });
    const bitmap = await createImageBitmap(blob);
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

    let outBlob: Blob;
    let mimeType = "image/webp";

    if (typeof OffscreenCanvas !== "undefined") {
      const canvas = new OffscreenCanvas(w, h);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No 2d context");
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate((transform.rotate * Math.PI) / 180);
      ctx.scale(transform.scaleX, transform.scaleY);
      ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
      ctx.restore();
      bitmap.close();
      outBlob = (await canvas.convertToBlob({ type: "image/webp", quality })) as Blob;
      if (!outBlob.type.includes("webp")) {
        outBlob = (await canvas.convertToBlob({ type: "image/jpeg", quality })) as Blob;
        mimeType = "image/jpeg";
      }
    } else {
      bitmap.close();
      throw new Error("OffscreenCanvas unavailable");
    }

    const outBuffer = await outBlob.arrayBuffer();
    self.postMessage(
      {
        id,
        ok: true,
        buffer: outBuffer,
        mimeType,
        originalFileSize: buffer.byteLength,
        compressedFileSize: outBuffer.byteLength,
        exifApplied: orientation !== 1,
      },
      { transfer: [outBuffer] },
    );
  } catch (e) {
    self.postMessage({
      id,
      ok: false,
      error: e instanceof Error ? e.message : "Processing failed",
    });
  }
};

export {};
