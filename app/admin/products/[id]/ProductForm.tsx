"use client";

import { useActionState } from "react";
import { saveProduct } from "../../catalog-actions";
import { FormMessage } from "@/components/ui/form-message";
import type { Category, Product } from "@/lib/catalog-types";

const input = "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-accent";
const label = "block text-sm font-medium";
const hint = "mt-1 block text-xs font-normal text-muted";

const badges = ["", "New", "Flagship", "Best value", "Editor's pick"];

export default function ProductForm({
  product,
  categories,
  notice,
}: {
  product?: Product;
  categories: Category[];
  notice?: string;
}) {
  const [state, action, pending] = useActionState(saveProduct, undefined);

  return (
    <form action={action} className="space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}
      <FormMessage error={state?.error} message={state?.message ?? notice} />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Product name
          <input name="name" defaultValue={product?.name} required className={input} />
        </label>
        <label className={label}>
          Category
          <select name="category" defaultValue={product?.category ?? ""} required className={input}>
            <option value="" disabled>Choose a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className={label}>
          Brand
          <input name="brand" defaultValue={product?.brand} placeholder="Apple, Samsung, HP…" className={input} />
        </label>
        <label className={label}>
          Badge
          <select name="badge" defaultValue={product?.badge ?? ""} className={input}>
            {badges.map((b) => (
              <option key={b} value={b}>{b || "None"}</option>
            ))}
          </select>
        </label>
        <label className={`${label} sm:col-span-2`}>
          Short description
          <input name="tagline" defaultValue={product?.tagline} placeholder="A18 Pro. 48MP Fusion camera." className={input} />
        </label>
      </div>

      <fieldset className="rounded-2xl border border-line p-4">
        <legend className="px-1 text-sm font-medium">Pricing (₦)</legend>
        <label className={label}>
          Options and prices
          <span className={hint}>One per line: <code>label | price</code>. Example: <code>256GB | 1650000</code>. The lowest becomes the &ldquo;from&rdquo; price.</span>
          <textarea
            name="options"
            rows={4}
            defaultValue={product?.options.map((o) => `${o.label} | ${o.price}`).join("\n")}
            className={`${input} mt-2 font-mono`}
          />
        </label>
        <label className={`${label} mt-4`}>
          Single price
          <span className={hint}>Only used when there are no options above.</span>
          <input name="price" inputMode="numeric" defaultValue={product?.options.length ? "" : product?.price} className={`${input} mt-2`} />
        </label>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Colours
          <span className={hint}>Separate with commas.</span>
          <input name="colours" defaultValue={product?.colours.join(", ")} placeholder="Black, White, Blue" className={`${input} mt-2`} />
        </label>
        <label className={label}>
          Web address (slug)
          <span className={hint}>Leave blank to make one from the name.</span>
          <input name="slug" defaultValue={product?.slug} placeholder="iphone-17-pro" className={`${input} mt-2`} />
        </label>
        <label className={`${label} sm:col-span-2`}>
          Tech specs
          <span className={hint}>One per line: <code>Name: value</code>. Example: <code>Chip: A18 Pro</code></span>
          <textarea
            name="specs"
            rows={5}
            defaultValue={product ? Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join("\n") : ""}
            className={`${input} mt-2 font-mono`}
          />
        </label>
        <label className={label}>
          Rating (0 to 5)
          <input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={product?.rating ?? 4.5} className={`${input} mt-2`} />
        </label>
        <label className={label}>
          Display order
          <span className={hint}>Lower numbers show first under &ldquo;Featured&rdquo;.</span>
          <input name="position" type="number" defaultValue={product?.position ?? 0} className={`${input} mt-2`} />
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" name="is_active" defaultChecked={product?.active ?? true} className="size-4 accent-[#0066cc]" />
        Show this product in the shop
      </label>

      <button type="submit" disabled={pending} className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white disabled:opacity-60">
        {pending ? "Saving…" : product ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
