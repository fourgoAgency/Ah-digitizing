"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';

import faqsData from "../../data/faqs.json";

const faqs = (faqsData as any).faqs || [];
const whyText = (faqsData as any).whyChooseUs || "";

const features = [
  {
    id: 1,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3v6h6v-6c0-1.657-1.343-3-3-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2" />
      </svg>
    ),
    title: "Manual Craftsmanship",
    description: "100% manually digitized designs by experienced digitizers for precise stitch quality and smooth runs."
  },
  {
    id: 2,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h3l3 8 4-16 3 8h4" />
      </svg>
    ),
    title: "Fast Turnaround",
    description: "Standard delivery within 4–12 hours and rush options (1–4 hours) for urgent projects."
  },
  {
    id: 3,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h6l3 6 3-12 6 18H3" />
      </svg>
    ),
    title: "Formats & Compatibility",
    description: "We deliver DST, PES, EXP plus vector formats (AI, EPS, SVG) so your designs work across machines and workflows."
  }
];

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function WhyChooseAndFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(1);
  const router = useRouter();
  const typedFaqs: FAQ[] = faqs;

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section className="py-20 bg-[#050A44] text-white relative pb-36">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Why Choose Us */}
          <div>
            <h2 className="text-4xl font-bold mb-6">Why Choose Us</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              {whyText}
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="bg-white text-gray-900 rounded-2xl p-6 hover:transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-primary mb-3">{feature.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button onClick={() => router.push('/get-quote')} className="bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              Get Quote
            </button>
          </div>

          {/* Right Side - FAQ */}
          <div>
            <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>

            <div className="space-y-4">
              {typedFaqs.map((faq: FAQ) => (
                <div
                    key={faq.id}
                    className="bg-white text-gray-900 rounded-xl overflow-hidden transition-all duration-300"
                >
                    <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-6 py-4 flex items-center rounded-full justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                        <span className="font-semibold pr-4">{faq.question}</span>
                        <svg
                            className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${
                                openFaq === faq.id ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${
                            openFaq === faq.id ? "max-h-96" : "max-h-0"
                        }`}
                    >
                        <div className="px-6 pb-4 text-gray-600">
                            {faq.answer}
                        </div>
                    </div>
                </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}