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
        style={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          overflow: 'hidden',
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
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 1.5rem',
          textAlign: 'center',
        }}>
          {/* Backdrop Blur Container */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '4px',
            padding: '2.5rem 1.75rem',
            width: '100%',
            maxWidth: '360px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            border: '0.5px solid rgba(255, 255, 255, 0.08)',
          }}>
            {/* Eyebrow: SUA ORIGEM, — 10px, 300 weight, 0.28em tracking, tight margin */}
            <p style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '10px',
              fontWeight: 300,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
              marginBottom: '0.3rem',
            }}>
              SUA ORIGEM,
            </p>

            {/* H1: Seu sorriso. — clamp(2.8rem, 11vw, 4rem), 300 weight, 1.05 line-height */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.8rem, 11vw, 4rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: '1.5rem',
              textShadow: '0 0 40px rgba(255,255,255,0.12)',
            }}>
              Seu sorriso.
            </h1>

            {/* Divider */}
            <div style={{
              width: '28px',
              height: '0.5px',
              background: 'rgba(255,255,255,0.22)',
              marginBottom: '1.25rem',
            }} />

            {/* Copy — 13px, 300 weight, white/50%, 26ch max-width */}
            <p style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '13px',
              fontWeight: 300,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.5)',
              maxWidth: '26ch',
              marginBottom: '1.75rem',
              letterSpacing: '0.01em',
            }}>
              Onde biologia e beleza<br />convergem em precisão.
            </p>

            {/* Pill CTA */}
            <a
              href="#agendamento"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.65rem 1.5rem',
                background: 'rgba(255,255,255,0.08)',
                border: '0.5px solid rgba(255,255,255,0.22)',
                borderRadius: '4px',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '10px',
                fontWeight: 300,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontFamily: "'Barlow', sans-serif",
                cursor: 'pointer',
              }}
            >
              <span style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#fff',
                opacity: 0.55,
                flexShrink: 0,
              }} />
              Agendar consulta
            </a>

            {/* Scroll hint — improved legibility (10px, 0.3 opacity) */}
            <p style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              marginTop: '1.5rem',
            }}>
              role para explorar ↓
            </p>
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
