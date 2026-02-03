"use client";

import Link from "next/link";
import priceData from "@/data/price.json";

type Plan = {
  id: string;
  title: string;
  description: string;
  price: number;
  suffix: string;
  features: string[];
  popular: boolean;
};

type PricingProps = {
  slug: string;
};

export default function Pricing({ slug }: PricingProps) {
  const keyMap: Record<string, keyof typeof priceData> = {
    "embroidery-digitizing": "embroidery",
    "raster-to-vector": "vector",
  };

  const selectedKey = keyMap[slug] || "embroidery";

  const plans: {
    id: string;
    name: string;
    description: string;
    price: string;
    period: string;
    features: { text: string; included: boolean }[];
    badge: string | null;
    cta: string;
    ctaVariant: "primary" | "secondary";
  }[] = priceData[selectedKey].map((plan: Plan) => ({
    id: plan.id,
    name: plan.title,
    description: plan.description,
    price: `$${plan.price}`,
    period: "/design",
    features: plan.features.map((f: string) => ({ text: f, included: true })),
    badge: plan.popular ? "Popular" : null,
    cta: "Get Started",
    ctaVariant: plan.popular ? "primary" : "secondary",
  }));

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Understand Our Transparent Pricing</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our pricing is fair and based on several factors to ensure you get the best value for your specific project. Get a custom quote for exact pricing.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.id} 
            className={`relative rounded-xl p-8 justify-between flex flex-col h-full border-2
            ${plan.ctaVariant === "primary" 
            ? "bg-linear-to-br from-primary to-black text-white border-2 border-white shadow-lg" 
            : "bg-white border border-gray-200 shadow-sm"}`}>
              <div className="mb-2">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              </div>
              <div className="mb-8">
                <p className={plan.ctaVariant === "primary" ? "text-white" : "text-gray-700"}>{plan.description}</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold ">{plan.price}</span>
                  <span className="text-sm">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    {feature.included ? (
                      <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={plan.ctaVariant === "primary" ? "text-white" : "text-gray-700"}>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/account?quote=${selectedKey}`} 
              className={`w-full py-3 px-6 rounded-full font-semibold text-center transition-colors 
              ${plan.ctaVariant === "primary" 
              ? "bg-white text-primary hover:border-blue-900 hover:bg-gray-200" 
              : "border border-blue-600 text-blue-600 hover:bg-primary hover:text-white"}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
