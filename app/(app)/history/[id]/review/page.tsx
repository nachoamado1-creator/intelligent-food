"use client";

import { use, useMemo, useState } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const search = useSearchParams();
  const { toast } = useToast();
  const productIdParam = search.get("productId");
  const purchase = useStore((s) => s.purchases.find((p) => p.id === id));
  const products = useStore((s) => s.products);
  const addComment = useStore((s) => s.addComment);

  const choices = useMemo(
    () =>
      purchase
        ? purchase.items.map((i) => ({ id: i.productId, name: i.productName }))
        : [],
    [purchase]
  );
  const [productId, setProductId] = useState(productIdParam ?? choices[0]?.id ?? "");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  if (!purchase) return notFound();
  const product = products.find((p) => p.id === productId);

  function submit() {
    if (!productId) return;
    setLoading(true);
    const r = addComment(productId, rating, text);
    setLoading(false);
    if (!r.ok) {
      toast(r.error ?? "Error", "error");
      return;
    }
    toast("¡Gracias por tu calificación!", "success");
    router.push("/history");
  }

  return (
    <>
      <TopBar back fallbackHref="/history" title="Calificar" />
      <section className="container max-w-md mt-2 space-y-4">
        <Card>
          <CardContent className="pt-5 pb-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Producto</p>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mt-1 w-full h-11 rounded-lg border border-input bg-background px-3 text-sm cursor-pointer"
            >
              {choices.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {product && (
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-muted/40 p-3">
                <span className="text-3xl">{product.imageEmoji}</span>
                <div>
                  <p className="font-medium">{product.nombre}</p>
                  <p className="text-xs text-muted-foreground">{product.description.slice(0, 80)}…</p>
                </div>
              </div>
            )}

            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Tu calificación
              </p>
              <div className="mt-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    className={cn(
                      "inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors cursor-pointer active:scale-[0.97]",
                      n <= rating ? "text-accent" : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-label={`${n} estrellas`}
                  >
                    <Star className={cn("h-6 w-6", n <= rating && "fill-accent")} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-1">
                Comentario
              </p>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="¿Qué te pareció? Tu reseña ayuda a otros usuarios."
              />
            </div>

            <Button onClick={submit} loading={loading} className="mt-5 w-full" size="lg">
              Publicar calificación
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
