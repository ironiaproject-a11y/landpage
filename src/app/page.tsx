"use client";

import nextDynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameObj = useRef({ index: 0 });
  const [videoPhase, setVideoPhase] = useState<'skull' | 'woman'>('skull');
  const frameCount = 145;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const ctx = gsap.context(() => {
      // 1. Initial State & Preload
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = `/hero-frames/frame_${i.toString().padStart(3, "0")}_delay-0.041s.png`;
        imagesRef.current[i] = img;
      }

      const render = (index: number) => {
        const img = imagesRef.current[Math.floor(index)];
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

      const handleResize = () => {
        if (!canvas) return;
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        render(frameObj.current.index);
      };
      window.addEventListener("resize", handleResize);
      handleResize();

      // 2. Sequential Logic (Intro THEN Scrub)
      const setupScrollScrub = () => {
        gsap.to(frameObj.current, {
          index: frameCount - 1,
          scrollTrigger: {
            trigger: scrollContainerRef.current,
            start: "top top",
            end: "+=500%", // Long scroll for ultra-fluidity
            scrub: 1.2,
            pin: containerRef.current,
            anticipatePin: 1,
            onUpdate: (self) => {
               // Full logic: mapping 0-1 scrub to the rest of the transformation
               const currentFrame = 75 + (self.progress * (frameCount - 1 - 75));
               frameObj.current.index = currentFrame;
               render(currentFrame);
               if (currentFrame >= 75) setVideoPhase('woman'); else setVideoPhase('skull');
            }
          }
        });
      };

      // Play Cinematic Intro on load
      const startIntro = () => {
        gsap.to(frameObj.current, {
          index: 75,
          duration: 3,
          ease: "power2.inOut",
          onUpdate: () => {
            render(frameObj.current.index);
            if (frameObj.current.index >= 75) setVideoPhase('woman');
          },
          onComplete: setupScrollScrub
        });
      };

      // Draw first frame immediately if ready
      const firstFrame = imagesRef.current[0];
      if (firstFrame.complete) {
        render(0);
        startIntro();
      } else {
        firstFrame.onload = () => {
          render(0);
          startIntro();
        };
      }

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <main className="w-full overflow-x-hidden m-0 p-0 border-none bg-black">
      <div ref={scrollContainerRef} className="relative w-full z-10">
        <section ref={containerRef} className="relative w-full h-[100vh] overflow-hidden bg-black text-white m-0 p-0 border-none">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0 m-0 p-0 border-none scale-[1.05] grayscale" />
          <div className="absolute inset-0 w-full h-full bg-black/40 z-0 pointer-events-none scale-[1.05]" />

          <div className="absolute top-[30%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-full z-10 pointer-events-none">
            <div className="w-full max-w-[1600px] mx-auto flex justify-center">
              <h1 className="flex flex-col text-center items-center w-full relative h-[300px] justify-center">
                <AnimatePresence mode="wait">
                  {videoPhase === 'skull' ? (
                    <m.span 
                      key="skull-text"
                      initial={{ opacity: 0, filter: 'blur(12px)', y: 10 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                      exit={{ opacity: 0, filter: 'blur(12px)', y: -10 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      style={{ fontFamily: 'var(--font-sans)' }} 
                      className="absolute text-[18px] lg:text-[clamp(1.75rem,5vw,4rem)] font-[400] text-white/55 lg:text-white/90 leading-tight tracking-[5px] uppercase text-center"
                    >
                      Sua origem,
                    </m.span>
                  ) : (
                    <m.span 
                      key="woman-text"
                      initial={{ opacity: 0, y: 20, clipPath: 'inset(100% 0 0 0)' }}
                      animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 -20% 0)' }}
                      exit={{ opacity: 0, y: -20, clipPath: 'inset(0 0 100% 0)' }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      style={{ fontFamily: 'var(--font-serif)' }} 
                      className="absolute text-[42px] lg:text-[clamp(3.75rem,11vw,10rem)] font-[300] text-white leading-[1.1] tracking-normal lowercase first-letter:uppercase text-center"
                    >
                      Seu sorriso.
                    </m.span>
                  )}
                </AnimatePresence>
              </h1>
            </div>
          </div>

          <div className="absolute bottom-[40px] left-0 right-0 w-full flex justify-center z-20">
            <a style={{ fontFamily: 'var(--font-sans)' }} href="#sobre" className="inline-flex items-center justify-center bg-transparent border border-white/25 rounded-full px-8 py-2.5 hover:bg-white/10 transition-colors whitespace-nowrap text-white/55 text-[11px] tracking-[4px] uppercase backdrop-blur-md">
              AGENDAR CONSULTA &rarr;
            </a>
          </div>
        </section>
      </div>

      <div className="relative z-20">
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
