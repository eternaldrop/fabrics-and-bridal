export function SaleBadge({ percent, className = "" }: { percent: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center bg-blush text-cream text-[11px] font-medium tracking-wide uppercase px-2 py-1 rounded-brand ${className}`}
    >
      -{percent}%
    </span>
  );
}
