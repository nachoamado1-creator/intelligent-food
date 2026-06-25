"use client";

import { use, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/top-bar";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { useStore } from "@/lib/store";
import { useSearchParams } from "next/navigation";
import { LocationMap } from "@/components/ui/expand-map";

export default function FridgePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();

  const fridges = useStore((s) => s.fridges);
  const stock = useStore((s) => s.stock);
  const products = useStore((s) => s.products);
  const comments = useStore((s) => s.comments);

  const fridge = useMemo(() => fridges.find((f) => f.id === id), [fridges, id]);

  const fridgeProducts = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of stock) {
      if (s.fridgeId !== id) continue;
      map.set(s.productId, (map.get(s.productId) ?? 0) + s.cantidad);
    }
    return Array.from(map.entries())
      .map(([pid, cantidad]) => {
        const product = products.find((p) => p.id === pid);
        return product ? { product, stock: cantidad } : null;
      })
      .filter((x): x is { product: NonNullable<typeof x>["product"]; stock: number } => x !== null);
  }, [stock, products, id]);

  const ratingByProduct = useMemo(() => {
    const m = new Map<string, { count: number; avg: number }>();
    for (const c of comments) {
      const prev = m.get(c.productId) ?? { count: 0, avg: 0 };
      const next = {
        count: prev.count + 1,
        avg: (prev.avg * prev.count + c.rating) / (prev.count + 1),
      };
      m.set(c.productId, next);
    }
    return m;
  }, [comments]);

  const initialQ = searchParams.get("q") ?? "";
  const [q, setQ] = useState(initialQ);

  const filtered = useMemo(() => {
    if (!q.trim()) return fridgeProducts;
    const t = q.toLowerCase();
    return fridgeProducts.filter(
      (p) =>
        p.product.nombre.toLowerCase().includes(t) ||
        p.product.tipo.toLowerCase().includes(t) ||
        p.product.tags.join(" ").toLowerCase().includes(t)
    );
  }, [q, fridgeProducts]);

  if (!fridge) return notFound();

  const inStockFirst = [...filtered].sort((a, b) => {
    if (a.stock === 0 && b.stock !== 0) return 1;
    if (a.stock !== 0 && b.stock === 0) return -1;
    return a.product.tipo.localeCompare(b.product.tipo);
  });

  return (
    <>
      <TopBar back fallbackHref="/home" />

      <section className="container max-w-3xl mt-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight">{fridge.nombre}</h1>
              <p className="mt-1 text-sm text-muted-foreground inline-flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>{fridge.ubicacion}</span>
              </p>
            </div>
            <Badge tone={fridge.estado === "Habilitada" ? "success" : "muted"}>
              {fridge.distanceKm.toFixed(1)} km
            </Badge>
          </div>

          <div className="mt-4">
            <LocationMap
              size="md"
              location={fridge.nombre}
              coordinates={fridge.coordinates}
            />
          </div>

          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar dentro de esta heladera"
              className="pl-9"
            />
          </div>
        </div>
      </section>

      <section className="container max-w-3xl mt-6">
        {inStockFirst.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">
            No encontramos coincidencias.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {inStockFirst.map((p, i) => {
              const rating = ratingByProduct.get(p.product.id);
              return (
                <div
                  key={p.product.id}
                  className="stagger-item"
                  style={{ "--i": Math.min(i, 8) } as React.CSSProperties}
                >
                  <ProductCard
                    product={p.product}
                    fridgeId={fridge.id}
                    stock={p.stock}
                    avgRating={rating?.avg ?? null}
                    commentCount={rating?.count ?? 0}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
