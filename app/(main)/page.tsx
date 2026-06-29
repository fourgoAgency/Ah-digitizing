import dynamic from "next/dynamic";
import Portfolio from "@/components/home/Portfolio";
import Category from '@/components/home/Category'
import WhyChooseAndFAQ from "@/components/home/WhyChooseUs";
import TestimonialsMarquee from "@/components/home/TestimonialsMarquee";
import BeforeAfterGrid from "@/components/home/BeforeAfter";
import FeaturesSection from "@/components/home/FeaturedSection";
import BannerStackTransition from "@/components/home/BannerStackTransition";
import Banner from "@/components/home/Banner";
import ServicesCarousel from "@/components/home/Services";
const LazyPricing = dynamic(() => import("@/components/home/Pricing"), {
  loading: () => (
    <section className="relative overflow-hidden bg-slate-100 py-16 sm:py-20">
      <div className="relative mx-auto flex max-w-7xl flex-col px-4">
        <div className="mb-12 text-center">
          <div className="mx-auto h-4 w-28 rounded-full bg-slate-200" />
          <div className="mx-auto mt-4 h-12 w-56 rounded-full bg-slate-200 sm:w-72" />
          <div className="mx-auto mt-4 h-4 w-full max-w-xl rounded-full bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[380px] rounded-[2rem] border border-slate-200/80 bg-white/70 shadow-xl shadow-slate-900/5"
            />
          ))}
        </div>
      </div>
    </section>
  ),
});

export default function Page() {
  return (
    <main className="overflow-x-clip bg-white">
      <div className="md:block hidden">
  <BannerStackTransition />
      </div>
      <div className="block md:hidden">
        <Banner/>
        <ServicesCarousel/>
      </div>
      <BeforeAfterGrid />
      <LazyPricing />
      <Portfolio />
      <TestimonialsMarquee />
      <Category />
      <div className="hidden sm:block">
      <WhyChooseAndFAQ />
      <FeaturesSection />
      </div>
    </main>
  );
}
