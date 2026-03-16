"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 0.8, // Snappier response
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1.1, // Slightly more travel
            touchMultiplier: 1.5,
            infinite: false,
        });

        // Sync GSAP with Lenis
        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // Remove normalization to increase main thread responsiveness
        // ScrollTrigger.normalizeScroll(true);
        
        // Expose lenis for other components
        (window as any).lenis = lenis;

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf as any);
            // ScrollTrigger.normalizeScroll(false);
            (window as any).lenis = undefined;
        };
    }, []);

    return null;
}
