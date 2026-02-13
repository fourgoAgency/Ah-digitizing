// import Image from "next/image";
// import Link from "next/link";
// import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

// export default function Footer() {
//   return (
//     <footer className="bg-gray-50 border-t border-gray-200">
//       {/* Main Footer */}
//       <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

//         {/* Brand & Newsletter */}
//         <div>
//           <div className="flex items-center gap-2 mb-4">
//             <Image src="/logo.jpeg" alt="AHdigitizing Logo" width={40} height={40} />
//             <span className="font-semibold text-lg">AHdigitizing</span>
//           </div>

//           <p className="text-sm text-gray-600 mb-4">
//             Your trusted partner for professional embroidery digitizing and vector art services.
//           </p>

//           <h4 className="font-medium mb-2">Newsletter</h4>
//           <div className="flex gap-2">
//             <input
//               type="email"
//               placeholder="Your email"
//               className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//             <button className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-transparent hover:text-primary border-2 border-primary transition-colors">
//               Subscribe
//             </button>
//           </div>
//         </div>

//         {/* About */}
//         <div>
//           <h4 className="font-semibold mb-4">About</h4>
//           <ul className="space-y-2 text-sm text-gray-600">
//             <li><Link href="/about-us">About Us</Link></li>
//             <li><Link href="/blog">Blog</Link></li>
//             <li><Link href="/write-a-review">Write a Review</Link></li>
//           </ul>
//         </div>

//         {/* Services */}
//         <div>
//           <h4 className="font-semibold mb-4">Services</h4>
//           <ul className="space-y-2 text-sm text-gray-600">
//             <li><Link href="/services/embroidery-digitizing">Embroidery Digitizing</Link></li>
//             <li><Link href="/services/raster-to-vector">Raster to Vector</Link></li>
//             <li><Link href="/services/custom-design">Custom Design</Link></li>
//             <li><Link href="/pricing">Pricing</Link></li>
//           </ul>
//         </div>

//         {/* Support */}
//         <div>
//           <h4 className="font-semibold mb-4">Support</h4>
//           <ul className="space-y-2 text-sm text-gray-600 mb-6">
//             <li><Link href="/contact-us">Contact Us</Link></li>
//             <li><Link href="/FAQs">FAQ</Link></li>
//             <li><Link href="/privacy-policy">Privacy Policy</Link></li>
//             <li><Link href="/terms-and-conditions">Terms of Service</Link></li>
//           </ul>

//           <div className="flex gap-3">
//             <a className="p-2 border rounded hover:bg-blue-600 hover:text-white">
//               <FaFacebookF size={14} />
//             </a>
//             <a className="p-2 border rounded hover:bg-blue-600 hover:text-white">
//               <FaTwitter size={14} />
//             </a>
//             <a className="p-2 border rounded hover:bg-blue-600 hover:text-white">
//               <FaInstagram size={14} />
//             </a>
//             <a className="p-2 border rounded hover:bg-blue-600 hover:text-white">
//               <FaLinkedinIn size={14} />
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="border-t border-gray-200 text-center pt-4 text-sm text-gray-500">
//         © 2025 AhDigitzing. All rights reserved.
//       </div>
//         <span className="bottom-0 text-right text-xs text-gray-300">By fourgo team</span>
//     </footer>
//   );
// }
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  const embroideryItems = [
    { label: "Logo Embroidery Digitizing", href: "/services/embroidery/logo" },
    { label: "Left Chest Embroidery Digitizing", href: "/services/embroidery/left-chest" },
    { label: "Cap Embroidery Digitizing", href: "/services/embroidery/cap" },
    { label: "3D Puff Embroidery Digitizing", href: "/services/embroidery/3d-puff" },
    { label: "Jacket Embroidery Digitizing", href: "/services/embroidery/jacket" },
    { label: "Applique Embroidery Digitizing", href: "/services/embroidery/applique" },
    { label: "Image Embroidery Digitizing", href: "/services/embroidery/image" },
    { label: "Towel Embroidery Digitizing", href: "/services/embroidery/towel" },
  ];

  const rasterToVectorItems = [
    { label: "Raster To Vector Services", href: "/services/raster-to-vector" },
    { label: "Silhouette Art", href: "/services/raster-to-vector/silhouette" },
    { label: "Stencil Art", href: "/services/raster-to-vector/stencil" },
    { label: "Color Separation", href: "/services/raster-to-vector/color-separation" },
  ];

  return (
    <footer className="px-4 pb-6">
      <div className="max-w-full mx-auto bg-linear-to-t from-primary via-primary to-black/90 text-white rounded-2xl px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">

          {/* SHOP */}
          <div>
            <h4 className="font-semibold mb-4 uppercase text-sm">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/shop/all-products">All Products</Link></li>
              <li><Link href="#">Embroidery Digitizing</Link></li>
              <li><Link href="#">Raster to Vector</Link></li>
              <li><Link href="#">Custom Design</Link></li>
              <li><Link href="#">Pricing</Link></li>
              {rasterToVectorItems.map((item) => (
                <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="">
            <ul className="space-y-2 text-sm mt-9 text-gray-300">
              {embroideryItems.map((item) => (
                <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h4 className="font-semibold mb-4 uppercase text-sm">Help</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/blogs">Blogs</Link></li>
              <li><Link href="/FAQs">FAQs</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
              <li><Link href="/contact-us">Contact Us</Link></li>
            </ul>
                </div>

          {/* COMPANY */}
          <div>
            <h4 className="font-semibold mb-4 uppercase text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/about-us">About Us</Link></li>
              <li><Link href="/portfolio">Portfolio</Link></li>
              <li><Link href="/write-a-review">Write a Review</Link></li>
              <li><Link href="#">News & Updates</Link></li>
            </ul>
            <div className="mt-6 col-span-2 ">
              <p className="mb-2 text-sm font-medium">
              Get exclusive offers & updates
              </p>
              <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 px-4 pr-18 py-2 rounded-full text-sm text-white border border-white bg-transparent placeholder-gray-300"
                />
              <button className="bg-white text-primary px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                Submit
              </button>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="hidden lg:flex justify-center">
            <div className="w-0.5 bg-white h-full" />
          </div>

          {/* BRAND + NEWSLETTER */}
          <div className="">
            <Image src="/logo.jpeg" alt="AHdigitizing" width={120} height={40} />


            <div className="flex gap-4 mt-4 text-lg">
              <FaFacebookF />
              <FaInstagram />
              <FaYoutube />
              <FaLinkedinIn />
              <FaXTwitter />
            </div>
            <div className="mt-6 text-sm text-gray-300">
              <p className="font-medium text-white">We're here to help.</p>
              <p>Call Us: <span className="text-white">021 111 176 646</span></p>
              <p>Email: <span className="text-white">support@ahdigitizing.com</span></p>
            </div>

          </div>

        </div>
      </div>

      {/* BOTTOM */}
      <div className="text-center mt-4 text-xs text-gray-400 flex flex-col md:flex-row justify-between items-center gap-2">
        <span></span>
        © 2025 AHdigitizing. All rights reserved. <span className="text-right text-amber-100">Designed by Fourgo Team</span>
      </div>
    </footer>
  );
}
