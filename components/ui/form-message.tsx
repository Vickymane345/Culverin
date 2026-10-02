import { cn } from "@/lib/utils";

export function FormMessage({
  error,
  message,
  className,
}: {
  error?: string;
  message?: string;
  className?: string;
}) {
  if (!error && !message) return null;
  return (
    <p
      role={error ? "alert" : "status"}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        error ? "border-danger/30 bg-danger/5 text-danger" : "border-success/30 bg-success/5 text-success",
        className
      )}
    >
      {error ?? message}
    </p>
  );
}
