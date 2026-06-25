"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, ShoppingBag, QrCode, History, User as UserIcon } from "lucide-react";
import DockMorph, { type DockItem } from "@/components/ui/dock-morph";
import { useStore } from "@/lib/store";

const baseItems: { href: string; label: string; icon: typeof Home; badgeKey?: "cart" | "active" }[] = [
  { href: "/home", label: "Inicio", icon: Home },
  { href: "/cart", label: "Carrito", icon: ShoppingBag, badgeKey: "cart" },
  { href: "/active", label: "Retiro", icon: QrCode, badgeKey: "active" },
  { href: "/history", label: "Historial", icon: History },
  { href: "/profile", label: "Cuenta", icon: UserIcon },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const cartCount = useStore((s) => s.cart.reduce((n, c) => n + c.quantity, 0));
  const activeCount = useStore(
    (s) =>
      s.purchases.filter(
        (p) =>
          (p.compradorId === s.currentUserId || p.consumidorId === s.currentUserId) &&
          p.status === "Pendiente"
      ).length
  );

  const items: DockItem[] = baseItems.map((it) => ({
    icon: it.icon,
    label: it.label,
    href: it.href,
    active: pathname.startsWith(it.href),
    badge:
      it.badgeKey === "cart"
        ? cartCount
        : it.badgeKey === "active"
          ? activeCount
          : undefined,
    onClick: () => router.push(it.href),
  }));

  return <DockMorph items={items} />;
}
