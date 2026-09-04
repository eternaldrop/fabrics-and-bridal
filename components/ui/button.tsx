import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  // Primary CTA: warm near-black fill, per the design brief — pink is an
  // accent, never a large fill.
  primary:
    "bg-ink text-cream border border-ink hover:bg-ink/90",
  // Used for CTAs the brief calls out by name: "Book your consultation" etc.
  secondary:
    "bg-rose text-ink border border-rose hover:bg-blush hover:border-blush",
  ghost:
    "bg-transparent text-ink border border-taupe hover:border-ink",
};

const base =
  "inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-brand transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`${base} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
);
Button.displayName = "Button";

interface LinkButtonProps {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

export function LinkButton({
  href,
  variant = "primary",
  className = "",
  children,
}: LinkButtonProps) {
  return (
    <Link href={href} className={`${base} ${variantClasses[variant]} ${className}`}>
      {children}
    </Link>
  );
}
