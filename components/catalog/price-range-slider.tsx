"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";

const thumbClasses =
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto " +
  "[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full " +
  "[&::-webkit-slider-thumb]:bg-ink [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-cream " +
  "[&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 " +
  "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-ink [&::-moz-range-thumb]:border-2 " +
  "[&::-moz-range-thumb]:border-cream [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow";

export function PriceRangeSlider({
  min,
  max,
  step = 1000,
  defaultMin,
  defaultMax,
  onCommit,
}: {
  min: number;
  max: number;
  step?: number;
  defaultMin?: number;
  defaultMax?: number;
  // Fired once when the user finishes dragging/pressing a thumb — not on
  // every tick of the drag — so callers can auto-submit the filter form.
  onCommit?: (e: React.SyntheticEvent<HTMLInputElement>) => void;
}) {
  const [minVal, setMinVal] = useState(defaultMin ?? min);
  const [maxVal, setMaxVal] = useState(defaultMax ?? max);

  const range = Math.max(1, max - min);
  const leftPct = ((minVal - min) / range) * 100;
  const rightPct = ((maxVal - min) / range) * 100;

  return (
    <div>
      <div className="flex justify-between text-xs text-taupe mb-3">
        <span>{formatPrice(minVal)}</span>
        <span>{formatPrice(maxVal)}</span>
      </div>

      <div className="relative h-4">
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 rounded-full bg-taupe/20" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-rose"
          style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
        />

        <input
          type="range"
          name="minPrice"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={(e) => setMinVal(Math.min(Number(e.target.value), maxVal - step))}
          onMouseUp={onCommit}
          onTouchEnd={onCommit}
          onKeyUp={onCommit}
          className={`absolute top-1/2 -translate-y-1/2 w-full h-1 appearance-none bg-transparent pointer-events-none ${thumbClasses}`}
        />
        <input
          type="range"
          name="maxPrice"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={(e) => setMaxVal(Math.max(Number(e.target.value), minVal + step))}
          onMouseUp={onCommit}
          onTouchEnd={onCommit}
          onKeyUp={onCommit}
          className={`absolute top-1/2 -translate-y-1/2 w-full h-1 appearance-none bg-transparent pointer-events-none ${thumbClasses}`}
        />
      </div>
    </div>
  );
}
