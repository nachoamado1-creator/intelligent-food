import HeroSection from "@/components/ui/glassmorphism-trust-hero";

// Tokens del tema CLARO (globals.css :root) forzados localmente, así la demo
// se ve siempre en claro aunque el tema global por defecto sea oscuro.
const lightTokens: React.CSSProperties = {
  "--background": "30 33% 98%",
  "--foreground": "220 25% 10%",
  "--card": "0 0% 100%",
  "--card-foreground": "220 25% 10%",
  "--muted": "30 10% 94%",
  "--muted-foreground": "220 12% 32%",
  "--primary": "158 64% 35%",
  "--primary-foreground": "0 0% 100%",
  "--accent": "34 96% 52%",
  "--accent-foreground": "220 25% 10%",
  "--border": "220 13% 90%",
} as React.CSSProperties;

export default function HeroDemo() {
  return (
    <div
      style={lightTokens}
      className="w-full min-h-screen overflow-y-auto bg-background text-foreground"
    >
      <HeroSection />
    </div>
  );
}
