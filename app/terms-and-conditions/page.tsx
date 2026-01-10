"use client";
import { motion } from "framer-motion";
import Image from "next/image";

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
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={section.title ? "mb-10" : "mb-6"}
            >
              {section.title && (
                <h2 className="text-2xl lg:text-3xl font-bold text-blue-600 mb-4">
                  {section.title}
                </h2>
              )}

              <div className="text-gray-700 leading-relaxed text-sm lg:text-base whitespace-pre-line">
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= FULL WIDTH CTA ================= */}
 <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#0A21C0] w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-around gap-6 sm:gap-8 lg:gap-10">

          {/* Left */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0"
            >
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
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
                Get In Touch With Us!
              </h2>
              <p className="text-blue-100 text-sm sm:text-base max-w-md">
                Let us be the game-changing partner to make your business fly high.
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-white hover:text-[#0A21C0] transition text-sm sm:text-base font-medium w-full sm:w-auto shadow-xl"
            >
              CALL NOW
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#0A21C0] px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-blue-50 transition text-sm sm:text-base font-medium w-full sm:w-auto"
            >
              LET&lsquo;S TALK
            </motion.button>
          </div>

        </div>
      </div>
    </motion.section>
    </>
  );
}
