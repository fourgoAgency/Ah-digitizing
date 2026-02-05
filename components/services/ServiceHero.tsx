"use client";

import Link from "next/link";

type ServiceHeroProps = {
  title: string;
  description: string;
  quoteParam: string;
};

export default function ServiceHero({ title, description, quoteParam }: ServiceHeroProps) {
  return (
    <section className="w-full bg-white py-32 px-6 mt-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl bg-linear-to-br from-primary to-blue-400 text-transparent bg-clip-text font-bold mb-6">
          {title}
        </h1>

        <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
          {description}
        </p>

        <Link
          href={`/account?quote=${quoteParam}`}
          className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-gray-100 hover:text-primary hover:border hover:border-primary transition-colors"
        >
          Get a Quote
        </Link>
      </div>
    </section>
  );
}
