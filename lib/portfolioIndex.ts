// lib/portfolioIndex.ts
import { getDocument } from "@/lib/firebase";

type PortfolioIndex = {
  urls: string[];
  updatedAt: Date;
};

type PortfolioItem = {
  id: number;
  src: string;
  alt: string;
};

// Cache in memory so navigating back doesn't re-fetch
const cache: Partial<Record<string, PortfolioItem[]>> = {};

export async function fetchPortfolioImages(
  category: "embroidery" | "vector",
  limit?: number
): Promise<PortfolioItem[]> {
  if (cache[category]) return limit ? cache[category]!.slice(0, limit) : cache[category]!;

  const doc = await getDocument<PortfolioIndex>("portfolioIndex", category);
  if (!doc) return [];

  const items = doc.urls.map((src, i) => ({
    id: i,
    src,
    alt: `${category} design ${i + 1}`,
  }));

  cache[category] = items;
  return limit ? items.slice(0, limit) : items;
}