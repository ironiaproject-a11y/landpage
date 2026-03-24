"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const preRef = useRef<HTMLParagraphElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    
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
            // ÔöÇÔöÇÔöÇ FRAME PRELOADING ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
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

            // ÔöÇÔöÇÔöÇ SCROLL ANIMATION ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
            const initScroll = () => {
                gsap.to(frameObj.current, {
                    index: totalFrames - 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: "bottom top",
                        scrub: 0.5,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                    onUpdate: () => renderFrame(frameObj.current.index)
                });
            };

            // ÔöÇÔöÇÔöÇ ENTRY ANIMATION ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
            const startAnimations = () => {
                const tl = gsap.timeline({ onComplete: initScroll });
                
                gsap.set(pre, { opacity: 0, y: 20 });
                gsap.set(title, { opacity: 0, y: 20 });

                tl.to(pre, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, "+=0.5");
                
                tl.to(frameObj.current, { 
                    index: 80, 
                    duration: 3, 
                    ease: "power2.inOut",
                    onUpdate: () => renderFrame(frameObj.current.index)
                }, "-=0.5");
                
                tl.to(pre, { opacity: 0, y: -10, duration: 1, ease: "power2.inIn" }, "-=1.5");
                
                tl.to(title, { opacity: 1, y: 0, duration: 1.5, ease: "expo.out" }, "-=0.8");
            };

            preloadFrames();
            window.addEventListener("resize", handleResize);
            handleResize();

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

            window.dispatchEvent(new CustomEvent("hero-assets-loaded"));

            return () => {
                window.removeEventListener("resize", handleResize);
            };
        });

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="hero">
            <style jsx>{`
                .hero {
                    position: relative;
                    width: 100%;
                    height: 300vh;
                    background: #000;
                    overflow: visible;
                }
                .heroVisual {
                    position: sticky;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .heroCanvas {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: brightness(1.1) contrast(1.1);
                    z-index: 1;
                }
                .heroCopy {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10;
                    text-align: center;
                    width: 100%;
                    pointer-events: none;
                }
                .heroPre {
                    display: block;
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1rem, 2vw, 1.5rem);
                    text-transform: uppercase;
                    letter-spacing: 0.4em;
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 2rem;
                    opacity: 0;
                }
                .heroTitle {
                    font-family: 'Inter', sans-serif;
                    font-size: clamp(3rem, 12vw, 12rem);
                    font-weight: 700;
                    line-height: 0.9;
                    color: #fff;
                    margin: 0;
                    opacity: 0;
                    white-space: nowrap;
                    text-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                }
            `}</style>

            <div className="heroVisual">
                <canvas ref={canvasRef} className="heroCanvas" />
            </div>

            <div className="heroCopy">
                <span ref={preRef} className="heroPre">Sua origem</span>
                <h1 ref={titleRef} className="heroTitle">Seu sorriso</h1>
            </div>
        </section>
    );
}
