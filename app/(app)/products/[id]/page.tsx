"use client";

import { use, useMemo, useState } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { TopBar } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label, Select } from "@/components/ui/input";
import { Star, Minus, Plus, ShoppingBag } from "lucide-react";
import { ProductImage } from "@/components/product-image";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDateTime, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const search = useSearchParams();
  const fridgeIdParam = search.get("fridge");
  const { toast } = useToast();

  const products = useStore((s) => s.products);
  const fridges = useStore((s) => s.fridges);
  const stock = useStore((s) => s.stock);
  const user = useStore((s) => s.getCurrentUser());
  const group = useStore((s) => s.getCurrentGroup());
  const users = useStore((s) => s.users);
  const allComments = useStore((s) => s.comments);
  const addToCart = useStore((s) => s.addToCart);

  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);
  const comments = useMemo(
    () => allComments.filter((c) => c.productId === id),
    [allComments, id]
  );

  // Heladeras donde existe stock de este producto
  const availableFridgeIds = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of stock) {
      if (s.productId !== id) continue;
      m.set(s.fridgeId, (m.get(s.fridgeId) ?? 0) + s.cantidad);
    }
    return Array.from(m.entries())
      .filter(([, q]) => q > 0)
      .sort(
        (a, b) => (fridges.find((f) => f.id === a[0])?.distanceKm ?? 99) -
          (fridges.find((f) => f.id === b[0])?.distanceKm ?? 99)
      );
  }, [stock, id, fridges]);

  const initialFridge =
    (fridgeIdParam && availableFridgeIds.find(([fid]) => fid === fridgeIdParam))?.[0] ??
    availableFridgeIds[0]?.[0] ??
    null;
  const [fridgeId, setFridgeId] = useState<string | null>(initialFridge);
  const fridge = fridges.find((f) => f.id === fridgeId);
  const stockHere = availableFridgeIds.find(([f]) => f === fridgeId)?.[1] ?? 0;

  const [qty, setQty] = useState(1);
  const [consumer, setConsumer] = useState(user?.id ?? "");

  const members = useMemo(
    () => (group ? users.filter((u) => group.memberIds.includes(u.id)) : user ? [user] : []),
    [group, users, user]
  );

  const avg =
    comments.length > 0
      ? comments.reduce((s, c) => s + c.rating, 0) / comments.length
      : null;

  if (!product) return notFound();

  function add() {
    if (!fridgeId) return;
    if (qty <= 0) {
      toast("La cantidad debe ser mayor a 0", "error");
      return;
    }
    const r = addToCart(product!.id, fridgeId, qty, consumer || user!.id);
    if (!r.ok) {
      toast(r.error ?? "No se pudo agregar", "error");
      return;
    }
    toast("Agregado al carrito", "success");
    router.push("/cart");
  }

  return (
    <>
      <TopBar back fallbackHref={fridgeId ? `/fridges/${fridgeId}` : "/home"} />

      <section className="container max-w-3xl mt-2 space-y-5">
        <div className="rounded-3xl overflow-hidden border border-border">
          <ProductImage
            src={product.imageUrl}
            alt={product.nombre}
            emojiFallback={product.imageEmoji}
            aspect="video"
            priority
            sizes="(max-width: 768px) 100vw, 600px"
          />
          <div className="bg-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary">{product.tipo}</Badge>
              {product.tags.map((t) => (
                <Badge key={t} tone="muted">
                  {t}
                </Badge>
              ))}
              {stockHere === 0 ? (
                <Badge tone="destructive">Sin stock</Badge>
              ) : stockHere <= 3 ? (
                <Badge tone="accent">Quedan {stockHere}</Badge>
              ) : (
                <Badge tone="success">Stock {stockHere}</Badge>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-balance">
              {product.nombre}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">{product.description}</p>
            <div className="mt-5 flex items-end justify-between">
              <span className="text-3xl font-semibold text-primary">
                {formatCurrency(product.precio)}
              </span>
              {avg !== null && (
                <span className="inline-flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  {avg.toFixed(1)}{" "}
                  <span className="text-muted-foreground">({comments.length})</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="pt-5 space-y-4">
            <div>
              <Label htmlFor="fridge">Heladera</Label>
              <Select
                id="fridge"
                value={fridgeId ?? ""}
                onChange={(e) => {
                  setFridgeId(e.target.value);
                  setQty(1);
                }}
              >
                {availableFridgeIds.length === 0 && <option value="">Sin stock</option>}
                {availableFridgeIds.map(([fid, q]) => {
                  const f = fridges.find((ff) => ff.id === fid)!;
                  return (
                    <option key={fid} value={fid}>
                      {f.nombre} · {f.distanceKm.toFixed(1)} km · {q} disp.
                    </option>
                  );
                })}
              </Select>
              {fridge && (
                <p className="text-xs text-muted-foreground mt-1.5">{fridge.ubicacion}</p>
              )}
            </div>

            <div>
              <Label>Cantidad</Label>
              <div className="inline-flex items-center gap-3 rounded-full border border-border bg-background px-2 py-1.5">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted cursor-pointer active:scale-[0.97] transition-colors"
                  aria-label="Restar"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[2ch] text-center font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(stockHere || 1, q + 1))}
                  disabled={qty >= stockHere}
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                    qty >= stockHere
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-muted cursor-pointer active:scale-[0.97]"
                  )}
                  aria-label="Sumar"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="consumer">Consumidor final</Label>
              <Select
                id="consumer"
                value={consumer}
                onChange={(e) => setConsumer(e.target.value)}
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id === user?.id ? "Yo · " : ""}
                    {m.nombre} {m.apellido}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-muted-foreground mt-1.5">
                Cada compra se asocia a un consumidor. Si elegís otro miembro del grupo, se genera
                una compra separada para ellos.
              </p>
            </div>

            <Button
              onClick={add}
              className="w-full"
              size="lg"
              disabled={!fridgeId || stockHere === 0}
            >
              <ShoppingBag className="h-4 w-4" />
              Agregar al carrito
            </Button>
          </CardContent>
        </Card>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">Calificaciones</h2>
            {avg !== null && (
              <span className="text-xs text-muted-foreground">
                Promedio {avg.toFixed(1)} / 5 · {comments.length} reseñas
              </span>
            )}
          </div>

          {comments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Todavía no hay comentarios. Sé el primero después de tu próxima compra.
              </CardContent>
            </Card>
          ) : (
            <ul className="space-y-3">
              {comments.map((c) => (
                <Card key={c.id}>
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                          {c.userName
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{c.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(c.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3.5 w-3.5",
                              i < c.rating
                                ? "fill-accent text-accent"
                                : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-pretty">{c.text}</p>
                  </CardContent>
                </Card>
              ))}
            </ul>
          )}
        </section>
      </section>
    </>
  );
}
