"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProductImage } from "@/components/product-image";
import { formatCurrency } from "@/lib/utils";
import { Star } from "lucide-react";

export function ProductCard({
  product,
  fridgeId,
  stock,
  avgRating,
  commentCount,
}: {
  product: Product;
  fridgeId: string;
  stock: number;
  avgRating: number | null;
  commentCount: number;
}) {
  const outOfStock = stock === 0;

  const content = (
    <Card
      className={`group h-full overflow-hidden transition-[background-color,box-shadow,transform] duration-base ease-out-quart ${
        outOfStock
          ? "opacity-60"
          : "hover:bg-muted/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
      }`}
    >
      <ProductImage
        src={product.imageUrl}
        alt={product.nombre}
        emojiFallback={product.imageEmoji}
        aspect="card"
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold tracking-tight leading-snug text-pretty">
            {product.nombre}
          </h3>
          {outOfStock ? (
            <Badge tone="destructive">Sin stock</Badge>
          ) : stock <= 3 ? (
            <Badge tone="accent">Quedan {stock}</Badge>
          ) : (
            <Badge tone="muted">Stock {stock}</Badge>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{product.tipo}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-semibold text-primary">
            {formatCurrency(product.precio)}
          </span>
          {avgRating !== null && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              {avgRating.toFixed(1)}
              {commentCount > 0 && ` · ${commentCount}`}
            </span>
          )}
        </div>
      </div>
    </Card>
  );

  if (outOfStock) return <div aria-disabled>{content}</div>;
  return (
    <Link
      href={`/products/${product.id}?fridge=${fridgeId}`}
      className="cursor-pointer"
    >
      {content}
    </Link>
  );
}
