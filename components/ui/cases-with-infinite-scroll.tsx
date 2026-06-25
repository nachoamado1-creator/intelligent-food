"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// Fotos reales en /public/products → p_1.png … p_32.png
const PRODUCT_IMAGES = Array.from(
  { length: 32 },
  (_, i) => `/products/p_${i + 1}.png`,
);

function Case() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const timer = setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [api, current]);

  return (
    <div className="w-full py-20 lg:py-32">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl md:text-5xl tracking-tight lg:max-w-xl font-semibold text-left text-foreground">
              Decenas de productos frescos, listos para retirar
            </h2>
            <p className="max-w-xl text-muted-foreground text-pretty">
              Viandas, snacks saludables y bebidas que rotan a diario en
              nuestras heladeras inteligentes de Tandil.
            </p>
          </div>

          <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {PRODUCT_IMAGES.map((src, index) => (
                <CarouselItem className="basis-1/2 sm:basis-1/3 lg:basis-1/5" key={index}>
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Producto ${index + 1}`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export { Case };
