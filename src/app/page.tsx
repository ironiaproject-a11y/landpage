"use client";

import nextDynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  const frameObj = useRef({ index: 0 });
  const [videoPhase, setVideoPhase] = useState<'skull' | 'woman'>('skull');
  const frameCount = 145;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.getById("heroScroll")?.kill(true);
    ScrollTrigger.refresh();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const ctx = gsap.context(() => {
      let loadedCount = 0;
      const criticalFrames = 30;

      const onImageLoad = () => {
        loadedCount++;
        if (loadedCount === criticalFrames) {
          render(0);
        }
        if (loadedCount === frameCount) {
          window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
        }
      };

      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.onload = onImageLoad;
        img.onerror = onImageLoad;
        img.src = `/hero-frames/frame_${i.toString().padStart(3, "0")}_delay-0.041s.png`;
        imagesRef.current[i] = img;
      }

      const render = (index: number) => {
        const roundedIndex = Math.min(Math.round(index), frameCount - 1);
        const img = imagesRef.current[roundedIndex];
        if (img && img.complete) {
          const { width, height } = canvas;
          const imgRatio = img.width / img.height;
          const canvasRatio = width / height;
          let dWidth, dHeight, dx, dy;
          if (imgRatio > canvasRatio) {
            dHeight = height; dWidth = dHeight * imgRatio;
            dx = (width - dWidth) / 2; dy = 0;
          } else {
            dWidth = width; dHeight = dWidth / imgRatio;
            dx = 0; dy = (height - dHeight) / 2;
          }
          context.clearRect(0, 0, width, height);
          context.drawImage(img, dx, dy, dWidth, dHeight);
        }
      };

      const updateFrame = () => {
        const idx = frameObj.current.index;
        render(idx);
        const nextPhase = idx >= 75 ? 'woman' : 'skull';
        setVideoPhase(prev => (prev !== nextPhase ? nextPhase : prev));
      };

      const handleResize = () => {
        if (!canvas) return;
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        updateFrame();
      };
      window.addEventListener("resize", handleResize);
      handleResize();

      const scrubTrigger = ScrollTrigger.create({
        id: "heroScroll",
        trigger: scrollContainerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const targetIdx = self.progress * (frameCount - 1);
          frameObj.current.index = targetIdx;
          updateFrame();
        }
      });

      (scrollContainerRef as any).__scrubTrigger = scrubTrigger;

      let introTween: any = null;
      const startIntro = () => {
        const lenis = (window as any).lenis;
        if (!lenis) return;
        const targetScroll = scrubTrigger.end;
        lenis.scrollTo(targetScroll, {
          duration: 3.5,
          easing: (t: number) => t,
          onComplete: () => {
            frameObj.current.index = frameCount - 1;
            updateFrame();
            introTween = null;
          }
        });
        introTween = true;
      };

      const handleUserScroll = () => {
        const lenis = (window as any).lenis;
        if (introTween && lenis) {
          lenis.stop();
          lenis.start();
          introTween = null;
        }
      };
      window.addEventListener("wheel", handleUserScroll, { passive: true });
      window.addEventListener("touchstart", handleUserScroll, { passive: true });

      let introStarted = false;
      const onPreloaderExit = () => {
        if (introStarted) return;
        introStarted = true;
        setTimeout(startIntro, 400);
      };
      window.addEventListener("preloader-exiting", onPreloaderExit);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("wheel", handleUserScroll);
        window.removeEventListener("touchstart", handleUserScroll);
        window.removeEventListener("preloader-exiting", onPreloaderExit);
      };
    });

    return () => {
      const st = (scrollContainerRef as any).__scrubTrigger;
      if (st) st.kill(true);
      ScrollTrigger.getById("heroScroll")?.kill(true);
      ctx.revert();
    };
  }, []);

  return (
    <main className="w-full bg-[#0D0D0D] overflow-x-clip">
      {/* Hero Section with Scrubbing Video */}
      <div ref={scrollContainerRef} style={{ height: '300vh' }} className="relative w-full z-10">
        <section ref={containerRef} className="sticky top-0 w-full h-screen overflow-hidden bg-black text-white m-0 p-0">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0 grayscale opacity-90 scale-[1.05]" />
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/40 to-black/70 lg:from-black/80 lg:via-black/30 lg:to-black/80 z-10 pointer-events-none" />

          {/* Enhanced Hero Typography - Phase Synchronized */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center px-6 pointer-events-none">
            <div className="max-w-4xl w-full text-center flex flex-col items-center">
              
              {/* Unified Hero Typography Lockup: Visible Immediately on Load */}
              <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.2 }}
                className="flex flex-col items-center justify-center w-full"
              >
                {/* Overline: Sua origem */}
                <m.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="hero-overline block text-white/70 uppercase font-light tracking-[0.4em] md:tracking-[0.6em] text-[12px] md:text-[14px] mb-4 md:mb-6"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Sua origem,
                </m.span>

                {/* Headline: Seu sorriso */}
                <m.h1 
                  initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="hero-headline text-white/95 font-[300] tracking-[-0.03em] flex items-baseline justify-center italic mb-10 md:mb-14"
                  style={{ 
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(48px, 12vw, 100px)', 
                    lineHeight: '1.0' 
                  }}
                >
                  <span className="inline-block whitespace-nowrap">Seu sorriso</span>
                  <span className="hero-period inline-block text-white/80 ml-2" style={{ fontSize: '0.8em', fontStyle: 'normal' }}>.</span>
                </m.h1>

                {/* Subheadline */}
                <m.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9 }}
                  transition={{ duration: 1.0, delay: 1.0 }}
                  className="hero-subheadline text-white/90 text-sm md:text-base font-normal leading-[1.8] max-w-[440px] mb-14 md:mb-16"
                  style={{ fontFamily: "'Jost', sans-serif", letterSpacing: '0.05em' }}
                >
                  Odontologia de alta performance onde<br className="hidden md:block"/>
                  a excelência encontra a precisão biológica.
                </m.p>
              </m.div>

              {/* CTA Button: Visible Immediately on Load */}
              <div className="z-40 relative pointer-events-auto w-full max-w-[320px] md:max-w-none md:w-auto px-4 md:px-0">
                <m.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
                  className="w-full flex justify-center"
                >
                  <m.a 
                    whileHover={{ scale: 1.02, backgroundColor: "white", color: "black", borderColor: "white" }}
                    whileTap={{ scale: 0.98 }}
                    style={{ fontFamily: "'Jost', sans-serif" }} 
                    href="#agendamento" 
                    className="hero-cta group inline-flex w-full md:w-auto items-center justify-center bg-white/10 border border-white/50 rounded-none px-8 md:px-[64px] py-6 md:py-[24px] transition-all text-white text-[14px] md:text-[15px] tracking-[0.25em] font-semibold uppercase backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.3)]"
                  >
                    <span>Agendar Consulta</span>
                    <svg 
                      className="hero-arrow ml-4 w-5 h-5 stroke-current fill-none transition-transform duration-500 group-hover:translate-x-2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 12 L20 12 M15 7 L20 12 L15 17" strokeWidth="1.5" />
                    </svg>
                  </m.a>
                </m.div>
              </div>
            </div>
          </div>
        </section>
      </div>

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
