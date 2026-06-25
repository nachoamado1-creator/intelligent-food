"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Wrench, ArrowRight, Snowflake, PowerOff } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LocationMap } from "@/components/ui/expand-map";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";

export default function HomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const fridges = useStore((s) => s.fridges);
  const stock = useStore((s) => s.stock);
  const user = useStore((s) => s.getCurrentUser());
  const findNearest = useStore((s) => s.findNearestFridgeWithStock);
  const [q, setQ] = useState("");

  const active = useMemo(
    () =>
      fridges
        .filter((f) => f.estado === "Habilitada")
        .sort((a, b) => a.distanceKm - b.distanceKm),
    [fridges]
  );
  const others = fridges.filter((f) => f.estado !== "Habilitada");

  const stockCountPerFridge = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of stock) {
      if (s.cantidad === 0) continue;
      m.set(s.fridgeId, (m.get(s.fridgeId) ?? 0) + 1);
    }
    return m;
  }, [stock]);

  function searchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    const f = findNearest(q);
    if (!f) {
      toast(`Sin stock de "${q}" en heladeras cercanas`, "error");
      return;
    }
    toast(`Disponible en ${f.nombre}`, "success");
    router.push(`/fridges/${f.id}?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      <TopBar back fallbackHref="/" backLabel="Salir" />

      <section className="container max-w-3xl pt-2">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-card to-accent/10 p-5 sm:p-7">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Hola, {user?.nombre ?? "viajero"}
          </p>
          <h1 className="mt-1 text-balance text-2xl sm:text-3xl font-semibold tracking-tight">
            ¿Qué te gustaría comer hoy?
          </h1>

          <form onSubmit={searchSubmit} className="mt-5 flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar plato, bebida, snack..."
                className="pl-9 h-12 text-base"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-200 cursor-pointer active:scale-[0.97]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">
            Te llevamos a la heladera habilitada más cercana con stock.
          </p>
        </div>
      </section>

      <section className="container max-w-3xl mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground/90 uppercase tracking-[0.14em]">
            Heladeras cerca tuyo
          </h2>
          <Badge tone="primary">{active.length} habilitadas</Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {active.map((f, i) => {
            const productsInStock = stockCountPerFridge.get(f.id) ?? 0;
            return (
              <Card
                key={f.id}
                style={{ "--i": i } as React.CSSProperties}
                className="stagger-item h-full transition-colors duration-base ease-out-quart hover:bg-muted/40"
              >
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/fridges/${f.id}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary cursor-pointer"
                    >
                      <Snowflake className="h-5 w-5" />
                    </Link>
                    <Badge tone="success">Habilitada</Badge>
                  </div>
                  <Link href={`/fridges/${f.id}`} className="block cursor-pointer">
                    <h3 className="mt-3 font-semibold tracking-tight">{f.nombre}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground inline-flex items-start gap-1">
                      <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>{f.ubicacion}</span>
                    </p>
                  </Link>

                  {/* Mini-mapa ilustrativo (clic para expandir) */}
                  <div className="mt-3">
                    <LocationMap
                      size="sm"
                      location={f.nombre}
                      coordinates={f.coordinates}
                    />
                  </div>

                  <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{f.distanceKm.toFixed(1)} km</span>
                    <span>{productsInStock} productos con stock</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {others.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
              No operativas
            </h3>
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-3 space-y-1">
              {others.map((f) => (
                <div key={f.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {f.estado === "Mantenimiento" ? (
                      <Wrench className="h-4 w-4" />
                    ) : (
                      <PowerOff className="h-4 w-4" />
                    )}
                    <span className="truncate">{f.nombre}</span>
                  </div>
                  <Badge tone="muted">{f.estado}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
