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
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        // 1. Synchronize Lenis with ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        // 2. Add Lenis's raf method to GSAP's ticker
        // This ensures GSAP animations and Lenis scroll are perfectly in sync
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        // 3. Disable GSAP's lag smoothing to prevent stuttering
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);
        };
    }, []);

    return <>{children}</>;
}
