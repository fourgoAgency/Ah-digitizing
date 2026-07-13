"use client";

import { useCartSidebar } from "./CartSidebarContext"; // Apne actual path se replace karein
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";

type OrderButtonProps = {
  product: Product;
};

export default function OrderButton({ product }: OrderButtonProps) {
  const { addItem, openCart } = useCartSidebar();

  const handleOrder = () => {
    // 1. Cart mein item add karein
    addItem(product, 1);
    // 2. Sidebar open karein taake user ko feedback mile
    openCart();
  };

  return (
    <Button 
      onClick={handleOrder} 
      className="rounded-full cursor-pointer px-7"
    >
      Order This Service
    </Button>
  );
}