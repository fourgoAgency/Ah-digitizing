type Testimonial = {
  name: string;
  role: string;
  text: string;
};

export default function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="min-w-[320px] max-w-[320px] h-[260px] bg-gray-50 rounded-lg p-6 relative flex flex-col">
      <div className="absolute top-4 left-4">
        <span
          className="text-3xl font-serif bg-linear-to-br from-blue-500 via-purple-500 to-indigo-600 text-transparent bg-clip-text select-none"
          style={{ WebkitTextStroke: "1px" }}
        >
          &rdquo;
        </span>
      </div>
      <p className="mt-10 mb-4 text-sm italic text-gray-700 leading-relaxed line-clamp-4">
        {t.text}
      </p>
      <div className="mt-auto">
        <div className="border-t border-gray-300 my-3" />
        <h4 className="font-bold text-sm">{t.name}</h4>
        <p className="text-xs text-gray-500">{t.role}</p>
      </div>
    </div>
  );
}