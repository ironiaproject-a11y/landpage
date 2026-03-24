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
      <section className="relative w-full h-[100svh] overflow-hidden bg-black text-white font-sans">
        {/* Video Background */}
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0" style={{ filter: 'brightness(0.6)' }}>
          <source src="/Aqui.mp4" type="video/mp4" />
        </video>

        {/* Main Content (Headline & Button) */}
        <div className="absolute top-[45%] -translate-y-1/2 left-0 w-full px-6 lg:static lg:flex lg:flex-col lg:justify-center lg:h-full lg:px-24 lg:translate-y-0 z-10">
          <div className="w-full max-w-[1600px] mx-auto">
            <h1 className="flex flex-col text-left">
              <span className="text-[18px] lg:text-[clamp(2.75rem,11vw,9rem)] font-[300] lg:font-normal text-[rgba(255,255,255,0.55)] lg:text-white/90 leading-tight lg:leading-[0.95] tracking-tight lg:tracking-[-0.04em] mb-1 lg:mb-0">Sua origem,</span>
              <span className="text-[42px] lg:text-[clamp(2.75rem,11vw,9rem)] font-[700] lg:font-medium text-[#ffffff] leading-[1.1] lg:leading-[0.95] tracking-tight lg:tracking-[-0.04em]">Seu sorriso.</span>
            </h1>


          </div>
        </div>

        {/* Centered Bottom Button */}
        <a href="#sobre" className="absolute bottom-8 left-1/2 -translate-x-1/2 inline-flex items-center justify-center bg-transparent border border-[rgba(255,255,255,0.25)] rounded-full px-[32px] py-[10px] hover:bg-white/10 transition-colors z-20 whitespace-nowrap text-[rgba(255,255,255,0.55)] text-[11px] tracking-[0.2em] font-sans font-medium uppercase">
          AGENDAR CONSULTA &rarr;
        </a>
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
