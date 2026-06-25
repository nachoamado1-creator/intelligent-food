"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BackButton } from "@/components/back-button";
import { BrandLogo } from "@/components/brand-logo";

interface TopBarProps {
  title?: string;
  back?: boolean;
  fallbackHref?: string;
  backLabel?: string;
  right?: React.ReactNode;
  transparent?: boolean;
}

export function TopBar({
  title,
  back = false,
  fallbackHref = "/home",
  backLabel = "Volver",
  right,
  transparent,
}: TopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30",
        transparent
          ? "bg-transparent"
          : "bg-background/85 backdrop-blur-md border-b border-border"
      )}
    >
      <div className="container max-w-3xl flex items-center justify-between h-14 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {back ? (
            <BackButton
              fallbackHref={fallbackHref}
              label={backLabel}
              size="sm"
              variant="secondary"
            />
          ) : (
            <Link href="/home" className="cursor-pointer">
              <BrandLogo size={32} withText />
            </Link>
          )}
          {title && (
            <h1 className="text-sm font-semibold truncate ml-1">{title}</h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          {right}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
