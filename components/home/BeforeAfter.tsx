import Image from "next/image";

type CardProps = {
  before: string;
  after: string;
};

const Card = ({ before, after }: CardProps) => {
  return (
    <div className="relative bg-muted rounded-3xl w-full h-full flex gap-6 shadow-xl">
      {/* Left: Before */}
      <div className="flex flex-col items-center gap-2">
        <div className=" rounded-2xl ml-9 mt-6 shadow-2xl bg-white shadow-black/80 border border-gray-400 w-32 flex items-center justify-center">
          <Image
            src={before}
            alt="Before"
            width={150}
            height={150}
            className="rounded-xl w-full h-full object-cover"
          />
        </div>
        <span className="text-xl font-bold italic text-black">
          Before
        </span>
      </div>

      {/* Right: After */}
      <div className="relative ml-auto">

        <div className="rounded-3xl p-6 shadow-2xl border border-gray-400 flex flex-col justify-center items-center gap-2">
        <span className=" text-2xl font-bold italic text-black">
          After
        </span>
        <div className="rounded-2xl shadow-2xl shadow-black/70 bg-white border border-gray-400 w-48 h-48 flex items-center justify-center">

          <Image
            src={after}
            alt="After"
            width={320}
            height={320}
            className="rounded-2xl w-full h-full object-cover"
            />
            </div>
        </div>
      </div>
    </div>
  );
};

export default function BeforeAfterGrid() {
  const items = Array.from({ length: 6 });

  return (
    <section className="max-w-fit mx-auto px-4 py-16">
        <div className="text-5xl text-center font-bold mb-12">Before & After</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {items.map((_, i) => (
          <Card
            key={i}
            before="/home-page/tiger.png"   // replace with your BEFORE image
            after="/home-page/tiger.png"    // replace with your AFTER image
          />
        ))}
      </div>
    </section>
  );
}
