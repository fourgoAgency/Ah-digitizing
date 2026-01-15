import Image from "next/image";

export default function OurStorySection() {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="relative">
            <Image
              width={500}
              height={500}
              src="about_one.jpeg"
              alt="Modern office workspace"
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>

          {/* Right Content */}
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Our Story: Crafting Digital Excellence
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2010, Artdigitizing emerged from a passion for bringing designs to life with precision and creativity. What began with a commitment to mastering the art of embroidery digitizing, evolved into a service that perfectly captured the client's vision. Over the years, we expanded our expertise, embracing raster-to-vector conversions, and bespoke design services to become a comprehensive hub for digital artistry. Today, we stand on continuous innovation, unwavering quality, and a deep dedication to our client's success.
            </p>
            <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-md font-semibold">
              Founded in 2010
            </div>
          </div>
        </div>
      </div>
    </section>
  );

}
