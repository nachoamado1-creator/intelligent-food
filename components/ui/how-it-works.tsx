import { Search, CreditCard, QrCode } from "lucide-react";

// Secuencia real y ordenada: los números informan el orden del flujo.
const STEPS = [
  {
    icon: Search,
    title: "Buscá",
    text: "Escribí un plato y te llevamos a la heladera habilitada más cercana con stock.",
  },
  {
    icon: CreditCard,
    title: "Pagá",
    text: "Elegí consumidor por ítem y pagá con saldo del grupo o Mercado Pago.",
  },
  {
    icon: QrCode,
    title: "Retirá",
    text: "Generás tu QR con 4 horas de validez. Escaneás en la heladera y se abre.",
  },
];

export default function HowItWorks() {
  return (
    <section className="container max-w-6xl py-20 md:py-28">
      <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        Tres pasos entre el hambre y la comida.
      </h2>

      <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex flex-col gap-4 bg-card p-7">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </span>
              <span className="font-mono text-sm text-muted-foreground">
                0{i + 1}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-1.5 text-sm text-pretty text-muted-foreground">
                {s.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
