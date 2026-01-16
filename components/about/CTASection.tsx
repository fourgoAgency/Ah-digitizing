export default function CTASection() {
  return (
    <section className="bg-[url('/bg_image_blue.jpeg')] bg-cover bg-center bg-no-repeat py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
          Ready to Bring Your Designs to Life?
        </h2>
        <p className="text-blue-100 text-lg mb-4 leading-relaxed">
          Get a personalized quote for your embroidery digitizing, vector art, or custom design project today.
        </p>
        <p className="text-blue-100 text-lg mb-8 leading-relaxed">
          Experience the Artdigitizing difference with unmatched quality and service.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-full transition-colors duration-200 text-lg">
          Request Your Free Quote
        </button>
      </div>
    </section>
  );
}