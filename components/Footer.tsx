'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import logo from '@/../public/logo/logo1.png'

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden text-white bg-gradient-to-br from-teal-800/90 via-teal-700/80 to-teal-600/80 backdrop-blur-lg border-t border-white/10"
      role="contentinfo"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-10 relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
          
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Image
              src={logo}
              alt="FourGo Agency Logo"
              width={180}
              height={60}
              priority
              className="mb-4 select-none"
            />
            <p className="text-sm opacity-90 max-w-xs">
              Innovate, Design & Grow with FourGo — your trusted creative partner for digital success.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-5">
              {[
                { icon: <FaFacebookF />, href: 'https://www.facebook.com/profile.php?id=61582074620117' },
                { icon: <FaInstagram />, href: 'https://www.instagram.com/fourgo04?igsh=MTloMDdsOWRpbzJ1bw==' },
                { icon: <FaLinkedinIn />, href: '#' },
                { icon: <FaWhatsapp />, href: 'https://wa.me/+923353123932?text=Can%20you%20tell%20me%20more%20about%20your%20services%3F' }
              ].map((s, i) => (
                <Link
                  key={i}
                  href={s.href}
                  target="_blank"
                  aria-label="Social link"
                  className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 hover:text-teal-200 transition-all duration-500 hover:scale-110 hover:rotate-6"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Menu */}
          <nav aria-label="Footer navigation">
            <h3 className="text-lg font-semibold mb-4 tracking-wide">Menu</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/services', label: 'Services' },
                { href: '/contact', label: 'Contact' }
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative inline-block hover:text-teal-200 transition-colors after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-teal-200 after:transition-all after:duration-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 tracking-wide">Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services/web-design" className="hover:text-teal-200 transition-colors">Web Design & Development</Link></li>
              <li><Link href="/services/graphic-design" className="hover:text-teal-200 transition-colors">Graphic Designing</Link></li>
              <li><Link href="/services/e-commerce" className="hover:text-teal-200 transition-colors">E-commerce Store Management</Link></li>
              <li><Link href="/services/digital-marketing" className="hover:text-teal-200 transition-colors">Digital Marketing</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <address className="not-italic">
            <h3 className="text-lg font-semibold mb-4 tracking-wide">Contact Info</h3>
            <p className="text-sm opacity-90 mb-2">Let’s build something amazing together!</p>
            <p className="text-sm mb-2">
               <Link href="https://wa.me/+923353123932" className="hover:text-teal-200">+44 7935 676694</Link> , <Link href="https://wa.me/03353123932" className="hover:text-teal-200">0335 3123932</Link>
            </p>
            <p className="text-sm mb-2">
               <Link href="mailto:fourgo.agency@gmail.com" className="hover:text-teal-200">fourgo.agency@gmail.com</Link>
            </p>
            <p className="text-sm opacity-90"> Karachi, Pakistan</p>
          </address>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-white/20 mt-14 pt-6 text-center text-xs md:text-sm opacity-80">
          <p>© {new Date().getFullYear()} <strong>FourGo Agency</strong>. All rights reserved.</p>
          <div className="mt-2 space-x-5">
            <Link href="/privacy-policy" className="hover:text-teal-200 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-teal-200 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
