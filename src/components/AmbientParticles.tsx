"use client";

import { useEffect, useRef } from "react";
import { m } from "framer-motion";

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
}

export function AmbientParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            if (typeof window !== "undefined") {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };
        resizeCanvas();
        if (typeof window !== "undefined") {
            window.addEventListener("resize", resizeCanvas);
        }

        // Initialize particles - Reduced for mobile
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 15 : 40;
        particlesRef.current = Array.from({ length: particleCount }, () => ({
            x: Math.random() * (canvas.width || 800),
            y: Math.random() * (canvas.height || 600),
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * (isMobile ? 0.1 : 0.2),
            speedY: (Math.random() - 0.5) * (isMobile ? 0.1 : 0.2),
            opacity: Math.random() * 0.2 + 0.05
        }));

        let scrollY = typeof window !== "undefined" ? window.scrollY : 0;
        const handleScroll = () => {
            if (typeof window !== "undefined") {
                scrollY = window.scrollY;
            }
        };
        if (typeof window !== "undefined") {
            window.addEventListener("scroll", handleScroll, { passive: true });
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((particle, i) => {
                // Parallax drift based on scroll
                const parallaxOffset = scrollY * (0.05 + (i % 5) * 0.02);
                const currentY = (particle.y - parallaxOffset) % canvas.height;
                const finalY = currentY < 0 ? currentY + canvas.height : currentY;

                // Update base position for horizontal drift
                particle.x += particle.speedX;
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, finalY, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(226, 232, 240, ${particle.opacity})`;
                ctx.fill();

                // Subtle glow - only for some particles
                if (i % 3 === 0) {
                    const gradient = ctx.createRadialGradient(
                        particle.x, finalY, 0,
                        particle.x, finalY, particle.size * 6
                    );
                    gradient.addColorStop(0, `rgba(226, 232, 240, ${particle.opacity * 0.2})`);
                    gradient.addColorStop(1, "rgba(226, 232, 240, 0)");
                    ctx.fillStyle = gradient;
                    ctx.beginPath(); // Ensure a new path for the glow
                    ctx.arc(particle.x, finalY, particle.size * 6, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("scroll", handleScroll);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <m.canvas
            ref={canvasRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
            className="absolute inset-0 pointer-events-none z-[5]"
            style={{ mixBlendMode: "screen" }}
        />
    );
}
