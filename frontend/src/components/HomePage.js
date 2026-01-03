"use client";

import { Header } from "./Header";
import { Products } from "./Products";
import { Special } from "./Special";
import { Uner } from "./Uner";

export const HomePage = () => {
  return (
    <div>
      <Header />
      <Special />
      <Uner />
      <Products />
      {/* <Footer /> */}
    </div>
  );
};
