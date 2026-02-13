import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice, Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
  imageVariant?: "default" | "largeSquare";
};

export default function ProductCard({ product, imageVariant = "default" }: ProductCardProps) {
  const imageWrapperClass =
    imageVariant === "largeSquare"
      ? "relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100"
      : "relative h-44 w-full overflow-hidden rounded-lg bg-gray-100";

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className={imageWrapperClass}>
          <Image
            src={product.heroImage}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 20vw"
          />
          <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[11px] font-semibold text-gray-700">
            {product.categoryLabel}
          </span>
        </div>
      </Link>

      <div className="mt-3 space-y-2">
        <Link href={`/shop/${product.slug}`} className="block">
          <h3 className="text-base font-semibold text-gray-900">{product.title}</h3>
        </Link>
        <p className="text-sm text-gray-600">{product.shortDescription}</p>
        <div className="flex justify-between p-2">
        <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
        <Button asChild className="h-8 rounded-md px-6 text-sm font-semibold">
          <Link href={`/shop/${product.slug}`}>Add to Cart</Link>
        </Button>
        </div>
      </div>
    </article>
  );
}
