"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    
    // New typography refs
    const topRef = useRef<HTMLDivElement>(null);
    const centerRef = useRef<HTMLHeadingElement>(null);
    const bottomRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!sectionRef.current || !videoRef.current || !topRef.current || !centerRef.current || !bottomRef.current) return;

        const video = videoRef.current;
        const section = sectionRef.current;

        const ctx = gsap.context(() => {
            // Force reset states for new structure
            gsap.set(topRef.current, { opacity: 0 });
            gsap.set(centerRef.current, { opacity: 0, y: 50 });
            gsap.set(bottomRef.current, { opacity: 0 });
            gsap.set(video, { currentTime: 0, opacity: 1 });

            const startAnimations = () => {
                const tl = gsap.timeline({
                    onComplete: () => initScroll()
                });

                // 1. Element 1 (Top) Fade In on Load
                tl.to(topRef.current, {
                    opacity: 1,
                    duration: 1,
                    ease: "power2.inOut"
                });

                // 2. Full Video Intro (Simulated play via currentTime)
                tl.to(video, {
                    currentTime: video.duration || 6.4,
                    duration: 4.5,
                    ease: "power2.inOut"
                }, 0);
            };

            const initScroll = () => {
                // Scroll-triggered Video scrub (0 to end)
                gsap.fromTo(video, 
                    { currentTime: 0 },
                    {
                        currentTime: video.duration || 6.4,
                        ease: "none",
                        overwrite: true,
                        scrollTrigger: {
                            trigger: section,
                            start: "top top",
                            end: "+=300vh",
                            scrub: 1.5,
                            pin: true,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        }
                    }
                );

                // Scroll-triggered Typography (Element 2 & 3)
                // Trigger exactly when scroll reaches 55% of the video duration
                // Video scroll is pinned for 300vh, so 55% of 300vh is 165vh.
                ScrollTrigger.create({
                    trigger: section,
                    start: "top -165%",
                    onEnter: () => {
                        // Element 2: Seu sorriso
                        gsap.to(centerRef.current, {
                            y: 0,
                            opacity: 1,
                            duration: 0.9,
                            ease: "power2.out"
                        });
                        // Element 3: ↓ descubra como
                        gsap.to(bottomRef.current, {
                            opacity: 1,
                            duration: 1,
                            delay: 0.7,
                            ease: "power2.out"
                        });
                    },
                    onLeaveBack: () => {
                        // Gently fade out when scrolling back up
                        gsap.to(centerRef.current, { y: 50, opacity: 0, duration: 0.5 });
                        gsap.to(bottomRef.current, { opacity: 0, duration: 0.5 });
                    }
                });
            };

            const primeAndStart = () => {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        video.pause();
                        video.currentTime = 0;
                        setTimeout(startAnimations, 50);
                    }).catch(() => {
                        startAnimations();
                    });
                } else {
                    startAnimations();
                }
            };

            // Start instantly on metadata load to prevent "taking too long"
            if (video.readyState >= 1) {
                primeAndStart();
            } else {
                video.addEventListener("loadedmetadata", primeAndStart, { once: true });
            }

            // Fallback to avoid black screen/stuck state
            const fallback = setTimeout(() => {
                if (gsap.getProperty(topRef.current, "opacity") === 0) {
                    primeAndStart();
                }
            }, 3500);

            // Preloader interaction
            window.dispatchEvent(new CustomEvent("hero-assets-loaded"));

            return () => {
                clearTimeout(fallback);
                video.removeEventListener("loadedmetadata", primeAndStart);
            };
        });

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="hero">
            <style>{`
                .hero {
                    position: relative;
                    min-height: 100svh;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    background: #000;
                    width: 100%;
                }

                .heroVideo {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center; 
                    filter: brightness(0.45) contrast(1.05) grayscale(100%);
                    z-index: 1; /* Ensured it's above the black background */
                    display: block;
                    opacity: 1 !important;
                    visibility: visible !important;
                }

                /* ELEMENT 1 (top) */
                .heroTop {
                    position: absolute;
                    top: 14%;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .heroPre {
                    margin: 0;
                    font-family: 'Playfair Display', serif;
                    font-weight: 300;
                    font-size: 12px;
                    letter-spacing: 0.4em;
                    color: rgba(255, 255, 255, 0.40);
                    text-transform: uppercase;
                }

                .heroSeparator {
                    width: 32px;
                    height: 1px;
                    background-color: rgba(255, 255, 255, 0.15);
                    margin: 14px auto 0;
                }

                /* ELEMENT 2 (center) */
                .heroCenter {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10;
                    width: 100%;
                    text-align: center;
                }

                .heroTitle {
                    margin: 0;
                    font-family: 'Playfair Display', serif;
                    font-weight: 700;
                    font-size: clamp(48px, 7.5vw, 88px);
                    letter-spacing: 0.02em;
                    line-height: 1.05;
                    color: #ffffff;
                }

                /* ELEMENT 3 (bottom) */
                .heroBottom {
                    position: absolute;
                    bottom: 9%;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10;
                    text-align: center;
                }

                .heroDescubra {
                    font-family: 'Inter', sans-serif;
                    font-weight: 300;
                    font-size: 10px;
                    letter-spacing: 0.35em;
                    color: rgba(255, 255, 255, 0.30);
                    text-transform: uppercase;
                    display: inline-block;
                }
            `}</style>

            <video 
                ref={videoRef}
                muted 
                playsInline 
                className="heroVideo"
                preload="auto"
            >
                <source src="/Aqui.mp4" type="video/mp4" />
            </video>

            <div ref={topRef} className="heroTop">
                <span className="heroPre">Sua origem</span>
                <div className="heroSeparator"></div>
            </div>

            <div className="heroCenter">
                <h1 ref={centerRef} className="heroTitle">Seu sorriso</h1>
            </div>

            <div className="heroBottom">
                <span ref={bottomRef} className="heroDescubra">↓ descubra como</span>
            </div>
        </section>
    );
}
