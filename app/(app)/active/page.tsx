"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRDisplay } from "@/components/qr-display";
import { Countdown, useCountdown } from "@/components/countdown";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, CheckCircle2, AlertCircle, QrCode } from "lucide-react";
import type { Purchase } from "@/lib/types";

export default function ActivePage() {
  const allPurchases = useStore((s) => s.purchases);
  const currentUserId = useStore((s) => s.currentUserId);
  const fridges = useStore((s) => s.fridges);
  const refresh = useStore((s) => s.refreshPurchaseStatuses);

  const purchases = useMemo(
    () =>
      allPurchases.filter(
        (p) =>
          (p.compradorId === currentUserId || p.consumidorId === currentUserId) &&
          p.status === "Pendiente"
      ),
    [allPurchases, currentUserId]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (purchases.length === 0) {
    return (
      <>
        <TopBar back fallbackHref="/home" />
        <section className="container max-w-md pt-10 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <QrCode className="h-7 w-7 text-muted-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Sin compras activas</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Cuando confirmes una compra vas a ver acá el QR de retiro.
          </p>
          <Link
            href="/home"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-200 cursor-pointer active:scale-[0.97]"
          >
            Explorar heladeras
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <TopBar />
      <section className="container max-w-3xl mt-2 space-y-5">
        <h1 className="text-2xl font-semibold tracking-tight px-1">Listo para retirar</h1>
        {purchases.map((p) => {
          const fridge = fridges.find((f) => f.id === p.fridgeId)!;
          return <PurchaseCard key={p.id} purchase={p} fridgeName={fridge.nombre} />;
        })}
      </section>
    </>
  );
}

function PurchaseCard({ purchase, fridgeName }: { purchase: Purchase; fridgeName: string }) {
  const { toast } = useToast();
  const pickup = useStore((s) => s.pickupPurchase);
  const consumer = useStore((s) => s.users.find((u) => u.id === purchase.consumidorId));
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const { expired } = useCountdown(purchase.expiresAt);

  function scan() {
    setError(undefined);
    setScanning(true);
    setTimeout(() => {
      const r = pickup(purchase.id);
      setScanning(false);
      if (!r.ok) {
        setError(r.error);
        toast(r.error ?? "Error", "error");
        return;
      }
      setSuccess(true);
      toast("¡Heladera abierta! Retirá tu pedido.", "success");
    }, 900);
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-primary/15 via-card to-accent/10 p-6 text-center">
        {success ? (
          <div className="animate-scale-in">
            <div className="mx-auto h-20 w-20 rounded-full bg-success text-success-foreground flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <p className="mt-4 font-semibold text-lg">¡Heladera abierta!</p>
            <p className="mt-1 text-sm text-muted-foreground">Retirá tus productos.</p>
          </div>
        ) : (
          <>
            <div className="inline-block animate-fade-in">
              <QRDisplay value={purchase.tokenApertura} />
            </div>
            <p className="mt-4 font-mono text-xs text-muted-foreground tracking-wide">
              {purchase.tokenApertura}
            </p>
          </>
        )}
      </div>

      <CardContent className="pt-5 pb-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Heladera</p>
            <p className="font-semibold">{fridgeName}</p>
            {consumer && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Consumidor: {consumer.nombre} {consumer.apellido}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Vence en</p>
            <p
              className={
                "font-mono font-semibold " +
                (expired ? "text-destructive" : "text-foreground")
              }
            >
              <Countdown target={purchase.expiresAt} />
            </p>
          </div>
        </div>

        <ul className="mt-4 space-y-1.5 text-sm">
          {purchase.items.map((i) => (
            <li key={i.productId} className="flex justify-between">
              <span className="text-muted-foreground">
                {i.quantity}× {i.productName}
              </span>
              <span className="font-medium">{formatCurrency(i.unitPrice * i.quantity)}</span>
            </li>
          ))}
          <li className="flex justify-between border-t border-border pt-2 mt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(purchase.total)}</span>
          </li>
        </ul>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 text-destructive px-3 py-2 text-sm">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        {!success && (
          <Button
            onClick={scan}
            disabled={expired}
            loading={scanning}
            className="mt-5 w-full"
            size="lg"
          >
            <Sparkles className="h-4 w-4" />
            {expired ? "Tiempo expirado" : "Escanear en heladera"}
          </Button>
        )}

        {success && (
          <Badge tone="success" className="mt-4 w-full justify-center py-2">
            Retirado correctamente
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
