"use client";

import { useParams } from "next/navigation";
import Hero from "@/components/pricing/Hero";
import Pricing from "@/components/pricing/Pricing";
import FAQs from "@/components/pricing/FAQs";

export default function PricingPage() {
  const params = useParams();
  const rawSlug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug || "";
  const slug = typeof rawSlug === "string" ? rawSlug : "";
  const category = slug.includes("vector")
    ? "vector"
    : slug.includes("embroidery")
    ? "embroidery"
    : "embroidery";

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <Pricing slug={category} />
      <FAQs />
      <section className="py-20 px-6">
        <div className="w-full lg:max-w-7xl mx-auto">
          <div className="text-left">
            <h4 className="text-lg font-bold text-gray-900 mb-2">NOTE *</h4>
            <p className="text-gray-600">
              Pricing above is mentioned in US dollars and although can be paid in customer’s local currency, will be paid according to the US conversion rate
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
