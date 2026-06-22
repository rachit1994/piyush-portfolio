type Size = { width: number; height: number };

/**
 * Read an image file's intrinsic pixel dimensions in the browser. Prefers
 * createImageBitmap (off-main-thread) and falls back to an HTMLImageElement.
 */
export async function readImageSize(file: File): Promise<Size> {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  }
  return readWithImageElement(file);
}

function readWithImageElement(file: File): Promise<Size> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("could not read image size"));
    };
    image.src = url;
  });
}
