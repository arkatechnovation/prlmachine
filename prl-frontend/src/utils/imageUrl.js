/** Resolve backend media without changing API endpoints or external image URLs.
 * Bare filenames (legacy blog records) are stored in /uploads. Root-relative
 * non-upload paths belong to the frontend and are left unchanged.
 */
export function getImageUrl(value, {
  apiBaseUrl = import.meta.env?.VITE_API_BASE_URL,
  fallback = "",
} = {}) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  // Older builds removed "/api" from the hostname and produced
  // https:/.prlmachine.com/api/uploads/… . Repair only that known legacy
  // upload format; do not reinterpret arbitrary external or signed URLs.
  const path = value.trim().replace(
    /^https?:\/{1,2}\.prlmachine\.com\/(?:api\/)?uploads\//i,
    "/uploads/",
  );

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
