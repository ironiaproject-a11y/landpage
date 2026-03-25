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
  
  // Ref-based state to prevent React lag
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
      // 1. Preload High-Quality Frames with Progress Tracking
      let loadedCount = 0;
      const criticalFrames = 30; // Min frames for a smooth start

      const onImageLoad = () => {
        loadedCount++;
        if (loadedCount === criticalFrames) {
          // Render first frame as soon as we have enough critical frames
          render(0);
        }
        if (loadedCount === frameCount) {
          window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
          (window as any).__HERO_ASSETS_LOADED__ = true;
        }
      };

      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.onload = onImageLoad;
        img.onerror = onImageLoad; // Don't block on errors
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
        } else if (img) {
          // Ghost-loading fix: If frame isn't loaded yet, draw it the ms it arrives
          img.onload = () => {
            if (Math.floor(frameObj.current.index) === Math.floor(index)) {
              render(index);
            }
          };
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

      // 2. Absolute Scroll-Synced Logic (0 to 144)
      const scrubTrigger = ScrollTrigger.create({
        id: "heroScroll",
        trigger: scrollContainerRef.current,
        start: "top top",
        end: "+=200%",
        pin: containerRef.current,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.5, // Much snappier (was 1.2)
        onUpdate: (self) => {
          const targetIdx = self.progress * (frameCount - 1);
          frameObj.current.index = targetIdx;
          updateFrame();
        }
      });

      // 3. Cinematic Auto-Intro via Physical Scroll Sync
      // Instead of fighting the scrollbar, we physically move it!
      let introTween: any = null;
      
      const startIntro = () => {
        const lenis = (window as any).lenis;
        if (!lenis) return;

        // Exact scroll target based on 200% scrub distance + frame 75 ratio
        const totalScrubDistance = window.innerHeight * 2.0;
        const targetScroll = (scrollContainerRef.current?.offsetTop || 0) + (totalScrubDistance * (75 / (frameCount - 1)));
        
        // Use Lenis.scrollTo for perfect sync with the smooth scroll engine
        lenis.scrollTo(targetScroll, {
          duration: 2.8,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          onComplete: () => {
            introTween = null;
          }
        });
        
        // Track the active scroll operation for override
        introTween = true;
      };

      // Kill the intro if the user manually scrubs (takes control)
      const handleUserScroll = () => {
        const lenis = (window as any).lenis;
        if (introTween && lenis) {
          lenis.stop(); // Stop the auto-scroll immediately
          lenis.start(); // Resume for manual control
          introTween = null;
        }
      };
      window.addEventListener("wheel", handleUserScroll, { passive: true });
      window.addEventListener("touchstart", handleUserScroll, { passive: true });

      // Start Trigger: Only start intro after preloader is signal to exit
      const onPreloaderExit = () => {
        setTimeout(startIntro, 400); // Slight delay for preloader blur to settle
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
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <main className="w-full bg-[#0D0D0D] overflow-x-hidden">
      <div ref={scrollContainerRef} className="relative w-full z-10">
        <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black text-white m-0 p-0">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0 grayscale opacity-90 scale-[1.05]" />
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/80 via-black/30 to-black/80 z-10 pointer-events-none" />

          {/* Correct Typography Hierarchy: Jost & Cormorant Garamond */}
          <div className="absolute top-[30%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-full z-20 pointer-events-none text-center px-4">
            <h1 className="relative flex flex-col items-center justify-center h-[350px]">
              <AnimatePresence mode="wait">
                {videoPhase === 'skull' ? (
                  <m.span 
                    key="skull-text"
                    initial={{ opacity: 0, filter: 'blur(15px)', y: 20 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{ opacity: 0, filter: 'blur(15px)', y: -20 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{ fontFamily: "'Jost', sans-serif", letterSpacing: '0.4em' }} 
                    className="absolute text-[18px] lg:text-[42px] font-[200] text-white/55 lg:text-white/90 uppercase"
                  >
                    Sua origem,
                  </m.span>
                ) : (
                  <m.span 
                    key="woman-text"
                    initial={{ opacity: 0, y: 30, clipPath: 'inset(100% 0 0 0)' }}
                    animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 -20% 0)' }}
                    exit={{ opacity: 0, y: -30, clipPath: 'inset(0 0 100% 0)' }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{ fontFamily: "'Cormorant Garamond', serif" }} 
                    className="absolute text-[48px] lg:text-[140px] font-[300] text-white lowercase first-letter:uppercase leading-none italic"
                  >
                    Seu sorriso.
                  </m.span>
                )}
              </AnimatePresence>
            </h1>
          </div>

          <m.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="absolute bottom-[50px] left-0 right-0 w-full flex justify-center z-30"
          >
            <a style={{ fontFamily: "'Jost', sans-serif" }} href="#sobre" className="inline-flex items-center justify-center bg-white/5 border border-white/20 rounded-full px-12 py-3.5 hover:bg-white/10 transition-all text-white/55 text-[11px] tracking-[5px] uppercase backdrop-blur-3xl">
              AGENDAR CONSULTA &rarr;
            </a>
          </m.div>
        </section>
      </div>

      <div className="relative z-30 bg-[#0D0D0D]">
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
