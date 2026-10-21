import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/designer/", "/login", "/api/"],
    },
    sitemap: "https://ah-digitizing.vercel.app/sitemap.xml",
  };
}
