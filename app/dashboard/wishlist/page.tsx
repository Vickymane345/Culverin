import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { wishlist } from "@/lib/mock-data";
import { formatNGN } from "@/lib/utils";

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">Wishlist</h1>
        <p className="mt-1 text-muted">{wishlist.length} saved items.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {wishlist.map((w) => (
          <Card key={w.id} className="group overflow-hidden">
            <div className="relative overflow-hidden">
              <img
                src={w.image}
                alt={w.name}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute left-3 top-3">
                <Badge variant="muted">{w.category}</Badge>
              </div>
            </div>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium leading-snug">{w.name}</h3>
                <span className="font-mono text-sm text-accent whitespace-nowrap">
                  {formatNGN(w.price)}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge variant={w.inStock ? "success" : "warning"}>
                  {w.inStock ? "In stock" : "Back-ordered"}
                </Badge>
                <Button variant="outline" disabled={!w.inStock}>
                  Add to cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
