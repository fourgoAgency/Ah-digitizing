type Testimonial = {
  name: string;
  role: string;
  text: string;
};

export default function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="relative w-90 ml-10 bg-white rounded-[28px] shadow-xl mt-20 p-6 pt-16 mb-10">
      
      {/* <div className="absolute top-0 left-0 bg-[#2f5fa7] text-white px-6 py-3 rounded-br-[26px] rounded-tl-[26px] rounded-tr-[26px]">
        <p className="text-sm font-semibold leading-tight">{t.name}</p>
        <p className="text-xs opacity-90">{t.role}</p>
      </div> */}

        <div className="absolute top-0 left-[-20px]">


  <div className="absolute top-[38px] left-0 w-5 h-10 bg-[#2a5492] rounded-bl-[20px] z-0"></div>


  <div className="relative  z-1 bg-[#2f5fa7] px-6 py-3 pr-10 rounded-tr-[26px] rounded-tl-[26px] rounded-br-[26px]  shadow-lg">
    <p className="text-sm font-semibold text-white leading-tight">
      {t.name}
    </p>
    <p className="text-xs text-white/80">
      {t.role}
    </p>
  </div>
</div>



      <div className="absolute -top-10 right-4 w-20 h-20 rounded-full bg-gray-100 shadow-xl border-white flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          className="w-10 h-10 fill-gray-400"
        >
          <path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z"/>
        </svg>
      </div>


      <div className="flex gap-4 mt-6">
        

        <div className="w-0.75 bg-[#2f5fa7] rounded-full"></div>

        <div>

          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4].map((i) => (
              <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            ))}
            <svg className="w-4 h-4 fill-gray-300" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
          </div>


      <p className="text-sm text-gray-600 leading-relaxed line-clamp-5">
        {t.text}
      </p>
        </div>
      </div>
    </div>
  );
}
