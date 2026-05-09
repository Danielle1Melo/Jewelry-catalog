"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import earringsImg from "@/assets/earrings.png";

const slides = [
  {
    label: "COLEÇÃO PRATA",
    heading: "Elegância atemporal",
    subtitle: "Peças de prata para o seu dia a dia.",
    image: earringsImg,
  },
  {
    label: "COLEÇÃO PRATA",
    heading: "Brilho natural",
    subtitle: "Joias que contam a sua história.",
    image: earringsImg,
  },
  {
    label: "COLEÇÃO PRATA",
    heading: "Estilo único",
    subtitle: "Acessórios que completam o seu look.",
    image: earringsImg,
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={index} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={slide.image}
                  alt={slide.heading}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 pb-12">
                  <span className="mb-2 text-xs font-semibold tracking-widest text-tiffany">
                    {slide.label}
                  </span>
                  <h2 className="mb-2 font-heading text-3xl font-bold text-white">
                    {slide.heading}
                  </h2>
                  <p className="mb-5 text-sm text-gray-200">
                    {slide.subtitle}
                  </p>
                  <a
                    href="#destaques"
                    className="inline-flex w-fit items-center gap-1 rounded-full bg-tiffany px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-tiffany-dark"
                  >
                    Explorar
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Ir para slide ${index + 1}`}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === selectedIndex
                ? "w-6 bg-tiffany"
                : "w-2 bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
