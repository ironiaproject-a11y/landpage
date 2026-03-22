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
    const preRef = useRef<HTMLParagraphElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (!sectionRef.current || !videoRef.current || !preRef.current || !titleRef.current) return;

        const video = videoRef.current;
        const section = sectionRef.current;
        const pre = preRef.current;
        const title = titleRef.current;

        const ctx = gsap.context(() => {
            let scrollTriggerCreated = false;
            gsap.set([pre, title], { opacity: 0, y: 30 });

            // ─── SCROLL SCRUB ────────────────────────────────────────────
            const initScroll = () => {
                if (scrollTriggerCreated) return;
                if (!video.duration || isNaN(video.duration)) {
                    video.addEventListener("loadedmetadata", initScroll, { once: true });
                    return;
                }
                scrollTriggerCreated = true;
                gsap.to(video, {
                    currentTime: video.duration,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: "+=300vh",
                        scrub: 2,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    }
                });
            };

            // ─── ENTRY ANIMATION ──────────────────────────────────────────
            const startAnimations = () => {
                const tl = gsap.timeline({ onComplete: initScroll });
                
                // Reset state
                gsap.set(pre, { opacity: 0, y: 20, "--mask-p": "0%" });
                gsap.set(title, { opacity: 0, y: 20 });

                // 1. Reveal "Sua origem"
                tl.to(pre, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, "+=0.5");
                
                // 2. Start Video Transformation (Skull to Smile)
                // Assuming the transformation happens between 0s and 3.2s
                tl.to(video, { currentTime: 3.2, duration: 3, ease: "slow(0.7, 0.7, false)" }, "-=0.5");
                
                // 3. Subtle mask wipe for "Sua origem" as it transitions
                tl.to(pre, { opacity: 0, y: -10, duration: 1, ease: "power2.inIn" }, "-=1.5");
                
                // 4. Powerful reveal of "Seu sorriso"
                tl.to(title, { opacity: 1, y: 0, duration: 1.5, ease: "expo.out" }, "-=0.8");
            };

            // ─── VIDEO ACTIVATION ─────────────────────────────────────────
            // Canonical GSAP video scrub pattern:
            // play() → browser decodes first frame → pause() → reset → GSAP takes over
            const activateVideo = () => {
                video.currentTime = 0;
                const playPromise = video.play();

                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        video.pause();
                        video.currentTime = 0;
                        startAnimations();
                    }).catch(() => {
                        // Autoplay blocked — fall back to canplay event
                        video.addEventListener("canplay", startAnimations, { once: true });
                    });
                } else {
                    startAnimations();
                }
            };

            // Wait for metadata at minimum before trying to play
            if (video.readyState >= 1) {
                activateVideo();
            } else {
                video.addEventListener("loadedmetadata", activateVideo, { once: true });
            }

            // Safety fallback
            const fallback = setTimeout(() => {
                if (gsap.getProperty(pre, "opacity") === 0) startAnimations();
            }, 4000);

            window.dispatchEvent(new CustomEvent("hero-assets-loaded"));

            return () => {
                clearTimeout(fallback);
                video.removeEventListener("loadedmetadata", activateVideo);
                video.removeEventListener("canplay", startAnimations);
                video.removeEventListener("loadedmetadata", initScroll);
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
                    /* Brightness ajustado para garantir visibilidade máxima */
                    filter: brightness(1.1) contrast(1.1);
                    z-index: 1;
                    display: block;
                    opacity: 1 !important;
                    visibility: visible !important;
                }

                .heroCopy {
                    position: relative;
                    z-index: 10; /* Far above the video */
                    width: min(600px, 90vw);
                    margin-left: clamp(24px, 8vw, 96px);
                    transform: translateY(-4vh);
                }

                .heroPre {
                    display: block;
                    margin: 0 0 1rem 0;
                    font-family: 'Playfair Display', serif;
                    font-style: italic;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    font-size: clamp(0.9rem, 1.5vw, 1.1rem);
                    color: rgba(255, 255, 255, 0.7);
                    --mask-p: 0%;
                    mask-image: linear-gradient(to right, transparent var(--mask-p), black calc(var(--mask-p) + 20%));
                    -webkit-mask-image: linear-gradient(to right, transparent var(--mask-p), black calc(var(--mask-p) + 20%));
                }

                .heroTitle {
                    margin: 0;
                    font-family: 'Inter', sans-serif;
                    font-weight: 900;
                    font-style: normal;
                    text-transform: uppercase;
                    color: #ffffff;
                    font-size: clamp(3.2rem, 11vw, 5.5rem);
                    line-height: 1;
                    filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
                }

                @media (max-width: 768px) {
                    .heroCopy {
                        width: min(340px, 88vw);
                        margin-left: 6vw;
                    }
                }
            `}</style>

            <video 
                ref={videoRef}
                muted 
                playsInline
                className="heroVideo"
                preload="auto"
                loop
            >
                <source src="/Aqui.mp4" type="video/mp4" />
            </video>

            <div className="heroCopy">
                <span ref={preRef} className="heroPre">Sua origem</span>
                <h1 ref={titleRef} className="heroTitle">Seu sorriso</h1>
            </div>
        </section>
    );
}
