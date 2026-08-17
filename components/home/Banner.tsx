"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
    const h2Ref = useRef<HTMLHeadingElement>(null);
    const [h2Text, setH2Text] = useState("Embroidery digitizing");
    const [hoveredButton, setHoveredButton] = useState<'contact' | 'login' | null>(null);

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
                  setH2Text(currentTextIndex === 0 ? "Embroidery digitizing" : "Raster to Vector");
              })
              .set(h2Ref.current, { y: 30 })
              .to(h2Ref.current, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
        }
    }, [currentTextIndex]);

    return (
        <section
        ref={sectionRef}
        className="relative z-30 mx-4 mb-0 mt-7 overflow-hidden rounded-[2rem] bg-linear-to-b from-primary via-primary to-gray-800 px-5 pt-8 drop-shadow-xl drop-shadow-black"
        >
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-primary/20 to-slate-950/85" />


            <div className="max-w-full pl-0 md:pl-9 ">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-20 justify-center items-center min-h-125">
                    {/* Left Content */}
                    <div ref={contentRef} className="flex flex-col justify-center">
                        <h1 className="text-xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-4 leading-tight">
                            Precision Embroidery Digitizing-Every Design, Perfectly Stitched <br/>
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
                            <b>100% Manually Digitized</b>, We turn your logo into a flawless, production-ready Embroidery file with <b>accurate push-pull compensation</b>, clean stitches, zero gaps, and no thread breaks, So it runs perfectly every single time.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <Button
                                asChild
                                className={`border shadow-xl cursor-pointer rounded-full px-10 transition-all duration-200 bg-transparent ${
                                    hoveredButton === 'contact'
                                        ? 'bg-secondary text-white border-secondary'
                                        : hoveredButton === 'login'
                                        ? 'bg-white text-secondary border-white'
                                        : 'border-white text-white'
                                }`}
                                onMouseEnter={() => setHoveredButton('contact')}
                                onMouseLeave={() => setHoveredButton(null)}
                            >
                                <Link href="/contact-us">Contact</Link>
                            </Button>
                            <Button
                                asChild
                                className={`border shadow-xl cursor-pointer rounded-full px-10 transition-all duration-200 ${
                                    hoveredButton === 'login'
                                        ? 'bg-white text-white border-white'
                                        : hoveredButton === 'contact'
                                        ? 'bg-white text-secondary border-white'
                                        : 'bg-white text-primary border-white'
                                }`}
                                onMouseEnter={() => setHoveredButton('login')}
                                onMouseLeave={() => setHoveredButton(null)}
                            >
                                <Link href="/login">Login</Link>
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
                                src={currentTextIndex === 0 ? "/home-page/Embroidery.png" : "/home-page/Vector.png"}
                                alt="Premium Digitizing Product"
                                width={600}
                                height={500}
                                className="w-full h-full object-fill rounded-2xl bg-white"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
