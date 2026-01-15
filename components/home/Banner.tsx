"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import TextType from "@/components/TextType";

gsap.registerPlugin(ScrollTrigger);

export default function Banner() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [textStyle, setTextStyle] = useState({});

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Animate content on scroll
            gsap.from(contentRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
                opacity: 0,
                x: -50,
                duration: 1,
                ease: "power3.out",
            });

            // Animate image on scroll
            gsap.from(imageRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
                opacity: 0,
                x: 50,
                duration: 1,
                ease: "power3.out",
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (imageRef.current) {
            gsap.fromTo(imageRef.current, {
                y: -50,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out"
            });
        }
    }, [currentTextIndex]);

    return (
        <section
            ref={sectionRef}
            className="relative bg-primary overflow-hidden pt-16 pb-32"
        >
            <svg
                className="absolute bottom-0 left-0 right-0 w-full h-20"
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
            >
                <path
                    d="M0,40 Q360,0 720,40 T1440,40 L1440,120 L0,120 Z"
                    fill="white"
                    opacity="1"
                />
            </svg>

            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-125">
                    {/* Left Content */}
                    <div ref={contentRef} className="flex flex-col justify-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            Experience Ultimate Luxury and Wellness with&nbsp;
                            <span className="text-secondary" style={{ WebkitTextStroke: '0.4px white' }}>
                                <TextType
                                    text={["AH Digitizing", "AH Vector"]}
                                    typingSpeed={75}
                                    pauseDuration={4000}
                                    showCursor={true}
                                    cursorCharacter="|"
                                    onSentenceComplete={(sentence, index) => setCurrentTextIndex(index)}
                                />
                            </span>
                        </h1>

                        <p className="text-white/90 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                            Welcome to AH Digitizing, your oasis for premium digitization services. Our mission is to elevate your designs through meticulous attention to detail, transforming your vision into exquisite reality from the very first stitch.
                        </p>

                        {/* CTA Buttons */}
                        <div className="group flex flex-col sm:flex-row gap-4 mb-8">

                            <button
                                className="px-8 py-3 bg-secondary text-white
      group-hover:bg-white group-hover:text-primary
      font-bold rounded-lg transition-all duration-300 transform hover:scale-105 uppercase text-sm tracking-wider">
                                Shop Now
                            </button>

                            <button
                                className="px-8 py-3 border-2 border-white text-white
      group-hover:bg-secondary group-hover:text-white
      font-bold rounded-lg transition-all duration-300 group-hover:border-transparent transform hover:scale-105 uppercase text-sm tracking-wider">
                                Order Today
                            </button>

                        </div>

                    </div>

                    {/* Right Image */}
                    <div
                        ref={imageRef}
                        className="flex justify-center lg:justify-end relative"
                    >
                        <div className="relative w-64 h-96 md:w-125 md:h-125 drop-shadow-2xl">
                            <Image
                                src={currentTextIndex === 0 ? "/home-page/portfolio-vector/1st.jpg" : "/home-page/portfolio-embroidery/1st.jpg"}
                                alt="Premium Digitizing Product"
                                width={900}
                                height={500}
                                className="w-full h-full object-fill rounded-2xl "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
