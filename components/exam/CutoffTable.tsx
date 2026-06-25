export function CutoffTable({
  cutoffs,
}: {
  cutoffs: { id: string; year: number; category: string; value: number; unit: string }[];
}) {
  if (cutoffs.length === 0) return <p className="text-sm text-ink-muted">Cutoff data not available yet.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-ink-muted">
            <th className="py-2 pr-4 font-medium">Year</th>
            <th className="py-2 pr-4 font-medium">Category</th>
            <th className="py-2 font-medium">Cutoff</th>
          </tr>
        </thead>
        <tbody>
          {cutoffs.map((c) => (
            <tr key={c.id} className="border-b border-border/60">
              <td className="stat-number py-2 pr-4">{c.year}</td>
              <td className="py-2 pr-4">{c.category}</td>
              <td className="stat-number py-2">
                {c.value} <span className="text-ink-muted">{c.unit}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
