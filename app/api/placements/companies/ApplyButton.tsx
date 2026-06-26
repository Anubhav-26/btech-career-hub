"use client";

export default function ApplyButton({
  userId,
  companyId,
}: {
  userId: string;
  companyId: string;
}) {
  const apply = async () => {
    const res = await fetch("/api/placements/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        companyId,
        role: "SDE",
      }),
    });

    if (res.ok) {
      alert("Applied Successfully 🚀");
    } else {
      alert("Already Applied or Error");
    }
  };

  return (
    <button
      onClick={apply}
      className="bg-black text-white px-3 py-1 rounded"
    >
      Apply
    </button>
  );
}