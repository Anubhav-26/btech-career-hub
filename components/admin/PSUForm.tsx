"use client";

import { useState } from "react";
import { createPSU } from "@/app/admin/psu/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PSUForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sector: "",
    avgSalaryLpa: "",
    minGateScore: "",
    branches: "",
    description: "",
    selectionProcess: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createPSU({
        name: form.name,
        sector: form.sector,
        avgSalaryLpa: form.avgSalaryLpa ? Number(form.avgSalaryLpa) : undefined,
        minGateScore: form.minGateScore ? Number(form.minGateScore) : undefined,
        branches: form.branches.split(",").map((b) => b.trim()),
        description: form.description,
        selectionProcess: form.selectionProcess,
      });

      setForm({
        name: "",
        sector: "",
        avgSalaryLpa: "",
        minGateScore: "",
        branches: "",
        description: "",
        selectionProcess: "",
      });

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error creating PSU");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-surface p-4 space-y-3"
    >
      <h2 className="text-sm font-semibold">Add PSU</h2>

      <Input name="name" placeholder="PSU Name" value={form.name} onChange={handleChange} />
      <Input name="sector" placeholder="Sector" value={form.sector} onChange={handleChange} />

      <div className="grid grid-cols-2 gap-2">
        <Input
          name="avgSalaryLpa"
          placeholder="Avg Salary (LPA)"
          value={form.avgSalaryLpa}
          onChange={handleChange}
        />
        <Input
          name="minGateScore"
          placeholder="Min GATE Score"
          value={form.minGateScore}
          onChange={handleChange}
        />
      </div>

      <Input
        name="branches"
        placeholder="Branches (comma separated)"
        value={form.branches}
        onChange={handleChange}
      />

      <Input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <Input
        name="selectionProcess"
        placeholder="Selection Process"
        value={form.selectionProcess}
        onChange={handleChange}
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create PSU"}
      </Button>
    </form>
  );
}