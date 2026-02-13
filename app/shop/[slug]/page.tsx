import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProductImageGallery from "@/components/shop/ProductImageGallery";
import { formatPrice, getProductBySlug, products } from "@/data/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | AH Digitizing",
    };
  }

  return {
    title: `${product.title} | AH Digitizing`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 3);

  return (
    <main className="bg-[#f7f8fb] py-10">
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 lg:grid-cols-2">
        <div>
          <p className="text-sm text-gray-500">
            <Link href="/shop" className="hover:text-primary">Shop</Link> /{" "}
            <Link href="/shop/all-products" className="hover:text-primary">All Products</Link> /{" "}
            <span className="font-medium text-gray-700">{product.title}</span>
          </p>

          <ProductImageGallery
            title={product.title}
            heroImage={product.heroImage}
            gallery={product.gallery}
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
            {product.categoryLabel}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">{product.title}</h1>
          <p className="mt-4 text-gray-600">{product.description}</p>

          <div className="mt-6 text-3xl font-bold text-primary">{formatPrice(product.price)}</div>

          <div className="mt-6 space-y-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
            <p>
              <span className="font-semibold text-gray-900">Turnaround:</span> {product.turnaround}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Revisions:</span> {product.revisions}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Deliverables:</span> {product.tags.join(", ")}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-full px-7">
              <Link href="/get-quote">Order This Service</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-7">
              <Link href="/shop/all-products">Back to Catalog</Link>
            </Button>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mx-auto mt-14 w-full max-w-7xl px-4">
          <h2 className="text-2xl font-bold text-gray-900">Related Services</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((item) => (
              <Link
                key={item.slug}
                href={`/shop/${item.slug}`}
                className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-primary"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.categoryLabel}</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{item.title}</p>
                <p className="mt-2 text-primary font-bold">{formatPrice(item.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
