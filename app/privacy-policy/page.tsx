"use client";
import { motion } from "framer-motion";
import CTASection from "@/components/CTASection";

const privacySections = [
  {
    id: "intro",
    title: "Privacy Policy",
    content:
      "Effective date: February 20, 2026\n\nThis Privacy Policy explains how AhDigitizing collects, uses, and protects your information when you use our website and request digitizing or vector conversion services.",
  },
  {
    id: "collection",
    title: "Information We Collect",
    content:
      "When you submit a quote request or contact us, we may collect:\n- Full name\n- Company name (optional)\n- Email address\n- Country\n- Contact number (optional)\n- Order details (service type, size, file formats, turnaround time, notes, etc.)\n- Uploaded files and artwork references\n- WhatsApp communication preference (opt-in checkbox)\n\nWe only collect information you provide directly through forms and communications.",
  },
  {
    id: "use",
    title: "How We Use Your Information",
    content:
      "We use your information to:\n- Review your design request and prepare a quote\n- Communicate about your order by email, phone, or WhatsApp (if selected)\n- Deliver files and provide customer support\n- Improve our services and website forms\n\nWe do not sell your personal information.",
  },
  {
    id: "processing",
    title: "File and Artwork Handling",
    content:
      "Files you upload are used to evaluate and process your request. Please upload only files you have permission to use. We may keep submitted files and order details for record-keeping, revisions, quality control, and support.",
  },
  {
    id: "file-validation",
    title: "Get Quote File Upload Validation",
    content:
      "To protect our systems and keep the quote process smooth, uploaded files in the Get Quote form are validated before submission.\n\nValidation rules currently include:\n- Maximum 10 files per submission\n- Maximum file size: 50MB per file\n- Video files are blocked\n- Unsafe file names are blocked\n\nAccepted file categories include image files and common document/design formats. Supported extensions include:\n- .jpg, .jpeg, .png, .gif, .bmp, .tif, .tiff, .webp, .svg\n- .pdf, .doc, .docx\n- .ai, .eps, .ps, .psd\n- .emb, .dst, .pes, .ngs, .pxf, .hus, .vp3, .jef, .cnd, .art, .csd, .xxx, .pec, .ofm, .omf\n\nIf a file does not meet validation requirements, it may be rejected at upload or form submission.If you have any file which is not accepted by the form, please contact us through our Contact Us page to discuss alternative ways to share your files for a quote.",
  },
  {
    id: "sharing",
    title: "Information Sharing",
    content:
      "We do not sell or rent your personal information. We may share information only when necessary to run our services (for example, hosting, file storage, or communication tools) or when required by law.",
  },
  {
    id: "security",
    title: "Data Security",
    content:
      "We use reasonable technical and organizational measures to protect your information. However, no online platform can guarantee absolute security.",
  },
  {
    id: "retention",
    title: "Data Retention",
    content:
      "We retain your information for as long as needed to provide services, resolve disputes, maintain business records, and meet legal obligations.",
  },
  {
    id: "rights",
    title: "Your Rights",
    content:
      "You can request access, correction, or deletion of your personal information by contacting us. You can also ask us to stop non-essential communications.",
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    content:
      "Our website may use third-party services for functionality such as media delivery, website hosting, and communication channels. Their handling of data is governed by their own privacy policies.",
  },
  {
    id: "updates",
    title: "Policy Updates",
    content:
      "We may update this Privacy Policy from time to time. Any updates will be posted on this page with the revised effective date.",
  },
  {
    id: "contact",
    title: "Contact Us",
    content:
      "If you have any privacy-related questions, please contact us through our Contact Us page.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {privacySections.map((section, index) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.01 }}
              className="mb-10 scroll-mt-28"
            >
              <h2
                className={`${section.id === "intro"
                  ? "text-3xl sm:text-4xl lg:text-5xl"
                  : "text-2xl sm:text-[26px] lg:text-3xl"
                  } font-bold text-[#0A21C0] mb-4`}
              >
                {section.title}
              </h2>

              <div className="text-gray-700 leading-relaxed text-base lg:text-[17px] whitespace-pre-line">
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <CTASection />
    </div>
  );
}
