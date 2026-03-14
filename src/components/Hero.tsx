// Updated: 2026-03-12 - Reverted to Image Sequence for 'lindo vc'
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const FRAME_COUNT = 144;
const FRAME_PREFIX = "/assets/hero-lindo-vc/frame_";
const FRAME_SUFFIX = "_delay-0.041s.webp";

// Helper to format frame numbers
const getFramePath = (index: number) => {
    const paddedIndex = index.toString().padStart(3, "0");
    return `${FRAME_PREFIX}${paddedIndex}${FRAME_SUFFIX}`;
};

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const frameObj = useRef({ frame: 0 });

    useEffect(() => {
        setMounted(true);
        // Preload images
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = getFramePath(i);
            img.onload = () => {
                loadedCount++;
                if (loadedCount === FRAME_COUNT && canvasRef.current) {
                    // Draw first frame
                    renderFrame(0);
                }
            };
            loadedImages.push(img);
        }
        imagesRef.current = loadedImages;
    }, []);

    const renderFrame = (index: number) => {
        if (!canvasRef.current || !imagesRef.current[index]) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = imagesRef.current[index];
        if (!img.complete) return;

        // Best Practice: Match canvas internal coordinate system to the exact image size!
        // This avoids any quality loss from CSS pixel scaling on Retina/High-DPI screens.
        if (canvas.width !== img.width || canvas.height !== img.height) {
            canvas.width = img.width;
            canvas.height = img.height;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the crisp original image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Manual brightness/contrast via semi-transparent black overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    useEffect(() => {
        if (!mounted || !textContainerRef.current) return;

        // Set up infinite play loop for frames since autoplay logic is requested
        const playAnim = gsap.to(frameObj.current, {
            frame: FRAME_COUNT - 1,
            snap: "frame",
            ease: "none",
            duration: (FRAME_COUNT * 0.041), // Based on 0.041s delay per frame
            repeat: -1,
            onUpdate: () => {
                renderFrame(frameObj.current.frame);
            }
        });

        // Load-only fade-in — NO scroll triggers
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.to(textContainerRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, 0.2);

            if (document.querySelector(".phrase-1")) {
                tl.fromTo(".phrase-1",
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                0.4);
            }

            if (document.querySelector(".phrase-2")) {
                tl.fromTo(".phrase-2",
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
                0.6);
            }

            if (document.querySelector(".hero-subheadline")) {
                tl.fromTo(".hero-subheadline",
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                0.8);
            }

            if (document.querySelector(".hero-metrics-subtle")) {
                tl.fromTo(".hero-metrics-subtle",
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                1.0);
            }


        }, textContainerRef);

        return () => {
            ctx.revert();
            playAnim.kill();
                    <div className="hero-canvas-wrapper">
                        <canvas ref={canvasRef} className="hero-canvas" />
                    </div>
                    <div className="hero-overlay" />
                </div>
            </div>

            <div className="hero-container relative z-10 w-full h-full">
                {/* Text Column */}
                <div ref={textContainerRef} className="hero-text opacity-0 translate-y-8">
                    <div className="phrase-1 mb-[10px]">
                        <h1 className="text-[#F5F5F5] font-medium tracking-[0.4em] uppercase" style={{ 
                            fontFamily: 'var(--font-body), sans-serif',
                            fontSize: 'clamp(20px, 4vw, 32px)',
                            lineHeight: '1.0'
                        }}>
                            Sua origem
                        </h1>
                    </div>
                    
                    <div className="phrase-2 text-balance mb-[48px]">
                        <h2 className="text-[#E6D3A3] font-bold tracking-tight" style={{ 
                            fontFamily: '"Playfair Display", serif',
                            fontSize: 'clamp(46px, 9vw, 82px)', 
                            lineHeight: '1.0',
                            letterSpacing: '-0.015em'
                        }}>
                            Seu sorriso
                        </h2>
                    </div>

                    <div className="hero-subheadline mt-4 max-w-[280px] mx-auto hidden md:block">
                        <p className="text-white/30 text-[13px] md:text-xl font-light leading-relaxed tracking-[0.05em]">
                            A união entre a alta tecnologia alemã e a sensibilidade artística para criar resultados que transcendem a estética.
                        </p>
                    </div>

                    <div className="hero-metrics-subtle mt-8 md:mt-12 hidden md:flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4">
                        {[
                            { value: "785+", label: "Transformações" },
                            { value: "12+ Anos", label: "Experiência" },
                            { value: "4.9★", label: "Satisfação" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col">
                                <span className="text-white/80 font-medium text-lg md:text-xl tracking-tight">
                                    {item.value}
                                </span>
                                <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-medium">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="hero-btn-wrapper">
                    <button className="btn-luxury-primary group px-[48px] py-[14px] rounded-full border border-[#E6D3A3]/25 bg-[#1a1a1a]/40 backdrop-blur-md text-white tracking-[0.4em] font-medium text-[10px] hover:bg-[#E6D3A3]/10 hover:border-[#E6D3A3]/60 hover:shadow-[0_0_30px_rgba(230,211,163,0.2)] transition-all duration-700">
                        AGENDAR EXPERIÊNCIA
                    </button>
                </div>
            </div>
        </section>
    );
}
