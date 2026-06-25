"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface FeaturedSpotlightProps {
  eyebrow?: string;
  titleTop?: string;
  titleBottom?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  ctaHref?: string;
  ctaLabel?: string;
  index?: string;
  /**
   * Si el PNG tiene fondo blanco/cream, mix-blend-multiply lo funde
   * con el background de la app sin recortar manualmente la imagen.
   */
  blendImage?: boolean;
}

export function FeaturedSpotlight({
  eyebrow = "Heladera Intelligent Food",
  titleTop = "Comida",
  titleBottom = "fresca 24/7",
  description = "Viandas, snacks y bebidas refrigeradas a temperatura ideal. Retirá con QR en segundos.",
  imageSrc = "/heladera-hero.png",
  imageAlt = "Heladera inteligente de Intelligent Food",
  ctaHref = "/auth/register",
  ctaLabel = "Empezar",
  index = "01",
  blendImage = true,
}: FeaturedSpotlightProps) {
  const [isHovered, setIsHovered] = useState(false);

  const Wrapper = ctaHref ? Link : "div";
  const wrapperProps = ctaHref ? { href: ctaHref } : {};

  return (
    <Wrapper
      {...(wrapperProps as { href: string })}
      className="group relative flex cursor-pointer flex-col items-center gap-8 md:flex-row md:items-center md:gap-12 lg:gap-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Text */}
      <div className="relative z-10 flex w-full max-w-[340px] shrink-0 flex-col items-center text-center md:w-[260px] md:items-start md:text-left lg:w-[300px] lg:pt-4">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-3 md:mb-8 md:gap-4">
          <div
            className="h-px bg-foreground transition-all duration-700"
            style={{
              width: isHovered ? 48 : 32,
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
          <span
            className="text-[10px] font-medium uppercase tracking-[0.25em] text-foreground transition-all duration-700 md:text-xs"
            style={{
              letterSpacing: isHovered ? "0.3em" : "0.25em",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {eyebrow}
          </span>
        </div>

        {/* Title */}
        <h2 className="relative">
          <span
            className="block text-4xl font-normal tracking-tight text-foreground transition-all duration-700 sm:text-5xl md:text-5xl lg:text-6xl"
            style={{
              transform: isHovered ? "translateY(-2px)" : "translateY(0)",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {titleTop}
          </span>
          <span
            className="block text-4xl font-normal tracking-tight transition-all duration-700 sm:text-5xl md:text-5xl lg:text-6xl"
            style={{
              transform: isHovered ? "translateX(12px)" : "translateX(0)",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              backgroundImage:
                "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {titleBottom}
          </span>
        </h2>

        {/* Description */}
        <p
          className="mt-6 max-w-[300px] text-sm leading-relaxed transition-all duration-700 md:mt-8 md:max-w-[240px] md:text-base lg:mt-10 lg:max-w-[260px]"
          style={{
            color: isHovered
              ? "hsl(var(--muted-foreground))"
              : "hsl(var(--muted-foreground) / 0.7)",
            transform: isHovered ? "translateY(-4px)" : "translateY(0)",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {description}
        </p>

        {/* CTA */}
        <div className="mt-6 flex items-center gap-4 md:mt-8 lg:mt-10">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 md:h-11 md:w-11 lg:h-12 lg:w-12"
            style={{
              borderColor: isHovered
                ? "hsl(var(--primary))"
                : "hsl(var(--muted-foreground) / 0.3)",
              backgroundColor: isHovered
                ? "hsl(var(--primary))"
                : "transparent",
              color: isHovered
                ? "hsl(var(--primary-foreground))"
                : "hsl(var(--foreground))",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
              boxShadow: isHovered
                ? "0 8px 32px hsl(var(--primary) / 0.25)"
                : "0 0 0 transparent",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-500 md:h-4 md:w-4"
              style={{
                transform: isHovered ? "rotate(45deg)" : "rotate(0deg)",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>
          <span
            className="text-[10px] font-medium uppercase tracking-widest transition-all duration-700 md:text-xs"
            style={{
              opacity: isHovered ? 1 : 0.6,
              transform: isHovered ? "translateX(0)" : "translateX(-8px)",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: isHovered ? "100ms" : "0ms",
            }}
          >
            {ctaLabel}
          </span>
        </div>
      </div>

      {/* Image */}
      <div
        className="relative transition-all duration-700"
        style={{
          transform: isHovered
            ? "translateX(4px) translateY(-4px)"
            : "translateX(0) translateY(0)",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Frame outline al hover */}
        <div
          className="absolute -inset-3 border transition-all duration-700 md:-inset-4"
          style={{
            borderColor: isHovered
              ? "hsl(var(--foreground) / 0.15)"
              : "transparent",
            transform: isHovered ? "scale(1.01)" : "scale(1)",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        <div className="relative h-[340px] w-[260px] sm:h-[400px] sm:w-[300px] md:h-[460px] md:w-[340px] lg:h-[540px] lg:w-[400px]">
          <div
            className="absolute -inset-1 transition-all duration-700"
            style={{
              boxShadow: isHovered
                ? "0 24px 64px hsl(var(--primary) / 0.18)"
                : "0 0 0 transparent",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />

          {/* Imagen con next/image. mix-blend-multiply funde el blanco con el bg de la app */}
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 80vw, 400px"
            priority
            className="object-contain transition-all duration-1000"
            style={{
              transform: isHovered ? "scale(1.03)" : "scale(1)",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              mixBlendMode: blendImage ? "multiply" : "normal",
            }}
          />

          {/* Corner accents */}
          <div
            className="absolute left-2 top-2 h-5 w-px bg-primary transition-all duration-500 md:left-3 md:top-3 md:h-6"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "scaleY(1)" : "scaleY(0)",
              transformOrigin: "top",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: "50ms",
            }}
          />
          <div
            className="absolute left-2 top-2 h-px w-5 bg-primary transition-all duration-500 md:left-3 md:top-3 md:w-6"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: "100ms",
            }}
          />
          <div
            className="absolute bottom-2 right-2 h-5 w-px bg-primary transition-all duration-500 md:bottom-3 md:right-3 md:h-6"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "scaleY(1)" : "scaleY(0)",
              transformOrigin: "bottom",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: "150ms",
            }}
          />
          <div
            className="absolute bottom-2 right-2 h-px w-5 bg-primary transition-all duration-500 md:bottom-3 md:right-3 md:w-6"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "right",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: "200ms",
            }}
          />
        </div>

        {/* Index number */}
        <span
          className="absolute -bottom-6 right-0 font-mono text-xs text-muted-foreground transition-all duration-700 md:-bottom-8 md:text-sm"
          style={{
            opacity: isHovered ? 1 : 0.4,
            transform: isHovered ? "translateY(12px)" : "translateY(0)",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {index}
        </span>
      </div>
    </Wrapper>
  );
}
