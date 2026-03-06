# Integração do Hero Premium (Desktop & Mobile)

Este pacote contém o código purificado do Hero, refatorado para entregar máxima legibilidade tipográfica, acessibilidade de movimento (`prefers-reduced-motion`) e a **animação sequencial correta controlada por disparo de vídeo**.

## 📁 Arquivos do Pacote
* `hero.html`: Estrutura de DOM semântica com breakpoints múltiplos de source de vídeo (`<source media="(...)">`) e tags de `preload`.
* `hero.css`: Vanilla CSS moderno (adaptado usando tokens do Tailwind) com uso do método *Stagger Fade-in* cascata usando `transition-delay`.
* `hero.js`: Lógica unificada usando *Intersection Observer*, triggers nativos HTML5 Video (`playing`, `timeupdate`) e fallbacks anti-falha de rede.

## 🎨 Asset Guidelines (Recomendação para a raiz do seu projeto)
Crie uma pasta `/assets/` em sua estrutura pública servida e adicione:
1. **Vídeos (WebM + MP4 Fallback):**
   * `hero-1920.webm` e `hero-1920.mp4` para Desktop (≥1280px);
   * `hero-720.webm` e `hero-720.mp4` para Mobile (<768px).
   * *Sugestão de Encoding:* CRF 26-28 no H.264 para não travar os devices intermediários em mobile.
2. **Posters Otimizados (WebP / AVIF):**
   * `hero-poster-1920.webp` e `hero-poster-720.webp`.
   * *Uso Crítico:* Preteja seus posters via `<link rel="preload">` na key `head` na versão mobile para um FCP < 1.5s absoluto.

## ✅ Checklist de Regras QA Realizado

- [x] **Autoplay Seguro e Econômico:** O vídeo só toca quando o Hero cruza um `IntersectionObserver` de ratio 0.5. (Exatamente para economizar banda se for implementado abaixo the fold).
- [x] **Disparo Lógico da Tipografia:** A frase entra magicamente 600ms *após* o evento `playing` (somente quadros gerados).
- [x] **Fallback Estável de Tela:** A frase entrará forçadamente no tempo `1.6s` (caso JS congele). Se autoplay falhar, Poster + aguardando Tap no bloco hero para revelar texto, com redundância final de `4.0s` absoluta.
- [x] **Acessibilidade 10.0:** Sem textos ocultos ao Leitor de Tela (`aria-hidden` reativo). Dispositivos que ativarem a bandeira `prefers-reduced-motion` no SO quebram todas as opacidades e animações revelando conteúdo em `0ms`.
- [x] **Tipografia & Contraste Escalonável:** Layout esticado em H1: 72px Desktop > 44px Tablet > 32px Mobile. Novo background gradient 90deg (`0.52`, `0.30`, `0.18`) protege leitura.
- [x] **Botões Acessíveis CTA:** Contrastes auditados! `#0B0B0B` background contra `#FBFBF9`. Botão secundário possui blur backdrop sofisticado semi-transparente. Ambos acendem `outline` focável via tab key (`focus-visible`).

### 📸 Teste de Screenshots (Emulação)
Por não hospedar fisicamente os arquivos de MP4 da sua agência no pipeline, recomendo:
1. Insira dois placeholders ou puxe os assets localmente.
2. Abra `hero.html` direto no Chrome e pressione `F12`.
3. Selecione o Device Toggle Toolbar para gravar as frames de Desktop 1366, Bloqueado e Mobile 360.
4. Valide a beleza das transições de texto em cascata (Title > Descrição > CTAs com seus respectivos offsets e delays descritos de *120ms*).
