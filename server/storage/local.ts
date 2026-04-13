// server/storage/local.ts
import "server-only";

import { mkdir, writeFile, readFile, unlink, access } from "fs/promises";
import { join, dirname } from "path";
import { randomBytes } from "crypto";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? join(process.cwd(), "uploads");

function monthPrefix(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// Sanitize filename to prevent path traversal.
function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);
}

export async function saveFile(
  buffer: Buffer,
  originalName: string,
  _mimeType: string
): Promise<{ filename: string; storagePath: string; sizeBytes: number }> {
  const filename = `${randomBytes(12).toString("hex")}-${safeName(originalName)}`;
  const storagePath = join(monthPrefix(), filename);
  const fullPath = join(UPLOAD_DIR, storagePath);

  await mkdir(dirname(fullPath), { recursive: true });
  await writeFile(fullPath, buffer);

  return { filename, storagePath, sizeBytes: buffer.length };
}

export async function getFile(storagePath: string): Promise<Buffer> {
  const fullPath = join(UPLOAD_DIR, storagePath);
  return readFile(fullPath);
}

export async function deleteFile(storagePath: string): Promise<void> {
  const fullPath = join(UPLOAD_DIR, storagePath);
  try {
    await access(fullPath);
    await unlink(fullPath);
  } catch {
    // File already gone — not an error.
  }
}
