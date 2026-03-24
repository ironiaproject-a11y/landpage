"use client";
import nextDynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import { m } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

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
  const scrubContainerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIntroDone, setIsIntroDone] = useState(false);
  const title1Ref = useRef<HTMLSpanElement>(null);
  const title2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Fast Forward to start of content and wait for metadata
    video.currentTime = 0;

    const handleLoadedMetadata = () => {
      (window as any).__HERO_ASSETS_LOADED__ = true;
      window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
    };
    
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    const ctx = gsap.context(() => {
      // Intro sequence handler
      const startIntro = () => {
        const lenis = (window as any).lenis;
        if (lenis) lenis.stop();

        const introTl = gsap.timeline({
          onComplete: () => {
            setIsIntroDone(true);
            
            // 3. SECURE HANDOFF: Create scrub sequence ONLY after intro is perfectly done
            // This prevents GSAP from recording opacity 0 and currentTime 0 as the "start" of the scrub
            const scrubTl = gsap.timeline({
              scrollTrigger: {
                trigger: scrubContainerRef.current,
                start: "top top",
                end: "bottom top", 
                scrub: 1.2, // Add slight smoothing to the scrub
                pin: heroSectionRef.current,
              }
            });

            // Video scrubbing (from intro end at 2.5s to end)
            scrubTl.fromTo(video, 
              { currentTime: 2.5 },
              { currentTime: video.duration || 6.5, ease: "none" }, 
              0
            );

            // Exit title1 (Sua origem)
            scrubTl.fromTo(title1Ref.current, 
              { opacity: 1, y: 0, filter: "blur(0px)" },
              { opacity: 0, y: -60, filter: "blur(20px)", ease: "power2.inOut" }, 
              0
            );

            // Enter title2 (Seu sorriso)
            scrubTl.fromTo(title2Ref.current, 
              { opacity: 0, y: 60, clipPath: "inset(100% 0 0 0)" },
              { opacity: 1, y: 0, clipPath: "inset(0% 0 -20% 0)", ease: "power3.out" }, 
              0.1
            );

            if (lenis) lenis.start();
            ScrollTrigger.refresh();
          }
        });

        // Entrance animation
        introTl.to(video, { currentTime: 2.5, duration: 3, ease: "slow(0.7, 0.7, false)" })
               .fromTo(title1Ref.current, 
                 { opacity: 0, filter: 'blur(12px)', y: 20 },
                 { opacity: 1, filter: 'blur(0px)', y: 0, duration: 2, ease: "power2.out" }, 
                 "-=2"
               );
      };

      window.addEventListener("preloader-finished", startIntro);

      return () => {
        window.removeEventListener("preloader-finished", startIntro);
      };
    }, scrubContainerRef);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      ctx.revert();
    };
  }, []); // Re-run carefully or handle updates in state

  return (
    <main className="w-full m-0 p-0 border-none overflow-x-hidden">
      {/* Scrub Container - Defines the scroll depth for the hero */}
      <div ref={scrubContainerRef} className="relative h-[250vh] w-full">
        <section ref={heroSectionRef} className="w-full h-[100vh] overflow-hidden bg-black text-white m-0 p-0 border-none z-10">
          <video 
            ref={videoRef} 
            muted 
            playsInline 
            className="absolute top-0 left-0 w-[100vw] h-[100vh] object-cover z-0 m-0 p-0 border-none pointer-events-none" 
          >
            <source src="/Aqui.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black/40 z-0 m-0 p-0 border-none pointer-events-none" />

          {/* Main Content (Headline) */}
          <div className="absolute top-0 left-0 w-[100vw] h-[100vh] flex flex-col justify-center items-center px-4 md:px-24 z-10 pointer-events-none">
            <div className="w-full max-w-[1600px] mx-auto flex justify-center translate-y-[-10vh]">
              <h1 className="flex flex-col text-center items-center w-full">
                <span 
                  ref={title1Ref}
                  style={{ fontFamily: 'var(--font-sans)', opacity: 0 }} 
                  className="text-[14px] lg:text-[clamp(1.75rem,5vw,4rem)] font-[400] text-[rgba(255,255,255,0.55)] lg:text-white/90 leading-tight lg:leading-[0.95] tracking-[3px] lg:tracking-[5px] uppercase mb-2 lg:mb-4 text-center block"
                >
                  Sua origem,
                </span>
                <span 
                  ref={title2Ref}
                  style={{ fontFamily: 'var(--font-serif)', opacity: 0 }} 
                  className="text-[48px] lg:text-[clamp(3.75rem,11vw,10rem)] font-[300] text-[#ffffff] leading-[1.1] lg:leading-[0.95] tracking-normal lowercase first-letter:uppercase text-center block"
                >
                  Seu sorriso.
                </span>
              </h1>
            </div>
          </div>

          <m.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isIntroDone ? 1 : 0 }}
            className="absolute bottom-0 left-0 w-[100vw] h-[100px] flex justify-center items-center z-20 pointer-events-none"
          >
            <a style={{ fontFamily: 'var(--font-sans)' }} href="#sobre" className="inline-flex items-center justify-center bg-transparent border border-[rgba(255,255,255,0.25)] rounded-full px-[32px] py-[10px] hover:bg-white/10 transition-colors z-20 whitespace-nowrap text-[rgba(255,255,255,0.7)] text-[12px] tracking-[4px] font-[400] uppercase backdrop-blur-md pointer-events-auto">
              AGENDAR CONSULTA &rarr;
            </a>
          </m.div>
        </section>
      </div>

      <div className="relative z-20 bg-[var(--color-background)]">
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
      </div>
    </main>
  );
}


