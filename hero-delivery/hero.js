document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById('heroVideo');
    const trigger = document.querySelector('.hero-trigger');

    if (!video || !trigger) return;

    // Acessibilidade: verifica preferência de movimento reduzido
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Registra o ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    let scrollTriggerCreated = false;

    const initScroll = () => {
        if (scrollTriggerCreated) return;

        if (prefersReduced) {
            video.currentTime = 0;
            return;
        }

        // Garante que a duração é válida
        if (!video.duration || isNaN(video.duration)) {
            video.addEventListener("loadedmetadata", initScroll, { once: true });
            return;
        }

        scrollTriggerCreated = true;

        // Prime video for seeking
        video.play().then(() => video.pause()).catch(() => {});
        gsap.set(video, { opacity: 1, visibility: "visible" });

        gsap.to(video, {
            currentTime: video.duration,
            ease: "none",
            overwrite: true,
            scrollTrigger: {
                trigger: trigger,
                start: "top top",
                end: "bottom bottom",
                scrub: 1, // Suavidade otimizada
                markers: false,
                invalidateOnRefresh: true
            }
        });
    };

    // Inicialização robusta
    if (video.readyState >= 1) {
        initScroll();
    } else {
        video.addEventListener("loadedmetadata", initScroll, { once: true });
    }
});
