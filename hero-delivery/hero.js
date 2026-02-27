/**
 * HERO JS - GSAP Scroll-Sync
 * Mapeia o currentTime do vídeo para o progresso do scroll do usuário.
 */
document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById('heroVideo');
    const trigger = document.querySelector('.hero-trigger');

    if (!video || !trigger) return;

    // Acessibilidade: verifica preferência de movimento reduzido
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Registra o ScrollTrigger (necessário para o GSAP)
    gsap.registerPlugin(ScrollTrigger);

    /**
     * Inicializa a animação de scroll assim que o vídeo estiver pronto
     */
    video.onloadedmetadata = function () {
        if (prefersReduced) {
            // No fallback de movimento reduzido, apenas mostra um frame ou deixa estático
            video.currentTime = 0;
            return;
        }

        // Criamos o ScrollTrigger
        gsap.fromTo(video, {
            currentTime: 0
        }, {
            currentTime: video.duration || 1, // Evita divisão por zero
            ease: "none", // Velocidade perfeitamente proporcional ao scroll
            scrollTrigger: {
                trigger: trigger,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.2, // Adiciona uma inércia/suavidade (smoothness)
                markers: false // Mude para true para debug visual dos gatilhos
            }
        });
    };

    // Caso o metadata já tenha carregado antes do listener
    if (video.readyState >= 2) {
        video.onloadedmetadata();
    }
});
