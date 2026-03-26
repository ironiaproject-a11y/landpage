"use client";
/* SYNC: Restored Unified Hero Design */

import nextDynamic from "next/dynamic";
import { useRef } from "react";
import { ServicesSkeleton, CaseStudiesSkeleton, TestimonialsSkeleton } from "@/components/SectionSkeletons";
import { InstitutionalTrust } from "@/components/InstitutionalTrust";
import { Agendamento } from "@/components/Agendamento";

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

  return (
    <main className="w-full bg-[#0D0D0D] overflow-x-clip">
      {/* Hero Section – Video Background */}
      <section
        className="hero-section"
        style={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: '#000',
          borderBottomLeftRadius: 'clamp(3rem, 10vw, 10rem)',
          borderBottomRightRadius: 'clamp(3rem, 10vw, 10rem)',
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
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            filter: 'grayscale(1) contrast(1.1) brightness(0.95)',
          }}
          src="/hero-background-new.mp4"
        />

        {/* Gradient overlay – bottom 65% */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '65%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 40%, transparent 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Radial gradient shadow for text legibility — centered behind text */}
        <div
          style={{
            background: 'radial-gradient(ellipse 85% 45% at 50% 55%, rgba(0,0,0,0.55) 0%, transparent 100%)',
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* ── Unified Centered Lockup ── */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 1.5rem',
          textAlign: 'center',
          width: '100%',
        }}>
          {/* Eyebrow: SUA ORIGEM, — 10px, 300 weight, 0.28em tracking, halo shadow */}
          <p style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: '10px',
            fontWeight: 300,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            marginBottom: '0.5rem',
            textShadow: '0 0 12px rgba(0,0,0,0.95), 0 0 24px rgba(0,0,0,0.8)',
          }}>
            SUA ORIGEM,
          </p>

          {/* H1: Seu sorriso. — clamp(3.2rem, 12vw, 4.5rem), 400 weight, italic, deep halo shadow */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(3.5rem, 15vw, 6.5rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#ffffff',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            marginBottom: '1.8rem',
            textShadow: '0 0 30px rgba(0,0,0,0.95), 0 0 60px rgba(0,0,0,0.8), 0 0 100px rgba(0,0,0,0.6)',
          }}>
            Seu sorriso.
          </h1>

          {/* Copy — 13px, 400 weight, white/75%, halo shadow */}
          <p style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.75)',
            maxWidth: '30ch',
            marginBottom: '2rem',
            letterSpacing: '0.02em',
            textShadow: '0 0 12px rgba(0,0,0,0.95), 0 0 20px rgba(0,0,0,0.9)',
          }}>
            Onde biologia e beleza<br />convergem em precisão absoluta.
          </p>

          {/* Pill CTA */}
          <a
            href="#agendamento"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.8rem 1.8rem',
              background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.15)',
              borderRadius: '100px',
              color: 'rgba(255,255,255,0.95)',
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontFamily: "'Barlow', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#fff',
              opacity: 0.8,
              flexShrink: 0,
            }} />
            Inicie sua jornada
          </a>

          {/* Visual Indicator of Premium Depth */}
          <div style={{
            position: 'absolute',
            bottom: '6vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.8rem',
            opacity: 0.6
          }}>
            <div style={{
              width: '1px',
              height: '30px',
              background: 'linear-gradient(to bottom, #fff, transparent)',
            }} />
          </div>
        </div>

      </section>


      {/* Main Content Sections Reordered for Conversion */}
      <div className="relative z-30 bg-[#0D0D0D]">
        <Services />
        <Stats />
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
