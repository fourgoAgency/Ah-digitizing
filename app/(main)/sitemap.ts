import type { MetadataRoute } from "next";

const siteUrl = "https://ah-digitizing.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about-us",
    "/contact-us",
    "/FAQs",
    "/portfolio",
    "/shop",
    "/blogs",
    "/get-quote",
    "/get-free-quote",
    "/pricing/embroidery-digitizing",
    "/pricing/raster-to-vector",
    "/services/embroidery",
    "/services/raster-to-vector",
    "/privacy-policy",
    "/terms-and-conditions",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
