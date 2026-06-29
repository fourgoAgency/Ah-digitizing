export type ProductCategory =
  | "embroidery-digitizing"
  | "vector-conversion"
  | "custom-patches"
  | "animal-designs"
  | "bird-designs"
  | "friends-and-family";

export type ShopSubcategoryDefinition = {
  label: string;
  href: string;
  category: ProductCategory;
  order?: number;
};

export type ShopCategoryDefinition = {
  slug: ProductCategory;
  image: string;
  label: string;
  order?: number;
  subcategories?: Omit<ShopSubcategoryDefinition, "category">[];
};
export type ProductType = "top-selling" | "free" | "bulk" | "none";

export type Product = {
  id: number;
  productType: ProductType;
  slug: string;
  title: string;
  category: ProductCategory;
  categoryLabel: string;
  shortDescription: string;
  description: string;
  price: number;
  turnaround: string;
  revisions: string;
  totalSold: number;
  heroImage: string;
  gallery: string[];
  tags: string[];
};

const portfolioPageImages = Array.from({ length: 10 }, (_, index) => `/new/${index + 1}-Photoroom.png`);

function createPortfolioProduct({
  id,
  slug,
  title,
  category,
  categoryLabel,
  productType,
  shortDescription,
  description,
  price,
  turnaround,
  revisions,
  imageIndex,
  tags,
}: Omit<Product, "heroImage" | "gallery" | "totalSold"> & { imageIndex: number }): Product {
  const heroImage = portfolioPageImages[imageIndex % portfolioPageImages.length];
  const gallery = [
    heroImage,
    portfolioPageImages[(imageIndex + 1) % portfolioPageImages.length],
    portfolioPageImages[(imageIndex + 2) % portfolioPageImages.length],
  ];

  return {
    id,
    slug,
    title,
    category,
    categoryLabel,
    productType,
    shortDescription,
    description,
    price,
    turnaround,
    revisions,
    totalSold: 120 + id * 7,
    heroImage,
    gallery,
    tags,
  };
}

export const transformationExamples = [
  {
    id: 1,
    title: "Logo Refinement",
    description:
      "Transforming a pixelated company logo into a clean, scalable vector format suitable for all branding needs.",
    beforeImage: "/home-page/portfolio-vector/1st.jpg",
    afterImage: "/home-page/portfolio-vector/2nd.jpg",
  },
  {
    id: 2,
    title: "Intricate Illustration Cleanup",
    description:
      "Converting a scanned illustration into a sharp vector graphic while preserving artistic details.",
    beforeImage: "/home-page/portfolio-vector/2nd.jpg",
    afterImage: "/home-page/portfolio-vector/3rd.jpg",
  },
  {
    id: 3,
    title: "Product Image Enhancement",
    description:
      "Preparing product visuals for e-commerce use by improving clarity and shape consistency for conversion workflows.",
    beforeImage: "/home-page/portfolio-vector/3rd.jpg",
    afterImage: "/home-page/portfolio-vector/4th.jpg",
  },
  {
    id: 4,
    title: "Detailed Artwork Conversion",
    description:
      "Rebuilding old or complex artwork into a production-ready vector suitable for large prints and digital assets.",
    beforeImage: "/home-page/portfolio-vector/4th.jpg",
    afterImage: "/home-page/portfolio-vector/1st.jpg",
  },
];

export const categoryTabs = [
  { slug: "all-products", label: "All Products" },
  { slug: "embroidery-digitizing", label: "Embroidery Digitizing" },
  { slug: "vector-conversion", label: "Vector Conversion" },
  { slug: "custom-patches", label: "Patches" },
  { slug: "animal-designs", label: "Animal Designs" },
  { slug: "bird-designs", label: "Bird designs" },
  { slug: "friends-and-family", label: "Friends and family" },
];

export const shopSubcategoryDefinitions: ShopSubcategoryDefinition[] = [
  {
    label: "Logo Embroidery Digitizing",
    href: "/services/embroidery/logo",
    category: "embroidery-digitizing",
  },
  {
    label: "Left Chest Embroidery Digitizing",
    href: "/services/embroidery/left-chest",
    category: "embroidery-digitizing",
  },
  {
    label: "Cap Embroidery Digitizing",
    href: "/services/embroidery/cap",
    category: "embroidery-digitizing",
  },
  {
    label: "3D Puff Embroidery Digitizing",
    href: "/services/embroidery/3d-puff",
    category: "embroidery-digitizing",
  },
  {
    label: "Jacket Embroidery Digitizing",
    href: "/services/embroidery/jacket",
    category: "embroidery-digitizing",
  },
  {
    label: "Animal Quotes",
    href: "/shop/animal-designs/animal-quotes",
    category: "animal-designs",
  },
  {
    label: "Baby Animals",
    href: "/shop/animal-designs/baby-animals",
    category: "animal-designs",
  },
  {
    label: "Cat Designs",
    href: "/shop/animal-designs/cat-designs",
    category: "animal-designs",
  },
  {
    label: "Dog Designs",
    href: "/shop/animal-designs/dog-designs",
    category: "animal-designs",
  },
  {
    label: "Farm Animals",
    href: "/shop/animal-designs/farm-animals",
    category: "animal-designs",
  },
  {
    label: "Chick Design",
    href: "/shop/bird-designs/chick-design",
    category: "bird-designs",
  },
  {
    label: "Duck",
    href: "/shop/bird-designs/duck",
    category: "bird-designs",
  },
  {
    label: "Eagle Design",
    href: "/shop/bird-designs/eagle-design",
    category: "bird-designs",
  },
  {
    label: "Fly",
    href: "/shop/bird-designs/fly",
    category: "bird-designs",
  },
  {
    label: "Ladybug Design",
    href: "/shop/bird-designs/ladybug-design",
    category: "bird-designs",
  },
  {
    label: "Boy Design",
    href: "/shop/friends-and-family/boy-design",
    category: "friends-and-family",
  },
  {
    label: "Boyfriend",
    href: "/shop/friends-and-family/boyfriend",
    category: "friends-and-family",
  },
  {
    label: "Cutiepie Designs",
    href: "/shop/friends-and-family/cutiepie-designs",
    category: "friends-and-family",
  },
  {
    label: "Family Quotes",
    href: "/shop/friends-and-family/family-quotes",
    category: "friends-and-family",
  },
  {
    label: "Relatives",
    href: "/shop/friends-and-family/relatives",
    category: "friends-and-family",
  },
];

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

