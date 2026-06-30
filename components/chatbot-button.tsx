"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Botón flotante de acceso al chatbot. Por ahora es solo ilustrativo:
 * al tocarlo muestra un pequeño globo indicando que el asistente llegará pronto.
 */
export function ChatbotButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3", className)}>
      {open && (
        <div className="animate-page-enter max-w-[15rem] rounded-2xl border border-border bg-card p-4 text-sm shadow-lg shadow-black/10">
          <p className="font-semibold text-foreground">Asistente Intelligent Food</p>
          <p className="mt-1 text-muted-foreground">
            ¡Hola! 👋 Pronto vas a poder chatear conmigo para pedir ayuda con tus compras.
          </p>
        </div>
      )}

      <button
        type="button"
        aria-label="Abrir asistente"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "group relative inline-flex h-14 w-14 items-center justify-center rounded-full",
          "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
          "transition-transform duration-200 hover:scale-105 active:scale-95",
          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        {/* Halo pulsante */}
        {!open && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/40" />
        )}
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
