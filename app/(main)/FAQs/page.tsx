"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
// FAQ Data Structure
type FAQButton = {
  label: string;
  href: string;
};

type FAQItem = {
  id: number;
  question: string;
  answer: string;
  button?: FAQButton;
  note?: string;
  contactUsLink?: boolean;
};

const faqData: {
  id: string;
  title: string;
  subtitle: string;
  questions: FAQItem[];
}[] = [
  {
    id: "general-enquiries",
    title: "General Enquiries",
    subtitle: "About Our Embroidery Digitizing Services",
    questions: [
      {
        id: 1,
        question: "What's your turnaround time?",
        answer:
          "Simple designs are typically delivered within 4–12 hours, while more complex designs may take up to 24 hours. For urgent requirements, we offer rush delivery within 2–6 hours and super rush delivery within 1–4 hours, depending on the design's complexity.",
        button: { label: "Order Now", href: "/get-quote" },
        note: "For further guidance regarding turnaround time, feel free to contact our team.",
      },
      {
        id: 2,
        question: "How do you ensure quality?",
        answer:
          "Every design is digitized by our experienced professional digitizers who understand embroidery machines inside and out, including the right density and underlay settings needed for high-quality results. Quality is our top priority, and we never compromise on it. You can trust us to deliver excellent results every time.",
        button: { label: "Order Now", href: "/get-quote" },
      },
      {
        id: 3,
        question: "Do you charge based on stitches or a flat rate?",
        answer:
          "We offer flat rate pricing. No confusing per-stitch charges. Just simple, straightforward pricing.",
      },
      {
        id: 4,
        question: "Which type of artwork format do you accept for digitizing?",
        answer:
          "We accept AI, CDR, EPS, PDF, JPG, PNG, BMP, GIF, TIFF, and PSD. Vector formats (AI, EPS, PDF) give the best results. Have a different format? Just contact us before ordering.",
        contactUsLink: true,
      },
      {
        id: 5,
        question: "What format will my digitized design be delivered in?",
        answer:
          "We can deliver your file in any format you need. Just tell us your machine's brand/model or the specific format (DST, PES, EXP, JEF, VP3, etc.), and we'll provide it accordingly.",
        button: { label: "Order Now", href: "/get-quote" },
      },
      {
        id: 6,
        question: "Do you offer a free quote?",
        answer:
          "Yes, we do. Simply share your design details or requirements with us, and we'll provide you with a free quote within 5 minutes—no obligations.",
        button: { label: "Get Free Quote", href: "/get-free-quote" },
      },
      {
        id: 7,
        question: "How will I receive my file?",
        answer:
          "Your file will be delivered via email, or you can create an account on our website to download it directly. Need a different delivery method? Just let us know.",
      },
      {
        id: 8,
        question: "Will my digitized design work on any fabric?",
        answer:
          "We digitize designs for standard fabric by default. Different fabrics (like stretchy, thick, fleece, towel, sweatshirt, or delicate materials) may require specific adjustments to ensure the best stitching quality. Just let us know your fabric type, and we'll digitize your design accordingly.",
        button: { label: "Order Now", href: "/get-quote" },
      },
      {
        id: 9,
        question: "Can I get a special discount on a bulk order?",
        answer:
          "Yes, we offer special discounts on bulk orders! Just send us your design files, and we'll provide you with a customized discount quote.",
        button: { label: "Get Free Quote", href: "/get-free-quote" },
      },
      {
        id: 10,
        question: "What size should I choose for my logo?",
        answer:
          "Logo size depends on placement (e.g., left chest, cap, sleeve, back). Let us know your placement, and we'll recommend the best size or share your custom size if you already have one in mind. Feel free to contact us for more details.",
        contactUsLink: true,
      },
      {
        id: 11,
        question: "Do you offer custom design sizes?",
        answer:
          "Yes, we can create your design in any custom size you require. Simply share your preferred dimensions with us, and we'll prepare your design accordingly.",
        button: { label: "Get Free Quote", href: "/get-free-quote" },
      },
      {
        id: 12,
        question: "Do you keep backups of my design files?",
        answer:
          "Yes, we keep backups of your design files. Registered users can log in and download their files directly. If you can't find it there, just contact us with your design details, and we'll send it over.",
        note: "Still have questions? Reach out to our support team — we're available 24/7 to help.",
      },
      {
        id: 13,
        question:
          "Do I need to send a reference file or screenshot if I want to match an existing design or one I've seen elsewhere?",
        answer:
          "Yes, sharing a reference file or screenshot helps us match your design as closely as possible to what you have in mind. Without a reference, we'll create the design based only on the artwork you provide.",
      },
      {
        id: 14,
        question: "What happens if I don't share a reference file?",
        answer:
          "If you request changes afterward, small edits will be done free of charge. However, if major changes are needed, additional charges will apply, and if the design needs to be completely redone, full payment will be required.",
      },
      {
        id: 15,
        question:
          "What if I don't like my digitized design? Will I still have to pay?",
        answer:
          "No, we'll send you a preview of your digitized design before requesting payment. If you're not happy with it, you won't need to pay until you're fully satisfied with the result.",
      },
      {
        id: 16,
        question: "Do you sell my design to anyone else?",
        answer:
          "No, your design belongs only to you. We never resell any customer's design to another customer. This ensures your privacy and exclusivity are always protected.",
      },
      {
        id: 17,
        question: "Can I get my design digitized from just a screenshot?",
        answer:
          "Yes, we can create your design from a screenshot. Just share it with us.",
        button: { label: "Get a free quote now", href: "/get-free-quote" },
      },
    ],
  },
  {
    id: "placing-order",
    title: "Placing An Order",
    subtitle: "About Our Embroidery Digitizing Services",
    questions: [
      {
        id: 18,
        question: "How do I place an order for digitizing?",
        answer:
          "Very simple. Go to the homepage, visit the Services section, and select the service you need. You'll be taken to the order page where you can fill out the order form with your design details and requirements so we can digitize your design exactly the way you want. If you'd like a free quote before placing your order, simply click Get Free Quote and submit your details. We'll get back to you with a quote within 5 minutes.",
      },
      {
        id: 19,
        question: "Can I place a direct order, or get a quote directly?",
        answer:
          "Yes, both options are available! On our website's header, you'll find the Order Now and Get Free Quote buttons. Simply click on either one to place a direct order or get a quote right away.",
      },
      {
        id: 20,
        question: "Can I place an order via email or any other method?",
        answer:
          "Yes! In addition to placing your order directly on our website, you can order via email or WhatsApp. Just share your design details and requirements with us, and we'll get started on your order right away.",
        button: { label: "Email Us", href: "mailto:ahdigitizing@gmail.com" },
      },
      {
        id: 21,
        question: "How can I track the progress of my order?",
        answer:
          "Once you place your order, you'll receive a unique tracking ID. You can log in to your account dashboard anytime to view real-time progress, or reach out to us via email or contact our team directly for updates on your design's progress.",
      },
    ],
  },
  {
    id: "registration",
    title: "Registration",
    subtitle: "About Our Embroidery Digitizing Services",
    questions: [
      {
        id: 22,
        question: "What are the benefits of registering at AH Digitizing?",
        answer:
          "Registering with us gives you access to exclusive benefits, including real-time order tracking to monitor your order's progress, easy access to your complete order history, a faster checkout process by skipping repetitive steps on future orders, special member-only discounts, and priority support for quicker responses from our team.",
      },
      {
        id: 23,
        question: "Can I place an order without registering?",
        answer:
          "Yes, you can place an order using just your email address — no account creation required. However, registering gives you access to order tracking, order history, and other exclusive benefits.",
        button: { label: "Email Us", href: "mailto:ahdigitizing@gmail.com" },
      },
      {
        id: 24,
        question: "Is my personal information safe and secure?",
        answer:
          "Yes, we take your privacy seriously. Your personal information is securely stored and never shared with third parties without your consent.",
      },
      {
        id: 25,
        question: "How do I reset my password?",
        answer:
          "Simply click on \"Forgot Password\" on the login page, enter your registered email address, and we'll send you a link to reset your password.",
      },
    ],
  },
  {
    id: "editing",
    title: "Editing",
    subtitle: "About Our Embroidery Digitizing Services",
    questions: [
      {
        id: 26,
        question: "How many revisions do you provide?",
        answer:
          "We provide unlimited revisions until your design is exactly the way you want it, free of charge, with no extra fees.",
      },
      {
        id: 27,
        question: "Do you charge for design editing?",
        answer:
          "No, we don't charge for standard editing. However, if you'd like to add something new to your design, a small additional charge may apply.",
      },
    ],
  },
  {
    id: "payment",
    title: "Payment",
    subtitle: "About Our Embroidery Digitizing Services",
    questions: [
      {
        id: 28,
        question: "What payment methods do you accept?",
        answer:
          "We accept payments through PayPal and Stripe, so you can pay via PayPal or debit/credit card. If you face any issues with payment, just contact us. We'll help you find an alternative way to pay. All transactions are secure and encrypted.",
      },
      {
        id: 29,
        question: "Do you offer a refund policy?",
        answer:
          "Yes, we offer a refund if we're unable to adjust the design according to your requirements or fail to deliver the expected quality.",
      },
      {
        id: 30,
        question: "Do I have to pay before digitizing?",
        answer:
          "No, you don't need to pay upfront. Once your design is ready, we'll send you a preview before you make any payment.",
      },
    ],
  },
];

function renderAnswer(answer: string, contactUsLink?: boolean) {
  if (!contactUsLink) return answer;

  const parts = answer.split(/\b(contact us)\b/i);
  if (parts.length < 3) return answer;

  return (
    <>
      {parts[0]}
      <Link
        href="/contact-us"
        className="font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-700">
        contact us
      </Link>
      {parts[2]}
    </>
  );
}

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
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 pl-4 lg:pl-8">
        {/* Left Side - Heading (Sticky & Top-Aligned) */}
        <div className="lg:w-1/4 lg:sticky lg:top-32 lg:self-start mt-10">
          <div className="relative">
            <div className="absolute left-0 top-0 w-1 h-20 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-3 pl-5">
              {section.title}
            </h2>
          </div>
          <p className="text-gray-500 text-sm lg:text-base pl-5 leading-relaxed">{section.subtitle}</p>
          <div className="hidden lg:block mt-5 pl-5">
            <div className="w-[50%] h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
          </div>
        </div>

        {/* Right Side - Questions (Wider) */}
        <div className="lg:w-3/4">
          <div className="space-y-4 pr-4 lg:pr-8">
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
                              {renderAnswer(item.answer, item.contactUsLink)}
                            </p>
                            {item.button && (
                              <Link
                                href={item.button.href}
                                className="mt-3 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:from-blue-700 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-200/50">
                                {item.button.label}
                              </Link>
                            )}
                            {item.note && (
                              <p className="mt-3 text-sm font-medium text-blue-700/80 leading-relaxed">
                                {item.note}
                              </p>
                            )}
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
      {/* <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-blue-600 text-white sticky top-0 z-50 shadow-lg overflow-x-hidden ">
        <div className="max-w-7xl mx-auto px-4 relative">
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
      </motion.nav> */}

      {/* FAQ Content */}
      <div className="py-12 lg:py-16">
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
