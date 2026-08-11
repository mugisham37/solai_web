export async function convertHeicToJpeg(file: File): Promise<Blob> {
  const mod = await import("heic2any");
  const heic2any = mod.default;
  const result = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.92,
  });
  const blob = Array.isArray(result) ? result[0] : result;
  if (!blob) throw new Error("HEIC conversion failed");
  return blob;
}
