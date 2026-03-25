"use client";

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

        {/* ── Editorial Lockup ── */}

        {/* Top-left anchor: "Sua origem" — the starting point */}
        <div style={{
          position: 'absolute',
          top: '1.75rem',
          left: '1.5rem',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{
            display: 'inline-block',
            width: '18px',
            height: '0.5px',
            background: 'rgba(255,255,255,0.3)',
          }} />
          <p style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: '9px',
            fontWeight: 300,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            margin: 0,
          }}>Sua origem</p>
        </div>

        {/* Bottom text zone: main lockup */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          padding: '0 1.5rem 2.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          {/* H1: Seu sorriso. — the destination */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(3rem, 13vw, 5rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#ffffff',
            lineHeight: 1.0,
            letterSpacing: '-0.01em',
            marginBottom: '1rem',
          }}>
            Seu sorriso.
          </h1>

          {/* Divider line — visual breath */}
          <div style={{
            width: '32px',
            height: '0.5px',
            background: 'rgba(255,255,255,0.25)',
            marginBottom: '1rem',
          }} />

          {/* Refined copy — concise, poetic, connected to the visual */}
          <p style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: '12px',
            fontWeight: 300,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.48)',
            maxWidth: '24ch',
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
              borderRadius: '40px',
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

          {/* Scroll hint */}
          <p style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)',
            marginTop: '0.75rem',
          }}>
            role para explorar ↓
          </p>
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
