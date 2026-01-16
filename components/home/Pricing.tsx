"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import pricesData from "../../data/price.json";

type Plan = {
  id: string;
  title: string;
  price: number;
  suffix: string;
  features: string[];
  subtitle?: string;
  service: "Embroidery" | "Vector";
};

function PriceCard({ plan }: { plan: Plan }) {
  return (
    <motion.div
      className="relative p-6 rounded-2xl bg-white border border-gray-200 shadow-md"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1 }}
    >
      <h3 className="text-2xl font-bold mb-1">{plan.title}</h3>

      {/* Service tag below title */}
      <span className="inline-block bg-primary text-white px-3 py-1 text-xs rounded-full font-semibold mb-4">
        {plan.service}
      </span>

      {plan.subtitle && (
        <p className="text-sm text-gray-600 mb-4">{plan.subtitle}</p>
      )}

      <div className="mb-4">
        <span className="text-4xl font-bold">${plan.price}</span>
        <span className="text-gray-600 text-sm ml-1">{plan.suffix}</span>
      </div>

      <ul className="space-y-2">
        {plan.features.slice(0, 2).map((feature, i) => {
          const hasFeature = !feature.startsWith("x:");
          const featureText = hasFeature ? feature : feature.substring(2);
          return (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className={hasFeature ? 'text-green-500' : 'text-gray-300'}>
                {hasFeature ? "✔" : "✖"}
              </span>
              <span className="text-gray-700">{featureText}</span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-20% 0px -20% 0px" });

  // Get first 2 plans for each service
  type PlanData = {
  id: string;
  title: string;
  price: number;
  suffix: string;
  features: string[];
  subtitle?: string;
};

const embroideryPlans: Plan[] = ((pricesData as { embroidery: PlanData[] }).embroidery.slice(0, 2)).map(
  (p: PlanData) => ({ ...p, service: "Embroidery" })
);

const vectorPlans: Plan[] = ((pricesData as { vector: PlanData[] }).vector.slice(0, 2)).map(
  (p: PlanData) => ({ ...p, service: "Vector" })
);


  const allPlans = [...embroideryPlans, ...vectorPlans];

  return (
    <section ref={sectionRef} className="relative py-16 overflow-hidden bg-gray-50">
      {/* Primary color background overlay */}
      <motion.div
        className="absolute inset-0 bg-primary z-0"
        initial={{ y: "-100%" }}
        animate={isInView ? { y: 0 } : { y: "-100%" }}
        transition={{ duration: 2, ease: "easeOut" }}
      ></motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center text-white mb-12">Pricing</h2>

        {/* 1 row, 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allPlans.map(plan => (
            <PriceCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Compare button */}
        <div className="text-center mt-12">
          <a
            href="/pricing"
            className="inline-block px-8 py-4 bg-white text-primary font-bold rounded-lg shadow-md hover:bg-gray-100 transition"
          >
            Compare All Pricings
          </a>
        </div>
      </div>
    </section>
  );
}
