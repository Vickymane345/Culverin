"use client";

import { useActionState } from "react";
import { saveCategory } from "./catalog-actions";
import { FormMessage } from "@/components/ui/form-message";
import type { Category } from "@/lib/catalog-types";

const input = "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent";

export default function CategoryForm({ category }: { category?: Category }) {
  const [state, action, pending] = useActionState(saveCategory, undefined);
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-[1fr_1fr_6rem_auto] sm:items-end">
      {category && <input type="hidden" name="existingId" value={category.id} />}
      <label className="text-xs text-muted">
        Name
        <input name="name" defaultValue={category?.name} required className={input} />
      </label>
      {!category && (
        <label className="text-xs text-muted">
          Web address (optional)
          <input name="id" placeholder="e.g. smart-home" className={input} />
        </label>
      )}
      <label className={`text-xs text-muted ${category ? "" : "sm:col-span-2"}`}>
        Short description
        <input name="blurb" defaultValue={category?.blurb} className={input} />
      </label>
      <label className="text-xs text-muted">
        Order
        <input name="position" type="number" defaultValue={category?.position ?? 0} className={input} />
      </label>
      <label className="text-xs text-muted sm:col-span-3">
        Cover image URL
        <input name="image" defaultValue={category?.image} placeholder="https://…" className={input} />
      </label>
      <button type="submit" disabled={pending} className="rounded-full bg-accent px-4 py-2 text-sm text-white disabled:opacity-60">
        {pending ? "Saving…" : category ? "Save" : "Add category"}
      </button>
      <FormMessage error={state?.error} message={state?.message} className="sm:col-span-4" />
    </form>
  );
}
