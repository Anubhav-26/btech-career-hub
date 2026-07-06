"use client";

import {
  deleteInternship,
} from "@/app/admin/internships/actions";

import { Button } from "@/components/ui/button";

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string | null;
  workMode: string;
  stipendMin: number | null;
  stipendMax: number | null;
  duration: string | null;
  applyLink: string;
  source: string;
  deadline: Date | null;
  branches: string[];
}

interface Props {
  data: Internship[];
}

export default function InternshipTable({
  data,
}: Props) {
  async function handleDelete(id: string) {
    if (!confirm("Delete this internship?")) return;

    try {
      await deleteInternship(id);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to delete internship");
    }
  }

  return (
    <div className="overflow-x-auto">

      <table className="w-full text-sm">

        <thead>

          <tr className="border-b">

            <th className="p-3 text-left">
              Title
            </th>

            <th className="p-3 text-left">
              Company
            </th>

            <th className="p-3 text-left">
              Work Mode
            </th>

            <th className="p-3 text-left">
              Stipend
            </th>

            <th className="p-3 text-left">
              Deadline
            </th>

            <th className="p-3 text-right">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {data.map((item) => (

            <tr
              key={item.id}
              className="border-b"
            >

              <td className="p-3">
                {item.title}
              </td>

              <td className="p-3">
                {item.company}
              </td>

              <td className="p-3">
                {item.workMode}
              </td>

              <td className="p-3">

                {item.stipendMin || item.stipendMax
                  ? `₹${item.stipendMin ?? 0} - ₹${item.stipendMax ?? 0}`
                  : "-"}

              </td>

              <td className="p-3">

                {item.deadline
                  ? new Date(item.deadline).toLocaleDateString()
                  : "-"}

              </td>

              <td className="p-3">

                <div className="flex justify-end gap-2">

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={item.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      handleDelete(item.id)
                    }
                  >
                    Delete
                  </Button>

                </div>

              </td>

            </tr>

          ))}

          {data.length === 0 && (

            <tr>

              <td
                colSpan={6}
                className="p-8 text-center text-muted-foreground"
              >
                No internships found.
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}