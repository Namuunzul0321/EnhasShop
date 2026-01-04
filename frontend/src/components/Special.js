"use client";

import { CarouselPlugin } from "./Carousel";

export const Special = () => {
  const images = ["/1.png", "/2.png", "/3.png"];
  return (
    <div className="py-5">
      <CarouselPlugin images={images} />
    </div>
  );
};
