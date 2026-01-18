import Hero from "@/components/home/Hero";
import Banner from "@/components/home/Banner";
import Pricing from "@/components/home/Pricing";
import Services from "@/components/home/Services";
import Portfolio from "@/components/home/Portfolio";
import Category from '@/components/home/Category'
import WhyChooseAndFAQ from "@/components/home/WhyChooseUs";
import CTABanner from "@/components/home/CTA";
import Testimonials from "@/components/home/Testimonials";
import BeforeAfterGrid from "@/components/home/BeforeAfter";
export default function Page() {
  return (
    <main>
      <Banner />
      <Services />
      <Pricing />
      <Portfolio />
      <Category />
      <BeforeAfterGrid/>
      <WhyChooseAndFAQ/>
      <Testimonials/>
      <CTABanner/>
    </main>
  );
}
