"use client";

import { useRef, useState } from "react";
import {
  UploadCloud,
  CheckCircle2,
  FolderOpen,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function FileUploader({
  label,
  onUploaded,
}: {
  label: string;
  onUploaded: (
    fileUrl: string,
    fileType: string,
    sizeBytes: number
  ) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] =
    useState<"idle" | "uploading" | "done">("idle");

  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  const { getIdToken } = useAuth();

  const MAX_SIZE = 100 * 1024 * 1024;

  async function uploadSingleFile(file: File) {
    const token = await getIdToken();

    const sigRes = await fetch("/api/admin/uploads/sign", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const sigJson = await sigRes.json();
    const sig = sigJson.data;

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sig.apiKey);
    form.append("timestamp", String(sig.timestamp));
    form.append("signature", sig.signature);
    form.append("folder", sig.folder);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`,
      {
        method: "POST",
        body: form,
      }
    );

    const uploaded = await uploadRes.json();

    if (!uploadRes.ok) {
      throw new Error(uploaded.error?.message || "Upload failed");
    }

    onUploaded(
      uploaded.secure_url,
      uploaded.format ?? file.type,
      uploaded.bytes ?? file.size
    );
  }

  async function handleFile(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(e.target.files ?? []);

    if (!files.length) return;

    for (const file of files) {
      if (file.size > MAX_SIZE) {
        alert(`${file.name} exceeds 100 MB`);
        return;
      }
    }

    setStatus("uploading");
    setProgress(0);

    setFileName(
      files.length === 1
        ? files[0].name
        : `${files.length} files selected`
    );

    try {
      for (let i = 0; i < files.length; i++) {
        await uploadSingleFile(files[i]);

        setProgress(
          Math.round(((i + 1) / files.length) * 100)
        );
      }

      setStatus("done");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
      setStatus("idle");
      setProgress(0);
    }
  }

  return (
    <div className="space-y-3">

      {/* UI BOX */}
      <div
        className={cn(
          "rounded-xl border-2 border-dashed border-border p-5 transition",
          status === "done"
            ? "border-primary bg-primary/5"
            : "hover:bg-muted"
        )}
      >
        <div className="flex items-center gap-3">

          {status === "done" ? (
            <CheckCircle2 className="h-6 w-6 text-primary" />
          ) : (
            <UploadCloud className="h-6 w-6 text-ink-muted" />
          )}

          <div className="flex-1">
            <p className="font-medium">
              {status === "uploading"
                ? "Uploading..."
                : fileName || label}
            </p>

            <p className="text-xs text-muted-foreground mt-1">
              PDF • Images • DOC • PPT • ZIP • Folder support
            </p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-4 flex gap-3">

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
          >
            <UploadCloud className="mr-2 inline h-4 w-4" />
            Upload Files
          </button>

          <button
            type="button"
            onClick={() => folderInputRef.current?.click()}
            className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
          >
            <FolderOpen className="mr-2 inline h-4 w-4" />
            Upload Folder
          </button>

        </div>

        {/* FILE INPUT */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFile}
          accept="
application/pdf,
application/zip,
application/x-zip-compressed,
application/x-rar-compressed,
application/vnd.rar,
application/msword,
application/vnd.openxmlformats-officedocument.wordprocessingml.document,
application/vnd.ms-powerpoint,
application/vnd.openxmlformats-officedocument.presentationml.presentation,
image/*
"
        />

        {/* FOLDER INPUT */}
        <input
          ref={folderInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFile}
          {...({ webkitdirectory: "", directory: "" } as any)}
        />
      </div>

      {/* PROGRESS */}
      {status === "uploading" && (
        <div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            {progress}% Uploaded
          </p>
        </div>
      )}

      {/* DONE */}
      {status === "done" && (
        <p className="text-sm text-green-600">
          ✔ Upload Completed Successfully
        </p>
      )}

    </div>
  );
}