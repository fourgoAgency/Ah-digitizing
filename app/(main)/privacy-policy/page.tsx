"use client";
import { motion } from "framer-motion";

// Content block types
type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

// Privacy Policy Data
const privacyData: Array<{ id: string; title: string | null; blocks: ContentBlock[] }> = [
  {
    id: "intro",
    title: null,
    blocks: [
      {
        type: "paragraph",
        text:
          "Thank you for choosing AH Digitizing! Customer trust is the foundation of our business. We enforce reasonable security measures to protect your privacy and intellectual property. We are committed to maintaining a secure environment for your business transactions, personal information, artwork, embroidery files, and vector files.",
      },
    ],
  },
  {
    id: "data-security",
    title: "How Do We Secure Your Data?",
    blocks: [
      {
        type: "paragraph",
        text:
          "Your security is very important to us. Our website may use advanced SSL (Secure Sockets Layer) technology to establish an encrypted connection between your browser and our website server. Information such as your personal details, communication, order information, and digital files is handled with reasonable security precautions.",
      },
      {
        type: "paragraph",
        text:
          "We take appropriate measures to help protect your information from unauthorized access, misuse, loss, or disclosure. However, no online system can be guaranteed to be completely secure.",
      },
    ],
  },
  {
    id: "card-details",
    title: "Do We Collect Card Details or Any Sensitive Financial Data?",
    blocks: [
      {
        type: "paragraph",
        text:
          "No! AH Digitizing does not intentionally collect or store complete credit or debit card details in our own database.",
      },
      {
        type: "paragraph",
        text:
          "For online store orders, payment may be processed through the secure payment options available on our website.",
      },
      {
        type: "paragraph",
        text:
          "For custom orders, AH Digitizing may provide payment instructions or account details directly to the customer. Customers can make the payment using the provided details.",
      },
    ],
  },
  {
    id: "information-collected",
    title: "What Information Do We Collect?",
    blocks: [
      {
        type: "paragraph",
        text:
          "We only gather essential information required to fulfill your order, such as:",
      },
      {
        type: "list",
        items: [
          "Your Information: Name, email address, phone number, and other contact information you voluntarily provide.",
          "Project Details: Design dimensions, colors, fabric information, required file formats, and design instructions for embroidery digitizing or vector conversion.",
          "Artwork & Reference Files: Logos, images, embroidery files, vector files, and reference artwork provided for your project.",
          "Order Form Information: Details and special instructions submitted through our website order form.",
        ],
      },
    ],
  },
  {
    id: "information-use",
    title: "How Do We Use Your Information?",
    blocks: [
      {
        type: "paragraph",
        text:
          "We use your data to deliver seamless service and maintain professional standards:",
      },
      {
        type: "list",
        items: [
          "To process embroidery digitizing and vector art orders and ensure accurate delivery.",
          "To understand your artwork, reference files, design requirements, and special instructions.",
          "To send you order confirmations, design previews, final files, invoices, and quality assurance updates.",
          "To communicate with you regarding your order and provide customer support.",
          "To personalize your experience and improve our customer support and services.",
          "To share information about our services, special offers, or updates where appropriate.",
        ],
      },
      {
        type: "paragraph",
        text:
          "AH Digitizing does not sell, rent, or distribute your personal information or customer artwork to other businesses for marketing purposes.",
      },
    ],
  },
  {
    id: "cookies",
    title: "How Do We Use Cookies?",
    blocks: [
      {
        type: "paragraph",
        text:
          "We use necessary cookies and similar technologies to enhance your browsing experience and analyze website traffic.",
      },
      {
        type: "paragraph",
        text:
          "You can control cookie preferences through your browser settings. Disabling cookies will not normally prevent you from successfully placing embroidery digitizing or vector orders, although some website features may be affected.",
      },
    ],
  },
  {
    id: "artwork-protection",
    title: "How Do We Protect Your Artwork?",
    blocks: [
      {
        type: "paragraph",
        text:
          "We understand that your artwork and embroidery designs are valuable. Customer-provided artwork, reference files, embroidery files, and project information are used primarily for completing the requested service.",
      },
      {
        type: "paragraph",
        text:
          "AH Digitizing does not claim ownership of your original artwork and does not knowingly sell or publicly distribute your customer files without permission, except where necessary to provide the requested service or when required by law.",
      },
    ],
  },
  {
    id: "privacy-rights",
    title: "Your Privacy Rights",
    blocks: [
      {
        type: "paragraph",
        text:
          "You may contact AH Digitizing if you would like to:",
      },
      {
        type: "list",
        items: [
          "Request information about the personal information we hold about you.",
          "Ask us to correct or update your information.",
          "Request deletion of certain personal information where applicable.",
          "Ask us not to contact you for marketing purposes.",
        ],
      },
      {
        type: "paragraph",
        text:
          "We will review and respond to reasonable requests where applicable.",
      },
    ],
  },
  {
    id: "note",
    title: "Note",
    blocks: [
      {
        type: "paragraph",
        text:
          "AH Digitizing reserves the right to modify this privacy statement periodically to reflect changes in our services, business practices, or operational requirements. Any changes made will be visible on this page.",
      },
      {
        type: "paragraph",
        text:
          "We encourage users to check this page periodically to stay informed.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl" style={{ color: "#0A21C0" }}>
            AH Digitizing&apos;s Privacy Policy
          </h1>
          <p className="mt-3 text-gray-600 text-lg">
            Customer trust is the foundation of our business
          </p>
        </div>
      </div>

      {/* Privacy Policy Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {privacyData.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className={section.title ? "mb-10" : "mb-6"}
            >
              {section.title && (
                <div className="mb-4">
                  <div className="inline-block">
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                      className="font-bold mb-2 text-2xl sm:text-3xl lg:text-3xl"
                      style={{ color: "#0A21C0" }}
                    >
                      {section.title}
                    </motion.h2>

                    {/* Underline covers 2/3 of the actual text width */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: index * 0.05 + 0.15, ease: "easeOut" }}
                      className="h-[2px] bg-[#0A21C0] origin-left rounded-full w-2/3"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {section.blocks.map((block, blockIndex) => (
                  <motion.div
                    key={blockIndex}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.05 + blockIndex * 0.04 + 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {block.type === "paragraph" ? (
                      <p className="text-gray-700 leading-relaxed text-base lg:text-[17px]">
                        {block.text}
                      </p>
                    ) : (
                      <ul className="list-disc pl-6 space-y-2 text-gray-700 leading-relaxed text-base lg:text-[17px]">
                        {block.items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}