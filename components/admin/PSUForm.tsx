"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createPSU, updatePSU } from "@/app/admin/psu/actions";

type PSUFormProps = {
  mode: "create" | "edit";
  psu?: {
    id: string;
    name: string;
    sector: string;
    avgSalaryLpa: number | null;
    maxSalaryLpa: number | null;
    minGateScore: number | null;
    branches: string[];
    officialUrl: string | null;
    logoUrl: string | null;
    description: string | null;
    selectionProcess: string | null;
  };
};

export default function PSUForm({ mode, psu }: PSUFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(psu?.name ?? "");
  const [sector, setSector] = useState(psu?.sector ?? "");
  const [avgSalaryLpa, setAvgSalaryLpa] = useState(
    psu?.avgSalaryLpa?.toString() ?? ""
  );
  const [maxSalaryLpa, setMaxSalaryLpa] = useState(
    psu?.maxSalaryLpa?.toString() ?? ""
  );
  const [minGateScore, setMinGateScore] = useState(
    psu?.minGateScore?.toString() ?? ""
  );
  const [branches, setBranches] = useState(
    psu?.branches?.join(", ") ?? ""
  );
  const [officialUrl, setOfficialUrl] = useState(
    psu?.officialUrl ?? ""
  );
  const [logoUrl, setLogoUrl] = useState(psu?.logoUrl ?? "");
  const [description, setDescription] = useState(
    psu?.description ?? ""
  );
  const [selectionProcess, setSelectionProcess] = useState(
    psu?.selectionProcess ?? ""
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const title = useMemo(() => {
    return mode === "create" ? "Create PSU" : "Edit PSU";
  }, [mode]);

  function parsePayload() {
    return {
      name: name.trim(),
      sector: sector.trim(),
      avgSalaryLpa: avgSalaryLpa ? Number(avgSalaryLpa) : undefined,
      maxSalaryLpa: maxSalaryLpa ? Number(maxSalaryLpa) : undefined,
      minGateScore: minGateScore ? Number(minGateScore) : undefined,
      branches: branches
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean),
      officialUrl: officialUrl.trim() || undefined,
      logoUrl: logoUrl.trim() || undefined,
      description: description.trim() || undefined,
      selectionProcess: selectionProcess.trim() || undefined,
    };
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const payload = parsePayload();

    startTransition(async () => {
      try {
        if (mode === "create") {
          await createPSU(payload);

          setSuccess("PSU created successfully.");
          router.refresh();
          router.push("/admin/psu");
          return;
        }

        if (!psu?.id) {
          throw new Error("PSU ID missing");
        }

        await updatePSU(psu.id, payload);

        setSuccess("PSU updated successfully.");
        router.refresh();
        router.push("/admin/psu");
      } catch (err: any) {
        setError(err?.message || "Something went wrong");
      }
    });
  }

  return (
    <div className="mx-auto max-w-4xl rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {error && (
          <div className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded bg-green-100 px-3 py-2 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded border p-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="rounded border p-2"
            placeholder="Sector"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          />

          <input
            type="number"
            className="rounded border p-2"
            placeholder="Avg Salary"
            value={avgSalaryLpa}
            onChange={(e) => setAvgSalaryLpa(e.target.value)}
          />

          <input
            type="number"
            className="rounded border p-2"
            placeholder="Max Salary"
            value={maxSalaryLpa}
            onChange={(e) => setMaxSalaryLpa(e.target.value)}
          />

          <input
            type="number"
            className="rounded border p-2"
            placeholder="GATE Score"
            value={minGateScore}
            onChange={(e) => setMinGateScore(e.target.value)}
          />

          <input
            className="rounded border p-2"
            placeholder="Branches (comma separated)"
            value={branches}
            onChange={(e) => setBranches(e.target.value)}
          />

          <input
            className="rounded border p-2"
            placeholder="Official URL"
            value={officialUrl}
            onChange={(e) => setOfficialUrl(e.target.value)}
          />

          <input
            className="rounded border p-2"
            placeholder="Logo URL"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
        </div>

        <textarea
          className="w-full rounded border p-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <textarea
          className="w-full rounded border p-2"
          placeholder="Selection Process"
          value={selectionProcess}
          onChange={(e) => setSelectionProcess(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/psu")}
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={isPending}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            {mode === "create" ? "Create" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}