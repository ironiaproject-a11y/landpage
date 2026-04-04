/**
 * Centralized GSAP Setup
 * Import this instead of importing gsap + ScrollTrigger separately in every component.
 * Prevents duplicate plugin registration and race conditions.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
