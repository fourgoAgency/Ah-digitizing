// "use client";

// import Link from "next/link";
// import priceData from "@/data/price.json";

// export default function Pricing() {
//   const plans = priceData.embroidery.map((plan) => ({
//     id: plan.id,
//     name: plan.title,
//     price: `$${plan.price}`,
//     period: "/design",
//     features: plan.features.map((f) => ({ text: f, included: true })),
//     badge: plan.popular ? "Popular" : null,
//     cta: "Get Started",
//     ctaVariant: plan.popular ? "primary" : "secondary",
//   }));

//   return (
//     <section className="py-20 px-6 bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <h2 className="text-5xl font-bold text-gray-900 mb-4">Understand Our Transparent Pricing</h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Our pricing is fair and based on several factors to ensure you get the best value for your specific project. Get a custom quote for exact pricing.
//           </p>
//         </div>

//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {plans.map((plan) => (
//             <div
//               key={plan.id}
//               className={`relative rounded-xl p-8 ${
//                 plan.ctaVariant === "primary"
//                   ? "bg-white border-2 border-blue-600 shadow-lg"
//                   : "bg-white border border-gray-200 shadow-sm"
//               }`}
//             >
//               {/* Popular Badge */}
//               {plan.badge && (
//                 <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
//                   <span className="inline-block bg-gray-900 text-white text-sm font-semibold px-4 py-1 rounded-full">
//                     {plan.badge}
//                   </span>
//                 </div>
//               )}

//               {/* Plan Header */}
//               <div className="mb-8">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
//               </div>

//               {/* Price */}
//               <div className="mb-8">
//                 <div className="flex items-baseline gap-2">
//                   <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
//                   <span className="text-gray-600 text-sm">{plan.period}</span>
//                 </div>
//               </div>

//               {/* Features */}
//               <ul className="space-y-4 mb-8">
//                 {plan.features.map((feature, idx) => (
//                   <li key={idx} className="flex items-start gap-3">
//                     {feature.included ? (
//                       <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                       </svg>
//                     ) : (
//                       <svg className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                       </svg>
//                     )}
//                     <span className={feature.included ? "text-gray-700" : "text-gray-400"}>{feature.text}</span>
//                   </li>
//                 ))}
//               </ul>

//               {/* CTA Button */}
//               <Link
//                 href="/account?quote=embroidery"
//                 className={`w-full py-3 px-6 rounded-full font-semibold text-center transition-colors ${
//                   plan.ctaVariant === "primary"
//                     ? "bg-blue-600 text-white hover:bg-blue-700"
//                     : "border border-blue-600 text-blue-600 hover:bg-blue-50"
//                 }`}
//               >
//                 {plan.cta}
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useInView } from "framer-motion";
import pricesData from "@/data/price.json";
import { useRef, useState } from "react";
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

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-20% 0px -20% 0px" });
  const sectionRefe = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  const allPlans = [...embroideryPlans];

  return (
    <section ref={sectionRef} className="relative py-16  overflow-hidden bg-gray-50">
      {/* Primary color background overlay */}

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <h2 className="text-7xl font-bold text-center mb-12">Pricing</h2>

        {/* 1 row, 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
          {allPlans.map(plan => (
            <PriceCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Compare button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="px-6 rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-colors"
          >
          <Link
            href="/pricing">
            Compare All Pricings
          </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
