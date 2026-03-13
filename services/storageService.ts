import { ASSET_PATHS, getAssetUrl } from '../constants';

// ─── Prompt cache ────────────────────────────────────────────────────────────
// Maps "teamName|number|removeBackground|customPrompt" → { result, expiry }
const promptCache = new Map<string, { result: string; expiry: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function getCachedSwap(key: string): string | null {
  const entry = promptCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    promptCache.delete(key);
    return null;
  }
  return entry.result;
}

export function setCachedSwap(key: string, result: string): void {
  promptCache.set(key, { result, expiry: Date.now() + CACHE_TTL_MS });
}

export function buildSwapCacheKey(
  teamName: string,
  number: string,
  removeBackground: boolean,
  customPrompt: string
): string {
  return `${teamName}|${number}|${removeBackground}|${customPrompt}`;
}

// ─── Image compression ───────────────────────────────────────────────────────
/**
 * Compresses a base64 data URL via an off-screen canvas.
 * Resizes to max 1200px on the longest side and encodes as JPEG at the
 * given quality (0–1). Falls back to the original if anything fails.
 */
export async function compressImage(
  base64DataUrl: string,
  maxDimension = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img;
      const scale = Math.min(1, maxDimension / Math.max(w, h));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(base64DataUrl);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL('image/jpeg', quality);
      // Only use the compressed version if it actually saved space
      resolve(compressed.length < base64DataUrl.length ? compressed : base64DataUrl);
    };
    img.onerror = () => resolve(base64DataUrl);
    img.src = base64DataUrl;
  });
}

// ─── Storage service ─────────────────────────────────────────────────────────
export class StorageService {
  /**
   * Compresses, then uploads an asset (base64 data URL) by converting to a
   * Blob and PUTting to GCS. Falls back gracefully to the data URL in dev.
   */
  async uploadAsset(
    base64DataUrl: string,
    folderKey: keyof typeof ASSET_PATHS,
    fileName: string,
    skipCompression = false
  ): Promise<string> {
    // Compress before upload (skip for masks / small images)
    const dataUrl = skipCompression
      ? base64DataUrl
      : await compressImage(base64DataUrl);

    const cleanFileName = fileName.replace(/\s+/g, '_').toLowerCase();
    const publicUrl = getAssetUrl(folderKey, cleanFileName);

    try {
      const [header, b64] = dataUrl.split(',');
      const mimeMatch = header.match(/data:([^;]+)/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: mime });

      const uploadUrl = `${ASSET_PATHS[folderKey]}/${cleanFileName}`;
      const res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': mime, 'x-goog-acl': 'public-read' },
        body: blob,
      });

      if (res.ok) return publicUrl;
      console.warn('[Storage] PUT failed, falling back to data URL');
      return dataUrl;
    } catch (err) {
      console.warn('[Storage] Upload skipped (dev mode):', err);
      return dataUrl;
    }
  }

  async uploadAvatar(base64DataUrl: string, userId: string): Promise<string> {
    return this.uploadAsset(base64DataUrl, 'PROFILES', `avatar_${userId}.jpg`);
  }

  async uploadSwap(base64DataUrl: string, swapId: string): Promise<string> {
    return this.uploadAsset(base64DataUrl, 'SWAPS', `swap_${swapId}.jpg`);
  }
}

export const storageService = new StorageService();
