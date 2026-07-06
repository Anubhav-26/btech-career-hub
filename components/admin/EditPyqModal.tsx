"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface Pyq {
  id: string;
  year: number;
  session: string | null;
  subject: string | null;
  questionUrl: string;
  solutionUrl: string | null;
}

interface Props {
  pyq: Pyq;
}

export function EditPyqModal({ pyq }: Props) {
  const router = useRouter();
  const { getIdToken } = useAuth();

  const [open, setOpen] = useState(false);

  const [year, setYear] = useState(pyq.year);
  const [session, setSession] = useState(pyq.session ?? "");
  const [subject, setSubject] = useState(pyq.subject ?? "");
  const [questionUrl, setQuestionUrl] = useState(pyq.questionUrl);
  const [solutionUrl, setSolutionUrl] = useState(pyq.solutionUrl ?? "");

  const [loading, setLoading] = useState(false);

  async function saveChanges() {
    try {
      setLoading(true);

      const token = await getIdToken();

      const res = await fetch(`/api/pyqs/${pyq.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          year,
          session: session || undefined,
          subject: subject || undefined,
          questionUrl,
          solutionUrl: solutionUrl || undefined,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          json?.error?.message ?? "Failed to update PYQ."
        );
      }

      alert("✅ PYQ updated successfully.");

      setOpen(false);

      router.refresh();
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
      >
        ✏️
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit PYQ</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <Input
              type="number"
              value={year}
              onChange={(e) =>
                setYear(Number(e.target.value))
              }
              placeholder="Year"
            />

            <Input
              value={session}
              onChange={(e) =>
                setSession(e.target.value)
              }
              placeholder="Session"
            />

            <Input
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
              placeholder="Subject"
            />

            <Input
              value={questionUrl}
              onChange={(e) =>
                setQuestionUrl(e.target.value)
              }
              placeholder="Question PDF URL"
            />

            <Input
              value={solutionUrl}
              onChange={(e) =>
                setSolutionUrl(e.target.value)
              }
              placeholder="Solution PDF URL (optional)"
            />

          </div>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={saveChanges}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>

          </DialogFooter>

        </DialogContent>
      </Dialog>
    </>
  );
}