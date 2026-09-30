// lib/content-disposition.ts

// Header values must be ByteStrings, so a raw non-ASCII name (every macOS
// screenshot name contains U+202F) makes `new Response()` throw. RFC 6266:
// `filename` gets an ASCII fallback, `filename*` carries the real name.
export function contentDisposition(type: "inline" | "attachment", name: string): string {
  const fallback = name.replace(/[^\x20-\x7E]|["\\]/g, "_");
  const encoded = encodeURIComponent(name).replace(
    /['()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
  return `${type}; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}
