"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { History as HistoryIcon, Star } from "lucide-react";

export default function HistoryPage() {
  const allPurchases = useStore((s) => s.purchases);
  const fridges = useStore((s) => s.fridges);
  const users = useStore((s) => s.users);
  const currentUserId = useStore((s) => s.currentUserId);
  const refresh = useStore((s) => s.refreshPurchaseStatuses);

  const purchases = useMemo(
    () =>
      allPurchases.filter(
        (p) => p.compradorId === currentUserId || p.consumidorId === currentUserId
      ),
    [allPurchases, currentUserId]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  const sorted = useMemo(
    () => [...purchases].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [purchases]
  );

  if (sorted.length === 0) {
    return (
      <>
        <TopBar back fallbackHref="/home" />
        <section className="container max-w-md pt-10 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <HistoryIcon className="h-7 w-7 text-muted-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Sin historial todavía</h1>
          <p className="mt-2 text-sm text-muted-foreground">Cuando hagas tu primera compra va a aparecer acá.</p>
        </section>
      </>
    );
  }

  return (
    <>
      <TopBar />
      <section className="container max-w-3xl mt-2 space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight px-1">Tu historial</h1>

        {sorted.map((p) => {
          const fridge = fridges.find((f) => f.id === p.fridgeId)!;
          const consumer = users.find((u) => u.id === p.consumidorId);
          const buyer = users.find((u) => u.id === p.compradorId);
          const tone =
            p.status === "Pendiente"
              ? ("primary" as const)
              : p.status === "Retirada"
                ? ("success" as const)
                : ("destructive" as const);
          const label = p.status;
          const role =
            p.compradorId === currentUserId && p.consumidorId === currentUserId
              ? "Comprador y consumidor"
              : p.compradorId === currentUserId
                ? `Compraste para ${consumer?.nombre ?? "—"}`
                : `Te compró ${buyer?.nombre ?? "—"}`;
          return (
            <Card key={p.id}>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {formatDateTime(p.createdAt)}
                    </p>
                    <p className="font-semibold mt-0.5">{fridge.nombre}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{role}</p>
                  </div>
                  <Badge tone={tone}>{label}</Badge>
                </div>

                <ul className="mt-3 space-y-1.5 text-sm">
                  {p.items.map((i) => (
                    <li key={i.productId} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate">
                          {i.quantity}× {i.productName}
                        </p>
                      </div>
                      {p.status === "Retirada" && (
                        <Link
                          href={`/history/${p.id}/review?productId=${i.productId}`}
                          className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs hover:bg-muted transition-colors cursor-pointer active:scale-[0.97]"
                        >
                          <Star className="h-3 w-3" />
                          Calificar
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">
                    {p.paymentMethod === "saldo_grupo" ? "Saldo grupal" : "Mercado Pago"}
                    {p.cuponId ? ` · Cupón aplicado` : ""}
                  </span>
                  <span className="font-semibold">{formatCurrency(p.total)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </>
  );
}
