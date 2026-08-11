export type UploadProgressHandler = (progress: number) => void;

const MAX_RETRIES = 3;

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

export async function fetchPresignedUploadUrl(
  draftId: string,
  fileName: string,
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const res = await fetch(`/api/draft/${draftId}/upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName }),
  });
  if (!res.ok) throw new Error("Could not get upload URL");
  return res.json() as Promise<{ uploadUrl: string; publicUrl: string }>;
}

export async function uploadBlobWithProgress(
  uploadUrl: string,
  blob: Blob,
  onProgress: UploadProgressHandler,
  signal?: AbortSignal,
): Promise<void> {
  if (uploadUrl.startsWith("mock://")) {
    for (let p = 0; p <= 100; p += 20) {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
      onProgress(p);
      await delay(80, signal);
    }
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Upload failed")));
    xhr.onerror = () => reject(new Error("Network error"));
    signal?.addEventListener("abort", () => {
      xhr.abort();
      reject(new DOMException("Aborted", "AbortError"));
    });
    xhr.send(blob);
  });
}

export async function uploadWithRetry(
  draftId: string,
  fileName: string,
  blob: Blob,
  onProgress: UploadProgressHandler,
  signal?: AbortSignal,
): Promise<string> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const { uploadUrl, publicUrl } = await fetchPresignedUploadUrl(draftId, fileName);
      await uploadBlobWithProgress(uploadUrl, blob, onProgress, signal);
      return publicUrl;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error("Upload failed");
      if (signal?.aborted) throw lastError;
      await delay(500 * 2 ** attempt, signal);
    }
  }
  throw lastError ?? new Error("Upload failed");
}
