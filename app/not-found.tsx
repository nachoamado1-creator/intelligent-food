import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <div className="text-center max-w-sm">
        <p className="text-7xl font-semibold tracking-tighter text-primary">404</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Página no encontrada</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Eso que buscás no existe o cambió de lugar.
        </p>
        <Link
          href="/home"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-200 cursor-pointer active:scale-[0.97]"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
