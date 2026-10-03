import "server-only";
import { getProducts } from "@/lib/catalog";
import type { Product } from "@/lib/catalog-types";
import { MAX_QTY, priceFor } from "@/lib/pricing";

export interface PricedLine {
  product: Product;
  option: string | null;
  colour: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

/** Prices a bag from the live catalog. Unknown or hidden products are dropped. */
export async function priceCart(
  lines: Array<{ category: unknown; slug: unknown; option: unknown; colour: unknown; quantity: unknown }>
): Promise<PricedLine[]> {
  const products = await getProducts();
  const out: PricedLine[] = [];
  for (const l of lines) {
    const product = products.find((p) => p.category === String(l.category) && p.slug === String(l.slug));
    if (!product) continue;
    const quantity = Math.max(1, Math.min(MAX_QTY, Math.floor(Number(l.quantity) || 1)));
    const optionIndex = Math.max(0, Math.floor(Number(l.option) || 0));
    const colourIndex = Math.max(0, Math.floor(Number(l.colour) || 0));
    const unitPrice = priceFor(product, optionIndex);
    out.push({
      product,
      option: product.options[optionIndex]?.label ?? null,
      colour: product.colours[colourIndex] ?? product.colours[0] ?? null,
      unitPrice,
      quantity,
      lineTotal: unitPrice * quantity,
    });
  }
  return out;
}
