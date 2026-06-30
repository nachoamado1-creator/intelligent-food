import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import LandingHero from "@/components/ui/landing-hero";
import PickupMoment from "@/components/ui/pickup-moment";
import HowItWorks from "@/components/ui/how-it-works";
import { Case } from "@/components/ui/cases-with-infinite-scroll";
import { ChatbotButton } from "@/components/chatbot-button";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="container max-w-6xl flex h-16 items-center justify-between">
          <Link href="/" className="cursor-pointer">
            <BrandLogo size={36} withText priority />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden rounded-full sm:inline-flex")}
            >
              Ingresar
            </Link>
            <Link
              href="/auth/register"
              className={cn(buttonVariants({ size: "sm" }), "rounded-full")}
            >
              Crear cuenta
              <ArrowRight className="h-4 w-4" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* 1 · Hero — la heladera como héroe */}
      <div className="animate-page-enter">
        <LandingHero />
      </div>

      {/* 2 · El momento del QR + por qué */}
      <PickupMoment />

      {/* 3 · Catálogo (única tira en movimiento) */}
      <Case />

      {/* 4 · Cómo funciona */}
      <HowItWorks />

      {/* CTA final */}
      <section className="container max-w-6xl pb-24">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-card p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Empezá a comer bien hoy.
            </h2>
            <p className="mt-2 text-muted-foreground">
              Crear la cuenta es gratis. No necesitás vincular pago para mirar.
            </p>
          </div>
          <Link
            href="/auth/register"
            className={cn(buttonVariants({ size: "lg" }), "shrink-0 rounded-full px-7")}
          >
            Crear cuenta gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container max-w-6xl flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <span>© 2026 Intelligent Food · Prototipo académico (ADS II — Grupo 7)</span>
          <span>Tandil, Buenos Aires</span>
        </div>
      </footer>

      <ChatbotButton />
    </main>
  );
}
