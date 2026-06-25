"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  label?: string;
  fallbackHref?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  onClick?: () => void;
}

/**
 * Botón "Previous" con badge de ChevronLeft (estilo originui).
 * Navega siempre a la pantalla padre lógica (`fallbackHref`) en vez de
 * seguir el historial del navegador, así "atrás" sube por la jerarquía
 * hasta la primera interfaz sin entrar en bucles de ida y vuelta.
 */
export function BackButton({
  label = "Volver",
  fallbackHref = "/home",
  variant = "secondary",
  size = "sm",
  className,
  onClick,
}: BackButtonProps) {
  const router = useRouter();

  function handleClick() {
    if (onClick) return onClick();
    router.push(fallbackHref);
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant={variant}
      size={size}
      aria-label={label}
      className={cn("relative ps-10", className)}
    >
      <span className="pointer-events-none absolute inset-y-0 left-0 flex w-8 items-center justify-center rounded-l-lg bg-foreground/10">
        <ChevronLeft className="h-4 w-4 opacity-70" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span>{label}</span>
    </Button>
  );
}
