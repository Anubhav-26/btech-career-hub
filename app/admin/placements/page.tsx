"use client";

import { useEffect, useState } from "react";

export default function AdminPlacementsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [companyFilter, setCompanyFilter] = useState("ALL");

  // ✅ STEP 4: RESUME MODAL STATE
  

  const fetchApps = async () => {
    setLoading(true);

    const res = await fetch("/api/admin/placements/applications");
    const data = await res.json();

    setApps(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // ==============================
  // STATUS UPDATE
  // ==============================
  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/placements/applications/status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        status,
      }),
    });

    fetchApps();
  };

  // ==============================
  // FILTER
  // ==============================
  const filteredApps = apps.filter((a) => {
    const statusMatch =
      statusFilter === "ALL" || a.status === statusFilter;

    const companyMatch =
      companyFilter === "ALL" ||
      a.company?.name === companyFilter;

    return statusMatch && companyMatch;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Admin Placement Applications
      </h1>

      {/* FILTER BAR */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="APPLIED">Applied</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="REJECTED">Rejected</option>
          <option value="SELECTED">Selected</option>
        </select>

        <select
          className="border p-2 rounded"
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
        >
          <option value="ALL">All Companies</option>

          {[...new Set(apps.map((a) => a.company?.name))].map(
            (name) =>
              name && (
                <option key={name} value={name}>
                  {name}
                </option>
              )
          )}
        </select>

        <button
          onClick={() => {
            setStatusFilter("ALL");
            setCompanyFilter("ALL");
            fetchApps();
          }}
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          Reset
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Student</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Company</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Applied At</th>
                <th className="p-2 border">Resume</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id}>
                  <td className="p-2 border">
                    {app.user?.name || "N/A"}
                  </td>

                  <td className="p-2 border text-sm text-gray-600">
                    {app.user?.email || "N/A"}
                  </td>

                  <td className="p-2 border">
                    {app.company?.name || "N/A"}
                  </td>

                  <td className="p-2 border">{app.role}</td>

                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        app.status === "SELECTED"
                          ? "bg-green-500"
                          : app.status === "SHORTLISTED"
                          ? "bg-blue-500"
                          : app.status === "REJECTED"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>

                  <td className="p-2 border">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>

                  {/* RESUME BUTTON (STEP 4 ADDED HERE) */}
                  <td className="p-2 border">
                   <span className="text-gray-400">
                     Resume feature unavailable
                        </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-2 border flex gap-2 flex-wrap">
                    <button
                      onClick={() =>
                        updateStatus(app.id, "SHORTLISTED")
                      }
                      className="px-2 py-1 bg-blue-500 text-white text-sm rounded"
                    >
                      Shortlist
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(app.id, "REJECTED")
                      }
                      className="px-2 py-1 bg-red-500 text-white text-sm rounded"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(app.id, "SELECTED")
                      }
                      className="px-2 py-1 bg-green-600 text-white text-sm rounded"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredApps.length === 0 && (
            <p className="text-center mt-4 text-gray-500">
              No applications found
            </p>
          )}
        </div>
      )}

      
    </div>
  );
}