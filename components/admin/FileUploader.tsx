import { useState } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";
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
  const [status, setStatus] = useState<"idle" | "uploading" | "done">("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const { getIdToken } = useAuth();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setFileName(file.name);

    try {
      const token = await getIdToken();

      // Step 1: Get Cloudinary Signature
      const sigRes = await fetch("/api/admin/uploads/sign", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sigJson = await sigRes.json();

      console.log("=================================");
      console.log("SIGN API RESPONSE");
      console.log(sigJson);
      console.log("=================================");

      const sig = sigJson.data;

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.apiKey);
      form.append("timestamp", String(sig.timestamp));
      form.append("signature", sig.signature);
      form.append("folder", sig.folder);

      // Step 2: Upload to Cloudinary
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`,
        {
          method: "POST",
          body: form,
        }
      );

      const uploaded = await uploadRes.json();

      console.log("=================================");
      console.log("CLOUDINARY RESPONSE");
      console.log(uploaded);
      console.log("=================================");

      // Agar Cloudinary error de raha hai to wahi dikhao
      if (!uploadRes.ok) {
        console.error("Cloudinary Upload Failed");
        console.error(uploaded);

        alert(
          "Cloudinary Upload Failed:\n\n" +
            JSON.stringify(uploaded, null, 2)
        );

        setStatus("idle");
        return;
      }

      console.log("=================================");
      console.log("SECURE URL:", uploaded.secure_url);
      console.log("FORMAT:", uploaded.format);
      console.log("BYTES:", uploaded.bytes);
      console.log("=================================");

      onUploaded(
        uploaded.secure_url,
        uploaded.format ?? file.type,
        uploaded.bytes ?? file.size
      );

      setStatus("done");
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert("Upload Failed. Check console.");
      setStatus("idle");
    }
  }

  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 py-2.5 text-sm",
        status === "done"
          ? "border-primary/40 bg-primary/5"
          : "hover:bg-muted"
      )}
    >
      {status === "done" ? (
        <CheckCircle2 className="h-4 w-4 text-primary" />
      ) : (
        <UploadCloud className="h-4 w-4 text-ink-muted" />
      )}

      <span className="truncate">
        {status === "uploading"
          ? "Uploading..."
          : fileName ?? label}
      </span>

      <input
        type="file"
        className="hidden"
        onChange={handleFile}
      />
    </label>
  );
}