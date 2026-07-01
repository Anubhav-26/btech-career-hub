export function AppCard({ title, description, children }: any) {
  return (
    <div className="rounded-xl border bg-surface p-4 hover:shadow-md transition">
      <h3 className="font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-3">{children}</div>
    </div>
  );
}