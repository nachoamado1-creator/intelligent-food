"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";

/** Pulsa el badge cada vez que cambia el valor (cart count). */
function useChangePulse(value: number | undefined) {
  const [pulse, setPulse] = React.useState(false);
  const prev = React.useRef(value);
  React.useEffect(() => {
    if (value === undefined) return;
    if (prev.current !== undefined && value !== prev.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 360);
      prev.current = value;
      return () => clearTimeout(t);
    }
    prev.current = value;
  }, [value]);
  return pulse;
}

export interface DockItem {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: number;
}

interface DockMorphProps {
  className?: string;
  items: DockItem[];
  position?: "bottom" | "top" | "left";
  onSelect?: (item: DockItem, index: number) => void;
}

const positionClasses = {
  bottom: "fixed bottom-4 left-1/2 -translate-x-1/2",
  top: "fixed top-4 left-1/2 -translate-x-1/2",
  left: "fixed left-4 top-1/2 -translate-y-1/2 flex-col",
};

export default function DockMorph({
  items,
  className,
  position = "bottom",
  onSelect,
}: DockMorphProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);

  return (
    <div
      className={cn(
        "z-50 flex items-center justify-center pb-[env(safe-area-inset-bottom)]",
        positionClasses[position],
        className
      )}
    >
      <TooltipProvider delayDuration={150}>
        <div
          className={cn(
            "relative flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-3xl",
            position === "left" ? "flex-col gap-3 px-3 py-6" : "flex-row",
            "bg-background/65 backdrop-blur-xl shadow-lg shadow-black/10 border border-border",
            "dark:bg-background/55 dark:shadow-black/40"
          )}
        >
          {items.map((item, i) => (
            <DockItemView
              key={item.label}
              item={item}
              index={i}
              hovered={hovered}
              setHovered={setHovered}
              onSelect={onSelect}
              position={position}
            />
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}

interface DockItemViewProps {
  item: DockItem;
  index: number;
  hovered: number | null;
  setHovered: (n: number | null) => void;
  onSelect?: (item: DockItem, index: number) => void;
  position: "bottom" | "top" | "left";
}

function DockItemView({
  item,
  index,
  hovered,
  setHovered,
  onSelect,
  position,
}: DockItemViewProps) {
  const Icon = item.icon;
  const showBubble = hovered === index || item.active;
  const pulse = useChangePulse(item.badge);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="relative flex items-center justify-center"
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
        >
          <AnimatePresence>
            {showBubble && (
              <motion.div
                layoutId="dock-bubble"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1.4, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                className={cn(
                  "absolute inset-0 rounded-full -z-10",
                  "bg-gradient-to-tr from-primary/40 via-primary/20 to-transparent",
                  "backdrop-blur-2xl shadow-md dark:shadow-primary/30"
                )}
              />
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            aria-label={item.label}
            aria-current={item.active ? "page" : undefined}
            onClick={() => {
              onSelect?.(item, index);
              item.onClick?.();
            }}
            className={cn(
              "relative z-10 h-11 w-11 rounded-full transition-transform duration-fast ease-out-quart",
              "hover:scale-110",
              item.active && "text-primary"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.badge !== undefined && item.badge > 0 && (
              <span
                className={cn(
                  "absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold flex items-center justify-center shadow-sm",
                  pulse && "animate-pulse-once"
                )}
              >
                {item.badge}
              </span>
            )}
          </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side={position === "left" ? "right" : "top"}
        className="text-xs"
      >
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}
