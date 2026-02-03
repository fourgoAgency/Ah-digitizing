import React from 'react'

import faqsData from "../../data/faqs.json";
import { useState } from "react";
import { FAQ } from '@/components/home/WhyChooseUs';
export default function FAQs() {

    const faqs = (faqsData as any).faqs || [];
    const typedFaqs: FAQ[] = faqs;
    const [openFaq, setOpenFaq] = useState<number | null>(1);
    const toggleFaq = (id: number) => {
        setOpenFaq(openFaq === id ? null : id);
    };
    return (
        <div className='lg:max-w-7xl w-full mx-auto flex flex-col justify-center items-center'>
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
                                className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${openFaq === faq.id ? "rotate-180" : ""
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${openFaq === faq.id ? "max-h-96" : "max-h-0"
                                }`}
                        >
                            <div className="px-6 pb-4 text-gray-600">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
};