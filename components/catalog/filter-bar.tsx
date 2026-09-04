interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  basePath: string;
  searchParams: Record<string, string | undefined>;
  filters: {
    category: FilterOption[];
    color: FilterOption[];
    material?: FilterOption[];
    occasion: FilterOption[];
  };
}

// Plain <form> with a GET method — filters live in the URL, so results are
// shareable/bookmarkable and need no client-side state.
export function FilterBar({ basePath, searchParams, filters }: FilterBarProps) {
  return (
    <form action={basePath} method="get" className="flex flex-wrap items-end gap-4 pb-8 border-b border-taupe/30 mb-8">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="search" className="block text-xs text-taupe mb-1">
          Search
        </label>
        <input
          id="search"
          name="search"
          type="text"
          defaultValue={searchParams.search ?? ""}
          placeholder="Search by name or keyword"
          className="w-full bg-cream border border-taupe/50 rounded-brand px-3 py-2 text-sm text-ink placeholder:text-taupe focus:outline-none focus:border-ink"
        />
      </div>

      {filters.category.length > 0 && (
        <Select name="category" label="Category" options={filters.category} defaultValue={searchParams.category} />
      )}
      {filters.color.length > 0 && (
        <Select name="color" label="Color" options={filters.color} defaultValue={searchParams.color} />
      )}
      {filters.material && filters.material.length > 0 && (
        <Select name="material" label="Fabric type" options={filters.material} defaultValue={searchParams.material} />
      )}
      {filters.occasion.length > 0 && (
        <Select name="occasion" label="Occasion" options={filters.occasion} defaultValue={searchParams.occasion} />
      )}

      <div>
        <label htmlFor="minPrice" className="block text-xs text-taupe mb-1">
          Min price
        </label>
        <input
          id="minPrice"
          name="minPrice"
          type="number"
          defaultValue={searchParams.minPrice ?? ""}
          className="w-28 bg-cream border border-taupe/50 rounded-brand px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink"
        />
      </div>
      <div>
        <label htmlFor="maxPrice" className="block text-xs text-taupe mb-1">
          Max price
        </label>
        <input
          id="maxPrice"
          name="maxPrice"
          type="number"
          defaultValue={searchParams.maxPrice ?? ""}
          className="w-28 bg-cream border border-taupe/50 rounded-brand px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink"
        />
      </div>

      <button
        type="submit"
        className="px-5 py-2 text-sm bg-ink text-cream rounded-brand hover:bg-ink/90 transition-colors"
      >
        Apply filters
      </button>
      {Object.values(searchParams).some(Boolean) && (
        <a href={basePath} className="text-sm text-taupe hover:text-ink underline decoration-taupe underline-offset-4">
          Clear
        </a>
      )}
    </form>
  );
}

function Select({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: FilterOption[];
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs text-taupe mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        className="bg-cream border border-taupe/50 rounded-brand px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
