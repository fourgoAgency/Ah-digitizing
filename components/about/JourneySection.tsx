type TimelineItem = {
  year: string;
  desc: string;
};

export default function JourneySection({ timeline }: { timeline: TimelineItem[] }) {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-black">
          Our Journey Through Out The Years
        </h2>
        <div className="space-y-10">
          {timeline.map((t, index) => (
            <div key={t.year}>
              {/* Timeline Item */}
              <div className="flex flex-col lg:flex-row items-start gap-3 lg:gap-6 py-4 lg:py-6">
                {/* Year */}
                <div className="text-[#0A21C0] font-semibold text-base lg:text-right w-full lg:w-20 shrink-0">
                  {t.year}
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed w-full pl-0 lg:pl-0">
                  {t.desc}
                </p>
              </div>

              {/* Divider */}
              {index !== timeline.length - 1 && (
                <div className="h-px bg-gray-300/70 mt-2 lg:mt-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}