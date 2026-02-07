import CTABanner from "@/components/home/CTA";
import ServiceHero from "@/components/services/ServiceHero";
import ServicePricing from "@/components/services/ServicePricing";
import ServiceTestimonials from "@/components/services/ServiceTestimonials";
import ServiceTransformationExamples from "@/components/services/ServiceTransformationExamples";
import servicesData from "@/data/services.json";
import { notFound } from "next/navigation";

type ServiceData = {
  slug: string;
  hero: {
    title: string;
    description: string;
    quoteParam: string;
  };
  transformation: {
    title: string;
    description: string;
    examples: {
      id: number;
      title: string;
      description: string;
      beforeImage: string;
      afterImage: string;
    }[];
  };
  testimonials: {
    id: number;
    name: string;
    country: string;
    text: string;
    image: string;
  }[];
  pricing: {
    serviceKey: "embroidery" | "vector";
    serviceLabel: "Embroidery" | "Vector";
  };
};

type ServicesMap = Record<string, ServiceData>;

export function generateStaticParams() {
  console.log("Generating static params for services...", Object.keys(servicesData as ServicesMap).map((slug) => ({ slug })));
  return Object.keys(servicesData as ServicesMap).map((slug) => ({ slug }));
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const services = servicesData as ServicesMap;
  const { slug } = await params;
  const service = services[slug];

  if (!service) {
    notFound();
  }

  return (
    <div>
      <ServiceHero {...service.hero} />
      <ServiceTransformationExamples {...service.transformation} />
      <ServiceTestimonials testimonials={service.testimonials} />
      <ServicePricing {...service.pricing} />
    </div>
  );
}
