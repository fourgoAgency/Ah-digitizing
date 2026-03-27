"use client";

import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/data/products";

type ShopProductSectionProps = {
  title: string;
  description: string;
  products: Product[];
};

export default function ShopProductSection({
  title,
  description,
  products,
}: ShopProductSectionProps) {
  return (
    <section className="">
      <h1 className="text-5xl font-black text-secondary text-center mt-4">{title}</h1>
      <p className="mb-6 mt-3 text-gray-600 text-center">{description}</p>

      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={`${title}-${product.id}`} product={product} imageVariant="largeSquare" />
        ))}
      </div>
    </section>
  );
}
