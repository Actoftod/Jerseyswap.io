import { ASSET_PATHS, getAssetUrl } from '../constants';

export class StorageService {
  /**
   * Uploads an asset (base64 data URL) by converting to a Blob and
   * sending via a PUT/POST to the GCS bucket. Falls back gracefully
   * to returning the original data URL when the bucket is unreachable
   * (dev / no-credentials environment).
   */
  async uploadAsset(
    base64DataUrl: string,
    folderKey: keyof typeof ASSET_PATHS,
    fileName: string
  ): Promise<string> {
    const cleanFileName = fileName.replace(/\s+/g, '_').toLowerCase();
    const publicUrl = getAssetUrl(folderKey, cleanFileName);

    try {
      // Convert base64 data URL → Blob
      const [header, b64] = base64DataUrl.split(',');
      const mimeMatch = header.match(/data:([^;]+)/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/png';
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: mime });

      // Attempt upload to GCS public bucket via PUT
      const uploadUrl = `${ASSET_PATHS[folderKey]}/${cleanFileName}`;
      const res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': mime, 'x-goog-acl': 'public-read' },
        body: blob,
      });

      if (res.ok) return publicUrl;

      // Bucket not writable in dev — return data URL so app still works
      console.warn('[Storage] PUT failed, falling back to data URL');
      return base64DataUrl;
    } catch (err) {
      // Network / CORS error in dev — silently fall back
      console.warn('[Storage] Upload skipped (dev mode):', err);
      return base64DataUrl;
    }
  }

  /**
   * Persists an avatar image for a user profile.
   */
  async uploadAvatar(base64DataUrl: string, userId: string): Promise<string> {
    return this.uploadAsset(base64DataUrl, 'PROFILES', `avatar_${userId}.png`);
  }

  /**
   * Persists a completed jersey swap result.
   */
  async uploadSwap(base64DataUrl: string, swapId: string): Promise<string> {
    return this.uploadAsset(base64DataUrl, 'SWAPS', `swap_${swapId}.png`);
  }
}

export const storageService = new StorageService();
