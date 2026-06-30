"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { ChatbotButton } from "@/components/chatbot-button";
import { ProtectedRoute } from "@/components/protected-route";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // key por pathname → fuerza re-mount del wrapper en cada navegación
  // y dispara la animación de entrada (CSS pageEnter) sin necesidad de
  // AnimatePresence (que en App Router + estricto da problemas).
  const pathname = usePathname();
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-32">
        <div key={pathname} className="animate-page-enter">
          {children}
        </div>
      </div>
      {/* Subido para no chocar con la dock inferior */}
      <ChatbotButton className="bottom-28" />
      <BottomNav />
    </ProtectedRoute>
  );
}
