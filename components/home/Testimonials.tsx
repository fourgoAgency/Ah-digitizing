import { FaStar } from "react-icons/fa";
import Image from "next/image";

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="relative border-gray-300 border bg-white rounded-[28px] shadow-2xl mt-20 p-6 pt-16">

      {/* ✅ OLD AVATAR (unchanged) */}
      <div className="absolute -top-10 right-0 w-20 h-20 rounded-full bg-white shadow-xl border-4 border-gray-200 flex items-center justify-center">
        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-10 h-10 fill-gray-400" > <path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z"/> </svg> */}
        <Image
          src={t.avatar}
          alt={t.name}
          width={80}
          height={80}
          className="w-18 h-18 rounded-full object-cover"
        />
      </div>

      {/* ✅ NEW NAME TAG */}
      <div className="absolute top-0 left-[-20px]">
        <div className="absolute top-[38px] left-0 w-5 h-10 bg-[#2a5492] rounded-bl-[20px]" />
        <div className="relative bg-[#2f5fa7] px-12 py-3 p-0 lg:pr-12 xl:pr-20 rounded-tr-[26px] rounded-tl-[26px] rounded-br-[26px] shadow-lg">
          <p className="text-sm font-semibold text-white">{t.name}</p>
          <p className="text-xs text-white/80">{t.role}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-4 mt-6">
        <div className="w-1 bg-[#2f5fa7] rounded-full" />

        <div>
          {/* Rating */}
          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={`w-4 h-4 ${
                  i < t.rating ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Text */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-5">
            {t.text}
          </p>
        </div>
      </div>
    </div>
  );
}
type Testimonial = {
  id: number;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatar: string;
};
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sample Name",
    role: "Designation",
    rating: 4,
    text:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue",
    avatar: "/avatar.png",
  },
  {
    id: 2,
    name: "Sample Name",
    role: "Designation",
    rating: 5,
    text:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue",
    avatar: "/avatar.png",
  },
  {
    id: 3,
    name: "Sample Name",  
    role: "Designation",
    rating: 3,
    text:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue",
    avatar: "/avatar.png",
  },
  {
    id: 4,
    name: "Sample Name",
    role: "Designation",
    rating: 5,
    text:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue",
    avatar: "/avatar.png",
  },
  {
    id: 5,
    name: "Sample Name",
    role: "Designation",
    rating: 4,
    text:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue",
    avatar: "/avatar.png",
  },
  
  {
    id: 6,
    name: "Sample Name",
    role: "Designation",
    rating: 5,
    text:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue",
    avatar: "/avatar.png",
  },  
  {
    id: 7,
    name: "Sample Name",
    role: "Designation",
    rating: 4,
    text:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue",
    avatar: "/avatar.png",
  },
  {
    id: 8,
    name: "Sample Name",
    role: "Designation",
    rating: 5,
    text:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue",
    avatar: "/avatar.png",
  }
];
export default function Testimonials() {
  return (
    <section className=" flex py-16 bg-white justify-center items-center">
      <div className="max-w-full mx-7 lg:mx-20 px-4">
        <h2 className="text-5xl font-bold text-center">
          Testimonials
        </h2>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10 justify-center">
          {testimonials.map((item) => (
            <TestimonialCard key={item.id} t={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
