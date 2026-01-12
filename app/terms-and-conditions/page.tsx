"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import CTASection from "@/components/CTASection";
// Disclaimers Data
const disclaimersData = [
  {
    id: "intro",
    title: null,
    content:
      "By Accessing DigitEMB Website, You Agree To Comply And Adhere To The Following Terms And Conditions Of Using This Website.",
  },
  {
    id: "website-disclaimers",
    title: "Website Disclaimers",
    content:
      "All information and materials contained in this website, including but not limited to text, visuals, links and the service mentioned on the website are provided as is. We do not claim that everything on this website and its contents are or will be completely accurate or understandable which must or not warrant secure and error-free. By using this website, you expressly agree that your use of the DigitEMB website is at your own risk.",
  },
  {
    id: "services",
    title: "Services",
    content:
      "Due to the customized of our services, it is necessary to renew your artwork (principally digitizing or vectorization services) that includes any images that are based on the 3D effects or text inside it.. In view of the lacking or non-clarity in the color scheme and visible aspect of any kind prior to the production process, the first second or vectorization text should be verified to perfection; the digitizing or vectorization process. Please review the new artwork. DigitEMB shall not be appointed for any damages, inconvenience and/or inaccuracies to the garment or specialized file. The final end copies is also submitted to banner or permission from the customer. DigitEMB shall not be held accountable for any misused of any logo, website and/or digitized design.",
  },
  {
    id: "modification",
    title: "Modification",
    content:
      "Any and/or all the information contained in this website is subjected to change from time to time, without giving any any prior notice before or after the implementation.",
  },
  {
    id: "payment-terms",
    title: "Payment Terms",
    content:
      "The procedure is generated when the ordered service is placed on our platforms; you would have the option of making the payment forthwith to make it more the hassle-free and manage it now the mode of delivery can also be confirmed and delivered.",
  },
  {
    id: "limitation",
    title: "Limitation of Liability",
    content:
      "DigitEMB always strives to ensure that the service provided on its website is accurate and delivered on time.",
  },
  {
    id: "free-order",
    title: "Free Order Policy",
    content:
      "- User must have business e-mail.\n- User have to verify the business.\n- User must have to attach the past 30 business.",
  },
  {
    id: "copyright",
    title: "Copyright",
    content:
      "All the digitize and vectorize artwork at DigitEMB are exclusively owned by DigitEMB.",
  },
  {
    id: "return-policy",
    title: "Return, Refund, OR Exchange Policy",
    content:
      "Due to the digital nature of products, we do not offer returns, refunds, or exchanges.",
  },
  {
    id: "shipping",
    title: "Shipping or Delivery",
    content:
      "All orders will be electronically delivered to the customer's provided email address.",
  },
];

export default function DisclaimersPage() {
  return (
    <>
      {/* ================= DISCLAMERS ================= */}
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {disclaimersData.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.01 }}
              className={section.title ? "mb-10" : "mb-6"}
            >
              {section.title && (
<h2
  className={`font-bold text-blue-600 mb-4 ${
    section.id === "website-disclaimers"
      ? "text-3xl sm:text-4xl lg:text-5xl"
      : "text-2xl sm:text-3xl lg:text-3xl"
  }`}
>
  {section.title}
</h2>

              )}

              <div className="text-gray-700 leading-relaxed text-base lg:text-[17px] whitespace-pre-line">

                {section.content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <CTASection />
    </>
  );
}
