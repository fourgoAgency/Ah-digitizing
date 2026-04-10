import Banner from "@/components/home/Banner";
import Pricing from "@/components/home/Pricing";
import Services from "@/components/home/Services";
import Portfolio from "@/components/home/Portfolio";
import Category from '@/components/home/Category'
import WhyChooseAndFAQ from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import BeforeAfterGrid from "@/components/home/BeforeAfter";
import FeaturesSection from "@/components/home/FeaturedSection";
export default function Page() {
  return (
    <main className="overflow-x-clip bg-white">
      <Banner />
      <div className="relative z-0 -mt-20 sm:-mt-24 lg:-mt-32">
        <Services />
      </div>
      <BeforeAfterGrid/>
      <Pricing />
      <Portfolio />
      <Category />
      <WhyChooseAndFAQ/>
    <FeaturesSection />
      <Testimonials/>
    </main>
  );
}
