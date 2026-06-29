"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Hero from "@/components/pricing/Hero";
import Pricing from "@/components/pricing/Pricing";
import FAQs from "@/components/pricing/FAQs";
import { getDocuments, getDocument } from "@/lib/firebase";

type Plan = {
  id: string;
  title: string;
  description: string;
  price: number;
  suffix: string;
  features: string[];
  popular: boolean;
  category?: string;
};

type PortfolioItem = {
  id: number;
  src: string;
  alt: string;
};

type PricingPageData = {
  plans: Plan[];
  portfolioItems: PortfolioItem[];
};

export default function PricingPage() {
  const params   = useParams();
  const rawSlug  = Array.isArray(params.slug) ? params.slug[0] : params.slug || "";
  const category = rawSlug.includes("vector") ? "vector" : "embroidery";

  const [data, setData]       = useState<PricingPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function load() {
      try {
        // Both fetched in parallel — one call each
        const [allPlans, portfolioDoc] = await Promise.all([
          getDocuments<Plan>("pricing"),
          getDocument<{ urls: string[] }>("portfolioIndex", category),
        ]);

        if (!isMounted) return;

        const plans = allPlans
          .filter((p) => {
            const cat = (p.category || "embroidery").toLowerCase();
            return cat.includes("vector") ? category === "vector" : category === "embroidery";
          })
          .sort((a, b) => a.price - b.price);

        const portfolioItems = (portfolioDoc?.urls ?? []).map((src, i) => ({
          id: i,
          src,
          alt: `${category} design ${i + 1}`,
        }));

        setData({ plans, portfolioItems });
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load pricing page data:", err);
        setData(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => { isMounted = false; };
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <Pricing
        slug={category}
        plans={data?.plans ?? []}
        portfolioItems={data?.portfolioItems ?? []}
        loading={loading}
      />
      <FAQs />
      <section className="py-20 px-6">
        <div className="w-full mx-auto">
          <div className="text-left">
            <h4 className="text-lg font-bold text-gray-900 mb-2">NOTE *</h4>
            <p className="text-gray-600">
              Pricing above is mentioned in US dollars and although can be paid in
              customer&apos;s local currency, will be paid according to the US conversion rate
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}