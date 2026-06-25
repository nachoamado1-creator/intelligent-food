"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string;
  alt: string;
  emojiFallback?: string;
  aspect?: "square" | "video" | "card";
  className?: string;
  priority?: boolean;
  sizes?: string;
}

const aspectClasses = {
  square: "aspect-square",
  video: "aspect-video",
  card: "aspect-[5/3]",
};

export function ProductImage({
  src,
  alt,
  emojiFallback,
  aspect = "card",
  className,
  priority,
  sizes = "(max-width: 768px) 50vw, 33vw",
}: ProductImageProps) {
  const [error, setError] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10",
        aspectClasses[aspect],
        className
      )}
    >
      {!error ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 ease-out-strong group-hover:scale-[1.04]"
          onError={() => setError(true)}
        />
      ) : (
        emojiFallback && (
          <span className="absolute inset-0 flex items-center justify-center text-6xl">
            {emojiFallback}
          </span>
        )
      )}
    </div>
  );
}
