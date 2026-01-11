"use client";
import { motion } from "framer-motion";
import Image from "next/image";

// Privacy Policy Data
const privacyData = [
  {
    id: "intro",
    title: null,
    content:
      "Thanks for using the platform of DigitEMB for acquiring the services of any (or all) of digitization and vectorization. This policy elaborates the ins and outs of our practices, including how and why we collect your information when you acquire our digitizing/vectorizing services. The policy also explains the methods we use to collect your data that is handled for specific purposes. Nevertheless, we would also like to emphasize that we take our customers' privacy policy very seriously. We do not sell, distribute or share our records with anyone, Be that may be an individual or an enterprise.",
  },
  {
    id: "collection",
    title: "Collection of Information",
    content:
      "All the information that is collected through this web portal, is owned and accessible by DigitEMB only. The only information we make use of or have access is provided to us by the customers (voluntarily) themselves. Either by contacting us directly over the phone, through an email or either by registering at digitemb.com.",
  },
  {
    id: "use",
    title: "Use of Information",
    content:
      "We will only use the information provided by you like a call of action for the specific purpose you contact us for. We may further contact you for a follow-up, to inform you about the specials and the latest services either via phone or email. We may also send a monthly newsletter if you have subscribed, unless or until you explicitly asked not to do so. As aforementioned, the information and the data we collect from our customers is not to be sold to any other enterprise or organization. Furthermore, the collected data and information will be utilized for digitemb.net as well.\n\nAll of the collected information including the password that you made for your account will be saved into our database for future references. (The figure rules apply for DigitEMB.net as well.)",
  },
  {
    id: "rights",
    title: "Your Rights",
    content:
      "You reserve the right to instruct us to provide us with the necessary information we kept within our records. You may further advise any concern or queries about us keeping your data. You may also ask us to delete your personal information from our records and we will comply with your request. Moreover, you may also ask us which contact you any further in the future for marketing purposes or any.",
  },
  {
    id: "updation",
    title: "Updation of Information",
    content:
      "You are requested to make us aware of any personal information, i.e. email address, phone number(s), etc., that needs to be updated, modified, or corrected in our records at your earliest convenience.",
  },
  {
    id: "security",
    title: "Security Precautions",
    content:
      "We take special precautions in order to prevent any kind of loss, damage, and modification of your personal and sensitive information, within our records, both offline and online. All the information we collect is archived and stored safely in our secure database servers. All of the information is encrypted to maximize the security of our customers. Furthermore, we will never ask you to disclose your password, except for the log-in purpose. The responsibility of safekeeping the password rests upon you. DigitEMB is not liable for any loss of data, whether it may be due to a technical error, hack or any other.",
  },
  {
    id: "amendments",
    title: "Amendments",
    content:
      "We reserve the right to, and will, update this policy occasionally, by issuing a newer version on our website in lieu of the changes within the business environment and the organization within. It is recommended that you visit this page from time to time, in order be aware of any and every changes or amendment made to the privacy policy.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Privacy Policy Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {privacyData.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.01 }}
              className={section.title ? "mb-10" : "mb-6"}>
              {section.title && (
                <h2 className="text-2xl sm:text-[26px] lg:text-3xl font-bold text-[#0A21C0] mb-4">
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
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-[#0A21C0] w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-around gap-6 sm:gap-8 lg:gap-10">
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
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
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
