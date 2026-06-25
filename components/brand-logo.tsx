"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: number;
  className?: string;
  withText?: boolean;
  priority?: boolean;
}

export function BrandLogo({
  size = 32,
  className,
  withText = false,
  priority,
}: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className="relative inline-flex shrink-0 overflow-hidden rounded-full bg-primary/10 ring-1 ring-border"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt="Intelligent Food"
          fill
          sizes={`${size}px`}
          priority={priority}
          className="object-cover"
        />
      </span>
      {withText && (
        <span className="font-semibold tracking-tight">Intelligent Food</span>
      )}
    </span>
  );
}
