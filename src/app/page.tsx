"use client";

import nextDynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
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

// Shared styles
const eyebrowStyle: React.CSSProperties = {
  fontSize: '9px',
  fontWeight: 300,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.38)',
  marginBottom: '0.4rem',
  fontFamily: "'Barlow', sans-serif",
};
const bodyStyle: React.CSSProperties = {
  fontFamily: "'Barlow', sans-serif",
  fontSize: '12px',
  fontWeight: 300,
  lineHeight: 1.6,
  color: 'rgba(255,255,255,0.45)',
  maxWidth: '26ch',
  marginBottom: '1.2rem',
};
const phaseBlockStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '1.75rem',
  left: '1.5rem',
  right: '1.5rem',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'opacity 0.7s ease, transform 0.7s ease',
};

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTime = () => {
      if (!video.duration) return;
      const p = video.currentTime / video.duration;
      if (p < 0.25) setActivePhase(0);
      else if (p < 0.55) setActivePhase(1);
      else if (p < 0.80) setActivePhase(2);
      else setActivePhase(3);
    };
    video.addEventListener('timeupdate', handleTime);
    return () => video.removeEventListener('timeupdate', handleTime);
  }, []);

  const phaseVisible = (i: number): React.CSSProperties => ({
    opacity: activePhase === i ? 1 : 0,
    transform: activePhase === i ? 'translateY(0)' : 'translateY(10px)',
  });

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

        {/* Phase Text Blocks Container */}
        <div style={{ position: 'relative', zIndex: 2, height: '220px' }}>

          {/* Phase 0 – Sua origem / A estrutura. */}
          <div style={{ ...phaseBlockStyle, ...phaseVisible(0) }}>
            <p style={eyebrowStyle}>Sua origem</p>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.7rem',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#fff',
              lineHeight: 1.05,
              marginBottom: '0.6rem',
            }}>A estrutura.</h1>
            <p style={{ ...bodyStyle, marginBottom: 0 }}>onde tudo começa</p>
          </div>

          {/* Phase 1 – A transformação / Precisão biológica. */}
          <div style={{ ...phaseBlockStyle, ...phaseVisible(1) }}>
            <p style={eyebrowStyle}>A transformação</p>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.3rem',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#fff',
              lineHeight: 1.05,
              marginBottom: '0.6rem',
            }}>Precisão biológica.</h1>
          </div>

          {/* Phase 2 – Alta performance / Excelência. */}
          <div style={{ ...phaseBlockStyle, ...phaseVisible(2) }}>
            <p style={eyebrowStyle}>Alta performance</p>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.6rem',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#fff',
              lineHeight: 1.05,
              marginBottom: '0.6rem',
            }}>Excelência.</h1>
            <p style={{ ...bodyStyle, marginBottom: 0 }}>Odontologia que nasce da sua biologia.</p>
          </div>

          {/* Phase 3 – Seu resultado / Seu sorriso. + CTA */}
          <div style={{ ...phaseBlockStyle, ...phaseVisible(3) }}>
            <p style={{ ...eyebrowStyle, color: 'rgba(255,255,255,0.55)' }}>Seu resultado</p>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '3rem',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#fff',
              lineHeight: 1.05,
              marginBottom: '0.6rem',
            }}>Seu sorriso.</h1>
            <p style={bodyStyle}>
              Odontologia de alta performance onde a excelência encontra a precisão biológica.
            </p>
            <a
              href="#agendamento"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.4rem',
                background: 'rgba(255,255,255,0.1)',
                border: '0.5px solid rgba(255,255,255,0.2)',
                borderRadius: '40px',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 300,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontFamily: "'Barlow', sans-serif",
                cursor: 'pointer',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', opacity: 0.6, flexShrink: 0 }} />
              Agendar consulta
            </a>
            <p style={{
              fontSize: '9px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.22)',
              marginTop: '0.55rem',
              fontFamily: "'Barlow', sans-serif",
            }}>role para explorar ↓</p>
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
