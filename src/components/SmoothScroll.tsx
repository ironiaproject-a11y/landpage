"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll() {
    useEffect(() => {
        // ── Skip Lenis on touch/mobile — native scroll is faster ──
        const isTouch = window.matchMedia("(pointer: coarse)").matches;
        if (isTouch) return;

        const lenis = new Lenis({
            duration: 0.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1.1,
            touchMultiplier: 1.5,
            infinite: false,
        });

        // Sync GSAP with Lenis
        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // Expose lenis for other components
        (window as any).lenis = lenis;

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf as any);
            (window as any).lenis = undefined;
        };
    }, []);

    return null;
}
