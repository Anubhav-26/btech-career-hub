"use client";

import { useEffect, useState } from "react";

export default function ApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);

  const userId = "demo-user"; // replace with auth later

  useEffect(() => {
    fetch(`/api/placements/applications?userId=${userId}`)
      .then((res) => res.json())
      .then(setApps);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        My Applications
      </h1>

      <div className="space-y-3">
        {apps.map((a) => (
          <div key={a.id} className="border p-3 rounded">
            <p className="font-semibold">
              {a.company?.name}
            </p>

            <p className="text-sm text-gray-500">
              Role: {a.role}
            </p>

            <p className="text-sm">
              Status: {a.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}