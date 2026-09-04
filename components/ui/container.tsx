export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`w-full max-w-7xl mx-auto px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}
