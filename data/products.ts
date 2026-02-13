export type ProductCategory = "embroidery-digitizing" | "vector-conversion" | "custom-patches";

export type Product = {
  id: number;
  slug: string;
  title: string;
  category: ProductCategory;
  categoryLabel: string;
  shortDescription: string;
  description: string;
  price: number;
  turnaround: string;
  revisions: string;
  heroImage: string;
  gallery: string[];
  tags: string[];
};

export const products: Product[] = [
  {
    id: 1,
    slug: "company-logo-vector-conversion",
    title: "Company Logo Vector Conversion",
    category: "vector-conversion",
    categoryLabel: "Vector Art Conversion",
    shortDescription:
      "Clean and scalable vector redraw for business logos, brand marks, signage, print, and digital use.",
    description:
      "We convert pixel-based logos into production-ready vector files with precise curves, balanced spacing, and editable layers. Each redraw is organized for practical use across print, web, uniforms, labels, packaging, and large-format signage without quality loss.",
    price: 20,
    turnaround: "4-8 Hours",
    revisions: "Unlimited minor revisions",
    heroImage: "/home-page/products picture/1.png",
    gallery: [
      "/home-page/products picture/1.png",
      "/home-page/vector.png",
      "/home-page/portfolio-vector/1st.jpg",
    ],
    tags: ["AI", "EPS", "SVG", "PDF"],
  },
  {
    id: 2,
    slug: "custom-tshirt-embroidery-digitizing",
    title: "Custom T-Shirt Embroidery Digitizing",
    category: "embroidery-digitizing",
    categoryLabel: "Embroidery Digitizing",
    shortDescription:
      "Balanced stitch paths and clean sequencing for sharper embroidery results on T-shirts and knitwear.",
    description:
      "This service is optimized for knit fabrics and casual garments with careful underlay, pull compensation, and stitch direction planning. The result is cleaner lettering, fewer thread breaks, and more consistent output during production runs.",
    price: 25,
    turnaround: "6-10 Hours",
    revisions: "Unlimited minor revisions",
    heroImage: "/home-page/products picture/2.png",
    gallery: [
      "/home-page/products picture/2.png",
      "/home-page/portfolio-embroidery/2nd.jpg",
      "/services/cap.svg",
    ],
    tags: ["DST", "PES", "EMB", "EXP"],
  },
  {
    id: 3,
    slug: "sports-team-logo-vectorization",
    title: "Sports Team Logo Vectorization",
    category: "vector-conversion",
    categoryLabel: "Vector Art Conversion",
    shortDescription:
      "Sharp vectorization for sports logos used on jerseys, banners, merchandise, and promotional print assets.",
    description:
      "We recreate detailed sports logos into editable vectors while preserving mascot character, line-weight consistency, and shape balance. Files are prepared for multi-size use across teamwear, vinyl cutting, social media graphics, and print campaigns.",
    price: 18,
    turnaround: "4-8 Hours",
    revisions: "Unlimited minor revisions",
    heroImage: "/home-page/products picture/3.png",
    gallery: [
      "/home-page/products picture/3.png",
      "/home-page/tiger.png",
      "/home-page/portfolio-vector/3rd.jpg",
    ],
    tags: ["Vector", "Mascot", "Branding", "Print-Ready"],
  },
  {
    id: 4,
    slug: "embroidered-patch-custom-design",
    title: "Embroidered Patch - Custom Design",
    category: "custom-patches",
    categoryLabel: "Patches",
    shortDescription:
      "Patch-ready digitizing with clean outlines, satin borders, and durable stitch structure for production.",
    description:
      "From concept to final stitch file, this service is tailored for uniform patches, clubs, and branded merchandise. We focus on border clarity, stable fill density, and practical machine sequencing so patches remain clean after repeated use.",
    price: 12.5,
    turnaround: "6-12 Hours",
    revisions: "Unlimited minor revisions",
    heroImage: "/home-page/products picture/4.png",
    gallery: [
      "/home-page/products picture/4.png",
      "/services/2 Cap Before.png",
      "/home-page/portfolio-embroidery/1st.jpg",
    ],
    tags: ["Patch", "Merrow Border", "Iron-On", "PVC Reference"],
  },
  {
    id: 5,
    slug: "complex-graphic-digitizing",
    title: "Complex Graphic Digitizing",
    category: "embroidery-digitizing",
    categoryLabel: "Embroidery Digitizing",
    shortDescription:
      "Detailed embroidery files for dense, artistic, and multi-layer graphics that require controlled stitch planning.",
    description:
      "Ideal for badges and multi-element artwork where stitch direction, density, and texture control are critical. We structure the file to protect small details and reduce distortion across different fabric types and garment placements.",
    price: 35,
    turnaround: "8-14 Hours",
    revisions: "Unlimited minor revisions",
    heroImage: "/home-page/products picture/5.png",
    gallery: [
      "/home-page/products picture/5.png",
      "/services/3D PUFF after.svg",
      "/home-page/portfolio-embroidery/5th.jpg",
    ],
    tags: ["High Detail", "3D Puff", "Applique", "Production Tested"],
  },
  {
    id: 6,
    slug: "applique-embroidery-digitizing",
    title: "Applique Embroidery Digitizing",
    category: "embroidery-digitizing",
    categoryLabel: "Embroidery Digitizing",
    shortDescription:
      "Accurate placement, tack-down, and cover stitching for smooth and reliable applique embroidery workflow.",
    description:
      "Built specifically for applique workflows with clear placement runs, secure tack-down passes, and neat satin cover stitching. This helps speed up production, improve alignment consistency, and deliver clean finishing on repeated orders.",
    price: 28,
    turnaround: "8-12 Hours",
    revisions: "Unlimited minor revisions",
    heroImage: "/home-page/products picture/6.png",
    gallery: [
      "/home-page/products picture/6.png",
      "/services/OUTLINE.svg",
      "/home-page/portfolio-embroidery/3rd.jpg",
    ],
    tags: ["Applique", "Multi-Layer", "Garment", "Fast Setup"],
  },
];

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
];

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
