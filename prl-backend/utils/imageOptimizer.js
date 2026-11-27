const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".jfif",
]);

const isOptimizableImage = (filePath) =>
  IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase());

/**
 * Resize and compress an uploaded image in-place without changing its filename
 * or breaking existing database URLs, and return the optimized buffer/path info.
 */
async function optimizeImageFile(filePath, { maxDimension = 1600 } = {}) {
  if (!filePath || !isOptimizableImage(filePath) || !fs.existsSync(filePath)) {
    return false;
  }

  const ext = path.extname(filePath).toLowerCase();
  const originalBuffer = await fs.promises.readFile(filePath);
  const pipeline = sharp(originalBuffer, { failOn: "none" })
    .rotate()
    .resize({
      width: maxDimension,
      height: maxDimension,
      fit: "inside",
      withoutEnlargement: true,
    });

  let outputBuffer;
  if (ext === ".png") {
    outputBuffer = await pipeline
      .png({ compressionLevel: 9, palette: true, quality: 85, effort: 8 })
      .toBuffer();
  } else if (ext === ".webp") {
    outputBuffer = await pipeline.webp({ quality: 82 }).toBuffer();
  } else if (ext === ".avif") {
    outputBuffer = await pipeline.avif({ quality: 65 }).toBuffer();
  } else {
    outputBuffer = await pipeline
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toBuffer();
  }

  // Only overwrite if we actually saved bytes or resized down
  if (outputBuffer.length < originalBuffer.length) {
    await fs.promises.writeFile(filePath, outputBuffer);
  }
  return true;
}

/**
 * Generate or return a cached WebP variant inside `<uploadDir>/.optimized/`.
 */
async function getOrCreateWebpVariant(uploadDir, filename, sourcePath) {
  const cacheDir = path.join(uploadDir, ".optimized");
  await fs.promises.mkdir(cacheDir, { recursive: true });
  const webpPath = path.join(cacheDir, `${filename}.webp`);

  if (fs.existsSync(webpPath)) {
    return webpPath;
  }

  const buffer = await sharp(sourcePath, { failOn: "none" })
    .rotate()
    .resize({
      width: 1200,
      height: 1200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toBuffer();

  await fs.promises.writeFile(webpPath, buffer);
  return webpPath;
}

/**
 * Express middleware that serves cached WebP variants when supported by the
 * client, adds immutable cache headers, and hydrates missing files from the
 * live origin when configured.
 */
function serveOptimizedUploads(
  uploadDir,
  { fallbackOrigin = process.env.LIVE_UPLOADS_ORIGIN || "https://api.prlmachine.com" } = {},
) {
  return async (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();

    const safeRel = decodeURIComponent(req.path || "").replace(/^\/+/, "");
    if (!safeRel || safeRel.includes("..") || safeRel.startsWith(".optimized")) {
      return next();
    }

    const filePath = path.resolve(uploadDir, safeRel);
    if (!filePath.startsWith(uploadDir + path.sep)) {
      return res.status(403).end();
    }

    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Vary", "Accept");

    // Hydrate from live origin once if local uploads folder does not have it yet
    if (!fs.existsSync(filePath) && fallbackOrigin) {
      try {
        const remoteUrl = `${fallbackOrigin.replace(/\/+$/, "")}/uploads/${encodeURIComponent(safeRel).replace(/%2F/g, "/")}`;
        const response = await fetch(remoteUrl);
        if (response.ok) {
          const buf = Buffer.from(await response.arrayBuffer());
          await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
          await fs.promises.writeFile(filePath, buf);
          await optimizeImageFile(filePath).catch(() => {});
        }
      } catch {
        // Fall through to static handler (404)
      }
    }

    if (!fs.existsSync(filePath) || !isOptimizableImage(filePath)) {
      return next();
    }

    const acceptsWebp = (req.headers.accept || "").includes("image/webp");
    if (acceptsWebp && path.extname(filePath).toLowerCase() !== ".webp") {
      try {
        const webpPath = await getOrCreateWebpVariant(
          uploadDir,
          safeRel.replace(/[\\/]/g, "_"),
          filePath,
        );
        res.type("image/webp");
        return res.sendFile(webpPath, { dotfiles: "allow" });
      } catch {
        return next();
      }
    }

    return next();
  };
}

module.exports = {
  isOptimizableImage,
  optimizeImageFile,
  getOrCreateWebpVariant,
  serveOptimizedUploads,
};
