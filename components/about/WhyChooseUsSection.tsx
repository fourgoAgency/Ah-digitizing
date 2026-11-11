"use client";
import { motion } from "framer-motion";

const reasons = [
  { title: "10 Years of Experience", desc: "Our industry experience helps us understand different embroidery applications, artwork requirements, and production challenges." },
  { title: "Quality-Focused Digitizing", desc: "We focus on proper stitch structure, accurate sequencing, clean details, and application-specific requirements when preparing embroidery files." },
  { title: "Affordable and Competitive Pricing", desc: "We aim to offer professional embroidery digitizing services at competitive prices for businesses and individuals with different project requirements." },
  { title: "Reliable Turnaround Times", desc: "We work efficiently to help customers meet their production deadlines. Rush service may be available when offered and agreed upon in advance." },
  { title: "Customer-Focused Service", desc: "We value clear communication and take individual project requirements into account. Customer feedback also helps us understand and address design adjustments." },
  { title: "Machine-Compatible File Formats", desc: "We prepare embroidery files in the supported formats required for your machine and project. Share your machine details with us so we can help identify the appropriate format." },
];

export default function WhyChooseUsSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-4"
        >
          Why Choose AH Digitizing?
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {reasons.map((r, index) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-gray-50 rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">{r.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
