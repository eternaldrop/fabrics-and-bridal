export function AdminStatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="border border-taupe/30 rounded-brand p-5">
      {icon && (
        <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 ${accent ?? "bg-taupe/15 text-ink"}`}>
          {icon}
        </div>
      )}
      <p className="text-xs text-taupe uppercase tracking-wide">{label}</p>
      <p className="font-serif text-2xl mt-1">{value}</p>
    </div>
  );
}
