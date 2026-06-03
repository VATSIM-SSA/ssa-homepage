export function Header({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`w-full flex items-center justify-center gap-3 ${className}`.trim()}
    >
      <div className="h-0 border-b border-primary w-full" />
      <h1 className="whitespace-nowrap text-xl font-semibold tracking-tight text-white sm:text-3xl lg:text-5xl">
        {text}
      </h1>
      <div className="h-0 border-b border-primary w-full" />
    </div>
  );
}
