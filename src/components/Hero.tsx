"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { m } from "framer-motion";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const visualRef = useRef<HTMLDivElement>(null);
    const preRef = useRef<HTMLSpanElement>(null);
    const titleRef = useRef<HTMLSpanElement>(null);
    const [isIntroDone, setIsIntroDone] = useState(false);
    
    const framesRef = useRef<HTMLImageElement[]>([]);
    const frameObj = useRef({ index: 0 });
    const totalFrames = 145;

    useEffect(() => {
        if (!sectionRef.current || !canvasRef.current || !preRef.current || !titleRef.current) return;

        const section = sectionRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const pre = preRef.current;
        const title = titleRef.current;

        if (!context) return;

        const ctx = gsap.context(() => {
            // Preload 145 frames
            const preloadFrames = () => {
                for (let i = 0; i < totalFrames; i++) {
                    const img = new Image();
                    img.src = `/hero-frames/frame_${i.toString().padStart(3, '0')}_delay-0.041s.png`;
                    framesRef.current[i] = img;
                }
            };

            const renderFrame = (index: number) => {
                const img = framesRef.current[Math.floor(index)];
                if (img && img.complete) {
                    const { width, height } = canvas;
                    const imgRatio = img.width / img.height;
                    const canvasRatio = width / height;
                    let drawWidth, drawHeight, offsetX, offsetY;

                    if (imgRatio > canvasRatio) {
                        drawHeight = height;
                        drawWidth = height * imgRatio;
                        offsetX = (width - drawWidth) / 2;
                        offsetY = 0;
                    } else {
                        drawWidth = width;
                        drawHeight = width / imgRatio;
                        offsetX = 0;
                        offsetY = (height - drawHeight) / 2;
                    }

                    context.clearRect(0, 0, width, height);
                    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                }
            };

            const handleResize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                renderFrame(frameObj.current.index);
            };

            // SCROLL ANIMATION: Sync canvas index and text exit
            const initScroll = () => {
                const lenis = (window as any).lenis;
                if (lenis) lenis.start();

                setIsIntroDone(true);

                const scrollTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1.2, // smoother scrub
                        pin: visualRef.current,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    }
                });

                // Scrub canvas
                scrollTl.to(frameObj.current, {
                    index: totalFrames - 1,
                    ease: "none",
                    onUpdate: () => renderFrame(frameObj.current.index)
                }, 0);

                // Exit title1 (Sua origem)
                scrollTl.fromTo(pre, 
                    { opacity: 1, y: 0, filter: "blur(0px)" },
                    { opacity: 0, y: -60, filter: "blur(20px)", ease: "power2.inOut" }, 
                    0
                );

                // Enter title2 (Seu sorriso) - modified to match page.tsx logic
                scrollTl.fromTo(title, 
                    { opacity: 0, y: 60, clipPath: "inset(100% 0 0 0)" },
                    { opacity: 1, y: 0, clipPath: "inset(0% 0 -20% 0)", ease: "power3.out" }, 
                    0.1
                );
            };

            // ENTRY ANIMATION
            const startAnimations = () => {
                const lenis = (window as any).lenis;
                if (lenis) lenis.stop();
                
                const tl = gsap.timeline({ onComplete: initScroll });
                
                // Initial state
                gsap.set(pre, { opacity: 0, y: 20 });
                gsap.set(title, { opacity: 0, y: 60 }); 
                
                // 1. Entrance of "Sua origem" and canvas fast-forward to frame 80
                tl.to(frameObj.current, { 
                    index: 80, 
                    duration: 3, 
                    ease: "slow(0.7, 0.7, false)",
                    onUpdate: () => renderFrame(frameObj.current.index)
                }, 0);
                
                tl.fromTo(pre, 
                    { opacity: 0, filter: 'blur(12px)', y: 20 },
                    { opacity: 1, filter: 'blur(0px)', y: 0, duration: 2, ease: "power2.out" }, 
                    "-=2"
                );
            };

            preloadFrames();
            window.addEventListener("resize", handleResize);
            handleResize();

            // Handle preloader
            const checkPreloaderSequence = () => {
                const firstFrame = framesRef.current[0];
                if (firstFrame) {
                    if (firstFrame.complete) {
                        renderFrame(0);
                        startAnimations();
                    } else {
                        firstFrame.onload = () => {
                            renderFrame(0);
                            startAnimations();
                        };
                    }
                }
            };

            // Fallback in case the preloader event already fired before mount
            const preloaderFallback = setTimeout(() => {
                checkPreloaderSequence();
            }, 3000); // Max delay just to guarantee it starts

            const onPreloaderFinished = () => {
                clearTimeout(preloaderFallback);
                checkPreloaderSequence();
            };

            window.addEventListener("preloader-finished", onPreloaderFinished);
            
            // Dispatch that hero is technically loaded
            window.dispatchEvent(new CustomEvent("hero-assets-loaded"));

            return () => {
                clearTimeout(preloaderFallback);
                window.removeEventListener("resize", handleResize);
                window.removeEventListener("preloader-finished", onPreloaderFinished);
            };
        });

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full h-[250vh] bg-black text-white m-0 p-0 border-none z-10">
            {/* Visual Container */}
            <div ref={visualRef} className="absolute top-0 left-0 w-[100vw] h-[100vh] overflow-hidden flex items-center justify-center pointer-events-none">
                <canvas 
                    ref={canvasRef} 
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 filter brightness-110 contrast-110" 
                />
                <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black/40 z-0 m-0 p-0 border-none pointer-events-none" />
                
                {/* Text Overlay */}
                <div className="absolute top-0 left-0 w-[100vw] h-[100vh] flex flex-col justify-center items-center px-4 md:px-24 z-10 pointer-events-none">
                    <div className="w-full max-w-[1600px] mx-auto flex justify-center translate-y-[-10vh]">
                        <h1 className="flex flex-col text-center items-center w-full">
                            <span 
                                ref={preRef}
                                style={{ fontFamily: 'var(--font-sans)', opacity: 0 }} 
                                className="text-[14px] lg:text-[clamp(1.75rem,5vw,4rem)] font-[400] text-[rgba(255,255,255,0.55)] lg:text-white/90 leading-tight lg:leading-[0.95] tracking-[3px] lg:tracking-[5px] uppercase mb-2 lg:mb-4 text-center block"
                            >
                                Sua origem,
                            </span>
                            <span 
                                ref={titleRef}
                                style={{ fontFamily: 'var(--font-serif)', opacity: 0 }} 
                                className="text-[48px] lg:text-[clamp(3.75rem,11vw,10rem)] font-[300] text-[#ffffff] leading-[1.1] lg:leading-[0.95] tracking-normal lowercase first-letter:uppercase text-center block"
                            >
                                Seu sorriso.
                            </span>
                        </h1>
                    </div>
                </div>

                {/* CTA Button */}
                <m.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isIntroDone ? 1 : 0 }}
                    className="absolute bottom-0 left-0 w-[100vw] h-[100px] flex justify-center items-center z-20 pointer-events-none"
                >
                    <a style={{ fontFamily: 'var(--font-sans)' }} href="#sobre" className="inline-flex items-center justify-center bg-transparent border border-[rgba(255,255,255,0.25)] rounded-full px-[32px] py-[10px] hover:bg-white/10 transition-colors z-20 whitespace-nowrap text-[rgba(255,255,255,0.7)] text-[12px] tracking-[4px] font-[400] uppercase backdrop-blur-md pointer-events-auto">
                        AGENDAR CONSULTA &rarr;
                    </a>
                </m.div>
            </div>
        </section>
    );
}
