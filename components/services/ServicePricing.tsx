"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import pricing from "@/data/price.json";
import portfolio from "@/data/portfolio.json";

import { Button } from "../ui/button";

type Plan = {
  id: string;
  title: string;
  description: string;
  price: number;
  suffix: string;
  features: string[];
  popular: boolean;
  service: "Embroidery" | "Vector";
};

type PriceData = {
  embroidery: Omit<Plan, "service">[];
  vector: Omit<Plan, "service">[];
};

type PortfolioItem = {
  id: number;
  src: string;
  alt: string;
};

type PortfolioData = {
  embroidery: PortfolioItem[];
  vector: PortfolioItem[];
};

type PricingProps = {
  serviceKey?: "embroidery" | "vector";
  serviceLabel?: "Embroidery" | "Vector";
};

const accents = [
  {
    chip: "bg-gradient-to-b from-blue-400 to-blue-800",
    button: "bg-blue-500 hover:bg-blue-600",
  },
  {
    chip: "bg-gradient-to-b from-sky-400 to-blue-500",
    button: "bg-sky-500 hover:bg-sky-600",
  },
  {
    chip: "bg-gradient-to-b from-primary to-secondary",
    button: "bg-primary hover:bg-secondary",
  },
];

const headingVariants = {
  hidden: { y: 40, opacity: 0, scale: 1.02 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function PriceCard({
  plan,
  index,
  onOpenSample,
}: {
  plan: Plan;
  index: number;
  onOpenSample: (service: Plan["service"]) => void;
}) {
  const accent = accents[index % accents.length];

  return (
    <div className="relative flex h-full flex-col rounded-[2rem] bg-white px-5 pb-8 pt-12 mx-5 text-center shadow-xl shadow-slate-900/10 sm:px-6">
      <button
        type="button"
        onClick={() => onOpenSample(plan.service)}
        className={`absolute left-0 hidden -translate-x-3/5 -rotate-90 rounded-t-md px-5 py-2 text-[10px] tracking-[0.35em] text-white sm:inline-flex top-20 ${accent.chip}`}
      >
        VIEW SAMPLE
      </button>

      <div className="flex flex-1 flex-col">
        <div className="mb-4 flex items-start justify-center text-[13px] uppercase tracking-[0.45em] text-slate-400">
          <div>
            {plan.title.toUpperCase()}
            <br />
            {plan.service}
          </div>
        </div>

        <div className="flex min-h-[4.5rem] items-center justify-center">
          <h3 className="text-4xl font-semibold text-slate-800">
            ${plan.price.toFixed(2)}
            <span className="ml-1 text-xs text-slate-500">
              {plan.suffix ? plan.suffix : "per plan"}
            </span>
          </h3>
        </div>

        <div className="mt-3 flex flex-1 items-start justify-center">
          <p className="mx-auto max-w-[17rem] text-sm text-slate-500">
            {plan.description}
          </p>
        </div>

        <Button
          asChild
          className={`mx-auto mt-8 w-full max-w-44 rounded-full text-xs font-semibold uppercase text-white ${accent.button}`}
        >
          <Link href={`/pricing/${plan.service.toLowerCase()}`}>View Pricing</Link>
        </Button>
      </div>
    </div>
  );
}

export default function Pricing({ serviceKey, serviceLabel }: PricingProps = {}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [activeService, setActiveService] = useState<keyof PortfolioData | null>(null);
  const [maxPreviewItems, setMaxPreviewItems] = useState(() => {
    if (typeof window === "undefined") return 8;
    return window.innerWidth < 1024 ? 4 : 8;
  });

  const plans = useMemo(() => {
    const data = pricing as PriceData;

    if (serviceKey) {
      return (data[serviceKey] ?? []).map((plan) => ({
        ...plan,
        service: (serviceLabel ?? (serviceKey.charAt(0).toUpperCase() + serviceKey.slice(1))) as Plan["service"],
      }));
    }

    const embroideryPlans = data.embroidery.slice(0, 2).map((plan) => ({
      ...plan,
      service: "Embroidery" as const,
    }));
    const vectorPlans = data.vector.slice(0, 2).map((plan) => ({
      ...plan,
      service: "Vector" as const,
    }));

    return [...embroideryPlans, ...vectorPlans];
  }, [serviceKey, serviceLabel]);

  const portfolioData = portfolio as PortfolioData;

  const previewItems = useMemo(() => {
    if (!activeService) return [];

    const items = portfolioData[activeService] ?? [];
    if (items.length === 0) return [];

    return Array.from(
      { length: maxPreviewItems },
      (_, index) => items[index % items.length]
    );
  }, [activeService, maxPreviewItems, portfolioData]);

  const viewportOpts = { once: true, amount: 0.2 };

  const openPopup = (service: Plan["service"]) => {
    setActiveService(service.toLowerCase() as keyof PortfolioData);
    setOpen(true);
    requestAnimationFrame(() => setActive(true));
  };

  const closePopup = () => {
    setActive(false);
    window.setTimeout(() => {
      setOpen(false);
      setActiveService(null);
    }, 250);
  };

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const updateMaxItems = () => {
      setMaxPreviewItems(media.matches ? 8 : 4);
    };

    updateMaxItems();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", updateMaxItems);
      return () => media.removeEventListener("change", updateMaxItems);
    }

    media.addListener(updateMaxItems);
    return () => media.removeListener(updateMaxItems);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const gridCols =
    plans.length <= 2
      ? "xl:grid-cols-2"
      : plans.length === 3
      ? "xl:grid-cols-3"
      : "xl:grid-cols-4";

  return (
    <section className="relative overflow-hidden bg-slate-100 py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.12),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.5),_rgba(241,245,249,0.95))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col px-4">
        <motion.div className="flex items-center justify-center overflow-hidden">
          <motion.div
            variants={headingVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOpts}
            className="text-center"
          >
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Pricing
            </h2>
            <p className="mx-auto my-4 max-w-2xl text-sm text-slate-600 sm:text-base">
              Straightforward embroidery and vector pricing built for quick decisions.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={cardsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOpts}
          className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${gridCols}`}
        >
          {plans.map((plan, index) => (
            <motion.div key={plan.id} variants={cardVariants}>
              <PriceCard
                plan={plan}
                index={index}
                onOpenSample={openPopup}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {open && activeService && (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            aria-label="Close sample preview"
            onClick={closePopup}
            className="absolute inset-0 bg-slate-900/55"
          />

          <div
            className={`absolute left-1/2 top-1/2 w-[92%] max-w-6xl -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-white p-5 shadow-2xl transition-all duration-300 sm:p-6 ${
              active ? "opacity-100 translate-y-[-50%]" : "opacity-0 translate-y-[-46%]"
            }`}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  {activeService} portfolio
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                  Sample Work Preview
                </h3>
              </div>

              <button
                type="button"
                onClick={closePopup}
                className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition-colors hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <div className="grid max-h-[70vh] grid-cols-2 gap-4 overflow-auto pr-1 sm:grid-cols-2 lg:grid-cols-4">
              {previewItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-44 w-full object-contain transition-transform duration-200 ease-out hover:scale-105 sm:h-52"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}