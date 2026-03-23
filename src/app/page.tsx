"use client";

import nextDynamic from "next/dynamic";


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
  return (
    <main className="min-h-screen">
      <section className="relative w-full min-h-[100svh] overflow-hidden bg-black text-white flex flex-col justify-between px-6 pt-24 pb-8 md:p-12 lg:px-24 lg:py-16">
        {/* Video Background */}
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0" style={{ filter: 'brightness(0.6)' }}>
          <source src="/Aqui.mp4" type="video/mp4" />
        </video>

        {/* Main Content (Headline & Button perfectly grouped) */}
        <div className="flex flex-col flex-1 justify-center w-full max-w-[1600px] mx-auto z-10 relative mt-16 md:mt-0">
          
          <div className="flex flex-col items-start gap-8 md:gap-12 w-full">
            {/* Main Headline */}
            <h1 className="text-[clamp(2.75rem,11vw,9rem)] leading-[0.95] tracking-[-0.04em] font-sans text-white text-left w-full break-normal lg:whitespace-nowrap">
              <span className="block font-normal text-white/90">Sua origem,</span>
              <span className="block font-medium">Seu sorriso.</span>
            </h1>

            {/* Button - logically grouped under the text */}
            <a href="#sobre" className="inline-flex items-center justify-between bg-white text-black rounded-full px-7 py-4 md:py-5 md:px-10 font-sans hover:bg-white/90 transition-all w-fit gap-6 md:gap-8 group shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.25)]">
              <span className="text-[16px] md:text-[18px] font-medium tracking-tight">Agendar Consulta</span>
              <span className="bg-black text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transform group-hover:translate-x-1 transition-transform duration-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </a>
          </div>
        </div>

        {/* Bottom Info Blocks - Anchored cleanly */}
        <div className="w-full max-w-[1600px] mx-auto flex flex-row justify-between lg:justify-start items-end z-10 relative gap-4 md:gap-16 pb-4">
          <div className="hidden lg:block text-white/30 mb-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M4 4v16h16"/></svg>
          </div>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-16 w-full lg:w-auto mt-8 lg:mt-0">
            <div className="flex flex-col gap-1.5 flex-1 lg:flex-none">
              <span className="text-[8px] md:text-[10px] uppercase font-sans tracking-[0.2em] text-white/50">Horário de funcionamento</span>
              <span className="text-xs md:text-sm font-sans text-white font-medium tracking-tight">Seg - Sáb 8:00 - 20:00</span>
            </div>
            <div className="flex flex-col gap-1.5 flex-1 lg:flex-none">
              <span className="text-[8px] md:text-[10px] uppercase font-sans tracking-[0.2em] text-white/50">Localização</span>
              <span className="text-xs md:text-sm font-sans text-white font-medium tracking-tight">São Paulo, SP</span>
            </div>
          </div>
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
