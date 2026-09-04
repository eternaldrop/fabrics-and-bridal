export interface PaletteSwatch {
  hex: string;
  label: string;
}

export function MoodBoardPalette({
  palette,
  size = "md",
}: {
  palette: PaletteSwatch[];
  size?: "sm" | "md";
}) {
  const swatchHeight = size === "sm" ? "h-12" : "h-20";

  return (
    <div className="flex gap-2">
      {palette.map((swatch) => (
        <div key={swatch.hex} className="flex-1 min-w-0">
          <div
            className={`w-full ${swatchHeight} border border-taupe/20`}
            style={{ backgroundColor: swatch.hex }}
          />
          {size === "md" && (
            <p className="text-xs text-taupe mt-1.5 truncate">{swatch.label}</p>
          )}
        </div>
      ))}
    </div>
  );
}
