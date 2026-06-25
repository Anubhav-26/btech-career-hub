"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/admin/FileUploader";
import { useAuth } from "@/hooks/useAuth";

const RESOURCE_TYPES = ["NOTES", "FORMULA_SHEET", "BOOK", "PDF", "LINK"];
const BRANCHES = ["", "CSE", "ECE", "ME", "CE", "EE", "IT", "CHEMICAL", "OTHER"];

function ExamSlugField() {
  return <Input name="examSlug" placeholder="Exam slug (e.g. gate-cse, placements)" required />;
}

export function ResourceUploadForm({ exams }: { exams: { slug: string; shortTitle: string }[] }) {
  const { getIdToken } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<{ url: string; type: string; size: number } | null>(null);

  async function resolveExamId(slug: string): Promise<string | null> {
    const res = await fetch(`/api/exams/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.id ?? null;
  }

  async function submitResource(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fileUrl) {
      setStatus("Upload a file first");
      return;
    }
    const form = new FormData(e.currentTarget);
    const examId = await resolveExamId(String(form.get("examSlug")));
    if (!examId) {
      setStatus("Exam slug not found");
      return;
    }console.log("FILE URL OBJECT:", fileUrl);

console.log({
  title: form.get("title"),
  fileUrl: fileUrl.url,
  fileType: fileUrl.type,
  sizeBytes: fileUrl.size,
});

    const token = await getIdToken();
    const res = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: form.get("title"),
        type: form.get("type"),
        subject: form.get("subject"),
        branch: form.get("branch") || null,
        examId,
        fileUrl: fileUrl.url,
        fileType: fileUrl.type,
        sizeBytes: fileUrl.size,
      }),
    });
    setStatus(res.ok ? "Resource added ✓" : "Failed to add resource");
    if (res.ok) {
      (e.target as HTMLFormElement).reset();
      setFileUrl(null);
      router.refresh();
    }
  }

  async function submitPyq(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fileUrl) {
      setStatus("Upload the question paper first");
      return;
    }
    const form = new FormData(e.currentTarget);
    const examId = await resolveExamId(String(form.get("examSlug")));
    if (!examId) {
      setStatus("Exam slug not found");
      return;
    }

    const token = await getIdToken();
    const res = await fetch("/api/pyqs", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        examId,
        year: Number(form.get("year")),
        session: form.get("session") || undefined,
        subject: form.get("subject") || undefined,
        questionUrl: fileUrl.url,
      }),
    });
    setStatus(res.ok ? "PYQ added ✓" : "Failed to add PYQ");
    if (res.ok) {
      (e.target as HTMLFormElement).reset();
      setFileUrl(null);
      router.refresh();
    }
  }

  async function submitVideo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const examId = await resolveExamId(String(form.get("examSlug")));
    if (!examId) {
      setStatus("Exam slug not found");
      return;
    }

    const token = await getIdToken();
    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        examId,
        title: form.get("title"),
        youtubeId: form.get("youtubeId"),
        channel: form.get("channel"),
        subject: form.get("subject") || undefined,
      }),
    });
    setStatus(res.ok ? "Video added ✓" : "Failed to add video");
    if (res.ok) {
      (e.target as HTMLFormElement).reset();
      router.refresh();
    }
  }

  return (
    <div>
      <p className="mb-3 text-xs text-ink-muted">
        Known exam slugs: {exams.map((e) => e.slug).join(", ") || "none yet — create an exam first"}
      </p>
      <Tabs defaultValue="resource">
        <TabsList>
          <TabsTrigger value="resource">Notes / Resource</TabsTrigger>
          <TabsTrigger value="pyq">PYQ</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
        </TabsList>

        <TabsContent value="resource">
          <form onSubmit={submitResource} className="space-y-3">
            <ExamSlugField />
            <Input name="title" placeholder="Title (e.g. Operating Systems Notes)" required />
            <div className="grid grid-cols-2 gap-3">
              <Select name="type" defaultValue="NOTES">
                {RESOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace("_", " ")}
                  </option>
                ))}
              </Select>
              <Select name="branch" defaultValue="">
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b || "Branch-agnostic"}
                  </option>
                ))}
              </Select>
            </div>
            <Input name="subject" placeholder="Subject (e.g. Operating Systems)" required />
            <FileUploader label="Upload PDF / file" onUploaded={(url, type, size) => setFileUrl({ url, type, size })} />
            <Button type="submit" className="w-full">
              Add resource
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="pyq">
          <form onSubmit={submitPyq} className="space-y-3">
            <ExamSlugField />
            <div className="grid grid-cols-2 gap-3">
              <Input name="year" type="number" placeholder="Year (e.g. 2025)" required />
              <Input name="session" placeholder="Session (optional)" />
            </div>
            <Input name="subject" placeholder="Subject (optional)" />
            <FileUploader label="Upload question paper PDF" onUploaded={(url, type, size) => setFileUrl({ url, type, size })} />
            <Button type="submit" className="w-full">
              Add PYQ
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="video">
          <form onSubmit={submitVideo} className="space-y-3">
            <ExamSlugField />
            <Input name="title" placeholder="Video title" required />
            <div className="grid grid-cols-2 gap-3">
              <Input name="youtubeId" placeholder="YouTube ID (11 chars)" required />
              <Input name="channel" placeholder="Channel name" required />
            </div>
            <Input name="subject" placeholder="Subject (optional)" />
            <Button type="submit" className="w-full">
              Add video
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      {status && <p className="mt-3 text-sm text-ink-muted">{status}</p>}
    </div>
  );
}
