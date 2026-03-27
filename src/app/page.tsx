"use client";
/* SYNC: Restored Unified Hero Design */

import nextDynamic from "next/dynamic";
import { useRef, useEffect } from "react";
import { ServicesSkeleton, CaseStudiesSkeleton, TestimonialsSkeleton } from "@/components/SectionSkeletons";
import { InstitutionalTrust } from "@/components/InstitutionalTrust";
import { Agendamento } from "@/components/Agendamento";
import { PremiumReveal } from "@/components/PremiumReveal";
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
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      
      const playVideo = async () => {
        try {
          await video.load();
          await video.play();
        } catch (err) {
          console.log("Autoplay failed, retrying on interaction...", err);
          // Fallback: try playing again if anything changes
        }
      };
      
      playVideo();
    }
  }, []);

  return (
    <main className="w-full bg-[#0D0D0D] overflow-x-clip">
      {/* Hero Section – Video Background */}
      {/* Hero Section – Nuclear Reset (Using DIV to bypass section-wide padding) */}
      <div
        className="hero-container-reset"
        style={{
          position: 'absolute',
          top: '-60px', // Over-fill: Pushing above the browser edge
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
            minWidth: '100%',
            minHeight: '100%',
            objectFit: 'cover',
            objectPosition: '40% 35%',
            zIndex: 0,
            filter: 'grayscale(1) contrast(1.1) brightness(0.95)',
            transform: 'scale(1.1)', // Reduced for more cinematic depth and space
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
