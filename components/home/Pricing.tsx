"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import pricesData from "../../data/price.json";

type Plan = {
  id: string;
  title: string;
  price: number;
  suffix: string;
  features: string[];
  popular?: boolean;
  subtitle?: string;
};

function PriceCard({ plan, isInView }: { plan: Plan; isInView: boolean }) {
  const isOrganization = plan.title === "Advanced";
  
  return (
    <div className="relative p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-shadow">
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-1 text-xs rounded-full font-medium">
          Popular
        </span>
      )}

      <h3 className="text-2xl font-bold mb-1">{plan.title}</h3>
      {plan.subtitle && (
        <p className="text-sm text-gray-600 mb-6">{plan.subtitle}</p>
      )}

      <div className="mb-6">
        <span className="text-5xl font-bold">${plan.price}</span>
        <span className="text-gray-600 text-sm ml-1">{plan.suffix}</span>
      </div>

      <ul className="mb-8 space-y-3">
        {plan.features.map((feature, i) => {
          const hasFeature = !feature.startsWith("x:");
          const featureText = hasFeature ? feature : feature.substring(2);
          
          return (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className={`mt-0.5 ${hasFeature ? 'text-green-500' : 'text-gray-300'}`}>
                {hasFeature ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              <span className="text-gray-700">{featureText}</span>
              {featureText.includes("Collaboration") && (
                <svg className="w-4 h-4 text-gray-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
            </li>
          );
        })}
      </ul>

      <button
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          plan.popular
            ? "bg-primary text-white hover:bg-primary"
            : isOrganization
            ? "border-2 border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center gap-2"
            : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
        }`}
      >
        {isOrganization ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact sale
          </>
        ) : (
          "Upgrade"
        )}
      </button>
    </div>
  );
}

export default function Pricing() {
  const [type, setType] = useState<"embroidery" | "vector">("embroidery");
  const plans: Plan[] = (pricesData as any)[type] || [];
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-20% 0px -20% 0px" });

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Primary Color Overlay Animation */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-primary"
        style={{ height: '60%', zIndex: 15 }}
        initial={{ y: "100%", opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
      ></motion.div>

      {/* Promo Badge - positioned in top right */}
<div className="absolute top-16 right-36 rotate-20 z-20">
  <div className="text-center leading-none">
    <div className="font-abril text-5xl text-gray-800 font-extrabold">Get</div>
    <div className="font-abril text-5xl text-primary -mt-2 font-extrabold">50% off</div>
    <div className="text-lg text-gray-800 font-medium">On your First Order</div>
  </div>
</div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.h2
          className="text-center text-5xl font-bold mb-4"
          animate={isInView ? { color: "#ffffff" } : { color: "#000000" }}
          transition={{ duration: 1 }}
        >
          Pricing
        </motion.h2>
        <motion.p
          className="text-center mb-10"
          animate={isInView ? { color: "#ffffff" } : { color: "#6b7280" }}
          transition={{ duration: 1 }}
        >
          Officia exercitation quis voluptate elit consequat nostrud
        </motion.p>

        <div className="flex items-center justify-center gap-0 mb-12">
          <motion.button
            onClick={() => setType("embroidery")}
            className={`px-8 py-3 rounded-l-full border-2 border-primary font-medium transition-colors ${
              type === "embroidery"
                ? "bg-primary text-white"
                : "bg-white text-primary"
            }`}
            animate={isInView ? {
              backgroundColor: type === "embroidery" ? "#ffffff" : "#ffffff",
              color: type === "embroidery" ? "#000000" : "#000000"
            } : {}}
            transition={{ duration: 1 }}
          >
            Embroidery Digitizing
          </motion.button>
          <motion.button
            onClick={() => setType("vector")}
            className={`px-8 py-3 rounded-r-full border-2 border-l-0 border-primary font-medium transition-colors ${
              type === "vector"
                ? "bg-primary text-white"
                : "bg-white text-primary"
            }`}
            animate={isInView ? {
              backgroundColor: type === "vector" ? "#ffffff" : "#ffffff",
              color: type === "vector" ? "#000000" : "#000000"
            } : {}}
            transition={{ duration: 1 }}
          >
            Vector Conversion
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <PriceCard plan={p} isInView={isInView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}