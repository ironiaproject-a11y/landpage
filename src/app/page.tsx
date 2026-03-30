"use client";

import nextDynamic from "next/dynamic";
import { useRef, useEffect, useState } from "react";
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

import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { TrustBar } from "@/components/TrustBar";

const About = nextDynamic(() => import("@/components/About").then(mod => mod.About), {
  ssr: false,
  loading: () => <div className="h-screen bg-[#0D0D0D]" />,
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
const Footer = nextDynamic(() => import("@/components/Footer").then(mod => mod.Footer), { ssr: false });


export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  // Direct Refs for synced typography
  const originTextRef = useRef<HTMLParagraphElement>(null);
  const smileTextRef  = useRef<HTMLHeadingElement>(null);
  const [isActuallyPlaying, setIsActuallyPlaying] = useState(false);

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

    // Event listeners to detect real play state
    const onPlay  = () => setIsActuallyPlaying(true);
    const onPause = () => setIsActuallyPlaying(false);
    const onEnded = () => setIsActuallyPlaying(false);
    const onWaiting = () => setIsActuallyPlaying(false);

    video.addEventListener("playing", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("waiting", onWaiting);

    return () => {
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", onLoaded);
      video.removeEventListener("playing", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("waiting", onWaiting);
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
    if (!video || !container || !heroContent) return;

    // Total entrance duration: delay 1.5 + duration 3.5 = 5.0 s
    const ENTRANCE_DURATION = 3.5;
    const ENTRANCE_DELAY    = 1.5;

    const ctx = gsap.context(() => {
      let isInit = false;
      const initGSAP = () => {
        if (isInit) return;
        isInit = true;
        const duration = video.duration || 5;

        let introDone = false;

        // 1. PINNING: THE LOCK (TRAVA)
        const mainST = ScrollTrigger.create({
          trigger:     container,
          start:       "top top",
          end:         "+=1000",
          pin:         true,
          scrub:       1.5,
          pinSpacing:  true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (introDone) {
              gsap.to(video, {
                currentTime: self.progress * duration,
                duration:    0.8, // Increased for a more natural, fluid feel
                ease:        "power1.out",
                overwrite:   "auto",
              });
            }
          }
        });

        // 2. ENTRANCE: AUTOMATIC FULL SWEEP (0 -> 100%)
        const tl = gsap.timeline({
          onComplete: () => {
            introDone = true;
            // No immediate sync here to avoid "jump back" from last frame
          }
        });

        tl.to(video, {
          currentTime: duration,
          duration:    5.5,
          ease:        "power2.inOut",
        });

        tl.to(video, {
          scale:    1.1, // reduced from 1.25
          filter:   "grayscale(1) contrast(1.1) brightness(0.95) blur(0px)",
          opacity:  1,
          duration: ENTRANCE_DURATION,
          ease:     "expo.out",
        }, ENTRANCE_DELAY);

        // 3. PARALLAX EFFECTS
        gsap.to(video, {
          scrollTrigger: {
            trigger: container,
            start:   "top top",
            end:     "+=1000",
            scrub:   2,
          },
          scale:    1.25, // parallax from 1.1 base (reduced from 1.45)
          yPercent: -8,
          ease:     "none",
        });

        gsap.to(heroContent, {
          scrollTrigger: {
            trigger: container,
            start:   "top top",
            end:     "+=1000",
            scrub:   0.8,
          },
          yPercent: -25,
          ease:     "none",
        });

        // 4. SYNCED TYPOGRAPHY
        // "SUA ORIGEM" - Linked to Skull appearance (early)
        // Starts VISIBLE at 0 scroll, fades out between 150 and 450
        gsap.set(originTextRef.current, { opacity: 1, filter: "blur(0px)", y: 0 });
        gsap.to(originTextRef.current, {
          scrollTrigger: {
            trigger: container,
            start: "100 top",
            end: "+=350",
            scrub: true,
          },
          opacity: 0,
          filter: "blur(10px)",
          y: -20,
          ease: "none"
        });

        // "SEU SORRISO" - Linked to Woman smiling (late)
        // Starts revealing much earlier (350px) to ensure visibility during transform
        gsap.fromTo(smileTextRef.current, 
          { opacity: 0, y: 20 },
          {
            scrollTrigger: {
              trigger: container,
              start: "350 top",
              end: "950 top",
              scrub: true,
            },
            opacity: 1,
            y: 0,
            ease: "power2.out"
          }
        );

        gsap.to(container, {
          scrollTrigger: {
            trigger: container,
            start:   "800 top",
            end:     "+=500",
            scrub:   true,
          },
          opacity: 0.35,
          ease:    "none",
        });
      };

      // Safety Net: force initialization if metadata is delayed or fails
      const safetyId = setTimeout(initGSAP, 2000);

      if (video.readyState >= 1) {
        initGSAP();
        clearTimeout(safetyId);
      } else {
        video.onloadedmetadata = () => {
          initGSAP();
          clearTimeout(safetyId);
        };
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
          top:            "-60px",
          left:           0,
          height:         "calc(100svh + 60px)",
          width:          "100vw",
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "space-between",
          overflow:       "hidden",
          zIndex:         10,       // Changed from 999 to 10 so Main Sections (30) can overlap it
          willChange:     "opacity",
          pointerEvents:  "auto",
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
          /* @ts-ignore - non-standard WebKit prop */
          webkit-playsinline="true"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          poster="/hero-video.webp"
          style={{
            position:       "absolute",
            inset:          0,
            width:          "100%",
            transition:     "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)", // Silky smooth entrance
            objectFit:      "cover",
            objectPosition: "33% 35%",
            zIndex:         0,
            willChange:     "transform, filter, opacity",
            pointerEvents:  "none",
            /* 
               NUCLEAR REVEAL: Only show when actually playing.
               This prevents the OS play icon from flashing on the first frame if the
               video stalls or is blocked by low-power mode policies.
            */
            opacity:   isActuallyPlaying ? 1 : 0, 
            transform: "scale(1.25) translateY(-30px)",
            filter:    "grayscale(1) contrast(1.1) brightness(0.5) blur(0px)",
            height:    "120%", 
            top:       "-10%", 
          }}
        >
          <source src="/hero-background-new.mp4" type="video/mp4" />
        </video>

        {/* ── NUCLEAR VIDEO CONTROLS SUPPRESSION ── */}
        <style dangerouslySetInnerHTML={{ __html: `
          video::-webkit-media-controls {
            display: none !important;
            -webkit-appearance: none;
          }
          video::-webkit-media-controls-enclosure {
            display: none !important;
          }
          video::-webkit-media-controls-panel {
            display: none !important;
          }
          video::-webkit-media-controls-play-button {
            display: none !important;
            -webkit-appearance: none;
          }
          video::-webkit-media-controls-start-playback-button {
            display: none !important;
            -webkit-appearance: none;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          video::-internal-media-controls-download-button {
            display: none !important;
          }
          video::-internal-media-controls-overflow-button {
            display: none !important;
          }
          video::-webkit-media-controls-container {
            display: none !important;
          }
        `}} />

        {/* Gradient layers */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)", zIndex:1, pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 20%, transparent 40%)", zIndex:1, pointerEvents:"none" }} />
        <div style={{ background:"radial-gradient(circle at center, rgba(0,0,0,0.5) 0%, transparent 70%)", position:"absolute", top:"40%", left:"50%", transform:"translate(-50%, -50%)", width:"90%", height:"50%", zIndex:1, pointerEvents:"none" }} />

        {/* ── Hero Content ── */}
        <div ref={heroContentRef} className="hero-content-split" style={{ pointerEvents: "auto" }}>

          <div className="hero-text-group">
            <p ref={originTextRef} className="hero-overline">SUA ORIGEM,</p>
            <h1 ref={smileTextRef} className="hero-headline">
              Seu sorriso<span className="hero-period">.</span>
            </h1>
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
      <div className="relative z-30 bg-[#0D0D0D] pt-16">
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
