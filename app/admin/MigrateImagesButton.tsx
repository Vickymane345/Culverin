"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { migrateLocalImages } from "./catalog-actions";

export default function MigrateImagesButton({ remaining }: { remaining: number }) {
  const [left, setLeft] = useState(remaining);
  const [note, setNote] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();

  if (left === 0) return null;

  function run() {
    start(async () => {
      let total = 0;
      // Keep going in batches until everything is moved or a batch stalls.
      for (let i = 0; i < 20; i++) {
        const res = await migrateLocalImages();
        if (res.error) {
          setNote(res.error);
          return;
        }
        total += res.moved;
        setLeft(res.remaining);
        setNote(`Moved ${total} so far…`);
        if (res.remaining === 0 || res.moved === 0) break;
      }
      setNote(`Done. Moved ${total} photos to R2.`);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 text-sm">
      <p>
        <strong>{left}</strong> product photos are still served from the website itself. Move them to
        Cloudflare R2 so all images live in one place.
      </p>
      <button
        type="button"
        onClick={run}
        disabled={pending}
        className="mt-3 rounded-full bg-accent px-4 py-2 text-white disabled:opacity-60"
      >
        {pending ? "Moving photos…" : "Move photos to R2"}
      </button>
      {note && <p className="mt-2 text-muted">{note}</p>}
    </div>
  );
}
