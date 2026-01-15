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
    ],
  },
  {
    id: "registration",
    title: "Registration",
    subtitle: "About Our Embroidery Digitizing Services",
    questions: [
      {
        id: 8,
        question: "How to get Register at DigitEMB?",
        answer:
          "Click on the 'Register' button in the top navigation, fill in your basic details including name, email, and password. Verify your email address through the link sent to your inbox, and you're all set!",
      },
      {
        id: 9,
        question: "Why Should I get Register at DigitEMB?",
        answer:
          "Registration provides exclusive benefits including: Order tracking, Access to your order history, Faster checkout process, Special discounts for members, Priority customer support, and Saved payment methods for quick orders.",
      },
    ],
  },
  {
    id: "editing",
    title: "Editing",
    subtitle: "About Our Embroidery Digitizing Services",
    questions: [
      {
        id: 10,
        question: "Can I request changes to my digitized design?",
        answer:
          "Yes! We offer free revisions within 7 days of delivery. Simply let us know what changes you need, and we'll modify the design according to your requirements.",
      },
      {
        id: 11,
        question: "How many revisions are included in the price?",
        answer:
          "We include 2 free revisions with every order. Additional revisions may incur a small fee depending on the complexity of changes requested.",
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
      className="mb-16">
      <div className="text-center mb-8">
        <h2
          className={`text-2xl sm:text-4xl md:text-6xl font-bold text-blue-600 mb-2 `}>
          {section.title}
        </h2>
        <p className="text-gray-600 text-sm lg:text-base">{section.subtitle}</p>
      </div>

      <div className="space-y-3">
        {section.questions.map((item, index) => {
          const isOpen = openItem === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer ">
              <button
                onClick={() => toggleItem(item.id)}
                className=" group w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer ">
                <span className="flex items-center gap-3 flex-1">
                  <span className="text-blue-600 font-bold shrink-0">
                    {isOpen ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </span>
                  <span className="font-medium text-gray-900 text-base lg:text-lg transition-all duration-200 group-hover:text-blue-600 group-hover:scale-[1.02]">
                    {item.question}
                  </span>
                </span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden">
                    <div className="px-6 pb-4 pt-2 pl-14 text-gray-600 text-base lg:text-[17px] leading-relaxed lg:leading-7">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
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
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="bg-[#0A21C0] w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 sm:pt-19">
          <div className="flex flex-col lg:flex-row items-center justify-around gap-6 sm:gap-9 lg:gap-10">
            {/* Left */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                <div className="relative w-full h-full">
                  <Image
                    fill
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop"
                    alt="Logo"
                    className="object-contain w-full h-full rounded-full"
                  />
                </div>
              </motion.div>

              <div className="text-white">
                <h2
                  className=" text-3xl sm:text-4xl lg:text-4xl font-bold mb-2 sm:mb-3"
                  >
                  Get In Touch With Us!
                </h2>
                <p className="text-blue-100 text-sm sm:text-base max-w-md">
                  Let us be the game-changing partner to make your business fly
                  high.
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-white hover:text-[#0A21C0] transition text-sm sm:text-base font-medium w-full sm:w-auto shadow-xl">
                CALL NOW
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#0A21C0] px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-blue-50 transition text-sm sm:text-base font-medium w-full sm:w-auto">
                LET&lsquo;S TALK
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
