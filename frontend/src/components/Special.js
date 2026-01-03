"use client";

import { CarouselPlugin } from "./Carousel";

export const Special = () => {
  const images = ["/1.png", "/2.png", "/lemon.png"];
  return (
    <div className="py-10">
      <CarouselPlugin images={images} />
    </div>
  );
};
