// Writes supabase/seed/catalog_seed.sql from lib/catalog-seed.ts.
// Run: node --experimental-strip-types scripts/generate-catalog-seed.mts
import { writeFileSync } from "node:fs";
import { seedCategories, seedProducts } from "../lib/catalog-seed.ts";

const q = (s: string) => `'${String(s).replace(/'/g, "''")}'`;
const lines: string[] = [
  "-- Seeds the catalog with the products the site launched with.",
  "-- Safe to run more than once: existing rows are left alone.",
  "begin;",
];

seedCategories.forEach((c, i) => {
  lines.push(
    `insert into public.categories (id, name, blurb, image, position) values (${q(c.id)}, ${q(c.name)}, ${q(c.blurb)}, ${q(c.image)}, ${i}) on conflict (id) do nothing;`
  );
});

seedProducts.forEach((p, i) => {
  const options = p.options.map((label, n) => ({ label, price: p.price + n * Math.round(p.price * 0.12) }));
  const colours = `array[${p.colours.map(q).join(", ")}]::text[]`;
  lines.push(
    `insert into public.products (slug, name, brand, category_id, price, tagline, rating, badge, options, colours, specs, position) values (` +
      [q(p.slug), q(p.name), q(p.brand), q(p.category), p.price, q(p.tagline), p.rating, p.badge ? q(p.badge) : "null",
        `${q(JSON.stringify(options))}::jsonb`, p.colours.length ? colours : "'{}'::text[]", `${q(JSON.stringify(p.specs))}::jsonb`, i].join(", ") +
      `) on conflict (slug) do nothing;`
  );
  lines.push(
    `insert into public.product_images (product_id, image_url, position) select id, ${q(p.image)}, 0 from public.products where slug = ${q(p.slug)} and not exists (select 1 from public.product_images pi where pi.product_id = products.id);`
  );
});

lines.push("commit;", "");
writeFileSync("supabase/seed/catalog_seed.sql", lines.join("\n"));
console.log(`categories ${seedCategories.length}, products ${seedProducts.length}`);
