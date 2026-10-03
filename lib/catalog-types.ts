// Catalog types, safe to import from client components.

export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
  image: string;
  position: number;
}

export interface ProductOption {
  label: string;
  /** NGN */
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategoryId;
  /** NGN, the lowest option price */
  price: number;
  tagline: string;
  /** First image, used on cards */
  image: string;
  images: string[];
  rating: number;
  badge?: string;
  options: ProductOption[];
  colours: string[];
  specs: Record<string, string>;
  position: number;
  active: boolean;
}
