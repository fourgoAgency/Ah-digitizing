import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";

interface ServiceCardProps {
  image: StaticImageData;
  title: string;
  description: string;
  link: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ image, title, description, link }) => {
  return (
    <Link href={link} className="w-full max-w-lg mx-auto mb-4">
      <div className="relative w-full h-64 max-w-lg rounded-2xl overflow-hidden shadow-lg group">
        <Image
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:blur-sm"
        />
        <div className="absolute inset-0 bg-opacity-50 flex flex-col justify-center items-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-white text-xl font-bold text-center">{title}</h3>
          <p className="text-gray-300 text-center mt-2">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
