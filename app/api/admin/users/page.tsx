"use client";

import useSWR from "swr";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSWR(
    `/api/admin/users?page=${page}&pageSize=10`,
    fetcher
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">

      <h1 className="text-xl font-bold">Users</h1>

      {/* TABLE */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Created</th>
            </tr>
          </thead>

          <tbody>
            {data.users.map((u: any) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.name || "-"}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex gap-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>

        <button
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}