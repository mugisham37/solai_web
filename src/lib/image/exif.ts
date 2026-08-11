/** Read EXIF orientation (1–8) from JPEG buffer. Returns 1 if unknown. */
export function readExifOrientation(buffer: ArrayBuffer): number {
  const view = new DataView(buffer);
  if (view.byteLength < 2 || view.getUint16(0, false) !== 0xffd8) {
    return 1;
  }
  let offset = 2;
  while (offset < view.byteLength - 1) {
    if (view.getUint8(offset) !== 0xff) break;
    const marker = view.getUint8(offset + 1);
    if (marker === 0xe1) {
      const exifStart = offset + 4;
      if (view.getUint32(exifStart, false) !== 0x45786966) return 1;
      const tiff = exifStart + 6;
      const little = view.getUint16(tiff, true) === 0x4949;
      const ifd0 = tiff + view.getUint32(tiff + 4, little);
      const entries = view.getUint16(ifd0, little);
      for (let i = 0; i < entries; i++) {
        const entry = ifd0 + 2 + i * 12;
        const tag = view.getUint16(entry, little);
        if (tag === 0x0112) {
          return view.getUint16(entry + 8, little) || 1;
        }
      }
      return 1;
    }
    if (marker === 0xd8 || marker === 0xd9) break;
    const size = view.getUint16(offset + 2, false);
    offset += 2 + size;
  }
  return 1;
}

export type DrawOrientationTransform = {
  swapDimensions: boolean;
  scaleX: number;
  scaleY: number;
  rotate: number;
};

export function orientationTransform(orientation: number): DrawOrientationTransform {
  switch (orientation) {
    case 2:
      return { swapDimensions: false, scaleX: -1, scaleY: 1, rotate: 0 };
    case 3:
      return { swapDimensions: false, scaleX: 1, scaleY: 1, rotate: 180 };
    case 4:
      return { swapDimensions: false, scaleX: 1, scaleY: -1, rotate: 0 };
    case 5:
      return { swapDimensions: true, scaleX: 1, scaleY: -1, rotate: 90 };
    case 6:
      return { swapDimensions: true, scaleX: 1, scaleY: 1, rotate: 90 };
    case 7:
      return { swapDimensions: true, scaleX: -1, scaleY: 1, rotate: 90 };
    case 8:
      return { swapDimensions: true, scaleX: -1, scaleY: -1, rotate: 90 };
    default:
      return { swapDimensions: false, scaleX: 1, scaleY: 1, rotate: 0 };
  }
}
