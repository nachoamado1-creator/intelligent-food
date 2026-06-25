"use client";

import React from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowRight,
  Snowflake,
  QrCode,
  Star,
  Clock,
  LogIn,
  ShieldCheck,
  CheckCircle2,
  // Brand-ish icons for the trust marquee
  Leaf,
  Wallet,
  Sparkles,
  Salad,
  Coffee,
  Cookie,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// --- ORDER MOCK ---
// Ejemplo de orden de compra de alimentos retirable con QR.
const ORDER = {
  code: "IF-2026-0142",
  fridge: "Heladera UNICEN · Campus",
  pickupBefore: "Hoy, 14:30",
  items: [
    { name: "Ensalada César", qty: 1, price: 4200, Icon: Salad },
    { name: "Café latte", qty: 2, price: 2300, Icon: Coffee },
    { name: "Alfajor de maicena", qty: 1, price: 1500, Icon: Cookie },
  ],
};

const ORDER_TOTAL = ORDER.items.reduce((s, i) => s + i.price * i.qty, 0);

// --- TRUST MARQUEE ---
const TRUST = [
  { name: "Comida fresca", icon: Leaf },
  { name: "Pago grupal o MP", icon: Wallet },
  { name: "Retiro con QR", icon: QrCode },
  { name: "Compras verificadas", icon: ShieldCheck },
  { name: "24/7 en Tandil", icon: Clock },
  { name: "Cocina central", icon: Sparkles },
];

// --- MAIN COMPONENT (theme-aware: follows light/dark tokens) ---
export default function HeroSection() {
  return (
    <div className="relative w-full bg-background text-foreground overflow-hidden font-sans">
      {/* SCOPED ANIMATIONS */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .if-animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .if-animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .if-delay-100 { animation-delay: 0.1s; }
        .if-delay-200 { animation-delay: 0.2s; }
        .if-delay-300 { animation-delay: 0.3s; }
        .if-delay-400 { animation-delay: 0.4s; }
        .if-delay-500 { animation-delay: 0.5s; }
      `}</style>

      {/* Background Image (PORTADA.png) with Gradient Mask */}
      <div
        className="absolute inset-0 z-0 bg-[url('/portada.png')] bg-cover bg-center opacity-60"
        style={{
          maskImage:
            "linear-gradient(180deg, transparent, black 0%, black 75%, transparent)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent, black 0%, black 75%, transparent)",
        }}
      />
      {/* Veil for legibility — uses theme background so it works light & dark */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-background via-background/75 to-background/30" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">

          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8">

            {/* Badge */}
            <div className="if-animate-fade-in if-delay-100">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 backdrop-blur-md shadow-sm transition-colors hover:bg-card">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Snowflake className="w-3.5 h-3.5 text-primary" />
                  Tandil · disponible 24/7
                  <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1 className="if-animate-fade-in if-delay-200 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tighter leading-[0.9] text-foreground">
              Comida fresca,<br />
              <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">
                cuando vos
              </span><br />
              quieras.
            </h1>

            {/* Description */}
            <p className="if-animate-fade-in if-delay-300 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Una red de heladeras inteligentes con viandas, snacks saludables y
              bebidas listas para retirar con QR. Sin colas, sin caja, sin esperas.
            </p>

            {/* CTA Buttons */}
            <div className="if-animate-fade-in if-delay-400 flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/register"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98]"
              >
                Crear cuenta gratis
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/auth/login"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/70 px-8 py-4 text-sm font-semibold text-foreground backdrop-blur-sm shadow-sm transition-colors hover:bg-card hover:border-foreground/20"
              >
                <LogIn className="w-4 h-4" />
                Ya tengo cuenta
              </Link>
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="lg:col-span-5 space-y-6 lg:mt-12">

            {/* Order Card (orden de compra con QR) */}
            <div className="if-animate-fade-in if-delay-500 relative overflow-hidden rounded-3xl border border-border bg-card/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-foreground/5">
              {/* Card Glow Effect */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Orden de compra
                    </div>
                    <div className="mt-1 font-mono text-lg font-bold tracking-tight text-foreground">
                      #{ORDER.code}
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Lista para retirar
                  </div>
                </div>

                {/* Items */}
                <ul className="space-y-3 mb-5">
                  {ORDER.items.map((it) => (
                    <li
                      key={it.name}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted ring-1 ring-border">
                        <it.Icon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <span className="flex-1 truncate text-foreground/90">
                        <span className="text-muted-foreground">{it.qty}×</span>{" "}
                        {it.name}
                      </span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(it.price * it.qty)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="h-px w-full bg-border mb-4" />

                {/* Total + QR */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Total</div>
                    <div className="text-2xl font-bold tracking-tight text-foreground">
                      {formatCurrency(ORDER_TOTAL)}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      Retirá antes de {ORDER.pickupBefore}
                    </div>
                  </div>

                  {/* QR — always on white so it stays scannable in any theme */}
                  <div className="shrink-0 rounded-2xl bg-white p-2.5 shadow-md ring-1 ring-black/5">
                    <QRCodeSVG
                      value={`INTELLIGENTFOOD:ORDER:${ORDER.code}`}
                      size={92}
                      bgColor="#FFFFFF"
                      fgColor="#0F172A"
                      level="M"
                    />
                  </div>
                </div>

                {/* Fridge location */}
                <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
                  <Snowflake className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate">{ORDER.fridge}</span>
                  <span className="ml-auto inline-flex items-center gap-1 text-muted-foreground">
                    <QrCode className="h-3.5 w-3.5" />
                    Escaneá y abrí
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Marquee Card */}
            <div className="if-animate-fade-in if-delay-500 relative overflow-hidden rounded-3xl border border-border bg-card/80 py-8 backdrop-blur-xl shadow-xl shadow-foreground/5">
              <h3 className="mb-6 px-8 text-sm font-medium text-muted-foreground">
                Por qué Intelligent Food
              </h3>

              <div
                className="relative flex overflow-hidden"
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                }}
              >
                <div className="if-animate-marquee flex gap-12 whitespace-nowrap px-4">
                  {/* Triple list for seamless loop */}
                  {[...TRUST, ...TRUST, ...TRUST].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 opacity-70 transition-all hover:opacity-100 hover:scale-105 cursor-default"
                    >
                      <item.icon className="h-5 w-5 text-primary" />
                      <span className="text-base font-bold text-foreground tracking-tight">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
