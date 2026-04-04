"use client";

import nextDynamic from "next/dynamic";
import { useRef, useEffect, useState } from "react";
import { ServicesSkeleton, CaseStudiesSkeleton, TestimonialsSkeleton } from "@/components/SectionSkeletons";
import { InstitutionalTrust } from "@/components/InstitutionalTrust";
import { Agendamento } from "@/components/Agendamento";
import { PremiumReveal } from "@/components/PremiumReveal";
import { Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ─── register gsap ─────────────────────────────────────────── */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import { Services } from "@/components/Services";
import { TrustBar } from "@/components/TrustBar";
import { LocationSection } from "@/components/LocationSection";

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
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  const originTextRef = useRef<HTMLParagraphElement>(null);
  const smileTextRef  = useRef<HTMLHeadingElement>(null);
  const heroBtnRef    = useRef<HTMLAnchorElement>(null);
  const [isVideoPrimed, setIsVideoPrimed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const percentRef = useRef<HTMLSpanElement>(null);

  /* ─── DETECT iOS ─────────────────────────────────────────────── */
  useEffect(() => {
    const checkIOS = () => {
      const ua = navigator.userAgent;
      const isIOSDevice = /iPad|iPhone|iPod/.test(ua) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      setIsIOS(isIOSDevice);
    };
    checkIOS();
  }, []);

  /* ─── FORCE iOS AUTOPLAY ──────────────────────────────────────── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptAutoplay = async () => {
      try {
        await video.play();
        setIsVideoPrimed(true);
      } catch (err) {
        // Autoplay blocked - try muted autoplay
        video.muted = true;
        video.defaultMuted = true;
        try {
          await video.play();
          setIsVideoPrimed(true);
        } catch {
          setIsVideoPrimed(true);
        }
      }
    };

    // Small delay to ensure video is loaded
    const timer = setTimeout(attemptAutoplay, 100);
    return () => clearTimeout(timer);
  }, []);

  /* ─── VIDEO AUTOPLAY (MOBILE AUDIO UNLOCK) ─────────────────────── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure all mobile-critical attributes are set
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    // ── iOS AudioContext UNLOCK TRICK ─────────────────────────────────
    const unlockAudio = () => {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ac = new AudioCtx();
          ac.resume().then(() => ac.close()).catch(() => {});
        }
      } catch { /* ignore */ }
    };

    // ── INTERACTION: Set primed on user interaction ──────────────────
    const onInteraction = () => {
      unlockAudio();
      setIsVideoPrimed(true);
      
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("touchstart", onInteraction);
      window.removeEventListener("scroll", onInteraction);
    };
    
    // Add listeners
    window.addEventListener("pointerdown", onInteraction, { passive: true });
    window.addEventListener("touchstart", onInteraction, { passive: true });
    window.addEventListener("scroll", onInteraction, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("touchstart", onInteraction);
      window.removeEventListener("scroll", onInteraction);
    };
  }, []);

  /* ─── CANVAS RENDERER ────────────────────────────────────────── */
  const renderFrame = () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // High DPI Handling
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }

    // Object-fit: cover implementation in Canvas
    const videoW = video.videoWidth || 1920;
    const videoH = video.videoHeight || 1080;
    const videoAspect = videoW / videoH;
    const canvasAspect = w / h;

    let drawW, drawH, offsetX = 0, offsetY = 0;

    if (canvasAspect > videoAspect) {
      drawW = w * dpr;
      drawH = (w * dpr) / videoAspect;
      // Refined anchoring: shift the video 35% into overage (cutting more bottom empty space)
      offsetY = (canvas.height - drawH) * 0.35;
    } else {
      drawH = h * dpr;
      drawW = (h * dpr) * videoAspect;
      offsetX = (canvas.width - drawW) / 2;
    }

    ctx.drawImage(video, offsetX, offsetY, drawW, drawH);
  };

  // Sync canvas with resize
  useEffect(() => {
    window.addEventListener("resize", renderFrame);
    return () => window.removeEventListener("resize", renderFrame);
  }, []);

  /* ─── GSAP UNIFIED MASTER TIMELINE ───────────────────────────────── */
  useEffect(() => {
    const video       = videoRef.current;
    const container   = containerRef.current;
    const heroContent = heroContentRef.current;
    const originText  = originTextRef.current;
    const smileText   = smileTextRef.current;
    const heroBtn     = heroBtnRef.current;
    
    if (!video || !container || !heroContent || !originText || !smileText || !heroBtn) return;

    const ctx = gsap.context(() => {
      let isInit = false;

      const initMasterTimeline = () => {
        if (isInit) return;
        isInit = true;

        let pollCount = 0;
        const MAX_POLLS = 30;

        const buildTimelines = (duration: number) => {
          const safeEnd = duration > 0.1 ? duration - 0.05 : duration;

          // ── PROXY & STATE ──
          const proxy = { time: 0 };

          // ── EXPLICIT INITIAL STATES ──
          gsap.set(originText, { opacity: 1, y: 0 });
          gsap.set(smileText,  { opacity: 0, y: 20 });
          gsap.set(heroBtn,    { opacity: 0, y: 30, scale: 0.9 });
          gsap.set(video, { opacity: 1 });

          // ── THE MASTER TIMELINE ──
          // It handles the entire "Sua Origem -> Seu Sorriso" narrative.
          const mainTl = gsap.timeline({ 
            paused: true,
            onUpdate: () => {
              if (video && !isNaN(proxy.time)) {
                video.currentTime = proxy.time;
                renderFrame();
              }
            }
          });

          // Text animations synced to the video duration
          mainTl.fromTo(originText,
            { opacity: 1, y: 0 },
            { opacity: 0, y: -30, duration: duration * 0.4, ease: "power2.inOut" }, 0);

          mainTl.fromTo(smileText,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: duration * 0.25, ease: "power2.out" }, duration * 0.75);

          mainTl.fromTo(heroBtn,
            { opacity: 0, y: 30, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: duration * 0.25, ease: "back.out(1.7)" }, duration * 0.8);

          // The "Driver": animates proxy.time which in turn updates video.currentTime
          mainTl.fromTo(proxy, { time: 0 }, { time: safeEnd, duration: duration, ease: "none" }, 0);

          // ── VIDEO PRIMING (Critical for Mobile Seeking) ──
          // We call play() then pause() immediately to notify the browser that seeking will start.
          video.play().then(() => {
            setIsVideoPrimed(true);
            video.pause();
            // Force an initial draw
            setTimeout(renderFrame, 50); 
            
            // ── PHASE 1: MECHANICAL INTRO ──
            mainTl.play();
          }).catch(() => {
            // Fallback for strict autoplay blocks: statically reveal the first frame
            if (video) video.currentTime = 0.01;
            setTimeout(renderFrame, 50);
            setIsVideoPrimed(true);
            mainTl.play();
          });

          // ── PHASE 2: MANUAL SCROLL HANDOVER ──
          let st: ScrollTrigger | null = null;
          const setupScroll = () => {
             if (st) return;
             st = ScrollTrigger.create({
               trigger: container,
               start: "top top",
               end: "bottom bottom",
               scrub: 1.2,
               animation: mainTl,
               invalidateOnRefresh: true,
             });
          };

          mainTl.eventCallback("onComplete", setupScroll);

          // Interrupt Intro on Scroll
          const onScrollInterrupt = () => {
            if (window.scrollY > 50) {
              mainTl.pause();
              setupScroll();
              window.removeEventListener("scroll", onScrollInterrupt);
            }
          };
          window.addEventListener("scroll", onScrollInterrupt, { passive: true });
        };

        // Polling until duration is available
        const pollDuration = () => {
          const d = video.duration;
          if (isFinite(d) && d > 0) {
            buildTimelines(d);
          } else if (pollCount < MAX_POLLS) {
            pollCount++;
            setTimeout(pollDuration, 100);
          } else {
            buildTimelines(4.8); // Robust mobile fallback (most hero videos are ~5s)
          }
        };
        pollDuration();
      };

      if (video.readyState >= 1) {
        initMasterTimeline();
      } else {
        video.addEventListener("loadedmetadata", initMasterTimeline);
      }

      const safetyId = setTimeout(initMasterTimeline, 2000);
      return () => {
        clearTimeout(safetyId);
        video.removeEventListener("loadedmetadata", initMasterTimeline);
      };
    });

    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* ─── PERCENTAGE COUNTER ANIMATION ────────────────────────────── */
  useEffect(() => {
    const el = percentRef.current;
    if (!el) return;

    const counter = { value: 0 };
    gsap.to(counter, {
      value: 98,
      duration: 1.5,
      delay: 0.8, // subtle delay to让用户看到开始
      ease: "power2.out",
      onUpdate: () => {
        if (el) el.textContent = Math.round(counter.value).toString();
      },
      scrollTrigger: {
        trigger: el,
        start: "top 95%",
        once: true,
      }
    });
  }, []);

  return (
    <main className="w-full bg-[#0D0D0D] overflow-x-clip">

      {/* ── HERO — NATIVE STICKY WRAPPER ─────────────────── */}
      <div
        ref={containerRef}
        className="hero-trigger bg-[#0D0D0D]"
        style={{
          position: "relative",
          height: "300vh", // SCROLL SCRUB DISTANCE
          width: "100%",
          zIndex: 10,
        }}
      >
        <div
          className="sticky-wrapper"
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            height: "100dvh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            pointerEvents: "auto",
          }}
        >
          {/* Main Visual Source (Hidden buffer) */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            /* @ts-ignore - non-standard WebKit prop */
            webkit-playsinline="true"
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            preload="auto"
            /* @ts-ignore - Safari specific prop */
            x-webkit-airplay="deny"
            onCanPlay={renderFrame}
            onPlaying={renderFrame}
            onSeeked={renderFrame}
            style={{
              position: "absolute",
              opacity: 0,
              pointerEvents: "none",
              width: "1px",  /* Some browsers need non-zero size to decode */
              height: "1px",
              zIndex: -1
            }}
          >
            <source src="/hero-background-new.mp4" type="video/mp4" />
          </video>

          {/* New Canvas Renderer — 100% Native-UI-Free */}
          <canvas
            ref={canvasRef}
            style={{
              position:       "absolute",
              top:            0,
              left:           0,
              width:          "100vw",
              height:         "100dvh",
              zIndex:         0,
              pointerEvents:  "none",
              willChange:     "transform",
              opacity:        1,
              transition:     "opacity 0.8s ease-in-out",
              transform:      "scale(1.2) translateZ(0)",
              filter:         "grayscale(1) contrast(1.1) brightness(0.6)",
            }}
          />

          {/* Background gradient - always visible as base */}
          <div 
            style={{ 
              position: "absolute", 
              inset: 0, 
              background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 30%, #0d0d0d 70%, #000000 100%)",
              zIndex: -1, 
              pointerEvents: "none"
            }} 
          />

          {/* ── NUCLEAR VIDEO CONTROLS SUPPRESSION ── */}
          <style dangerouslySetInnerHTML={{ __html: `
            video::-webkit-media-controls { display: none !important; -webkit-appearance: none; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }
            video::-webkit-media-controls-enclosure { display: none !important; visibility: hidden !important; }
            video::-webkit-media-controls-panel { display: none !important; visibility: hidden !important; }
            video::-webkit-media-controls-play-button { display: none !important; -webkit-appearance: none; visibility: hidden !important; }
            video::-webkit-media-controls-overlay-play-button { display: none !important; -webkit-appearance: none; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; width: 0 !important; height: 0 !important; }
            video::-webkit-media-controls-start-playback-button { display: none !important; -webkit-appearance: none; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }
            video::-internal-media-controls-download-button { display: none !important; visibility: hidden !important; }
            video::-internal-media-controls-overflow-button { display: none !important; visibility: hidden !important; }
            video::-webkit-media-controls-container { display: none !important; visibility: hidden !important; }
            video::--webkit-media-controls-play-button { display: none !important; visibility: hidden !important; }
            video::-moz-list-bullet { display: none !important; visibility: hidden !important; }
            /* Mobile-specific: completely hide any video controls layer */
            @media (max-width: 1024px), (pointer: coarse) {
              video::-webkit-media-controls-overlay-play-button,
              video::-webkit-media-controls-play-button {
                display: none !important;
                opacity: 0 !important;
                width: 0 !important;
                height: 0 !important;
                min-width: 0 !important;
                min-height: 0 !important;
                max-width: 0 !important;
                max-height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                position: absolute !important;
                left: -9999px !important;
                visibility: hidden !important;
                clip: rect(0,0,0,0) !important;
                -webkit-appearance: none !important;
              }
            }
          `}} />

          {/* ── IPHONE STEALTH OVERLAY (Hides play-button flash) ── */}
          <div 
            style={{ 
              position: "absolute", 
              inset: 0, 
              backgroundColor: "#000000", 
              zIndex: 999, 
              opacity: isVideoPrimed ? 0 : 1, 
              transition: "opacity 1.2s ease-in-out",
              pointerEvents: "none"
            }} 
          />

          {/* Gradient layers */}
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)", zIndex:1, pointerEvents:"none" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 20%, transparent 40%)", zIndex:1, pointerEvents:"none" }} />
          <div style={{ background:"radial-gradient(circle at center, rgba(0,0,0,0.5) 0%, transparent 70%)", position:"absolute", top:"40%", left:"50%", transform:"translate(-50%, -50%)", width:"90%", height:"50%", zIndex:1, pointerEvents:"none" }} />

          {/* ── Hero Content ── */}
          <div ref={heroContentRef} className="hero-content-split" style={{ pointerEvents: "auto", position: 'relative', height: '100%', zIndex: 2 }}>

            <div className="hero-text-group">
              <p ref={originTextRef} className="hero-overline">SUA ORIGEM,</p>
              <h1 ref={smileTextRef} className="hero-headline">
                Seu sorriso<span className="hero-period">.</span>
              </h1>
            </div>

            <div className="hero-action-group">
              <div className="hero-social-proof">
                <div className="hero-social-proof-row">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-google-icon">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="rgba(255,255,255,0.8)"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="rgba(255,255,255,0.8)"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="rgba(255,255,255,0.8)"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="rgba(255,255,255,0.8)"/>
                  </svg>
                  <span className="hero-stars">★★★★★</span>
                  <span className="hero-rating-text">4.9 no Google</span>
                </div>
                <div className="hero-social-proof-row hero-satisfaction-row">
                  <span className="hero-satisfaction-text"><span ref={percentRef}>0</span>% de satisfação dos pacientes</span>
                </div>
              </div>
              <a ref={heroBtnRef} href="#agendamento" className="hero-cta" style={{ position: 'relative', zIndex: 10 }}>
                AGENDAR CONSULTA →
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="relative z-30 bg-[#0D0D0D] pt-16">
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
        <LocationSection />
        <Footer />
      </div>
    </main>
  );
}
