"use client";
import React from "react";
import HeroSection from "@/components/about/HeroSection";
import OurStorySection from "@/components/about/OurStorySection";
import MissionValuesSection from "@/components/about/MissionValuesSection";
import ServicesSection from "@/components/about/ServicesSection";
import JourneySection from "@/components/about/JourneySection";
import TestimonialsSection from "@/components/about/TestimonialsSection";
import CTASection from "@/components/about/CTASection";

/* =======================
   DATA (AKA BRAIN 🧠)
   ======================= */

import values from "@/data/about-values.json";
import timeline from "@/data/about-timeline.json";
import testimonials from "@/data/about-testimonials.json";

type Value = {
  title: string;
  desc: string;
  icon: string;
};

type TimelineItem = {
  year: string;
  desc: string;
};

type Testimonial = {
  name: string;
  role: string;
  text: string;
};

export default function DigitizingLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      <HeroSection />
      <OurStorySection />
      <MissionValuesSection values={values} />
      <ServicesSection />
      <JourneySection timeline={timeline} />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </div>
  );

}

