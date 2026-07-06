"use client";

import { useState } from "react";
import { createInternship } from "@/app/admin/internships/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function InternshipForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    workMode: "ONSITE",
    stipendMin: "",
    stipendMax: "",
    duration: "",
    applyLink: "",
    source: "",
    deadline: "",
    branches: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      await createInternship({
        title: form.title,
        company: form.company,
        location: form.location || undefined,
        workMode: form.workMode as
          | "ONSITE"
          | "REMOTE"
          | "HYBRID",
        stipendMin: form.stipendMin
          ? Number(form.stipendMin)
          : undefined,
        stipendMax: form.stipendMax
          ? Number(form.stipendMax)
          : undefined,
        duration: form.duration || undefined,
        applyLink: form.applyLink,
        source: form.source,
        deadline: form.deadline
          ? new Date(form.deadline)
          : undefined,
        branches: form.branches
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean),
      });

      alert("Internship Created Successfully ✅");

      setForm({
        title: "",
        company: "",
        location: "",
        workMode: "ONSITE",
        stipendMin: "",
        stipendMax: "",
        duration: "",
        applyLink: "",
        source: "",
        deadline: "",
        branches: "",
      });

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to create internship");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-surface p-4 space-y-3"
    >
      <h2 className="text-sm font-semibold">
        Add Internship
      </h2>

      <Input
        name="title"
        placeholder="Internship Title"
        value={form.title}
        onChange={handleChange}
      />

      <Input
        name="company"
        placeholder="Company"
        value={form.company}
        onChange={handleChange}
      />

      <Input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
      />

      <select
        name="workMode"
        value={form.workMode}
        onChange={handleChange}
        className="w-full rounded-md border p-2"
      >
        <option value="ONSITE">Onsite</option>
        <option value="REMOTE">Remote</option>
        <option value="HYBRID">Hybrid</option>
      </select>

      <div className="grid grid-cols-2 gap-2">
        <Input
          name="stipendMin"
          placeholder="Min Stipend"
          value={form.stipendMin}
          onChange={handleChange}
        />

        <Input
          name="stipendMax"
          placeholder="Max Stipend"
          value={form.stipendMax}
          onChange={handleChange}
        />
      </div>

      <Input
        name="duration"
        placeholder="Duration (eg. 6 Months)"
        value={form.duration}
        onChange={handleChange}
      />

      <Input
        name="branches"
        placeholder="Branches (comma separated)"
        value={form.branches}
        onChange={handleChange}
      />

      <Input
        name="applyLink"
        placeholder="Apply URL"
        value={form.applyLink}
        onChange={handleChange}
      />

      <Input
        name="source"
        placeholder="Source"
        value={form.source}
        onChange={handleChange}
      />

      <Input
        type="date"
        name="deadline"
        value={form.deadline}
        onChange={handleChange}
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? "Creating..." : "Create Internship"}
      </Button>
    </form>
  );
}