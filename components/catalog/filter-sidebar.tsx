"use client";

import { PriceRangeSlider } from "@/components/catalog/price-range-slider";

interface FilterOption {
  label: string;
  value: string;
}

// Still a plain GET form — filters live in the URL, so results stay
// shareable/bookmarkable — but category/occasion/price now resubmit it the
// moment an option is picked, instead of waiting for "Apply filters".
export function FilterSidebar({
  basePath,
  searchParams,
  categoryLabel = "Category",
  categoryOptions,
  occasionOptions,
  sizeOptions,
  priceBounds,
}: {
  basePath: string;
  searchParams: Record<string, string | undefined>;
  categoryLabel?: string;
  categoryOptions: FilterOption[];
  occasionOptions: FilterOption[];
  sizeOptions?: FilterOption[];
  priceBounds: { min: number; max: number };
}) {
  const hasActiveFilters = Object.values(searchParams).some(Boolean);

  return (
    <form action={basePath} method="get" className="space-y-8">
      <div>
        <label htmlFor="search" className="block text-xs text-taupe uppercase tracking-wide mb-2">
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

      {categoryOptions.length > 0 && (
        <RadioGroup
          title={categoryLabel}
          name="category"
          options={categoryOptions}
          selected={searchParams.category}
        />
      )}

      {occasionOptions.length > 0 && (
        <RadioGroup
          title="Occasion"
          name="occasion"
          options={occasionOptions}
          selected={searchParams.occasion}
        />
      )}

      {sizeOptions && sizeOptions.length > 0 && (
        <RadioGroup
          title="Size"
          name="size"
          options={sizeOptions}
          selected={searchParams.size}
        />
      )}

      <div>
        <p className="text-xs text-taupe uppercase tracking-wide mb-3">Price range</p>
        <PriceRangeSlider
          min={priceBounds.min}
          max={priceBounds.max}
          defaultMin={searchParams.minPrice ? Number(searchParams.minPrice) : undefined}
          defaultMax={searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined}
          onCommit={(e) => e.currentTarget.form?.requestSubmit()}
        />
      </div>

      <div className="space-y-3 pt-2">
        <button
          type="submit"
          className="w-full px-5 py-2.5 text-sm bg-ink text-cream rounded-brand hover:bg-ink/90 transition-colors"
        >
          Search
        </button>
        {hasActiveFilters && (
          <a
            href={basePath}
            className="block text-center text-sm text-taupe hover:text-ink underline decoration-taupe underline-offset-4"
          >
            Clear filters
          </a>
        )}
      </div>
    </form>
  );
}

function RadioGroup({
  title,
  name,
  options,
  selected,
}: {
  title: string;
  name: string;
  options: FilterOption[];
  selected?: string;
}) {
  return (
    <div>
      <p className="text-xs text-taupe uppercase tracking-wide mb-3">{title}</p>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer transition-colors duration-150 hover:text-blush">
          <input
            type="radio"
            name={name}
            value=""
            defaultChecked={!selected}
            className="accent-ink transition-transform duration-150 active:scale-90"
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
          />
          All
        </label>
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer transition-colors duration-150 hover:text-blush">
            <input
              type="radio"
              name={name}
              value={opt.value}
              defaultChecked={selected === opt.value}
              className="accent-ink transition-transform duration-150 active:scale-90"
              onChange={(e) => e.currentTarget.form?.requestSubmit()}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}
