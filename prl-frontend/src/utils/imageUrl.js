/** Resolve backend media without changing API endpoints or external image URLs.
 * Bare filenames (legacy blog records) are stored in /uploads. Root-relative
 * non-upload paths belong to the frontend and are left unchanged.
 */
export function getImageUrl(value, {
  apiBaseUrl = import.meta.env?.VITE_API_BASE_URL,
  fallback = "",
} = {}) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  const path = value.trim();

  // Preserve external hosts, signed URLs, and local upload previews verbatim.
  if (/^(https?:|blob:|data:|\/\/)/i.test(path)) return path;
  if (/^[a-z][a-z\d+.-]*:/i.test(path)) return fallback;

  const uploadPath = path.replace(/^\/?(?:api\/)?uploads\//, "/uploads/");
  if (uploadPath.startsWith("/") && !uploadPath.startsWith("/uploads/")) {
    return uploadPath;
  }
  const mediaPath = uploadPath.startsWith("/uploads/")
    ? uploadPath
    : `/uploads/${uploadPath}`;

  // Only the configured server origin hosts /uploads; never strip /api from
  // the hostname (https://api.example.com). Missing config uses same-origin.
  try {
    const base = new URL(apiBaseUrl);
    if (!/^https?:$/.test(base.protocol)) return mediaPath;
    return new URL(mediaPath, base.origin).href;
  } catch {
    return mediaPath;
  }
}
