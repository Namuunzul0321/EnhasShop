"use client";

import Autoplay from "embla-carousel-autoplay";
import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselPlugin({ images }) {
  const plugin = React.useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false })
  );

  return (
    <Carousel
      loop
      plugins={[plugin.current]}
      className="w-screen relative  -mt-25 -mb-15
      md:-mt-16 md:-mb-0"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <div
              className="
                w-full
                h-[45vh]
                sm:h-[50vh]
                md:h-[60vh]
                lg:h-[70vh]
                overflow-hidden
              "
            >
              <img
                src={src}
                alt={`carousel-${index}`}
                className="w-full h-full object-contain"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Arrows */}
      <CarouselPrevious
        className="
        hidden md:flex
          absolute left-4 top-1/2 -translate-y-1/2
          bg-white/80 backdrop-blur
          rounded-full shadow
          hover:bg-white
        "
      />
      <CarouselNext
        className="
        hidden md:flex
          absolute right-4 top-1/2 -translate-y-1/2
          bg-white/80 backdrop-blur
          rounded-full shadow
          hover:bg-white
        "
      />
    </Carousel>
  );
}
