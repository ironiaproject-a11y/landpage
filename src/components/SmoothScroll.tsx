"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
            infinite: false,
        });

        // Sync GSAP with Lenis
        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // Normalize scroll for mobile and better consistency
        ScrollTrigger.normalizeScroll(true);
        
        // Expose lenis for other components
        (window as any).lenis = lenis;

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf as any);
            ScrollTrigger.normalizeScroll(false);
            (window as any).lenis = undefined;
        };
    }, []);

    return null;
}
