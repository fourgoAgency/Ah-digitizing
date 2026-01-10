"use client";
import { Lightbulb, Shield, Award } from "lucide-react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

/* ======================= 
   DATA (AKA BRAIN 🧠) 
   ======================= */

const values = [
  {
    title: "Innovation",
    desc: "Continuously embracing new technologies and creative approaches.",
    icon: Lightbulb,
  },
  {
    title: "Integrity",
    desc: "Operating with transparency, honesty, and ethical practices.",
    icon: Shield,
  },
  {
    title: "Excellence",
    desc: "Striving for perfection in every detail we deliver.",
    icon: Award,
  },
];

type Testimonial = {
  name: string;
  role: string;
  text: string;
};

const team = [
  {
    name: "Eleanor Vance",
    role: "Founder & Lead Digitizer",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  },
  {
    name: "Marsus Thorne",
    role: "Head of Vector Art",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
  },
  {
    name: "Sophie Chen",
    role: "Creative Director",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
  },
];

const timeline = [
  { year: "2010", desc: "Company founded with a vision to revolutionize digitizing." },
  { year: "2014", desc: "Expanded services to raster to vector conversions." },
  { year: "2018", desc: "Launched custom design services." },
  { year: "2022", desc: "Implemented AI-powered precision tools." },
];

const testimonials: Testimonial[] = [
  {
    name: "Sarah Jenkins",
    role: "CEO, Stellar Threads",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since ",
  },
  {
    name: "David Rodriguez",
    role: "Marketing Director, Urban Canvas",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    name: "Emily White",
    role: "Owner, Bespoke Crafts",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
];

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="min-w-[320px] max-w-[320px] h-[260px] bg-gray-50 rounded-lg p-6 relative flex flex-col">
      <div className="absolute top-4 left-4">
        <span
          className="text-3xl font-serif bg-linear-to-br from-blue-500 via-purple-500 to-indigo-600 text-transparent bg-clip-text select-none"
          style={{ WebkitTextStroke: "1px" }}
        >
          &rdquo;
        </span>
      </div>
      <p className="mt-10 mb-4 text-sm italic text-gray-700 leading-relaxed line-clamp-4">
        {t.text}
      </p>
      <div className="mt-auto">
        <div className="border-t border-gray-300 my-3" />
        <h4 className="font-bold text-sm">{t.name}</h4>
        <p className="text-xs text-gray-500">{t.role}</p>
      </div>
    </div>
  );
}

function InfiniteTestimonials() {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  
  // Triple kiya hai testimonials ko for seamless infinite loop
  const tripleTestimonials = [...testimonials, ...testimonials, ...testimonials];
  
  // Smooth infinite animation
  useAnimationFrame(() => {
    if (!isDragging) {
      const currentX = x.get();
      const cardWidth = 344; // 320px width + 24px gap
      const singleSetWidth = cardWidth * testimonials.length;
      
      // Move left (speed adjust karna ho to ye number change karo)
      let newX = currentX - 0.5;
      
      // Jab ek complete set scroll ho jaye, seamlessly reset
      if (Math.abs(newX) >= singleSetWidth) {
        newX = newX + singleSetWidth;
      }
      
      x.set(newX);
    }
  });

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-6 w-max cursor-grab"
        style={{ x }}
        drag="x"
        dragMomentum={false}
        whileTap={{ cursor: "grabbing" }}
        dragConstraints={{ left: -344 * testimonials.length, right: 0 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      >
        {tripleTestimonials.map((t, i) => (
          <TestimonialCard key={`testimonial-${i}`} t={t} />
        ))}
      </motion.div>
    </div>
  );
}

export default function DigitizingLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 flex flex-col justify-center order-2 lg:order-1">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight text-center lg:text-left">
                Precision Digitizing for Unmatched Visuals
              </h1>
              <p className="text-gray-600 text-xl lg:text-lg text-center lg:text-left">
                Artdigitizing transforms your designs into flawless embroidery files, crisp vector art, and captivating custom creations.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md transition-colors duration-200">
                Get Started Today
              </button>
            </div>

            {/* Right Image */}
            <div className="relative order-1 lg:order-2">
              <Image
                width={500}
                height={500}
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=600&fit=crop"
                alt="Professional working at desk"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <div className="relative">
              <Image
                width={500}
                height={500}
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=600&fit=crop"
                alt="Modern office workspace"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>

            {/* Right Content */}
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Our Story: Crafting Digital Excellence
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Founded in 2010, Artdigitizing emerged from a passion for bringing designs to life with precision and creativity. What began with a commitment to mastering the art of embroidery digitizing, evolved into a service that perfectly captured the client&apos;s vision. Over the years, we expanded our expertise, embracing raster-to-vector conversions, and bespoke design services to become a comprehensive hub for digital artistry. Today, we stand on continuous innovation, unwavering quality, and a deep dedication to our client&apos;s success.
              </p>
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-md font-semibold">
                Founded in 2010
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white text-black py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12">
            Our Mission: Empowering Creativity
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-gray-50 p-8 rounded-xl space-y-4">
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-full">
                    <v.icon className="w-8 h-8 text-[#0A21C0]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">{v.title}</h3>
                <p className="text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="bg-gray-100/2 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-16">
            Our Services: Digital Art Solutions
          </h2>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Embroidery Digitizing */}
            <div className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-50 p-4 rounded-full">
                  <svg className="w-12 h-12 text-[#0A21C0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Embroidery Digitizing</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Transform your designs into high-quality embroidery files with precision and detail, tailored for all fabric types.
              </p>
              <button className="text-[#0A21C0] font-semibold text-sm hover:text-blue-700">
                Learn More
              </button>
            </div>

            {/* Raster to Vector */}
            <div className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-50 p-4 rounded-full">
                  <svg className="w-12 h-12 text-[#0A21C0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Raster to Vector</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Convert any low-resolution image into a crisp, scalable vector format, perfect for printing and branding.
              </p>
              <button className="text-[#0A21C0] font-semibold text-sm hover:text-blue-700">
                Learn More
              </button>
            </div>

            {/* Custom Design */}
            <div className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-50 p-4 rounded-full">
                  <svg className="w-12 h-12 text-[#0A21C0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Design</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Bring your unique ideas to life with bespoke design solutions tailored to your brand and creative requirements.
              </p>
              <button className="text-[#0A21C0] font-semibold text-sm hover:text-blue-700">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-black">
            Our Journey Through Out The Years
          </h2>
          <div className="space-y-10">
            {timeline.map((t, index) => (
              <div key={t.year}>
                {/* Timeline Item */}
                <div className="flex flex-col lg:flex-row items-start gap-3 lg:gap-6 py-4 lg:py-6">
                  {/* Year */}
                  <div className="text-[#0A21C0] font-semibold text-base lg:text-right w-full lg:w-20 shrink-0">
                    {t.year}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed w-full pl-0 lg:pl-0">
                    {t.desc}
                  </p>
                </div>

                {/* Divider */}
                {index !== timeline.length - 1 && (
                  <div className="h-px bg-gray-300/70 mt-2 lg:mt-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16 lg:py-24 text-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
            What Our Clients Say
          </h2>

          <InfiniteTestimonials />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[url('/bg_image_blue.jpeg')] bg-cover bg-center bg-no-repeat py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Bring Your Designs to Life?
          </h2>
          <p className="text-blue-100 text-lg mb-4 leading-relaxed">
            Get a personalized quote for your embroidery digitizing, vector art, or custom design project today.
          </p>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Experience the Artdigitizing difference with unmatched quality and service.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-md transition-colors duration-200 text-lg">
            Request Your Free Quote
          </button>
        </div>
      </section>
    </div>
  );
}