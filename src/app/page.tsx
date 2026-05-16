"use client";

import { useState } from "react";
import { Header } from "@/components/storefront/Header";
import { HeroCarousel } from "@/components/storefront/HeroCarousel";
import { CategoriesSection } from "@/components/storefront/CategoriesSection";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { Footer } from "@/components/storefront/Footer";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Todos");

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="flex-1">
        <HeroCarousel />
        <CategoriesSection activeTab={activeTab} onTabChange={setActiveTab} />
        <FeaturedProducts activeTab={activeTab} />
      </div>
      <Footer />
    </div>
  );
}
