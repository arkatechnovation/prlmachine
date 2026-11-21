import test from "node:test";
import assert from "node:assert/strict";
import { getImageUrl } from "../src/utils/imageUrl.js";

const production = "https://api.prlmachine.com/api";

const filename = "1770371219492-972249092-single-head-cutting.png";
for (const apiBaseUrl of [production, "https://prlmachine.com/api"]) {
  for (const prefix of [
    "https:/.prlmachine.com/api/uploads/",
    "https://.prlmachine.com/api/uploads/",
    "https:/.prlmachine.com/uploads/",
  ]) {
    test(`repairs legacy ${prefix} using ${apiBaseUrl}`, () => {
      assert.equal(getImageUrl(`${prefix}${filename}`, { apiBaseUrl }),
        `${new URL(apiBaseUrl).origin}/uploads/${filename}`);
    });
  }
}

test("repairs the reported malformed URL without losing encoding or query parameters", () => {
  assert.equal(getImageUrl("https:/.prlmachine.com/api/uploads/product%20photo.png?size=200&token=a%2Fb#preview", {
    apiBaseUrl: production,
  }), "https://api.prlmachine.com/uploads/product%20photo.png?size=200&token=a%2Fb#preview");
});

test("legacy repair cannot rewrite unrelated hosts or valid signed PRL URLs", () => {
  for (const value of [
    "https://api.prlmachine.com/api/uploads/product.png?signature=a%2Fb",
    "https://prlmachine.com/uploads/product.png?X-Amz-Signature=abc",
    "https://cdn.example.com/api/uploads/product.png?signature=abc",
    "https://prlmachine.com.example.org/api/uploads/product.png",
    "https://.prlmachine.com.example.org/api/uploads/product.png",
  ]) assert.equal(getImageUrl(value, { apiBaseUrl: production }), value);
});

test("legacy URL repair is stable when resolved a second time", () => {
  const options = { apiBaseUrl: production };
  const resolved = getImageUrl(`https:/.prlmachine.com/api/uploads/${filename}`, options);
  assert.equal(getImageUrl(resolved, options), resolved);
});

for (const apiBaseUrl of [
  production,
  `${production}/`,
  "https://prlmachine.com/api",
  "http://localhost:3000/api",
]) {
  for (const value of [
    "/uploads/product.png",
    "uploads/product.png",
    "/api/uploads/product.png",
    "api/uploads/product.png",
    "product.png",
  ]) {
    test(`${apiBaseUrl} resolves ${value}`, () => {
      assert.equal(getImageUrl(value, { apiBaseUrl }),
        `${new URL(apiBaseUrl).origin}/uploads/product.png`);
    });
  }
}

test("preserves absolute, external signed URLs and upload previews", () => {
  for (const value of [
    "https://api.prlmachine.com/uploads/product.png",
    "https://prlmachine.com/uploads/product.png",
    "https://cdn.example.com/api/uploads/image.png?signature=a%2Fb&size=200#image",
    "http://legacy.example.com/image.jpg",
    "//cdn.example.com/image.jpg",
    "blob:https://prlmachine.com/preview-id",
    "data:image/png;base64,aGVsbG8=",
  ]) assert.equal(getImageUrl(value, { apiBaseUrl: production }), value);
});

test("missing or non-string values use the caller's fallback", () => {
  for (const value of [undefined, null, "", "  ", false, 123, {}, []]) {
    assert.equal(getImageUrl(value), "");
    assert.equal(getImageUrl(value, { fallback: "/placeholder.jpg" }), "/placeholder.jpg");
  }
});

test("keeps frontend static assets on the frontend", () => {
  assert.equal(getImageUrl("/assets/logo/logo.png", { apiBaseUrl: production }), "/assets/logo/logo.png");
});

test("encodes spaces and preserves existing encoding, queries and fragments", () => {
  assert.equal(getImageUrl(" /api/uploads/product photo.png?size=200#preview ", { apiBaseUrl: production }),
    "https://api.prlmachine.com/uploads/product%20photo.png?size=200#preview");
  assert.equal(getImageUrl("/uploads/product%20photo.png", { apiBaseUrl: production }),
    "https://api.prlmachine.com/uploads/product%20photo.png");
});

test("missing, relative or invalid API config falls back to same-origin uploads", () => {
  for (const apiBaseUrl of [undefined, "", "/api", "not a URL", "ftp://example.com/api"]) {
    assert.equal(getImageUrl("/api/uploads/image.png", { apiBaseUrl }), "/uploads/image.png");
  }
});

test("rejects unsupported URL schemes", () => {
  assert.equal(getImageUrl("javascript:alert(1)"), "");
});
