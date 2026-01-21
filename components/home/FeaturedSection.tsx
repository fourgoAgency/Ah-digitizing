"use client";
import Image from "next/image";
import { FaStar, FaPhoneAlt, FaUserTie, FaShieldAlt, FaUsers } from "react-icons/fa";

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
    <div className="bg-white py-10 shadow-xl rounded-3xl
                max-w-6xl mx-auto
                relative
                -mt-20 z-20">

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center text-center relative px-4 md:px-6 "
          ><div className="flex flex-col items-center justify-center text-center relative px-4 md:px-6 hover:scale-110 transition-transform duration-300">   
            <Image src={feature.image} alt={feature.title} width={50} height={50} className="drop-shadow-md drop-shadow-black/80 mx-12" />
            <h3 className="font-semibold text-secondary mt-4">{feature.title}</h3>
            {feature.description && (
                <p className="text-secondary text-sm mt-1">{feature.description}</p>
            )}
            </div>
            {/* Vertical divider except last item */}
            {idx !== features.length - 1 && (
              <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 h-48 border-r border-primary"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
