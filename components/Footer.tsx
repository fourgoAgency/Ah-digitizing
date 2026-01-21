import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand & Newsletter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image src="/logo.jpeg" alt="AHdigitizing Logo" width={40} height={40} />
            <span className="font-semibold text-lg">AHdigitizing</span>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Your trusted partner for professional embroidery digitizing and vector art services.
          </p>

          <h4 className="font-medium mb-2">Newsletter</h4>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-transparent hover:text-primary border-2 border-primary transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        {/* About */}
        <div>
          <h4 className="font-semibold mb-4">About</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/about-us">About Us</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/write-a-review">Write a Review</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/services/embroidery-digitizing">Embroidery Digitizing</Link></li>
            <li><Link href="/services/raster-to-vector">Raster to Vector</Link></li>
            <li><Link href="/services/custom-design">Custom Design</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li><Link href="/contact-us">Contact Us</Link></li>
            <li><Link href="/FAQs">FAQ</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms-and-conditions">Terms of Service</Link></li>
          </ul>

          <div className="flex gap-3">
            <a className="p-2 border rounded hover:bg-blue-600 hover:text-white">
              <FaFacebookF size={14} />
            </a>
            <a className="p-2 border rounded hover:bg-blue-600 hover:text-white">
              <FaTwitter size={14} />
            </a>
            <a className="p-2 border rounded hover:bg-blue-600 hover:text-white">
              <FaInstagram size={14} />
            </a>
            <a className="p-2 border rounded hover:bg-blue-600 hover:text-white">
              <FaLinkedinIn size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 text-center pt-4 text-sm text-gray-500">
        © 2025 AhDigitzing. All rights reserved.
      </div>
        <span className="bottom-0 text-right text-xs text-gray-300">By fourgo team</span>
    </footer>
  );
}
