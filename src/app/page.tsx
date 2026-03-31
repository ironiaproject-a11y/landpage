"use client";

import nextDynamic from "next/dynamic";
import { useRef, useEffect, useState } from "react";
import { ServicesSkeleton, CaseStudiesSkeleton, TestimonialsSkeleton } from "@/components/SectionSkeletons";
import { InstitutionalTrust } from "@/components/InstitutionalTrust";
import { Agendamento } from "@/components/Agendamento";
import { PremiumReveal } from "@/components/PremiumReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ─── register gsap ─────────────────────────────────────────── */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { TrustBar } from "@/components/TrustBar";

const About = nextDynamic(() => import("@/components/About").then(mod => mod.About), { ssr: false, loading: () => <div className="h-screen bg-[#0D0D0D]" /> });
const CaseStudies = nextDynamic(() => import("@/components/CaseStudies").then(mod => mod.CaseStudies), { ssr: false, loading: () => <CaseStudiesSkeleton /> });
const Specialist = nextDynamic(() => import("@/components/Specialist").then(mod => mod.Specialist), { ssr: false, loading: () => <div className="h-screen bg-[#0D0D0D]" /> });
const Experience = nextDynamic(() => import("@/components/Experience").then(mod => mod.Experience), { ssr: false, loading: () => <div className="h-screen bg-[#0D0D0D]" /> });
const Amenities = nextDynamic(() => import("@/components/Amenities").then(mod => mod.Amenities), { ssr: false, loading: () => <div className="h-screen bg-[#0D0D0D]" /> });
const Testimonials = nextDynamic(() => import("@/components/Testimonials").then(mod => mod.Testimonials), { ssr: false, loading: () => <TestimonialsSkeleton /> });
const FAQ = nextDynamic(() => import("@/components/FAQ").then(mod => mod.FAQ), { ssr: false, loading: () => <div className="h-40 bg-[#0D0D0D]" /> });
const Footer = nextDynamic(() => import("@/components/Footer").then(mod => mod.Footer), { ssr: false });

export default function Home() {
  const triggerRef    = useRef<HTMLDivElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const videoRef      = useRef<HTMLVideoElement>(null);
  const originTextRef = useRef<HTMLParagraphElement>(null);
  const smileTextRef  = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const video    = videoRef.current;
    const trigger  = triggerRef.current;
    const container = containerRef.current;
    const origin   = originTextRef.current;
    const smile    = smileTextRef.current;

    if (!video || !trigger || !container || !origin || !smile) return;

    // Mobile Optimizations
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");

    const ctx = gsap.context(() => {
      let isInit = false;

      const initScroll = () => {
        if (isInit) return;
        
        // Duration Guard
        if (!video.duration || isNaN(video.duration)) {
          video.addEventListener("loadedmetadata", initScroll, { once: true });
          return;
        }
        isInit = true;

        const duration = video.duration;

        // ── SCROLL TRIGGER — NATIVE STICKY ────────────────────────────────
        // We use the triggerRef (300vh) to define the scroll area.
        // The containerRef is just .sticky top-0.
        
        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: trigger,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            invalidateOnRefresh: true,
          }
        });

        // 1. Video Scrub
        mainTl.to(video, { currentTime: duration, ease: "none" }, 0);

        // 2. Typography Stagger
        // "Sua Origem" fades early
        mainTl.fromTo(origin, 
          { opacity: 1, y: 0 }, 
          { opacity: 0, y: -20, ease: "power1.inOut" }, 0
        );

        // "Seu Sorriso" fades in late
        mainTl.fromTo(smile, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, ease: "power2.out" }, 0.6
        );

        // 3. Section Fade Out at the very end
        mainTl.to(container, { opacity: 0, scale: 0.98, filter: "blur(20px)", ease: "power1.in" }, 0.9);

        // ── CINEMATIC INTRO (AUTOPLAY FALLBACK) ───────────────────────────
        // If the user doesn't scroll, we auto-play the intro.
        const introTl = gsap.to(window, {
          scrollTo: { y: ScrollTrigger.maxScroll(window) * 0.1, autoKill: true },
          duration: 3,
          ease: "power2.inOut",
          delay: 0.5,
          onStart: () => {
            gsap.to(video, { opacity: 1, duration: 1.2 });
            window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
          }
        });

        // Interaction handoff
        const stopIntro = () => {
          introTl.kill();
          video.play().catch(() => {});
          window.removeEventListener("wheel", stopIntro);
          window.removeEventListener("touchstart", stopIntro);
        };
        window.addEventListener("wheel", stopIntro, { passive: true, once: true });
        window.addEventListener("touchstart", stopIntro, { passive: true, once: true });

        ScrollTrigger.refresh();
      };

      if (video.readyState >= 1) {
        initScroll();
      } else {
        video.addEventListener("loadedmetadata", initScroll, { once: true });
      }

      // Sync Lenis (exposes window.lenis)
      const rafId = requestAnimationFrame(() => {
        const lenis = (window as any).lenis;
        if (lenis) {
          lenis.resize();
          lenis.start();
        }
        ScrollTrigger.refresh();
      });

      return () => cancelAnimationFrame(rafId);
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="w-full bg-[#0D0D0D] overflow-x-clip">
      
      {/* ── STICKY TRIGGER AREA (300vh) ── */}
      <div 
        ref={triggerRef} 
        className="hero-trigger" 
        style={{ height: "320vh", position: "relative", zIndex: 10 }}
      >
        {/* ── STICKY CONTENT (100vh) ── */}
        <div 
          ref={containerRef} 
          className="sticky top-0 w-full h-screen overflow-hidden bg-black flex items-center justify-center"
        >
          {/* Main Video */}
          <video
            ref={videoRef}
            muted
            playsInline
            controls={false}
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.4] contrast-[1.1] grayscale-[0.2]"
            style={{ willChange: "currentTime, opacity" }}
          >
            <source src="/Aqui.mp4" type="video/mp4" />
          </video>

          {/* Gradients */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-transparent" />

          {/* Typography */}
          <div className="relative z-20 text-center px-6">
            <div className="flex flex-col items-center">
              <p ref={originTextRef} className="text-[var(--color-accent-gold)] font-sans text-xs sm:text-sm tracking-[0.4em] uppercase mb-6">
                Sua Origem,
              </p>
              <h1 ref={smileTextRef} className="text-white font-serif text-5xl sm:text-7xl md:text-8xl italic font-light tracking-tight">
                Seu sorriso<span className="text-[var(--color-accent-gold)]">.</span>
              </h1>
            </div>

            <div className="mt-16 flex flex-col items-center gap-8">
              <PremiumReveal type="fade" direction="bottom" delay={0.6}>
                <p className="text-white/60 font-sans text-sm sm:text-base tracking-widest uppercase">
                  Odontologia de alta performance
                </p>
              </PremiumReveal>
              <PremiumReveal type="fade" direction="bottom" delay={0.8}>
                <a href="#agendamento" className="px-10 py-4 border border-white/10 bg-white/5 backdrop-blur-md rounded-full text-white text-xs tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500">
                  AGENDAR CONSULTA →
                </a>
              </PremiumReveal>
            </div>
          </div>
        </div>
      </div>

      {/* ── NEXT SECTIONS ── */}
      <div className="relative z-30 bg-[#0D0D0D]">
        <Stats />
        <Services />
        <TrustBar />
        <InstitutionalTrust />
        <About />
        <Specialist />
        <Experience />
        <Amenities />
        <CaseStudies />
        <Testimonials />
        <FAQ />
        <Agendamento />
        <Footer />
      </div>

      {/* Global CSS for sticky support and controls hiding */}
      <style jsx global>{`
        .hero-trigger {
          contain: paint;
        }
        video::-webkit-media-controls { display: none !important; }
        video::-webkit-media-controls-enclosure { display: none !important; }
        video::-webkit-media-controls-panel { display: none !important; }
      `}</style>
    </main>
  );
}
