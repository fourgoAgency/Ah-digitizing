import React from 'react'

import { motion, AnimatePresence } from "framer-motion";
import faqsData from "../../data/faqs.json";
import { useState } from "react";
import { FAQ } from '@/components/home/WhyChooseUs';
const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
};

const headingVariants = {
    hidden: { opacity: 0, y: 40, scale: 1.02 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
};
export default function FAQs() {

    const faqs = (faqsData as any).faqs || [];
    const typedFaqs: FAQ[] = faqs;
    const [openFaq, setOpenFaq] = useState<number | null>(1);
    const toggleFaq = (id: number) => {
        setOpenFaq(openFaq === id ? null : id);
    };
    return (
        <div className='lg:max-w-7xl w-full mx-auto flex flex-col justify-center items-center'>
            <motion.h2 variants={headingVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }} className="text-4xl font-bold mb-6">Frequently Asked Questions</motion.h2>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }} className="space-y-4">
                {typedFaqs.map((faq: FAQ) => (
                    <motion.div
                        key={faq.id}
                        variants={itemVariants}
                        className="bg-white text-gray-900 rounded-xl overflow-hidden transition-all duration-300"
                    >
                        <button
                            onClick={() => toggleFaq(faq.id)}
                            className="w-full px-6 py-4 flex items-center rounded-full cursor-pointer justify-between text-left "
                        >
                            <span className="font-semibold pr-4">{faq.question}</span>
                            <motion.svg
                                animate={{ rotate: openFaq === faq.id ? 180 : 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${openFaq === faq.id ? "rotate-180" : ""
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                        </button>
                        <motion.div
                            key="answer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            style={{ overflow: "hidden" }}
                            className={`overflow-hidden transition-all duration-300 ${openFaq === faq.id ? "max-h-96" : "max-h-0"
                                }`}
                        >
                            <div className="px-6 pb-4 text-gray-600">
                                {faq.answer}
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
                </motion.div>
        </div>
    )
};