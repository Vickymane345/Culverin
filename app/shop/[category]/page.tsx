import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  categories,
  byCategory,
  brandsIn,
  getCategory,
  type CategoryId,
} from "@/lib/catalog";
import CategoryBrowser from "@/components/shop/CategoryBrowser";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return { title: "Shop" };
  return {
    title: `${cat.name} Prices in Nigeria`,
    description: `${cat.blurb} Shop ${cat.name.toLowerCase()} online with delivery across Nigeria.`,
    alternates: { canonical: `/shop/${cat.id}` },
    openGraph: { title: `${cat.name} | Culverin Quantum Systems`, images: [cat.image] },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const items = byCategory(cat.id as CategoryId);
  const brands = brandsIn(cat.id as CategoryId);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 md:pb-24">
      <nav aria-label="Breadcrumb" className="pt-10 text-sm text-muted">
        <Link href="/shop" className="hover:text-foreground">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{cat.name}</span>
      </nav>

      <header className="py-7 md:py-12">
        <h1 className="text-balance font-semibold leading-[1.05] tracking-tight text-[clamp(1.8rem,4vw,3.5rem)]">
          {cat.name}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">{cat.blurb}</p>
      </header>

      <CategoryBrowser products={items} brands={brands} />
    </div>
  );
}
