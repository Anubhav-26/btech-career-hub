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
import { Select } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

const RESOURCE_TYPES = [
  "NOTES",
  "FORMULA_SHEET",
  "BOOK",
  "PDF",
  "LINK",
];

const BRANCHES = [
  "",
  "CSE",
  "ECE",
  "ME",
  "CE",
  "EE",
  "IT",
  "CHEMICAL",
  "OTHER",
];

interface Resource {
  id: string;
  title: string;
  subject: string;
  type: string;
  branch: string | null;
}

interface Props {
  resource: Resource;
}

export function EditResourceModal({ resource }: Props) {
  const router = useRouter();
  const { getIdToken } = useAuth();

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState(resource.title);

  const [subject, setSubject] = useState(resource.subject);

  const [type, setType] = useState(resource.type);

  const [branch, setBranch] = useState(resource.branch ?? "");

  const [loading, setLoading] = useState(false);

  async function saveChanges() {
  if (!title.trim()) {
    alert("Title is required.");
    return;
  }

  if (!subject.trim()) {
    alert("Subject is required.");
    return;
  }

  try {
    setLoading(true);

    const token = await getIdToken();

    const res = await fetch(`/api/resources/${resource.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        subject,
        type,
        branch: branch || null,
      }),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(
        json?.error?.message ??
          "Failed to update resource."
      );
    }

    alert("✅ Resource updated successfully.");

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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>

          <DialogHeader>
            <DialogTitle>
              Edit Resource
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />

            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
            />

            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {RESOURCE_TYPES.map((t) => (
                <option
                  key={t}
                  value={t}
                >
                  {t.replace("_", " ")}
                </option>
              ))}
            </Select>

            <Select
              value={branch}
              onChange={(e) =>
                setBranch(e.target.value)
              }
            >
              {BRANCHES.map((b) => (
                <option
                  key={b}
                  value={b}
                >
                  {b || "All Branches"}
                </option>
              ))}
            </Select>

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
              {loading
                ? "Saving..."
                : "Save Changes"}
            </Button>

          </DialogFooter>

        </DialogContent>
      </Dialog>
    </>
  );
}