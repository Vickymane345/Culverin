import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getCategory, getProduct, getProducts, related } from "@/lib/catalog";
import ProductBuyPanel from "@/components/shop/ProductBuyPanel";
import ProductCard from "@/components/shop/ProductCard";
import ProductStage from "@/components/shop/ProductStage";
import { Badge } from "@/components/ui/badge";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { formatNGN } from "@/lib/utils";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await getProduct(category, slug);
  if (!product) return { title: "Product" };
  const path = `/shop/${product.category}/${product.slug}`;
  const description = `Buy ${product.name} in Nigeria from ${formatNGN(product.price)}. ${product.tagline} Delivery across Nigeria, 12-month warranty.`;
  return {
    title: `${product.name} Price in Nigeria`,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: `${product.name} | ${SITE_NAME}`,
      description,
      url: path,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const product = await getProduct(category, slug);
  if (!product) notFound();

  const cat = await getCategory(product.category);
  const more = related(await getProducts(), product, 4);
  const absolute = (src: string) => (src.startsWith("http") ? src : `${SITE_URL}${src}`);
  const url = `${SITE_URL}/shop/${product.category}/${product.slug}`;
  const structured = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.tagline,
      image: product.images.length ? product.images.map(absolute) : absolute(product.image),
      sku: product.slug,
      brand: { "@type": "Brand", name: product.brand },
      category: cat?.name,
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "NGN",
        price: product.price,
        availability: "https://schema.org/InStock",
        seller: { "@id": `${SITE_URL}/#organization` },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Shop", item: `${SITE_URL}/shop` },
        { "@type": "ListItem", position: 2, name: cat?.name, item: `${SITE_URL}/shop/${product.category}` },
        { "@type": "ListItem", position: 3, name: product.name, item: url },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 md:pb-24">
      <JsonLd data={structured} />
      <nav aria-label="Breadcrumb" className="pt-10 text-sm text-muted">
        <Link href="/shop" className="hover:text-foreground">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/shop/${product.category}`} className="hover:text-foreground">
          {cat?.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 py-8 md:gap-12 lg:grid-cols-2 lg:gap-16 lg:py-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductStage images={product.images.length ? product.images : [product.image]} alt={product.name} />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {product.brand}
            </p>
            {product.badge && (
              <Badge variant={product.badge === "New" ? "info" : "success"}>
                {product.badge}
              </Badge>
            )}
          </div>

          <h1 className="mt-4 text-balance font-semibold leading-[1.05] tracking-tight text-[clamp(1.7rem,3.5vw,3.25rem)]">
            {product.name}
          </h1>
          <p className="mt-4 text-base text-muted sm:text-lg">{product.tagline}</p>

          <p className="mt-4 flex items-center gap-2 text-sm text-[#b45309]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="m12 2 2.9 6.26 6.85.7-5.12 4.6 1.46 6.72L12 16.9 5.91 20.3l1.46-6.73L2.25 8.96l6.85-.7z" />
            </svg>
            {product.rating.toFixed(1)}
            <span className="text-muted">
              {Math.round(product.rating * 47)} customer reviews
            </span>
          </p>

          <div className="mt-10">
            <ProductBuyPanel product={product} />
          </div>

          <section className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Tech specs
            </h2>
            <dl className="mt-4 divide-y divide-line rounded-2xl border border-line bg-surface">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="flex flex-wrap gap-x-6 gap-y-1 px-5 py-3.5 text-sm">
                  <dt className="w-28 shrink-0 text-muted sm:w-32">{k}</dt>
                  <dd className="text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      {more.length > 0 && (
        <section className="border-t border-line pt-16">
          <h2 className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl md:mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {more.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
