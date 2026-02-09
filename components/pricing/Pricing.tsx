"use client";

import { useEffect, useMemo, useState } from "react";
import pricing from "@/data/price.json";
import portfolio from "@/data/portfolio.json";

type Plan = {
  id: string;
  title: string;
  description: string;
  price: number;
  suffix: string;
  features: string[];
  popular: boolean;
};

type PriceData = {
  embroidery: Plan[];
  vector: Plan[];
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

export default function Pricing({ slug }: { slug: string }) {
  const data = pricing as PriceData;
  const category = (slug in data ? slug : "embroidery") as keyof PriceData;
  const plans = data[category];

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [maxPreviewItems, setMaxPreviewItems] = useState(() => {
    if (typeof window === "undefined") return 10;
    return window.innerWidth < 1024 ? 4 : 10;
  });

  const portfolioData = portfolio as PortfolioData;
  const items = useMemo(
    () => portfolioData[category] ?? [],
    [category]
  );
  const previewItems = useMemo(() => {
    if (items.length === 0) return [];
    return Array.from(
      { length: maxPreviewItems },
      (_, index) => items[index % items.length]
    );
  }, [items, maxPreviewItems]);

  const openPopup = (planId: string) => {
    setActivePlanId(planId);
    setOpen(true);
    requestAnimationFrame(() => setActive(true));
  };

  const closePopup = () => {
    setActive(false);
    setTimeout(() => {
      setOpen(false);
      setActivePlanId(null);
    }, 300);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const updateMaxItems = () => {
      setMaxPreviewItems(media.matches ? 10 : 4);
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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <section className="relative py-24 bg-slate-100 overflow-hidden">
      <div className="container mx-auto ">
        <div className="grid gap-12 md:grid-cols-3 items-center justify-center">
          {plans.map((plan, index) => {
            const accent = accents[index % accents.length];
            const isActive = activePlanId === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative flex w-96 h-103 flex-col rounded-4xl bg-white px-4 pb-10 pt-12 text-center shadow-xl transition-opacity duration-300
                  ${open && !isActive ? "opacity-0" : "opacity-100"}
                `}
                style={
                  isActive && open
                    ? {
                        position: "fixed",
                        right: "0",
                        top: "50%",
                        width: "20%",
                        transform: active
                          ? "translateY(-50%) translateX(0)"
                          : "translateY(-50%) translateX(-40px)",
                        transition: "transform 300ms ease",
                        zIndex: 50,
                        marginRight: 40,
                      }
                    : undefined
                }
              >
                {/* Side Label */}
                <button
                  type="button"
                  onClick={() => openPopup(plan.id)}
                  className={`absolute left-0 top-20 hidden -translate-x-3/5 -rotate-90 px-5 py-2 text-[10px] tracking-[0.35em] text-white rounded-t-md w-36 text-center sm:inline-flex ${accent.chip}`}
                >
                  VIEW SAMPLE
                </button>

                {/* Price */}
                <div className="mb-3 text-[10px] uppercase tracking-[0.45em] text-slate-400">
                  {plan.title.toUpperCase()}
                  {category}
                </div>

                <h2 className="text-4xl font-semibold text-slate-800">
                  ${plan.price.toFixed(2)}
                  <span className="ml-1 text-xs text-slate-500">
                    /{plan.suffix || "month"}
                  </span>
                </h2>

                <p className="mx-auto mt-2 max-w-[16rem] text-sm text-slate-500">
                  {plan.description}
                </p>

                <ul className="my-7 space-y-3 text-sm text-slate-500">
                  {plan.features.map((f, i) => (
                    <li key={i}>✓ {f}</li>
                  ))}
                </ul>

                <button
                  className={`mx-auto w-40 rounded-full py-2.5 text-xs font-semibold uppercase text-white ${accent.button}`}
                >
                  Buy Now
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* POPUP */}
      {open && (
        <div className="fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-slate-900/50"
            onClick={closePopup}
          />

          <div
            className={`fixed left-0 top-1/2 max-h-screen w-[70%] -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-2xl rounded-xl transition-transform duration-300
              ${active ? "translate-x-0" : "-translate-x-6"}
            `}
          >
            <button
              onClick={closePopup}
              className="absolute right-4 top-4 rounded-full bg-slate-100 px-3 py-1 text-xs"
            >
              Close
            </button>

            <div className="mb-4 text-xs uppercase tracking-[0.3em] text-slate-400">
              {category} portfolio
            </div>

            <div className="hidden grid-rows-2 gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-5 overflow-auto px-2">
              {previewItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="h-24 sm:h-28 md:h-32 lg:h-full overflow-hidden rounded-lg"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full rounded-lg object-contain border border-slate-200 transition-transform duration-200 ease-out hover:scale-105"
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
