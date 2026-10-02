import { getProduct, type Product } from "./catalog";

// Higher storage/capacity tiers cost more. One formula, used by the product
// page and by the server when it prices an order, so they can never disagree.
export function priceFor(product: Product, optionIndex: number) {
  const i = Math.max(0, Math.min(optionIndex, product.options.length - 1));
  return product.price + i * Math.round(product.price * 0.12);
}

export interface CartLine {
  category: string;
  slug: string;
  option: number;
  colour: number;
  quantity: number;
}

export interface PricedLine {
  product: Product;
  option: string | null;
  colour: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export const MAX_QTY = 10;

/** Prices a cart from the catalog. Unknown products are dropped. */
export function priceCart(lines: CartLine[]): PricedLine[] {
  const out: PricedLine[] = [];
  for (const l of lines) {
    const product = getProduct(String(l.category), String(l.slug));
    if (!product) continue;
    const quantity = Math.max(1, Math.min(MAX_QTY, Math.floor(Number(l.quantity) || 1)));
    const optionIndex = Math.max(0, Math.floor(Number(l.option) || 0));
    const colourIndex = Math.max(0, Math.floor(Number(l.colour) || 0));
    const unitPrice = priceFor(product, optionIndex);
    out.push({
      product,
      option: product.options[optionIndex] ?? product.options[0] ?? null,
      colour: product.colours[colourIndex] ?? product.colours[0] ?? null,
      unitPrice,
      quantity,
      lineTotal: unitPrice * quantity,
    });
  }
  return out;
}

// Delivery fees in NGN. Adjust to match your courier rates.
export const DELIVERY = {
  lagos: 5000,
  otherStates: 10000,
  /** Matches the "Free Lagos delivery" promise on the shop page. */
  freeLagosAbove: 250000,
};

export function deliveryFee(state: string, subtotal: number) {
  if (subtotal === 0) return 0;
  const lagos = state.trim().toLowerCase() === "lagos";
  if (lagos) return subtotal >= DELIVERY.freeLagosAbove ? 0 : DELIVERY.lagos;
  return DELIVERY.otherStates;
}

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
  "Yobe", "Zamfara",
];
