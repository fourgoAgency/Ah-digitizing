import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 flex flex-col justify-center order-2 lg:order-1">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight text-center lg:text-left">
              Precision Digitizing for Unmatched Visuals
            </h1>
            <p className="text-gray-600 text-xl lg:text-lg text-center lg:text-left">
              Artdigitizing transforms your designs into flawless embroidery files, crisp vector art, and captivating custom creations.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md transition-colors duration-200">
              Get Started Today
            </button>
          </div>

          {/* Right Image */}
          <div className="relative order-1 lg:order-2">
            <Image
              width={500}
              height={500}
              src="/about_two.jpeg"
              alt="Professional working at desk"
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );

}
