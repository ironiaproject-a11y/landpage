# Premium Site Reveal Implementation Walkthrough

This document outlines the implementation of the "Premium Reveal" typography animations across the landing page.

## Core Visual Concept

To achieve a "stunning first impression" and "premium aesthetic," we implemented a synchronized typography reveal system.

### Key Features:
- **Masked Entrance**: Text appears as if it is sliding up from an invisible slit, achieved using `overflow-hidden` containers.
- **GSAP Synchronization**: Using GSAP and ScrollTrigger for precise control over entrance timings and scroll-triggered re-reveals.
- **Skew & Opacity**: A 7-degree skew and 0 opacity start, settling into position with an `expo.out` or `power4.out` ease for that "luxury brand" feel.

## Implementation Details

### HTML/TSX Structure
Each major heading follows this nested structure to facilitate the reveal:
```tsx
<h2 ref={titleRef} className="...">
    <div className="block overflow-hidden pb-1">
        <span className="title-line-inner inline-block">Line One Text</span>
    </div>
    <div className="block overflow-hidden pb-1">
        <span className="title-line-inner inline-block text-gradient-gold">Line Two Text</span>
    </div>
</h2>
```

### GSAP Animation Logic
The animation is handled via a `useEffect` hook in each component:
```typescript
useEffect(() => {
    if (!mounted) return;
    const ctx = gsap.context(() => {
        const titleLines = Array.from(titleRef.current?.querySelectorAll(".title-line-inner") || []);
        if (titleLines.length > 0) {
            gsap.fromTo(titleLines,
                { y: "110%", skewY: 7, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: titleRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    y: 0,
                    skewY: 0,
                    opacity: 1,
                    stagger: 0.15,
                    duration: 1.2,
                    ease: "power4.out"
                }
            );
        }
    }, sectionRef);
    return () => ctx.revert();
}, [mounted]);
```

## Updated Components

The following components have been updated to include this premium effect:
- **Hero**: Extended with parallax and scrub-based reveals.
- **InstitutionalTrust**: Applied to the "Ciência e a Arte" header.
- **Services**: Integrated with asymmetrical grid reveals.
- **Amenities**: Consistent title reveal.
- **Experience**: Timeline-reveal synchronization.
- **CaseStudies**: Reveals matching the slider transitions.
- **FAQ**: Centered reveal for the header.
- **Contact**: Integrated with the form entrance.
- **Footer**: Added brand and section list reveals for complete consistency.

## Next Steps for Visual Excellence
- Ensure all Lucide icons maintain a `strokeWidth={1.2}` for a consistent "thin-line luxury" aesthetic. (Completed)
- Monitor `VisualContainer` (3D cards) performance across mobile devices.
