import InfiniteTestimonials from "./InfiniteTestimonials";

type Testimonial = {
  name: string;
  role: string;
  text: string;
};

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="bg-white py-16 lg:py-24 text-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
          What Our Clients Say
        </h2>

        <InfiniteTestimonials testimonials={testimonials} />
      </div>
    </section>
  );
}