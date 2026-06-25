import Link from "next/link";
import { ArrowRight, LogIn, Snowflake } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

// Hero de marca: la heladera inteligente ES el objeto protagonista.
// Render de estudio sobre una "vitrina" clara que funciona en light y dark,
// sin glassmorphism ni texto con gradiente.
export default function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Foto de fondo difuminada (portada.png) con máscara para fundirse abajo */}
      <div
        className="absolute inset-0 z-0 bg-[url('/portada.png')] bg-cover bg-center opacity-60"
        style={{
          maskImage:
            "linear-gradient(180deg, black 0%, black 70%, transparent)",
          WebkitMaskImage:
            "linear-gradient(180deg, black 0%, black 70%, transparent)",
        }}
        aria-hidden
      />
      {/* Velo para legibilidad — usa el background del tema (light y dark) */}
      <div
        className="absolute inset-0 z-0 bg-gradient-to-r from-background via-background/80 to-background/35"
        aria-hidden
      />

      <div className="container relative z-10 max-w-6xl pt-28 pb-12 md:pt-32 md:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
          {/* Texto */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="stagger-item inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground" style={{ "--i": 0 } as React.CSSProperties}>
              <Snowflake className="h-3.5 w-3.5 text-primary" />
              Tandil · disponible 24/7
            </div>

            <h1
              className="stagger-item mt-6 text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl xl:text-7xl"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              Comida fresca,{" "}
              <span className="text-primary">cuando vos</span> quieras.
            </h1>

            <p
              className="stagger-item mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              Una red de heladeras inteligentes con viandas, snacks saludables y
              bebidas listas para retirar con QR. Sin colas, sin caja, sin esperas.
            </p>

            <div
              className="stagger-item mt-8 flex flex-col gap-3 sm:flex-row"
              style={{ "--i": 3 } as React.CSSProperties}
            >
              <Link
                href="/auth/register"
                className={cn(buttonVariants({ size: "lg" }), "group rounded-full px-7")}
              >
                Crear cuenta gratis
                <ArrowRight className="h-4 w-4 transition-transform duration-base ease-out-quart group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/auth/login"
                className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "rounded-full px-7")}
              >
                <LogIn className="h-4 w-4" />
                Ya tengo cuenta
              </Link>
            </div>

            <dl
              className="stagger-item mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-6"
              style={{ "--i": 4 } as React.CSSProperties}
            >
              <Stat value="15" label="heladeras en Tandil" />
              <Stat value="32" label="productos frescos" />
              <Stat value="4 h" label="para retirar tu QR" />
            </dl>
          </div>

          {/* Heladera — vitrina/spotlight que sirve en light y dark */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="stagger-item relative mx-auto max-w-[320px]" style={{ "--i": 2 } as React.CSSProperties}>
              {/* Piso/sombra suave bajo el producto */}
              <div className="absolute inset-x-6 bottom-4 h-10 rounded-[50%] bg-foreground/20 blur-2xl" aria-hidden />
              {/* Marco vertical con el video de la heladera */}
              <div className="relative overflow-hidden rounded-[2rem] ring-1 ring-border shadow-xl shadow-foreground/10">
                <video
                  src="/H.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Recorrido de la heladera inteligente Intelligent Food"
                  className="aspect-[9/16] h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-mono text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </dt>
      <dd className="mt-0.5 text-sm text-muted-foreground">{label}</dd>
    </div>
  );
}
