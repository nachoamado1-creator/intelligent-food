"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, cn } from "@/lib/utils";
import { Wallet, CreditCard, ShieldCheck, Check } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const cart = useStore((s) => s.cart);
  const products = useStore((s) => s.products);
  const fridges = useStore((s) => s.fridges);
  const users = useStore((s) => s.users);
  const user = useStore((s) => s.getCurrentUser());
  const group = useStore((s) => s.getCurrentGroup());
  const cupones = useStore((s) => s.cupones);
  const appliedCouponId = useStore((s) => s.appliedCouponId);
  const checkout = useStore((s) => s.checkout);
  const groupBalance = useStore((s) =>
    group ? s.getGroupBalance(group.id) : 0
  );

  const [method, setMethod] = useState<"saldo_grupo" | "mercado_pago">(
    group ? "saldo_grupo" : "mercado_pago"
  );
  const [loading, setLoading] = useState(false);

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

  const grouped = useMemo(() => {
    const m = new Map<string, typeof items>();
    for (const it of items) {
      const key = `${it.fridgeId}|${it.consumerUserId}`;
      const arr = m.get(key) ?? [];
      arr.push(it);
      m.set(key, arr);
    }
    return Array.from(m.entries());
  }, [items]);

  function pay() {
    setLoading(true);
    setTimeout(() => {
      const r = checkout(method);
      setLoading(false);
      if (!r.ok) {
        toast(r.error ?? "No se pudo completar el pago", "error");
        return;
      }
      toast("Pago confirmado", "success");
      router.replace("/active");
    }, 700);
  }

  if (items.length === 0) {
    router.replace("/cart");
    return null;
  }

  const canGroup = !!group && groupBalance >= total;
  const canMP = !!user?.cuentaMercadoPago;

  return (
    <>
      <TopBar back fallbackHref="/cart" />

      <section className="container max-w-3xl mt-2 space-y-5">
        <h1 className="text-2xl font-semibold tracking-tight px-1">Revisá tu compra</h1>

        {grouped.map(([key, items]) => {
          const [fridgeId, consumerId] = key.split("|");
          const fridge = fridges.find((f) => f.id === fridgeId)!;
          const consumer = users.find((u) => u.id === consumerId);
          const sub = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
          return (
            <Card key={key}>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge tone="primary">{fridge.nombre}</Badge>
                    <Badge tone="muted">
                      Para {consumer ? consumer.nombre : "—"}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {fridge.distanceKm.toFixed(1)} km
                  </span>
                </div>
                <ul className="mt-3 space-y-2">
                  {items.map((it) => (
                    <li
                      key={`${it.fridgeId}-${it.productId}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {it.product.imageEmoji} {it.product.nombre} × {it.quantity}
                        </p>
                      </div>
                      <span className="font-medium tabular-nums">
                        {formatCurrency(it.unitPrice * it.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
                  <span className="text-muted-foreground">Subtotal ticket</span>
                  <span className="font-semibold tabular-nums">{formatCurrency(sub)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Card>
          <CardContent className="pt-5 pb-5 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {coupon && (
              <div className="flex items-center justify-between text-sm text-primary">
                <span>Cupón {coupon.codigo}</span>
                <span>- {formatCurrency(discount)}</span>
              </div>
            )}
            <div className="h-px bg-border my-1" />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total a pagar</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground/90 px-1">
            Método de pago
          </h2>

          {group && (
            <PaymentOption
              selected={method === "saldo_grupo"}
              disabled={!canGroup}
              onClick={() => canGroup && setMethod("saldo_grupo")}
              icon={<Wallet className="h-5 w-5" />}
              title={`Saldo del grupo · ${group.nombre}`}
              subtitle={
                canGroup
                  ? `Disponible ${formatCurrency(groupBalance)}`
                  : `Saldo insuficiente (${formatCurrency(groupBalance)})`
              }
            />
          )}

          <PaymentOption
            selected={method === "mercado_pago"}
            disabled={!canMP}
            onClick={() => canMP && setMethod("mercado_pago")}
            icon={<CreditCard className="h-5 w-5" />}
            title="Mercado Pago"
            subtitle={
              canMP
                ? `Cuenta vinculada · ${user?.cuentaMercadoPago}`
                : "Vinculá tu cuenta desde Mi perfil."
            }
          />
        </div>

        <Button
          size="lg"
          className="w-full"
          loading={loading}
          disabled={method === "saldo_grupo" ? !canGroup : !canMP}
          onClick={pay}
        >
          <ShieldCheck className="h-4 w-4" />
          Pagar {formatCurrency(total)}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Al confirmar generamos un token de apertura (QR) válido por 4 horas.
        </p>
      </section>
    </>
  );
}

function PaymentOption({
  selected,
  disabled,
  onClick,
  icon,
  title,
  subtitle,
}: {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-3 rounded-2xl border bg-card px-4 py-4 text-left transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-[0.99]"
      )}
    >
      <span
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full",
          selected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
        )}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium leading-tight">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
      </div>
      <span
        className={cn(
          "inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors duration-150",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background"
        )}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}
