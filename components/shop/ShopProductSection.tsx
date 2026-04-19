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

function chunkArray<T>(arr: T[], size: number): T[][] {
  return arr.reduce<T[][]>((acc, _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size));
    return acc;
  }, []);
}

const rowVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.96, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function ShopProductSection({
  title,
  description,
  products,
  showSoldBadge = false,
}: ShopProductSectionProps) {
  const rows = chunkArray(products, 5);

  return (
    <section className="">
      <h1 className="text-5xl font-black text-secondary text-center mt-4">{title}</h1>
      <p className="mb-6 mt-3 text-gray-600 text-center">{description}</p>

      <div className="mt-5 space-y-6">
        {rows.map((row, rowIdx) => (
          <motion.div
            key={rowIdx}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            variants={rowVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {row.map((product) => (
              <motion.div key={`${title}-${product.id}`} variants={cardVariants}>
                <ProductCard
                  product={product}
                  imageVariant="largeSquare"
                  showSoldBadge={showSoldBadge}
                />
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
