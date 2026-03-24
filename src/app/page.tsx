"use client";

import nextDynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import { m } from "framer-motion";


import { ServicesSkeleton, CaseStudiesSkeleton, TestimonialsSkeleton } from "@/components/SectionSkeletons";

const About = nextDynamic(() => import("@/components/About").then(mod => mod.About), { 
  ssr: false, 
  loading: () => <div className="h-screen bg-[#0D0D0D]" />
});
const InstitutionalTrust = nextDynamic(() => import("@/components/InstitutionalTrust").then(mod => mod.InstitutionalTrust), { 
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
const CTA = nextDynamic(() => import("@/components/CTA").then(mod => mod.CTA), { 
  ssr: false,
  loading: () => <div className="h-screen bg-[#0D0D0D]" />
});
const Contact = nextDynamic(() => import("@/components/Contact").then(mod => mod.Contact), { 
  ssr: false,
  loading: () => <div className="h-screen bg-[#0D0D0D]" />
});
const Stats = nextDynamic(() => import("@/components/Stats").then(mod => mod.Stats), {
  ssr: false,
  loading: () => <div className="h-40 bg-[#0D0D0D] -mt-[10vh]" />
});
const Footer = nextDynamic(() => import("@/components/Footer").then(mod => mod.Footer), { ssr: false });

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPhase, setVideoPhase] = useState<'skull' | 'woman'>('skull');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // Transition exactly at 3.5 seconds (tweak this split boundary if needed)
      if (video.currentTime < 3.5) {
        setVideoPhase('skull');
      } else {
        setVideoPhase('woman');
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  return (
    <main className="w-full m-0 p-0 border-none overflow-x-hidden">
      <section className="relative w-full h-[100vh] overflow-hidden bg-black text-white m-0 p-0 border-none">
        {/* Video Background (Strictly full-bleed, scaled to kill any edge lines) */}
        <video ref={videoRef} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0 m-0 p-0 border-none scale-[1.05] origin-center" style={{ filter: 'grayscale(100%)' }}>
          <source src="/Aqui.mp4" type="video/mp4" />
        </video>
        
        {/* Subtle Dark Overlay for Contrast (Apple/Tesla vibe) */}
        <div className="absolute inset-0 w-full h-full bg-black/40 z-0 m-0 p-0 border-none pointer-events-none scale-[1.05] origin-center" />

        {/* Main Content (Headline) */}
        <div className="absolute top-[40%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-full lg:static lg:flex lg:flex-col lg:justify-center lg:h-full lg:px-24 lg:translate-y-0 z-10">
          <div className="w-full max-w-[1600px] mx-auto flex justify-center">
            <h1 className="flex flex-col text-center items-center w-full">
              <m.span 
                initial={{ opacity: 0, filter: 'blur(12px)', y: 10 }}
                animate={videoPhase === 'skull' ? { opacity: 1, filter: 'blur(0px)', y: 0 } : { opacity: 0, filter: 'blur(12px)', y: -10 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ fontFamily: 'var(--font-sans)' }} 
                className="text-[14px] lg:text-[clamp(1.75rem,5vw,4rem)] font-[400] text-[rgba(255,255,255,0.55)] lg:text-white/90 leading-tight lg:leading-[0.95] tracking-[3px] lg:tracking-[5px] uppercase mb-2 lg:mb-4 text-center"
              >
                Sua origem,
              </m.span>
              <m.span 
                initial={{ opacity: 0, y: 20, clipPath: 'inset(100% 0 0 0)' }}
                animate={videoPhase === 'woman' ? { opacity: 1, y: 0, clipPath: 'inset(0% 0 -20% 0)' } : { opacity: 0, y: 20, clipPath: 'inset(100% 0 0 0)' }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontFamily: 'var(--font-serif)' }} 
                className="text-[48px] lg:text-[clamp(3.75rem,11vw,10rem)] font-[300] text-[#ffffff] leading-[1.1] lg:leading-[0.95] tracking-normal lowercase first-letter:uppercase text-center"
              >
                Seu sorriso.
              </m.span>
            </h1>


          </div>
        </div>

        {/* Action Button securely inside Hero */}
        <div className="absolute bottom-[40px] left-0 right-0 w-full flex justify-center z-20">
          <a style={{ fontFamily: 'var(--font-sans)' }} href="#sobre" className="inline-flex items-center justify-center bg-transparent border border-[rgba(255,255,255,0.25)] rounded-full px-[32px] py-[10px] hover:bg-white/10 transition-colors z-20 whitespace-nowrap text-[rgba(255,255,255,0.7)] text-[12px] tracking-[4px] font-[400] uppercase backdrop-blur-md">
            AGENDAR CONSULTA &rarr;
          </a>
        </div>
      </section>

      <Stats />
      <About />
      <InstitutionalTrust />
      <TrustBar />
      <Services />
      <CaseStudies />
      <Specialist />
      <Experience />
      <Amenities />
      <Testimonials />
      <FAQ />
      <CTA />
      <Contact />
      <Footer />
    </main>
  );
}
