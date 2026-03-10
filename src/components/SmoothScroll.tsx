"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.5,
        });

        // 1. Synchronize Lenis with ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        // 2. Optimized Ticker Integration (Fixes potential memory leak/conflicts)
        const updateRaf = (time: number) => {
            lenis.raf(time * 1000);
        };

        (window as any).__LENIS__ = lenis;

        gsap.ticker.add(updateRaf);
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            (window as any).__LENIS__ = null;
            gsap.ticker.remove(updateRaf);
        };
    }, []);

    return <>{children}</>;
}
