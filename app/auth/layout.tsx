import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ChevronLeft } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 0%, hsl(var(--primary) / 0.18) 0%, transparent 65%), radial-gradient(60% 50% at 100% 100%, hsl(var(--accent) / 0.15) 0%, transparent 60%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 grid-noise opacity-60" />

      <header className="container max-w-3xl flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            aria-label="Volver al inicio"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors duration-200 cursor-pointer active:scale-[0.97]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <Link href="/" className="cursor-pointer">
            <BrandLogo size={32} withText />
          </Link>
        </div>
        <ThemeToggle />
      </header>

      <main className="container max-w-md py-6 pb-24 animate-fade-in">{children}</main>
    </div>
  );
}
