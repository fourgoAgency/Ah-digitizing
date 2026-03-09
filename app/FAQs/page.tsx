"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
// FAQ Data Structure
const faqData = [
  {
    id: "general-enquiries",
    title: "General Enquiries",
    subtitle: "About Our Embroidery Digitizing Services",
    questions: [
      {
        id: 1,
        question:
          "On What Criteria Do We Charge Each Digitised Embroidery Design?",
        answer:
          "We charge based on the complexity, size, and stitch count of your design. Simple logos are more affordable than intricate designs with multiple colors and details.",
      },
      {
        id: 2,
        question:
          "What are the charges of Your Embroidery Digitizing Services?",
        answer:
          "Our pricing starts from $10 for simple designs. Complex designs may range from $20-$50 depending on size and detail. Contact us for a custom quote.",
      },
      {
        id: 3,
        question:
          "Which type of artwork format do you accept for digitizing any embroidery design?",
        answer:
          "We accept multiple formats including: AI, CDR, EPS, PDF, JPG, PNG, BMP, GIF, TIFF, PSD, and more. Vector formats (AI, EPS, PDF) are preferred for best results.",
      },
      {
        id: 4,
        question:
          "In what file formats will my digitized designs be delivered?",
        answer:
          "CND, CSD, DSB, DST, DSZ, EMB, EXP, HUS, JEF, PCS, PES, SEW, SHV, VIP, VP3, XXX and more. We deliver in all major embroidery machine formats.",
      },
    ],
  },
  {
    id: "placing-order",
    title: "Placing An Order",
    subtitle: "About Our Embroidery Digitizing Services",
    questions: [
      {
        id: 5,
        question:
          "How can I place an order for custom digitizing of logos or designs?",
        answer:
          "Simply upload your design through our website, fill in the order form with your requirements, and submit. You'll receive a quote within 24 hours. Once approved, we'll start digitizing your design.",
      },
      {
        id: 6,
        question: "What are the modes of payments?",
        answer:
          "We accept multiple payment methods including Credit/Debit Cards, PayPal, Bank Transfer, and major digital wallets. All transactions are secure and encrypted.",
      },
      {
        id: 7,
        question: "How Can I track the Progress of My Order?",
        answer:
          "After placing your order, you'll receive a unique tracking ID. Login to your account dashboard to view real-time updates, or check your email for status notifications at each stage of production.",
      },
      {
        id: 8,
        question: "What is the typical turnaround time for orders?",
        answer:
          "Standard turnaround is 2-3 business days for simple designs and 3-5 business days for complex projects. Rush services are available for an additional fee with same-day or 24-hour delivery options.",
      },
    ],
  },
  {
    id: "registration",
    title: "Registration",
    subtitle: "About Our Embroidery Digitizing Services",
    questions: [
      {
        id: 9,
        question: "How to get Register at AHDigitizing?",
        answer:
          "Click on the 'Register' button in the top navigation, fill in your basic details including name, email, and password. Verify your email address through the link sent to your inbox, and you're all set!",
      },
      {
        id: 10,
        question: "Why Should I get Register at AHDigitizing?",
        answer:
          "Registration provides exclusive benefits including: Order tracking, Access to your order history, Faster checkout process, Special discounts for members, Priority customer support, and Saved payment methods for quick orders.",
      },
      {
        id: 11,
        question: "Is registration free or paid?",
        answer:
          "Registration is completely free! You can create an account at no cost and start placing orders immediately. Premium membership options with additional benefits are available but entirely optional.",
      },
      {
        id: 12,
        question: "Can I have multiple users under one account?",
        answer:
          "Yes! Business accounts can have multiple team members with different access levels. Contact our support team to set up a multi-user business account with customized permissions for your team.",
      },
    ],
  },
  {
    id: "editing",
    title: "Editing",
    subtitle: "About Our Embroidery Digitizing Services",
    questions: [
      {
        id: 13,
        question: "Can I request changes to my digitized design?",
        answer:
          "Yes! We offer free revisions within 7 days of delivery. Simply let us know what changes you need, and we'll modify the design according to your requirements.",
      },
      {
        id: 14,
        question: "How many revisions are included in the price?",
        answer:
          "We include 2 free revisions with every order. Additional revisions may incur a small fee depending on the complexity of changes requested.",
      },
      {
        id: 15,
        question: "What if I need major changes after the revision limit?",
        answer:
          "For major changes beyond the included revisions, we offer discounted modification rates. Our team will provide a quote before proceeding, so you always know the cost upfront.",
      },
      {
        id: 16,
        question: "Can I edit my order after it has been placed?",
        answer:
          "Yes, you can request order modifications within 2 hours of placing it at no cost. After production begins, changes may incur additional charges depending on the progress of your order.",
      },
    ],
  },
];

function FAQSection({ section }: { section: (typeof faqData)[0] }) {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-20">
      <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16">
        {/* Left Side - Heading */}
        <div className="lg:w-1/3 lg:sticky lg:top-32">
          <div className="relative">
            <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 mb-3 pl-4">
              {section.title}
            </h2>
          </div>
          <p className="text-gray-500 text-sm lg:text-base pl-4 leading-relaxed">{section.subtitle}</p>
          <div className="hidden lg:block mt-6 pl-4">
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
          </div>
        </div>

        {/* Right Side - Questions (Centered) */}
        <div className="lg:w-2/3">
          <div className="space-y-4 max-w-2xl mx-auto">
            {section.questions.map((item, index) => {
              const isOpen = openItem === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`group bg-white border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
                    ${isOpen 
                      ? 'border-blue-300 shadow-lg shadow-blue-100/50 scale-[1.02]' 
                      : 'border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200'
                    }`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors cursor-pointer">
                    <span className="flex items-center gap-4 flex-1">
                      <span className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shrink-0
                        ${isOpen 
                          ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rotate-180' 
                          : 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 group-hover:from-blue-100 group-hover:to-blue-200'
                        }`}>
                        {isOpen ? (
                          <Minus className="w-5 h-5" />
                        ) : (
                          <Plus className="w-5 h-5" />
                        )}
                      </span>
                      <span className={`font-semibold text-base lg:text-lg transition-all duration-300
                        ${isOpen ? 'text-blue-600' : 'text-gray-800 group-hover:text-blue-600'}`}>
                        {item.question}
                      </span>
                    </span>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full transition-all duration-300
                      ${isOpen 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'
                      }`}>
                      Q{index + 1}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden">
                        <div className="px-6 pb-5 pt-1 pl-[4.5rem]">
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                            <p className="text-gray-600 text-base lg:text-[17px] leading-relaxed lg:leading-7">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default function FAQPage() {
  const navRef = useRef<HTMLDivElement>(null);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-blue-600 text-white sticky top-0 z-50 shadow-lg overflow-x-hidden ">
        <div className="max-w-7xl mx-auto px-4 relative">
          {/* LEFT ARROW — ONLY ≤ 440px */}
          <button
            onClick={() =>
              navRef.current?.scrollBy({ left: -150, behavior: "smooth" })
            }
            className="
        absolute left-0 top-1/2 -translate-y-1/2
        bg-blue-700/80 p-1.5 rounded-full z-20
        max-[440px]:flex hidden
      ">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* MENU */}
          <div
  ref={navRef}
  className="
    flex items-center gap-4 lg:gap-8 py-4
    overflow-x-auto scroll-smooth
    justify-center
    max-[440px]:justify-start
    px-10
    mx-auto

    [-ms-overflow-style:none]
    [scrollbar-width:none]
    [&::-webkit-scrollbar]:hidden
  "
>

            {faqData.map((section, index) => (
              <motion.a
                key={section.id}
                href={`#${section.id}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="text-sm sm:text-base lg:text-lg font-medium whitespace-nowrap hover:text-blue-200 transition-colors">
                {section.title}
              </motion.a>
            ))}
          </div>

          {/* RIGHT ARROW — ONLY ≤ 440px */}
          <button
            onClick={() =>
              navRef.current?.scrollBy({ left: 150, behavior: "smooth" })
            }
            className="
        absolute right-0 top-1/2 -translate-y-1/2
        bg-blue-700/80 p-1.5 rounded-full z-20
        max-[440px]:flex hidden
      ">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </motion.nav>

      {/* FAQ Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 lg:py-16">
        {faqData.map((section) => (
          <div
            className="scroll-mt-24 lg:scroll-mt-32"
            key={section.id}
            id={section.id}>
            <FAQSection section={section} />
          </div>
        ))}
      </div>
    </div>
  );
}
