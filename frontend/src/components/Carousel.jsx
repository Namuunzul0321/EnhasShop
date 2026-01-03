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
  // Autoplay plugin
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false }) // 3 секунд тутамд гүйлгэх
  );

  return (
    <Carousel
      loop
      plugins={[plugin.current]}
      className="w-full max-w-4xl mx-auto relative"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="gap-4">
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <div className="w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
              <img
                src={src}
                alt={`carousel-${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Arrows */}
      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition" />
      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition" />
    </Carousel>
  );
}
