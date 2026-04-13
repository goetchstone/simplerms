// components/ui/file-upload.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, Download, Loader2 } from "lucide-react";

const ALLOWED_EXTENSIONS = new Set(["pdf", "png", "jpg", "jpeg", "gif", "webp", "txt", "csv", "xlsx", "docx"]);
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

interface UploadedFile {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

interface Props {
  entityType?: "clientId" | "invoiceId" | "ticketId" | "ticketMessageId" | "orderId";
  entityId?: string;
  existingFiles?: UploadedFile[];
  onUpload?: (file: UploadedFile) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getExtension(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

export function FileUpload({ entityType, entityId, existingFiles = [], onUpload }: Props) {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    const ext = getExtension(file.name);
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      setError(`File type .${ext} is not allowed`);
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("File is too large (max 10 MB)");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const params = new URLSearchParams();
      if (entityType && entityId) params.set(entityType, entityId);

      const res = await fetch(`/api/files/upload?${params}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(data.error ?? `Error ${res.status}`);
      }

      const uploaded: UploadedFile = await res.json();
      setFiles((prev) => [...prev, uploaded]);
      onUpload?.(uploaded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [entityType, entityId, onUpload]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed px-4 py-6 text-center transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/20 hover:border-muted-foreground/40"
        }`}
      >
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <Upload className="h-5 w-5 text-muted-foreground" />
        )}
        <p className="text-xs text-muted-foreground">
          {uploading ? "Uploading..." : "Drop a file here or click to browse"}
        </p>
        <p className="text-[10px] text-muted-foreground/60">
          PDF, images, CSV, XLSX, DOCX — max 10 MB
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.txt,.csv,.xlsx,.docx"
          onChange={handleFileInput}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between rounded-md border px-3 py-2"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-xs font-medium">{f.originalName}</span>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {formatSize(f.sizeBytes)}
                </span>
              </div>
              <a
                href={`/api/files/${f.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 p-1 text-muted-foreground hover:text-foreground"
                title="Download"
              >
                <Download className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
