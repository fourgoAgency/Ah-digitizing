"use client";
import { motion } from "framer-motion";

// Content block types
type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

// Terms & Conditions Data
const termsData: Array<{ id: string; title: string | null; blocks: ContentBlock[] }> = [
  {
    id: "intro",
    title: null,
    blocks: [
      {
        type: "paragraph",
        text:
          "Welcome to AH Digitizing. By using our website or placing an order with us, you agree to the following Terms & Conditions. Please read them carefully before submitting your artwork or ordering our services.",
      },
    ],
  },
  {
    id: "services",
    title: "Services",
    blocks: [
      {
        type: "paragraph",
        text: "AH Digitizing provides professional embroidery digitizing and vector conversion services.",
      },
      {
        type: "paragraph",
        text: "Our services may include:",
      },
      {
        type: "list",
        items: [
          "Embroidery digitizing",
          "Logo digitizing",
          "Cap and left chest digitizing",
          "3D puff digitizing",
          "Applique digitizing",
          "Patch digitizing",
          "Vector conversion",
          "Other custom embroidery and vector artwork services",
        ],
      },
      {
        type: "paragraph",
        text: "Each order is handled according to the artwork, size, fabric, colors, and instructions provided by the customer.",
      },
    ],
  },
  {
    id: "placing-an-order",
    title: "Placing an Order",
    blocks: [
      {
        type: "paragraph",
        text: "To place an order, customers should provide:",
      },
      {
        type: "list",
        items: [
          "Clear artwork or logo",
          "Required design size",
          "Preferred colors",
          "Fabric or garment information, when applicable",
          "Required embroidery or vector file format",
          "Any special instructions or requirements",
        ],
      },
      {
        type: "paragraph",
        text: "Providing complete and accurate information helps us deliver the design correctly and avoid unnecessary delays.",
      },
    ],
  },
  {
    id: "order-form",
    title: "Order Form & Customer Instructions",
    blocks: [
      {
        type: "paragraph",
        text: "When placing an order through the AH Digitizing order form, customers will be asked to provide important details about their design, such as design size, required file format, colors, fabric type, and any other specific requirements.",
      },
      {
        type: "paragraph",
        text: "Customers can also provide additional instructions or special requests in the order form. All available fields and instructions will be visible while completing the form.",
      },
      {
        type: "paragraph",
        text: "Please carefully review all the information you have entered before submitting the order. Once the form is submitted, the information provided will be used as the main reference for completing your design.",
      },
      {
        type: "paragraph",
        text: "After submission, AH Digitizing will also send a copy of the submitted order details to the customer's email address. This allows the customer to review and keep a record of the exact design requirements and instructions they provided.",
      },
      {
        type: "paragraph",
        text: "Customers are responsible for checking the submitted information and notifying AH Digitizing as soon as possible if any details are incorrect or need to be changed.",
      },
      {
        type: "paragraph",
        text: "By submitting the order form, the customer confirms that the information and instructions provided are accurate and complete.",
      },
    ],
  },
  {
    id: "reference-artwork",
    title: "Reference Artwork & Design Requirements",
    blocks: [
      {
        type: "paragraph",
        text: "If you have a reference file, sample, or previous design that you want us to follow, please upload it along with your new artwork when placing your order.",
      },
      {
        type: "paragraph",
        text: "Providing the reference file before we start the work helps our digitizers understand the required look, stitch technique, level of detail, style, and overall design approach so we can create the new design as closely as possible to your reference.",
      },
      {
        type: "paragraph",
        text: "Please make sure to provide all reference files and special instructions when submitting your order.",
      },
      {
        type: "paragraph",
        text: "If a reference file is provided after the design has already been completed, and you then request the design to be recreated or significantly changed according to that reference, the request may be considered a new design or additional work.",
      },
      {
        type: "list",
        items: [
          "Small changes or minor adjustments may be completed at no additional charge.",
          "If the reference requires major changes, significant redesign, or rebuilding most or all of the design, additional charges may apply based on the amount of work required.",
          "If the entire design needs to be recreated according to the newly provided reference, it may be treated as a new order and full payment may be required.",
        ],
      },
      {
        type: "paragraph",
        text: "To avoid additional charges and delays, please provide all artwork, reference files, and special instructions before we begin your order.",
      },
    ],
  },
  {
    id: "payment",
    title: "Payment",
    blocks: [
      {
        type: "paragraph",
        text: "Payment is required according to the price agreed upon for the requested service.",
      },
      {
        type: "paragraph",
        text: "For standard orders, work may begin after payment and confirmation of the order details.",
      },
      {
        type: "paragraph",
        text: "If additional work is requested outside the original requirements, an additional charge may apply. We will inform you before proceeding with any additional paid work.",
      },
    ],
  },
  {
    id: "revisions",
    title: "Revisions",
    blocks: [
      {
        type: "paragraph",
        text: "We want every customer to be satisfied with the final result.",
      },
      {
        type: "paragraph",
        text: "Reasonable revisions based on the original instructions are included at no additional cost.",
      },
      {
        type: "paragraph",
        text: "Minor changes such as:",
      },
      {
        type: "list",
        items: [
          "Color adjustments",
          "Spelling corrections",
          "Minor detail changes",
          "File format changes",
        ],
      },
      {
        type: "paragraph",
        text: "may be completed without an additional charge.",
      },
      {
        type: "paragraph",
        text: "However, major changes, significant redesigns, new concepts, or substantial modifications to the original requirements may require an additional fee.",
      },
    ],
  },
  {
    id: "design-approval",
    title: "Design Approval",
    blocks: [
      {
        type: "paragraph",
        text: "For applicable orders, we may provide a preview or sample for review before final delivery.",
      },
      {
        type: "paragraph",
        text: "Customers are responsible for checking important details such as:",
      },
      {
        type: "list",
        items: [
          "Design size",
          "Colors",
          "Spelling",
          "Text",
          "Placement",
          "Overall appearance",
        ],
      },
      {
        type: "paragraph",
        text: "If you notice any issue, please let us know before using the design for production.",
      },
    ],
  },
  {
    id: "delivery",
    title: "Delivery & Turnaround Time",
    blocks: [
      {
        type: "paragraph",
        text: "Most standard orders are completed within 4–12 hours, depending on the complexity of the design and the information provided.",
      },
      {
        type: "paragraph",
        text: "More complex designs may require additional time.",
      },
      {
        type: "paragraph",
        text: "Turnaround time may also be affected by:",
      },
      {
        type: "list",
        items: [
          "Missing artwork or information",
          "Customer response time",
          "Revision requests",
          "Complex design requirements",
          "Technical issues",
        ],
      },
      {
        type: "paragraph",
        text: "Urgent, rush, or super rush orders may be available upon request and may be subject to an additional charge.",
      },
    ],
  },
  {
    id: "file-formats",
    title: "File Formats",
    blocks: [
      {
        type: "paragraph",
        text: "We can provide embroidery and vector files in commonly requested formats, depending on the service.",
      },
      {
        type: "paragraph",
        text: "These may include:",
      },
      {
        type: "paragraph",
        text: "DST, PES, EMB, JEF, EXP, VP3, HUS, OFM, PXF, ART, SVG, AI, EPS, PDF and other available formats.",
      },
      {
        type: "paragraph",
        text: "If you require a specific format, please mention it when placing your order.",
      },
    ],
  },
  {
    id: "intellectual-property",
    title: "Customer Artwork & Intellectual Property",
    blocks: [
      {
        type: "paragraph",
        text: "Customers must have the necessary rights or permission to provide artwork to AH Digitizing.",
      },
      {
        type: "paragraph",
        text: "The customer retains ownership of their original artwork and designs. AH Digitizing does not claim ownership of customer-provided artwork.",
      },
      {
        type: "paragraph",
        text: "Customer files are used for the purpose of completing the requested service and are handled confidentially.",
      },
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation",
    blocks: [
      {
        type: "paragraph",
        text: "If you need to cancel an order, please contact us as soon as possible.",
      },
      {
        type: "paragraph",
        text: "Orders cancelled before work begins may be eligible for a refund.",
      },
      {
        type: "paragraph",
        text: "Once work has started, cancellation and refund eligibility will depend on the progress of the order and the circumstances of the request.",
      },
      {
        type: "paragraph",
        text: "Please see our Refund Policy for more information.",
      },
    ],
  },
  {
    id: "refunds",
    title: "Refunds",
    blocks: [
      {
        type: "paragraph",
        text: "AH Digitizing aims to provide high-quality work and customer satisfaction.",
      },
      {
        type: "paragraph",
        text: "If there is an issue with the delivered file, we will first try to correct the problem through reasonable revisions.",
      },
      {
        type: "paragraph",
        text: "A refund may be considered when:",
      },
      {
        type: "list",
        items: [
          "We are unable to complete the requested service.",
          "A significant issue exists in our delivered work and cannot reasonably be corrected.",
          "An order is cancelled before work begins, where applicable.",
        ],
      },
      {
        type: "paragraph",
        text: "Refunds may not be available when the design has been completed according to the original instructions or when the customer changes the requirements after completion.",
      },
      {
        type: "paragraph",
        text: "Each refund request is reviewed individually.",
      },
    ],
  },
  {
    id: "free-order-policy",
    title: "Free Order Policy",
    blocks: [
      {
        type: "paragraph",
        text: "Free orders are available for new business customers who meet our verification requirements.",
      },
      {
        type: "list",
        items: [
          "Customer must provide a valid business email address.",
          "The business may be required to provide basic business verification.",
          "Customers may be asked to provide social proof, such as a business website or active social media page.",
          "Free orders are limited to one order per business/customer.",
          "The free order must be for a reasonable sample or test design.",
          "AH Digitizing reserves the right to review and approve free order requests on a case-by-case basis.",
        ],
      },
      {
        type: "paragraph",
        text: "Please provide accurate business information when requesting a free order.",
      },
    ],
  },
  {
    id: "customer-responsibilities",
    title: "Customer Responsibilities",
    blocks: [
      {
        type: "paragraph",
        text: "Customers are responsible for providing accurate information and reviewing their files before production.",
      },
      {
        type: "paragraph",
        text: "AH Digitizing is not responsible for mistakes caused by incorrect information, incorrect artwork, incorrect spelling, wrong colors, incorrect sizing, or other details provided by the customer.",
      },
      {
        type: "paragraph",
        text: "If you notice an issue, please contact us before using the file for production.",
      },
    ],
  },
  {
    id: "payment-terms",
    title: "Payment Terms",
    blocks: [
      {
        type: "paragraph",
        text: "Payment is required according to the price agreed upon for the requested service.",
      },
      {
        type: "paragraph",
        text: "For standard orders, work may begin after payment and confirmation of the order details.",
      },
      {
        type: "paragraph",
        text: "If additional work is requested outside the original requirements, an additional charge may apply. We will inform you before proceeding with any additional paid work.",
      },
    ],
  },
  {
    id: "garment-damages",
    title: "Garment Damages / Liability",
    blocks: [
      {
        type: "paragraph",
        text: "AH Digitizing is responsible for providing the embroidery file according to the customer's requirements. However, we are not responsible for damage to garments or other goods that may occur during the physical embroidery or production process. Final embroidery results may vary depending on the fabric, machine, thread, stabilizer, hooping, and production settings.",
      },
    ],
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    blocks: [
      {
        type: "paragraph",
        text: "We respect the privacy of our customers and their artwork.",
      },
      {
        type: "paragraph",
        text: "Customer information, artwork, embroidery files, and project details will be kept confidential and will not knowingly be shared with third parties without permission, except where required to provide a service or comply with applicable legal requirements.",
      },
    ],
  },
  {
    id: "website-content",
    title: "Website Content & Copyright",
    blocks: [
      {
        type: "paragraph",
        text: "All original content displayed on the AH Digitizing website, including text, graphics, images, layouts, branding, and other materials, belongs to AH Digitizing or is used with appropriate permission.",
      },
      {
        type: "paragraph",
        text: "Unauthorized copying, reproduction, redistribution, modification, or commercial use of our website content is prohibited.",
      },
    ],
  },
  {
    id: "changes-to-terms",
    title: "Changes to These Terms",
    blocks: [
      {
        type: "paragraph",
        text: "AH Digitizing may update these Terms & Conditions from time to time to reflect changes in our services, business practices, or legal requirements.",
      },
      {
        type: "paragraph",
        text: "Any updated version will be published on this page. Customers are encouraged to review this page periodically.",
      },
    ],
  },
  {
    id: "contact-us",
    title: "Contact Us",
    blocks: [
      {
        type: "paragraph",
        text: "If you have any questions regarding these Terms & Conditions, your order, or our services, please contact AH Digitizing through the contact details provided on our website.",
      },
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl" style={{ color: "#0A21C0" }}>
            AH Digitizing's Terms & Conditions
          </h1>
          <p className="mt-3 text-gray-600 text-lg">
            Please read carefully before placing your order
          </p>
        </div>
      </div>

      {/* ================= TERMS & CONDITIONS ================= */}
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {termsData.map((section, index) => (
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

                    {/* Underline covers 50% of the actual text width */}
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
    </>
  );
}
