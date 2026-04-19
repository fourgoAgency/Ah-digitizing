"use client";
import { motion } from "framer-motion";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/data/products";

type ShopProductSectionProps = {
  title: string;
  description: string;
  products: Product[];
  showSoldBadge?: boolean;
};

export default function ShopProductSection({
  title,
  description,
  products,
  showSoldBadge = false,
}: ShopProductSectionProps) {
  return (
    <section className="">
      <h1 className="text-5xl font-black text-secondary text-center mt-4">{title}</h1>
      <p className="mb-6 mt-3 text-gray-600 text-center">{description}</p>
      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {products.map((product) => (
          <motion.div
            key={`${title}-${product.id}`}
            initial={{ opacity: 0, y: 60, scale: 0.96, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <ProductCard
              product={product}
              imageVariant="largeSquare"
              showSoldBadge={showSoldBadge}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
