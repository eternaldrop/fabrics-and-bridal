import Link from "next/link";

function buildHref(basePath: string, params: Record<string, string | undefined>, page: number) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && key !== "page") query.set(key, value);
  }
  if (page > 1) query.set("page", String(page));
  const qs = query.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({
  basePath,
  searchParams,
  page,
  totalPages,
}: {
  basePath: string;
  searchParams: Record<string, string | undefined>;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2 mt-14 pt-8 border-t border-taupe/30">
      <Link
        href={buildHref(basePath, searchParams, Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={`px-3 py-2 text-sm border border-taupe/40 rounded-brand ${
          page === 1 ? "pointer-events-none text-taupe/40" : "text-ink hover:border-ink"
        }`}
      >
        Previous
      </Link>

      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(basePath, searchParams, p)}
          className={`w-9 h-9 flex items-center justify-center text-sm rounded-brand border ${
            p === page
              ? "bg-ink text-cream border-ink"
              : "border-taupe/40 text-ink hover:border-ink"
          }`}
        >
          {p}
        </Link>
      ))}

      <Link
        href={buildHref(basePath, searchParams, Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={`px-3 py-2 text-sm border border-taupe/40 rounded-brand ${
          page === totalPages ? "pointer-events-none text-taupe/40" : "text-ink hover:border-ink"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
