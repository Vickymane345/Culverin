"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleWishlist } from "@/app/actions/wishlist";

export default function RemoveFromWishlist({ category, slug }: { category: string; slug: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await toggleWishlist(category, slug);
          router.refresh();
        })
      }
      className="text-sm text-muted hover:text-danger disabled:opacity-50"
    >
      Remove
    </button>
  );
}
