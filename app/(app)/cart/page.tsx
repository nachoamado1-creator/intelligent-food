"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Tag,
  X,
  ShoppingBag,
  ArrowRight,
  Plus,
  Minus,
  Search,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { cn, formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { toast } = useToast();
  const cart = useStore((s) => s.cart);
  const products = useStore((s) => s.products);
  const fridges = useStore((s) => s.fridges);
  const user = useStore((s) => s.getCurrentUser());
  const group = useStore((s) => s.getCurrentGroup());
  const users = useStore((s) => s.users);
  const cupones = useStore((s) => s.cupones);
  const appliedCouponId = useStore((s) => s.appliedCouponId);
  const applyCoupon = useStore((s) => s.applyCoupon);
  const removeCoupon = useStore((s) => s.removeCoupon);
  const updateCartItem = useStore((s) => s.updateCartItem);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const clearCart = useStore((s) => s.clearCart);
  const getStock = useStore((s) => s.getStock);
  const userCupones = useMemo(
    () => (user ? cupones.filter((c) => c.userId === user.id) : []),
    [cupones, user]
  );

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | undefined>();
  const [productQuery, setProductQuery] = useState("");
  const findNearest = useStore((s) => s.findNearestFridgeWithStock);

  function handleProductSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!productQuery.trim()) return;
    const f = findNearest(productQuery);
    if (!f) {
      toast(`Sin stock de "${productQuery}" cerca`, "error");
      return;
    }
    toast(`Disponible en ${f.nombre}`, "success");
    router.push(`/fridges/${f.id}?q=${encodeURIComponent(productQuery)}`);
  }

  const members = useMemo(
    () => (group ? users.filter((u) => group.memberIds.includes(u.id)) : user ? [user] : []),
    [group, users, user]
  );

  const items = cart.map((c) => {
    const p = products.find((pp) => pp.id === c.productId)!;
    const f = fridges.find((ff) => ff.id === c.fridgeId)!;
    const consumer = users.find((u) => u.id === c.consumerUserId);
    return { ...c, product: p, fridge: f, consumer };
  });

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const coupon = appliedCouponId ? cupones.find((c) => c.id === appliedCouponId) : undefined;
  const discount = coupon ? Math.round(subtotal * (coupon.porcentajeDto / 100)) : 0;
  const total = subtotal - discount;

  // Para mostrar info: agrupar visualmente por (heladera × consumidor)
  const grouped = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const it of items) {
      const key = `${it.fridgeId}|${it.consumerUserId}`;
      const arr = map.get(key) ?? [];
      arr.push(it);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [items]);

  const availableCupones = userCupones.filter((c) => c.estado === "Disponible");

  function applyCode() {
    setCouponError(undefined);
    if (!couponInput.trim()) return;
    const r = applyCoupon(couponInput);
    if (!r.ok) {
      setCouponError(r.error);
      toast(r.error ?? "Cupón inválido", "error");
      return;
    }
    toast("Cupón aplicado", "success");
    setCouponInput("");
  }

  if (cart.length === 0) {
    return (
      <>
        <TopBar back fallbackHref="/home" />
        <section className="container max-w-3xl mt-2">
          <div className="mx-auto max-w-sm pt-16 pb-2 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Tu carrito está vacío.
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <TopBar
        back
        fallbackHref="/home"
        right={
          <button
            onClick={() => {
              clearCart();
              toast("Carrito vaciado", "info");
            }}
            className="text-xs text-muted-foreground hover:text-destructive cursor-pointer"
          >
            Vaciar
          </button>
        }
      />

      <section className="container max-w-3xl mt-2 space-y-5">
        <form onSubmit={handleProductSearch}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={productQuery}
              onChange={(e) => setProductQuery(e.target.value)}
              placeholder="¿Querés sumar otro producto? Buscalo acá..."
              className="pl-9 pr-12 h-12"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9"
              variant="ghost"
              aria-label="Buscar"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {grouped.length > 1 && (
          <div className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-foreground/90">
            Tu compra se va a separar en {grouped.length} tickets (uno por heladera/consumidor) y
            cada uno tiene su propio QR.
          </div>
        )}

        {grouped.map(([key, group]) => {
          const [fridgeId, consumerId] = key.split("|");
          const fridge = fridges.find((f) => f.id === fridgeId)!;
          const consumer = users.find((u) => u.id === consumerId);
          return (
            <div key={key} className="space-y-3">
              <div className="flex items-center gap-2 px-1 flex-wrap">
                <Badge tone="primary">{fridge.nombre}</Badge>
                <Badge tone="muted">
                  Para {consumer ? `${consumer.nombre} ${consumer.apellido[0]}.` : "—"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {fridge.distanceKm.toFixed(1)} km
                </span>
              </div>
              {group.map((it) => {
                const maxStock = getStock(it.fridgeId, it.productId);
                return (
                  <Card key={`${it.fridgeId}-${it.productId}`}>
                    <CardContent className="pt-5 pb-5">
                      <div className="flex items-start gap-3">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={it.product.imageUrl}
                            alt={it.product.nombre}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-medium tracking-tight leading-snug">
                              {it.product.nombre}
                            </h3>
                            <button
                              onClick={() => removeFromCart(it.productId, it.fridgeId)}
                              className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                              aria-label="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatCurrency(it.unitPrice)} c/u
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1">
                              <button
                                onClick={() =>
                                  it.quantity > 1
                                    ? updateCartItem(it.productId, it.fridgeId, {
                                        quantity: it.quantity - 1,
                                      })
                                    : removeFromCart(it.productId, it.fridgeId)
                                }
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted cursor-pointer active:scale-[0.97] transition-colors"
                                aria-label="Restar"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-[2ch] text-center text-sm font-semibold">
                                {it.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  it.quantity < maxStock &&
                                  updateCartItem(it.productId, it.fridgeId, {
                                    quantity: it.quantity + 1,
                                  })
                                }
                                className={cn(
                                  "inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                                  it.quantity >= maxStock
                                    ? "opacity-40 cursor-not-allowed"
                                    : "hover:bg-muted cursor-pointer active:scale-[0.97]"
                                )}
                                aria-label="Sumar"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <Select
                              value={it.consumerUserId}
                              onChange={(e) =>
                                updateCartItem(it.productId, it.fridgeId, {
                                  consumerUserId: e.target.value,
                                })
                              }
                              className="h-9 max-w-[180px]"
                            >
                              {members.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.id === user?.id ? "Yo · " : ""}
                                  {m.nombre}
                                </option>
                              ))}
                            </Select>

                            <span className="ml-auto font-semibold">
                              {formatCurrency(it.unitPrice * it.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          );
        })}

        {/* Coupon */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <Label>Cupón</Label>
            {coupon ? (
              <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="font-mono font-medium">{coupon.codigo}</span>
                  <Badge tone="primary">-{coupon.porcentajeDto}%</Badge>
                </div>
                <button
                  onClick={() => {
                    removeCoupon();
                    toast("Cupón removido", "info");
                  }}
                  className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  aria-label="Quitar cupón"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="CUP-XXXXXX"
                  invalid={!!couponError}
                />
                <Button onClick={applyCode} variant="outline">
                  Aplicar
                </Button>
              </div>
            )}
            {availableCupones.length > 0 && !coupon && (
              <div className="mt-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
                  Tus cupones disponibles
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {availableCupones.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setCouponInput(c.codigo);
                        applyCoupon(c.codigo);
                        toast("Cupón aplicado", "success");
                        setCouponInput("");
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs hover:bg-muted transition-colors cursor-pointer active:scale-[0.97]"
                    >
                      <Tag className="h-3 w-3" />
                      <span className="font-mono">{c.codigo}</span>
                      <span className="text-primary font-semibold">-{c.porcentajeDto}%</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Solo se aplica un cupón por compra y debe pertenecer a tu cuenta.
            </p>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardContent className="pt-5 pb-5 space-y-2">
            <Row label="Subtotal" value={formatCurrency(subtotal)} />
            {discount > 0 && (
              <Row
                label={`Cupón ${coupon?.codigo}`}
                value={`- ${formatCurrency(discount)}`}
                emphasis="primary"
              />
            )}
            <div className="h-px bg-border my-1" />
            <Row label="Total" value={formatCurrency(total)} emphasis="strong" />
          </CardContent>
        </Card>

        <Button size="lg" className="w-full" onClick={() => router.push("/checkout")}>
          Continuar al pago <ArrowRight className="h-4 w-4" />
        </Button>
      </section>
    </>
  );
}

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: "primary" | "strong";
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={cn(emphasis === "strong" && "font-semibold text-base")}>{label}</span>
      <span
        className={cn(
          emphasis === "primary" && "text-primary font-medium",
          emphasis === "strong" && "font-semibold text-base"
        )}
      >
        {value}
      </span>
    </div>
  );
}
