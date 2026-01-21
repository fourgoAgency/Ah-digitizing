"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import TextType from "@/components/TextType";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export default function Banner() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [textStyle, setTextStyle] = useState({});
    const h2Ref = useRef<HTMLHeadingElement>(null);
    const [h2Text, setH2Text] = useState("Raster to Vector");
    const [hoveredButton, setHoveredButton] = useState<'shop' | 'quote' | null>(null);

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

    useEffect(() => {
        if (h2Ref.current) {
            const tl = gsap.timeline();
            tl.to(h2Ref.current, { y: -30, opacity: 0, duration: 0.3, ease: "power2.out" })
              .call(() => {
                  setH2Text(currentTextIndex === 0 ? "Raster to Vector" : "Embroidery digitizing");
              })
              .set(h2Ref.current, { y: 30 })
              .to(h2Ref.current, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
        }
    }, [currentTextIndex]);

    return (
        <section
        ref={sectionRef}
        className="relative rounded-3xl mx-4 my-7 drop-shadow-xl drop-shadow-black bg-linear-to-b from-primary via-primary to-gray-800 overflow-hidden justify-center items-center pt-8 pb-2 px-5"
        >


            <div className="max-w-full pl-9 ">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-20 justify-center items-center min-h-125">
                    {/* Left Content */}
                    <div ref={contentRef} className="flex flex-col justify-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            Experience Ultimate Luxury and Wellness with&nbsp; <br/>
                            <span className="text-secondary" style={{ WebkitTextStroke: '0.4px white' }}>
                                <TextType
                                    text={["Ah Digitizing", "Ah Digitizing"]}
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
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <Button
                                className={`border shadow-xl rounded-full px-10 transition-all duration-200 bg-transparent ${
                                    hoveredButton === 'shop'
                                        ? 'bg-secondary text-white border-secondary'
                                        : hoveredButton === 'quote'
                                        ? 'bg-white text-secondary border-white'
                                        : 'border-white text-white'
                                }`}
                                onMouseEnter={() => setHoveredButton('shop')}
                                onMouseLeave={() => setHoveredButton(null)}
                            >
                                Shop Now
                            </Button>
                            <Button
                                className={`border shadow-xl rounded-full px-10 transition-all duration-200 ${
                                    hoveredButton === 'quote'
                                        ? 'bg-white text-white border-white'
                                        : hoveredButton === 'shop'
                                        ? 'bg-white text-secondary border-white'
                                        : 'bg-white text-primary border-white'
                                }`}
                                onMouseEnter={() => setHoveredButton('quote')}
                                onMouseLeave={() => setHoveredButton(null)}
                            >
                                Get Quote
                            </Button>
                        </div>

                    </div>

                    {/* Right Image */}
                    <div
                        ref={imageRef}
                        className="hidden lg:flex flex-col justify-center items-center xl:py-16 md:mt-0"
                    >
                        <h2 ref={h2Ref} className="text-white font-bold text-4xl mb-6">{h2Text}</h2>
                        <div className="w-80 h-80 md:w-105 md:h-105 drop-shadow-2xl">

                            <Image
                                src={currentTextIndex === 0 ? "/home-page/portfolio-vector/1st.jpg" : "/home-page/portfolio-embroidery/1st.jpg"}
                                alt="Premium Digitizing Product"
                                width={600}
                                height={500}
                                className="w-full h-full object-fill rounded-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
