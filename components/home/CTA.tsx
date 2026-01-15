import Image from "next/image";

export default function CTABanner() {
  return (
    <section className="bg-[#0A21C0] py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Side - Logo/Icon */}
          <div className="shrink-0">
            <div className="w-36 h-36 md:w-44 md:h-44 bg-white rounded-full flex items-center justify-center shadow-lg">
              {/* Replace with your actual logo/icon */}
              <div className="relative w-24 h-24 md:w-28 md:h-28">
                <Image 
                  src="/logo.jpeg" 
                  alt="Company Logo" 
                  width={500}
                    height={500}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Center - Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get In Touch With Us!
            </h2>
            <p className="text-white/90 text-lg">
              Let us be the game changing partner to make your business fly high.
            </p>
          </div>

          {/* Right Side - CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <a
              href="tel:+1234567890"
              className="px-8 py-3 bg-secondary hover:bg-secondary-800 text-white font-semibold rounded-lg transition-colors text-center"
            >
              CALL NOW
            </a>
            <a
              href="/contact"
              className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg transition-colors text-center"
            >
              LET'S TALK
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}