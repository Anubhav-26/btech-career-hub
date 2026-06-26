"use client";

import { useEffect, useState } from "react";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/placements/companies")
      .then((res) => res.json())
      .then(setCompanies);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Placement Companies
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {companies.map((c) => (
          <div key={c.id} className="border p-4 rounded-lg">
            <h2 className="font-semibold text-lg">{c.name}</h2>
            <p className="text-sm text-gray-500">{c.description}</p>

            <p className="mt-2 text-sm">
              💰 {c.avgPackageLpa ?? "N/A"} LPA
            </p>

            <a
              href={c.website}
              target="_blank"
              className="text-blue-500 text-sm"
            >
              Visit Website
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}