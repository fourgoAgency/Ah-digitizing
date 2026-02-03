"use client";

import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import pricesData from "@/data/price.json";
import { useRef } from "react";
import Link from "next/link";

type Plan = {
  id: string;
  title: string;
  price: number;
  suffix: string;
  features: string[];
  subtitle?: string;
  service: "Embroidery" | "Vector";
};

type PlanData = {
  id: string;
  title: string;
  price: number;
  suffix: string;
  features: string[];
  subtitle?: string;
};

type ServicePricingProps = {
  serviceKey: "embroidery" | "vector";
  serviceLabel: "Embroidery" | "Vector";
};

export function PriceCard({ plan }: { plan: Plan }) {
  return (
    <motion.div
      className="relative rounded-3xl bg-primary bg-[url('/home-page/bg.svg')] bg-cover bg-right bg-no-repeat p-8 pl-0 shadow-xl shadow-gray-800/70"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      {/* STEP LABEL */}
      <div className="absolute top-4 left-4 text-white font-semibold tracking-wide text-sm opacity-90">
        {plan.service.toUpperCase()}
      </div>

      {/* INNER WHITE CARD */}
      <div className="mt-10 bg-white rounded-3xl  rounded-bl-none rounded-tl-none p-6 flex flex-col justify-center items-center shadow-xl shadow-gray-800/60">
        {/* Service Tag */}
        <span className="inline-block bg-primary/10 text-primary px-3 py-1 text-xs text-center rounded-full font-semibold mb-4">
          {plan.title}
        </span>

        {plan.subtitle && (
          <p className="text-sm text-gray-600 mb-4">{plan.subtitle}</p>
        )}

        {/* Price */}
        <div className="mb-6 ">
          <span className="text-4xl font-bold text-center text-gray-900">
             ${plan.price}
          </span>
          <span className="text-gray-500 text-sm">
            {plan.suffix}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicePricing({ serviceKey, serviceLabel }: ServicePricingProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useInView(sectionRef, { once: false, margin: "-20% 0px -20% 0px" });

  const plans = ((pricesData as Record<string, PlanData[]>)[serviceKey] || [])
    .slice(0, 2)
    .map((plan) => ({ ...plan, service: serviceLabel }));

  return (
    <section ref={sectionRef} className="relative py-16  overflow-hidden bg-gray-50">
      {/* Primary color background overlay */}

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <h2 className="text-7xl font-bold text-center mb-12">Pricing</h2>

        {/* 1 row, 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <PriceCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Compare button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="px-6 rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-colors"
          >
            <Link href="/pricing">Compare All Pricings</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
