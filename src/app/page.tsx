"use client";

import nextDynamic from "next/dynamic";
import { useRef, useEffect } from "react";
import { ServicesSkeleton, CaseStudiesSkeleton, TestimonialsSkeleton } from "@/components/SectionSkeletons";
import { InstitutionalTrust } from "@/components/InstitutionalTrust";
import { Agendamento } from "@/components/Agendamento";
import { PremiumReveal } from "@/components/PremiumReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ─── register gsap ─────────────────────────────────────────── */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const About = nextDynamic(() => import("@/components/About").then(mod => mod.About), {
  ssr: false,
  loading: () => <div className="h-screen bg-[#0D0D0D]" />,
});
const TrustBar = nextDynamic(() => import("@/components/TrustBar").then(mod => mod.TrustBar), {
  ssr: false,
  loading: () => <div className="h-10 bg-[#0D0D0D]" />,
});
const Services = nextDynamic(() => import("@/components/Services").then(mod => mod.Services), {
  ssr: false,
  loading: () => <ServicesSkeleton />,
});
const CaseStudies = nextDynamic(() => import("@/components/CaseStudies").then(mod => mod.CaseStudies), {
  ssr: false,
  loading: () => <CaseStudiesSkeleton />,
});
const Specialist = nextDynamic(() => import("@/components/Specialist").then(mod => mod.Specialist), {
  ssr: false,
  loading: () => <div className="h-screen bg-[#0D0D0D]" />,
});
const Experience = nextDynamic(() => import("@/components/Experience").then(mod => mod.Experience), {
  ssr: false,
  loading: () => <div className="h-screen bg-[#0D0D0D]" />,
});
const Amenities = nextDynamic(() => import("@/components/Amenities").then(mod => mod.Amenities), {
  ssr: false,
  loading: () => <div className="h-screen bg-[#0D0D0D]" />,
});
const Testimonials = nextDynamic(() => import("@/components/Testimonials").then(mod => mod.Testimonials), {
  ssr: false,
  loading: () => <TestimonialsSkeleton />,
});
const FAQ = nextDynamic(() => import("@/components/FAQ").then(mod => mod.FAQ), {
  ssr: false,
  loading: () => <div className="h-40 bg-[#0D0D0D]" />,
});
const Stats = nextDynamic(() => import("@/components/Stats").then(mod => mod.Stats), {
  ssr: false,
  loading: () => <div className="h-40 bg-[#0D0D0D] -mt-[10vh]" />,
});
const Footer = nextDynamic(() => import("@/components/Footer").then(mod => mod.Footer), { ssr: false });


export default function Home() {
  const spacerRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  /* ─── VIDEO AUTOPLAY ─────────────────────────────────────────────── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force muted — required for autoplay in all browsers
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const tryPlay = () => video.play().catch(() => {});

    // Attempt 1: as soon as the component mounts
    tryPlay();

    // Attempt 2: once enough data is buffered (covers slow connections)
    video.addEventListener("canplay", tryPlay, { once: true });
    video.addEventListener("loadeddata", tryPlay, { once: true });

    // Attempt 3: on first user interaction of ANY kind (covers strict autoplay policies)
    const onInteraction = () => {
      tryPlay();
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("keydown", onInteraction);
    };
    window.addEventListener("pointerdown", onInteraction, { passive: true });
    window.addEventListener("keydown", onInteraction, { passive: true });

    // Signal preloader that assets are ready
    const onLoaded = () => window.dispatchEvent(new CustomEvent("hero-assets-loaded"));
    video.addEventListener("canplay", onLoaded, { once: true });
    // Safety net: fire after 4 s regardless
    const safetyId = setTimeout(onLoaded, 4000);

    return () => {
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", onLoaded);
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("keydown", onInteraction);
      clearTimeout(safetyId);
    };
  }, []);

  /* ─── GSAP ANIMATIONS ────────────────────────────────────────────── */
  useEffect(() => {
    const video       = videoRef.current;
    const container   = containerRef.current;
    const heroContent = heroContentRef.current;
    const spacer      = spacerRef.current;
    if (!video || !container || !heroContent || !spacer) return;

    // Total entrance duration: delay 0.5 + duration 2.2 = 2.7 s
    const ENTRANCE_DURATION = 2.2;
    const ENTRANCE_DELAY    = 0.5;

    const ctx = gsap.context(() => {
      const initGSAP = () => {
        const duration = video.duration || 5;

        // 1. PINNING: THE LOCK (TRAVA)
        ScrollTrigger.create({
          trigger: container,
          start:   "top top",
          end:     "+=3000",
          pin:     true,
          scrub:   2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (tl.progress() === 1) {
              gsap.to(video, {
                currentTime: self.progress * duration,
                duration:    0.1,
                ease:        "none",
                overwrite:   "auto",
              });
            }
          }
        });

        // 2. ENTRANCE: AUTOMATIC FULL SWEEP (0 -> 100%)
        const tl = gsap.timeline();

        tl.to(video, {
          currentTime: duration,
          duration:    3.5,
          ease:        "power2.inOut",
        });

        tl.to(video, {
          scale:    1.25,
          filter:   "grayscale(1) contrast(1.1) brightness(0.95) blur(0px)",
          opacity:  1,
          duration: 2.2,
          ease:     "expo.out",
        }, 0);

        // 3. PARALLAX EFFECTS
        gsap.to(video, {
          scrollTrigger: {
            trigger: container,
            start:   "top top",
            end:     "+=3000",
            scrub:   2,
          },
          scale:    1.45,
          yPercent: -10,
          ease:     "none",
        });

        gsap.to(heroContent, {
          scrollTrigger: {
            trigger: container,
            start:   "top top",
            end:     "+=3000",
            scrub:   0.8,
          },
          yPercent: -22,
          opacity:  0,
          ease:     "none",
        });

        gsap.to(container, {
          scrollTrigger: {
            trigger: container,
            start:   "2500 top",
            end:     "+=500",
            scrub:   true,
          },
          opacity: 0.35,
          ease:    "none",
        });
      };

      // Ensure duration is available before starting
      if (video.readyState >= 1) {
        initGSAP();
      } else {
        video.onloadedmetadata = initGSAP;
      }
    });

    // Refresh ScrollTrigger after a tick so Lenis has initialised its scroll
    // proxy — without this the trigger positions can be miscalculated on first load.
    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main className="w-full bg-[#0D0D0D] overflow-x-clip">

      {/* ── HERO — Pinned by GSAP ─────────────────────────── */}
      <div
        ref={containerRef}
        className="hero-container-reset"
        style={{
          position:       "relative",
          top:            0,         // Reset top to 0 for GSAP pinning
          left:           0,
          height:         "100vh",   // Clean 100vh for pinning trigger
          width:          "100vw",
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "space-between",
          overflow:       "hidden",
          zIndex:         50,        // Elevated above all following content (z-30)
          willChange:     "opacity",
          pointerEvents:  "none",
        }}
      >
        {/*
          ⚠️  GHOST-LOADING FIX
          The initial inline styles (opacity:0, scale:1.4, filter blur) are applied
          synchronously at render time. GSAP then uses gsap.to() to animate FROM
          these values — so the video is never briefly visible in its raw state.
        */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position:       "absolute",
            inset:          0,
            width:          "100%",
            height:         "100%",
            objectFit:      "cover",
            objectPosition: "40% 35%",
            zIndex:         0,
            willChange:     "transform, filter, opacity",
            // Over-fill handled internally on the video asset
            opacity:   0,
            transform: "scale(1.4) translateY(-30px)", // Negative translate for over-fill
            filter:    "grayscale(1) contrast(1.1) brightness(0.5) blur(20px)",
            height:    "120%", // Extra height within the container
            top:       "-10%", // Centered offset
          }}
        >
          <source src="/hero-background-new.mp4" type="video/mp4" />
        </video>

        {/* Gradient layers */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)", zIndex:1, pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 20%, transparent 40%)", zIndex:1, pointerEvents:"none" }} />
        <div style={{ background:"radial-gradient(circle at center, rgba(0,0,0,0.5) 0%, transparent 70%)", position:"absolute", top:"40%", left:"50%", transform:"translate(-50%, -50%)", width:"90%", height:"50%", zIndex:1, pointerEvents:"none" }} />

        {/* ── Hero Content ── */}
        <div ref={heroContentRef} className="hero-content-split" style={{ pointerEvents: "auto" }}>

          <div className="hero-text-group">
            <PremiumReveal type="fade" direction="bottom" delay={0.1}>
              <p className="hero-overline">SUA ORIGEM,</p>
            </PremiumReveal>
            <PremiumReveal type="mask" direction="bottom" delay={0.3}>
              <h1 className="hero-headline">
                Seu sorriso<span className="hero-period">.</span>
              </h1>
            </PremiumReveal>
          </div>

          <div className="hero-action-group">
            <PremiumReveal type="fade" direction="bottom" delay={0.5}>
              <p className="hero-subheadline">
                Odontologia de alta performance
              </p>
            </PremiumReveal>
            <PremiumReveal type="fade" direction="bottom" delay={0.65}>
              <a href="#agendamento" className="hero-cta">
                AGENDAR CONSULTA →
              </a>
            </PremiumReveal>
          </div>

        </div>
      </div>

      {/*
        The spacer is no longer needed as the pin distance creates the gap.
      */}

      {/* Main Sections */}
      <div className="relative z-30 bg-[#0D0D0D]">
        <Stats />
        <Services />
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
