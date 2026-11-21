import test from "node:test";
import assert from "node:assert/strict";
import { getImageUrl } from "../src/utils/imageUrl.js";

const production = "https://api.prlmachine.com/api";

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
