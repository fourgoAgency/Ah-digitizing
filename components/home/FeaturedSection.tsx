"use client";
import Image from "next/image";

const features = [
  {
    image: "/Customer.png",
    title: "Customer Satisfaction",
    description: "Supreme Customer Satisfaction",
  },
  {
    image: "/Support.png",
    title: "24/5 Support",
    description: "",
  },
  {
    image: "/Manager.png",
    title: "Dedicated Account & Manager",
    description: "",
  },
  {
    image: "/Guarantee.png",
    title: "Secure Money Back Guarantee",
    description: "",
  },
  {
    image: "/Professionals.png",
    title: "Industry Proven Professionals",
    description: "",
  },
];

const FeaturesSection = () => {
  return (
    <section
      className="relative z-20 mx-auto mb-8 -mt-28 max-w-6xl rounded-3xl bg-white py-10 shadow-xl"
      aria-label="Trust signals"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row md:gap-0">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="relative flex flex-col items-center justify-center px-4 text-center md:px-6"
          >
            <div className="relative flex flex-col items-center justify-center px-4 text-center transition-transform duration-300 hover:scale-110 md:px-6">
              <Image
                src={feature.image}
                alt={feature.title}
                width={50}
                height={50}
                className="mx-12 drop-shadow-md drop-shadow-black/80"
              />
              <h3 className="mt-4 font-semibold text-secondary">{feature.title}</h3>
              {feature.description && (
                <p className="text-secondary text-sm mt-1">{feature.description}</p>
              )}
            </div>

            {idx !== features.length - 1 && (
              <div className="absolute right-0 top-1/2 hidden h-48 -translate-y-1/2 border-r border-primary md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
