"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function ExamForm() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Exam
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Exam</DialogTitle>

          <DialogDescription>
            Fill the details below to create a new exam.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5">

          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Exam Title
            </label>

            <input
              type="text"
              placeholder="GATE CSE"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Slug
            </label>

            <input
              type="text"
              placeholder="gate-cse"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Category
            </label>

            <select className="w-full rounded-md border px-3 py-2">
              <option value="">Select Category</option>
              <option value="GATE">GATE</option>
              <option value="CAT">CAT</option>
              <option value="PSU">PSU</option>
              <option value="PLACEMENT">PLACEMENT</option>
              <option value="UPSC">UPSC</option>
            </select>
          </div>

          {/* Branch */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Branch
            </label>

            <select className="w-full rounded-md border px-3 py-2">
              <option value="">All Branches</option>
              <option>CSE</option>
              <option>IT</option>
              <option>ECE</option>
              <option>EEE</option>
              <option>ME</option>
              <option>CE</option>
            </select>
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit">
              Save Exam
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}