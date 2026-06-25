"use client";

import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Clock, Leaf, ShieldCheck, Snowflake, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const ORDER = {
  code: "IF-2026-0142",
  fridge: "Heladera UNICEN · Campus",
  pickupBefore: "Hoy, 14:30",
  items: [
    { name: "Ensalada César", qty: 1, price: 4200 },
    { name: "Café latte", qty: 2, price: 2300 },
    { name: "Alfajor de maicena", qty: 1, price: 1500 },
  ],
};
const ORDER_TOTAL = ORDER.items.reduce((s, i) => s + i.price * i.qty, 0);

const POINTS = [
  {
    icon: Leaf,
    title: "Saludable de verdad",
    text: "Viandas de cocina central, balanceadas y frescas del día.",
  },
  {
    icon: Wallet,
    title: "Saldo familiar o Mercado Pago",
    text: "Compartí saldo entre el grupo o pagá directo, sin vincular nada para mirar.",
  },
  {
    icon: ShieldCheck,
    title: "Compras verificadas",
    text: "Calificaciones de gente que realmente compró el producto. Sin reseñas falsas.",
  },
];

export default function PickupMoment() {
  return (
    <section className="container max-w-6xl py-20 md:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Orden de compra — panel sólido, sin glass */}
        <div className="relative mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl shadow-foreground/5 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                Orden de compra
              </div>
              <div className="mt-1 font-mono text-lg font-semibold tracking-tight">
                #{ORDER.code}
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Lista para retirar
            </span>
          </div>

          <ul className="mb-5 divide-y divide-border">
            {ORDER.items.map((it) => (
              <li key={it.name} className="flex items-center gap-3 py-2.5 text-sm">
                <span className="font-mono text-muted-foreground">{it.qty}×</span>
                <span className="flex-1 truncate text-foreground/90">{it.name}</span>
                <span className="font-medium">{formatCurrency(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-end justify-between gap-4 border-t border-border pt-4">
            <div>
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="font-mono text-2xl font-semibold tracking-tight">
                {formatCurrency(ORDER_TOTAL)}
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Retirá antes de {ORDER.pickupBefore}
              </div>
            </div>
            {/* QR siempre sobre blanco para que sea escaneable en cualquier tema */}
            <div className="shrink-0 rounded-2xl bg-white p-2.5 shadow-md ring-1 ring-black/5">
              <QRCodeSVG
                value={`INTELLIGENTFOOD:ORDER:${ORDER.code}`}
                size={88}
                bgColor="#FFFFFF"
                fgColor="#0F172A"
                level="M"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
            <Snowflake className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{ORDER.fridge}</span>
            <span className="ml-auto whitespace-nowrap">Escaneá y abrí</span>
          </div>
        </div>

        {/* Texto + puntos como filas, no como grid de cards iguales */}
        <div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            De tener hambre a comer bien, sin fricción.
          </h2>
          <p className="mt-4 max-w-md text-pretty text-muted-foreground">
            Elegís, pagás y generás tu QR. La heladera se abre en segundos cuando
            llegás: cero colas, cero caja.
          </p>

          <dl className="mt-8 divide-y divide-border">
            {POINTS.map((p) => (
              <div key={p.title} className="flex gap-4 py-4">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <p.icon className="h-5 w-5" />
                </span>
                <div>
                  <dt className="font-semibold tracking-tight">{p.title}</dt>
                  <dd className="mt-0.5 text-sm text-pretty text-muted-foreground">
                    {p.text}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
