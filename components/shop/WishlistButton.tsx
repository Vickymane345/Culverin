"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isInWishlist, toggleWishlist } from "@/app/actions/wishlist";
import { cn } from "@/lib/utils";

export default function WishlistButton({
  category,
  slug,
  className,
}: {
  category: string;
  slug: string;
  className?: string;
}) {
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  // Product pages are static, so the saved state is fetched after load.
  useEffect(() => {
    let live = true;
    isInWishlist(slug).then((v) => live && setSaved(v)).catch(() => {});
    return () => {
      live = false;
    };
  }, [slug]);

  return (
    <button
      type="button"
      aria-pressed={saved}
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await toggleWishlist(category, slug);
          if ("saved" in res) setSaved(res.saved);
          else if (res.error === "signin") router.push(`/signin?next=${encodeURIComponent(pathname)}`);
        })
      }
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3.5 text-sm font-medium transition-colors disabled:opacity-60",
        saved ? "border-accent text-accent" : "border-line hover:border-accent hover:text-accent",
        className
      )}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill={saved ? "currentColor" : "none"}>
        <path
          d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
      {saved ? "Saved to wishlist" : "Save to wishlist"}
    </button>
  );
}
