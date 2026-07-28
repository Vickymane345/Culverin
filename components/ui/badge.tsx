import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Variant = "default" | "success" | "warning" | "info" | "destructive" | "muted";

const variants: Record<Variant, string> = {
  default: "bg-surface text-foreground",
  success: "bg-[#e7f5ed] text-success",
  warning: "bg-amber-400/15 text-[#b45309]",
  info: "bg-accent-soft text-accent",
  destructive: "bg-[#fdeceb] text-danger",
  muted: "bg-surface text-muted",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
