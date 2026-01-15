// app/page.tsx
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import Banner from '@/../public/images/serviceImg.png'
import image1 from '@/../public/images/portfolio/1.png'
import image2 from '@/../public/images/portfolio/2.png'
import image3 from '@/../public/images/portfolio/3.png'
import image4 from '@/../public/images/portfolio/4.png'
import Link from 'next/link';
const categories = [
  {
    title: 'Web Development',
    image: image1,
  },
  {
    title: 'Graphic Design',
    image: image2,
  },
  {
    title: 'Digital Marketing',
    image: image3,
  },
  {
    title:"E-commerce management",
    image: image4,
  }
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40">
          <Image
            src={Banner}
            alt="Hero Background"
            fill
            className="object-cover -z-10"
          />
        </div>
        <SearchBar />
        {/* <div className="text-center px-4 z-10 max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-white mb-8">
            Find Your Service
          </h1>
          <input
            type="text"
            placeholder="Search services..."
            className={`w-full px-6 py-4 backdrop-blur border text-teal-50 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 ${styles.glass}}`}
          />
        </div> */}
      </div>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular Categories
          </h2>
          <p className="text-gray-600 text-lg">
            Choose from our professional service categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="relative h-60">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600">
                 Chat on whatsapp to get top-notch {category.title} services tailored to your needs.
                </p>
                <Link href='https://wa.me/+923353123932' className="text-teal-600 hover:underline mb-4 block">
                <button className="w-full bg-teal-600 text-white px-4 py-2 mt-3 rounded-lg hover:bg-teal-700 transition-colors duration-300">
                  Start Conversation
                </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}