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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force muted states to satisfy all browser policies
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
      // 1. Data Store for Scroll Sync
      const scrollState = {
        scale: 1.1,
        brightness: 0.95,
        blur: 0,
        opacity: 1,
        isActive: false
      };

      // 2. Prepare ScrollTrigger (Scrubbing the Proxy Object)
      const st = ScrollTrigger.create({
        trigger: ".hero-container-reset",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          // Manual scrub of the proxy object
          scrollState.scale = gsap.utils.interpolate(1.1, 1.0, self.progress);
          scrollState.brightness = gsap.utils.interpolate(0.95, 0.3, self.progress);
          scrollState.blur = gsap.utils.interpolate(0, 15, self.progress);
          scrollState.opacity = gsap.utils.interpolate(1, 0.6, self.progress);

          // Apply to video ONLY if entrance is finished
          if (scrollState.isActive) {
            gsap.set(video, {
              scale: scrollState.scale,
              filter: `grayscale(1) contrast(1.1) brightness(${scrollState.brightness}) blur(${scrollState.blur}px)`,
              opacity: scrollState.opacity
            });
          }
        }
      });

      // 3. Entrance Animation (Auto-play)
      gsap.fromTo(video, 
        { 
          scale: 1.4, 
          filter: 'grayscale(1) contrast(1.1) brightness(0.5) blur(20px)', 
          opacity: 0 
        },
        { 
          scale: 1.1, 
          filter: 'grayscale(1) contrast(1.1) brightness(0.95) blur(0px)', 
          opacity: 1,
          duration: 2.2,
          delay: 0.5,
          ease: "expo.out",
          onComplete: () => {
            // 4. Smooth Handover
            ScrollTrigger.refresh();
            gsap.to(video, {
              scale: scrollState.scale,
              filter: `grayscale(1) contrast(1.1) brightness(${scrollState.brightness}) blur(${scrollState.blur}px)`,
              opacity: scrollState.opacity,
              duration: 0.8,
              ease: "power2.out",
              onComplete: () => {
                scrollState.isActive = true;
              }
            });
          }
        }
      );

    }, videoRef);

    return () => {
      ctx.revert();
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return (
    <main className="w-full bg-[#0D0D0D] overflow-x-clip">
      {/* Hero Section – Video Background */}
      {/* Hero Section – Nuclear Reset (Using DIV to bypass section-wide padding) */}
      <div
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
        }}
      >
        {/* Background Video */}
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
            willChange: 'transform, filter'
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

        {/* Layer 2: Radial gradient */}
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

        {/* ── Hero: dois grupos verticais ── */}
        <div className="hero-content-split">

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

      {/* Main Content Sections Reordered for Conversion */}
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
