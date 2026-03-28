"use client";

import nextDynamic from "next/dynamic";
import { useRef, useEffect } from "react";
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
const About = nextDynamic(() => import("@/components/About").then(mod => mod.About), { 
  ssr: false, 
  loading: () => <div className="h-screen bg-[#0D0D0D]" />
});
const TrustBar = nextDynamic(() => import("@/components/TrustBar").then(mod => mod.TrustBar), { 
  ssr: false,
  loading: () => <div className="h-10 bg-[#0D0D0D]" />
});
const Services = nextDynamic(() => import("@/components/Services").then(mod => mod.Services), {
  ssr: false,
  loading: () => <ServicesSkeleton />
});
const CaseStudies = nextDynamic(() => import("@/components/CaseStudies").then(mod => mod.CaseStudies), {
  ssr: false,
  loading: () => <CaseStudiesSkeleton />
});
const Specialist = nextDynamic(() => import("@/components/Specialist").then(mod => mod.Specialist), { 
  ssr: false,
  loading: () => <div className="h-screen bg-[#0D0D0D]" />
});
const Experience = nextDynamic(() => import("@/components/Experience").then(mod => mod.Experience), { 
  ssr: false,
  loading: () => <div className="h-screen bg-[#0D0D0D]" />
});
const Amenities = nextDynamic(() => import("@/components/Amenities").then(mod => mod.Amenities), { 
  ssr: false,
  loading: () => <div className="h-screen bg-[#0D0D0D]" />
});
const Testimonials = nextDynamic(() => import("@/components/Testimonials").then(mod => mod.Testimonials), {
  ssr: false,
  loading: () => <TestimonialsSkeleton />
});
const FAQ = nextDynamic(() => import("@/components/FAQ").then(mod => mod.FAQ), { 
  ssr: false,
  loading: () => <div className="h-40 bg-[#0D0D0D]" />
});
const Stats = nextDynamic(() => import("@/components/Stats").then(mod => mod.Stats), {
  ssr: false,
  loading: () => <div className="h-40 bg-[#0D0D0D] -mt-[10vh]" />
});
const Footer = nextDynamic(() => import("@/components/Footer").then(mod => mod.Footer), { ssr: false });


export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    const heroContent = heroContentRef.current;
    if (!video || !container || !heroContent) return;

    // Force muted states to satisfy all browser autoplay policies
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    const attemptPlay = async () => {
      try {
        await video.play();
        window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
      } catch (err) {
        window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
      }
    };

    attemptPlay();

    const handleUserInteraction = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);

    const ctx = gsap.context(() => {

      // ─── 1. ENTRANCE ANIMATION (automatic, runs once on load) ─────────────
      // The video's initial state (opacity:0, scale:1.4, filter blur) is applied
      // synchronously via inline styles on the <video> element — this prevents
      // the "ghost loading" flash that occurred when the video appeared in its
      // raw state before GSAP could set the fromTo initial values.
      gsap.to(video, {
        scale: 1.0,
        filter: 'grayscale(1) contrast(1.1) brightness(0.95) blur(0px)',
        opacity: 1,
        duration: 2.2,
        delay: 0.5,
        ease: "expo.out",
        onComplete: () => {
          // ─── 2. SCROLL PARALLAX — only activates after entrance completes ──
          // This sequencing ensures no collision between entrance and scroll.
          ScrollTrigger.refresh();

          // 2a. Video parallax — subtle zoom-out + upward drift (cinematic depth)
          gsap.to(video, {
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: "bottom top",
              scrub: 1.2,
            },
            scale: 1.15,
            yPercent: -8,
            ease: "none",
          });

          // 2b. Hero text parallax — slower drift (layered depth: text closer than video)
          gsap.to(heroContent, {
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
            yPercent: -18,
            opacity: 0,
            ease: "none",
          });

          // 2c. Hero container — smooth cinematic fade-out on exit
          gsap.to(container, {
            scrollTrigger: {
              trigger: container,
              start: "60% top",
              end: "bottom top",
              scrub: true,
            },
            opacity: 0.4,
            ease: "none",
          });
        }
      });

    }, containerRef);

    return () => {
      ctx.revert();
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return (
    <main className="w-full bg-[#0D0D0D] overflow-x-clip">
      {/* Hero Section */}
      <div
        ref={containerRef}
        className="hero-container-reset"
        style={{
          position: 'absolute',
          top: '-60px',
          left: 0,
          height: 'calc(100vh + 60px)',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          zIndex: 10,
          willChange: 'opacity',
        }}
      >
        {/*
          ⚠️ GHOST-LOADING FIX:
          The inline styles below define the animation's initial state SYNCHRONOUSLY,
          before GSAP hydrates. Previously, GSAP's fromTo() set the initial state only
          after client-side mount, causing a flash where the video appeared fully visible
          for a split second before snapping to opacity:0 / scale:1.4 / blur.
          Now the video starts hidden from SSR — no flash, no ghost.
        */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '40% 35%',
            zIndex: 0,
            willChange: 'transform, filter, opacity',
            // Initial state — GSAP animates FROM here to the final state
            opacity: 0,
            transform: 'scale(1.4)',
            filter: 'grayscale(1) contrast(1.1) brightness(0.5) blur(20px)',
          }}
        >
          <source src="/hero-background-new.mp4" type="video/mp4" />
        </video>

        {/* Layer 1: Bottom-up gradient for content legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Layer 1.5: Top-down gradient to soften the navbar edge */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 20%, transparent 40%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Layer 2: Radial vignette */}
        <div
          style={{
            background: 'radial-gradient(circle at center, rgba(0,0,0,0.5) 0%, transparent 70%)',
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            height: '50%',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* ── Hero Content — ref'd for scroll parallax ── */}
        <div ref={heroContentRef} className="hero-content-split">

          {/* TOPO — Overline + Headline */}
          <div className="hero-text-group">
            <PremiumReveal type="fade" direction="bottom" delay={0.1}>
              <p className="hero-overline">SUA ORIGEM,</p>
            </PremiumReveal>
            <PremiumReveal type="mask" direction="bottom" delay={0.3}>
              <h1 className="hero-headline">
                Seu sorriso<span className="hero-period">.</span>
              </h1>
            </PremiumReveal>
          </div>

          {/* BASE — Subheadline + CTA */}
          <div className="hero-action-group">
            <PremiumReveal type="fade" direction="bottom" delay={0.5}>
              <p className="hero-subheadline">
                Odontologia de alta performance
              </p>
            </PremiumReveal>
            <PremiumReveal type="fade" direction="bottom" delay={0.65}>
              <a href="#agendamento" className="hero-cta">
                AGENDAR CONSULTA →
              </a>
            </PremiumReveal>
          </div>

        </div>
      </div>

      {/* Spacer to push content below the absolute Hero */}
      <div className="h-screen w-full invisible pointer-events-none" />

      {/* Main Content Sections */}
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
    </main>
  );
}
