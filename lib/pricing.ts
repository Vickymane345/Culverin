import type { Product } from "./catalog-types";

/** Price of the chosen option, or the base price for single-price products. */
export function priceFor(product: Product, optionIndex: number) {
  if (!product.options.length) return product.price;
  const i = Math.max(0, Math.min(optionIndex, product.options.length - 1));
  return product.options[i].price;
}

/**
 * One line in the bag. The name, image and price are a snapshot taken when the
 * item was added, used only for display. Checkout always re-prices every line
 * from the database on the server, so an edited snapshot changes nothing.
 */
export interface CartLine {
  category: string;
  slug: string;
  option: number;
  colour: number;
  quantity: number;
  name: string;
  image: string;
  unitPrice: number;
  optionLabel: string | null;
  colourLabel: string | null;
}

export const MAX_QTY = 10;

export function cartLineFor(product: Product, option: number, colour: number): Omit<CartLine, "quantity"> {
  return {
    category: product.category,
    slug: product.slug,
    option,
    colour,
    name: product.name,
    image: product.image,
    unitPrice: priceFor(product, option),
    optionLabel: product.options[option]?.label ?? null,
    colourLabel: product.colours[colour] ?? null,
  };
}

export function isValidLine(l: unknown): l is CartLine {
  const x = l as CartLine;
  return Boolean(x && typeof x.slug === "string" && typeof x.name === "string" && typeof x.unitPrice === "number");
}

export function lineTotal(l: CartLine) {
  return l.unitPrice * l.quantity;
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
