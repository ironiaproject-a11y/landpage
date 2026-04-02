"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { WHATSAPP_NUMBER } from "@/config/constants";

/* ─── CONFIG ─────────────────────────────────────────────────────────── */
const CLINICA = "Sua origem, Seu sorriso";
const CLINIC_WA = WHATSAPP_NUMBER.replace(/\D/g, "") || '5511999999999';

/* ─── TYPES ──────────────────────────────────────────────────────────── */
interface BotResponse {
  title?: string;
  text?: string;
  html?: string;
  suggestions?: string[];
  escalate?: boolean;
}

interface Message {
  role: "bot" | "user";
  title?: string;
  text?: string;
  html?: string;
  suggestions?: string[];
}

/* ─── ICON HELPERS ───────────────────────────────────────────────────── */
const BotIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 9V7c0-1.1-.9-2-2-2h-3V3h-2v2H9V3H7v2H4c-1.1 0-2 .9-2 2v2c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h.17C4.58 20.72 6.17 22 8 22h8c1.83 0 3.42-1.28 3.83-3H20c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zm-2 8H6v-2H4v-6h.83C5.4 7.83 6.64 7 8 7h8c1.36 0 2.6.83 3.17 2H20v6h-2v2zM9 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChatBubbleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-2 10H6V10h12zm0-3H6V7h12z" />
  </svg>
);

/* ─── BOT LOGIC (From flow.js) ────────────────────────────────────────── */
function handleBotFlow(input: string, ctx: any): BotResponse {
  const kw = String(input || '').toLowerCase();

  // booking intent
  if (/agend|marcar|consulta|hora/.test(kw)) {
    return {
      title: 'Agendamento',
      text: 'Perfeito — posso agendar uma avaliação. Informe um dia da semana e horário aproximado (ex: terça de manhã) e se precisa prioridade.',
      suggestions: ['Terça de manhã', 'Quarta à tarde', 'Sexta de manhã', 'Preciso urgente', 'Enviar pelo WhatsApp']
    };
  }

  // emergency/acute signs
  if (/(sangra|sangramento|incha|inchaço|inchado|dor intensa|dor forte|febre|dificuldade para respirar|difícil engolir|engolir)/.test(kw)) {
    return {
      title: 'Sinais de emergência',
      text: 'Se há sangramento intenso, inchaço que dificulta respirar/engolir, febre alta ou dor insuportável, procure emergência imediatamente. Posso ligar para a clínica ou priorizar sua vaga — prefere isso?',
      suggestions: ['Ligar pra clínica', 'Marcar primeira vaga', 'Explicar sintomas']
    };
  }

  // duration/severity follow-up
  if (/(há|faz)\s*\d+|dias|semanas|meses|há pouco tempo|sumiu|melhorou|piorou/.test(kw) || /(leve|moderada|forte|insuportável|intensa)/.test(kw)) {
    return {
      title: 'Obrigado pela informação',
      text: 'Obrigado — isso ajuda. Para priorizar: você tem febre, inchaço visível ou secreção/pus na boca?',
      suggestions: ['Tenho febre', 'Há inchaço', 'Não, só dor']
    };
  }

  // toothache general
  if (/(dor de dente|dor no dente|toothache|doendo|dor aguda)/.test(kw)) {
    ctx.lastIssue = 'dor_de_dente';
    return {
      title: 'Dor de dente',
      text: 'A dor de dente pode ser por cárie, infecção (pulpite), fratura ou sensibilidade. Para alívio imediato: enxágue com água morna e sal, evite mastigar do lado afetado e analgésico conforme tolerância. Quer que eu agende uma avaliação ou prefere orientações para dor agora?',
      suggestions: ['Agendar avaliação', 'Dicas para alívio agora', 'Quero falar com atendente']
    };
  }

  // pain when chewing
  if (/(mastig|dor ao mastig|dói ao mastig)/.test(kw)) {
    ctx.lastIssue = 'dor_mastigar';
    return {
      title: 'Dor ao mastigar',
      text: 'Dor ao mastigar normalmente indica problema estrutural (fratura) ou cárie profunda. Evite mastigar do lado afetado e faça bochechos mornos. Deseja que eu verifique opções de horário ou envie orientações por WhatsApp?',
      suggestions: ['Ver horários', 'Enviar pelo WhatsApp', 'Dúvidas']
    };
  }

  // nocturnal/night pain
  if (/(dor à noite|acorda à noite|dor noturna|acordo com dor)/.test(kw)) {
    ctx.lastIssue = 'dor_noturna';
    return {
      title: 'Dor noturna',
      text: 'Dor que acorda à noite costuma indicar inflamação pulpar (necessidade de tratamento de canal) ou infecção. Recomendo agendar avaliação com prioridade. Deseja que eu confira horários?',
      suggestions: ['Sim, verificar horários', 'Quero orientações para dormir', 'Dúvidas']
    };
  }

  // sensitivity
  if (/sensibilidade|sensível|frio|doe com frio|sensível ao frio|sensível ao doce/.test(kw)) {
    ctx.lastIssue = 'sensibilidade';
    return {
      title: 'Sensibilidade dentária',
      text: 'Sensibilidade ao frio/doce pode vir de desgaste do esmalte, retração gengival ou restauração com fim de vida útil. Tente creme dental dessensibilizante e escova macia; podemos avaliar e aplicar flúor profissional.',
      suggestions: ['Marcar avaliação', 'Produtos recomendados', 'Dúvidas']
    };
  }

  // broken filling / lost crown
  if (/(coroa|coroa caiu|restauração caiu|obturação caiu|plomb|caiu|colocou|coroa solta|protese solta)/.test(kw)) {
    ctx.lastIssue = 'restauracao_solta';
    return {
      title: 'Restauração / prótese solta',
      text: 'Se uma restauração ou coroa caiu, guarde o fragmento e evite mastigar. Trazer o fragmento pode facilitar a reparação. Deseja agendar urgente para recolocação?',
      suggestions: ['Agendar urgente', 'Como guardar o fragmento', 'Dúvidas']
    };
  }

  // cosmetic
  if (/(clareamento|faceta|veneers|facetas|estética|sorriso bonito|estético)/.test(kw)) {
    ctx.lastIssue = 'estetica';
    return {
      title: 'Estética dentária',
      text: 'Oferecemos clareamento, facetas e restaurações estéticas. Uma avaliação define opções e custos. Deseja agendar para avaliação estética?',
      suggestions: ['Agendar avaliação estética', 'Ver opções de tratamento', 'Dúvidas']
    };
  }

  // human attendant
  if (/(atendente|falar com atendente|atendimento humano|humano|falar com humano)/.test(kw)) {
    return {
      title: 'Atendimento humano',
      text: 'Posso encaminhar para um atendente humano. Deseja solicitação imediata ou preferir que entrem em contato mais tarde?',
      suggestions: ['Solicitar agora', 'Prefiro horário', 'Dúvidas']
    };
  }

  if (/solicitar atendimento agora|solicitar atendimento|solicitar atendente|solicitar atendimento já/.test(kw)) {
    return {
      title: 'Encaminhando para atendente',
      text: 'Certo — estou encaminhando seu pedido para um atendente humano. A equipe receberá a solicitação e entrará em contato em breve. Deseja enviar seu nome e telefone para agilizar?',
      suggestions: ['Enviar nome e telefone', 'Não, obrigado'],
      escalate: true
    };
  }

  // WhatsApp booking
  if (/(enviar pelo whatsapp|enviar pelo whats|enviar pelo zap|whatsapp|whats|zap)/.test(kw)) {
    const issueLabel = ctx.lastIssue ? ctx.lastIssue.replace(/_/g, ' ') : 'agendamento';
    const preText = `Olá! Gostaria de agendar uma avaliação na clínica "${CLINICA}". Motivo: ${issueLabel}. Pode confirmar horários disponíveis e orientações, por favor?`;
    const url = `https://wa.me/${CLINIC_WA}?text=${encodeURIComponent(preText)}`;
    return {
      title: 'Enviar pelo WhatsApp',
      html: `Clique para abrir o WhatsApp e enviar sua solicitação: <br><br><a href="${url}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;background:#25D366;color:#fff;padding:8px 14px;border-radius:20px;text-decoration:none;font-size:13px;font-weight:600;">Falar pelo WhatsApp</a>`,
      suggestions: ['Enviei pelo WhatsApp', 'Quero outra opção']
    };
  }

  // Fallback
  return {
    title: 'Posso ajudar com:',
    text: 'Se preferir, diga resumidamente qual é o problema (ex: "dor ao mastigar", "sensibilidade", "quero agendar"). Posso fazer triagem e agendar.',
    suggestions: ['Dói ao mastigar', 'Sensibilidade ao frio', 'Quero agendar', 'Tenho inchaço']
  };
}

/* ─── COMPONENT ──────────────────────────────────────────────────────── */
export function SofiaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState("Online");
  const ctxRef = useRef<any>({});
  const msgsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const didGreet = useRef(false);

  /* Reveal after preloader */
  useEffect(() => {
    const show = () => setIsVisible(true);
    window.addEventListener("preloader-exiting", show);
    if (!(window as any).__PRELOADER_ACTIVE__) setIsVisible(true);
    return () => window.removeEventListener("preloader-exiting", show);
  }, []);

  /* Auto-scroll */
  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* Focus input on open */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const addBotMessage = useCallback((response: BotResponse) => {
    setIsTyping(true);
    
    // Simulate typing delay based on length
    const textLen = (response.text || response.html || "").length;
    const delay = Math.min(600 + textLen * 20, 2000);

    setTimeout(() => {
      setIsTyping(false);
      if (response.escalate) {
        setStatus("Solicitando atendente...");
        setTimeout(() => setStatus("Atendimento solicitado"), 1800);
      }
      setMessages(prev => [...prev, { role: "bot", ...response }]);
    }, delay);
  }, []);

  const greet = useCallback(() => {
    if (didGreet.current) return;
    didGreet.current = true;
    addBotMessage({
      title: 'Olá 👋',
      text: `Bem-vindo à ${CLINICA}! Sou o assistente virtual. Posso ajudar com dores, agendamentos e informações sobre tratamentos. Como posso ajudar você hoje?`,
      suggestions: ['Dói ao mastigar', 'Sensibilidade ao frio', 'Quero agendar']
    });
  }, [addBotMessage]);

  const handleToggle = useCallback(() => {
    setIsOpen(prev => {
      const next = !prev;
      if (next && !didGreet.current) greet();
      return next;
    });
  }, [greet]);

  const handleSend = useCallback((textOverride?: string) => {
    const text = textOverride || inputVal.trim();
    if (!text) return;

    if (!textOverride) setInputVal("");
    setMessages(prev => [...prev, { role: "user", text }]);

    const response = handleBotFlow(text, ctxRef.current);
    addBotMessage(response);
  }, [inputVal, addBotMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      <style>{`
        @keyframes sofia-pulse{0%{transform:scale(1);opacity:.7}70%,100%{transform:scale(1.5);opacity:0}}
        @keyframes sofia-fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sofia-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
        .sofia-msg-anim{animation:sofia-fadeUp .3s ease}
        .sofia-bounce-1{animation:sofia-bounce 1.2s infinite}
        .sofia-bounce-2{animation:sofia-bounce 1.2s .2s infinite}
        .sofia-bounce-3{animation:sofia-bounce 1.2s .4s infinite}
        @media(max-width:440px){
          #sofia-window{bottom:0!important;right:0!important;width:100vw!important;max-width:100vw!important;height:100dvh!important;max-height:100dvh!important;border-radius:0!important;}
          #sofia-fab{bottom:88px!important;right:16px!important;}
        }
      `}</style>

      {/* ── FAB ────────────────────────────────────────────────────────── */}
      <button
        id="sofia-fab"
        aria-label="Abrir chat"
        onClick={handleToggle}
        style={{
          position: "fixed",
          bottom: 100,
          right: 28,
          width: 62,
          height: 62,
          background: "#000000",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 40px rgba(0,0,0,.35)",
          border: "none",
          transition: "transform .25s, opacity .6s",
          zIndex: 9998,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1)" : "scale(0.7)",
          color: "#fff",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        <ChatBubbleIcon />
        <span
          style={{
            position: "absolute",
            width: 62,
            height: 62,
            borderRadius: "50%",
            border: "2px solid #000",
            animation: "sofia-pulse 2.4s infinite",
            pointerEvents: "none",
          }}
        />
      </button>

      {/* ── CHAT WINDOW ─────────────────────────────────────────────────── */}
      <div
        id="sofia-window"
        style={{
          position: "fixed",
          bottom: 174,
          right: 28,
          width: 380,
          maxWidth: "calc(100vw - 32px)",
          height: 580,
          maxHeight: "calc(100vh - 130px)",
          background: "#ffffff",
          borderRadius: 18,
          boxShadow: "0 8px 40px rgba(0,0,0,.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 9999,
          transform: isOpen ? "scale(1) translateY(0)" : "scale(.92) translateY(16px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "all" : "none",
          transition: "opacity .3s, transform .3s",
        }}
      >
        {/* Header */}
        <div style={{ background: "#000", padding: "18px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", color: "#fff" }}>
            <BotIcon size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{CLINICA}</div>
            <div style={{ color: "rgba(255,255,255,.7)", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
              {status}
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
            <CloseIcon />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", background: "#f8f8f8", display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((msg, i) => (
            <div key={i} className="sofia-msg-anim" style={{ alignSelf: msg.role === "bot" ? "flex-start" : "flex-end", maxWidth: "85%" }}>
              {msg.role === "bot" && msg.title && (
                <div style={{ fontSize: 11, color: "#888", marginBottom: 4, marginLeft: 4 }}>{msg.title}</div>
              )}
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: msg.role === "bot" ? "14px 14px 14px 4px" : "14px 14px 4px 14px",
                  background: msg.role === "bot" ? "#fff" : "#000",
                  color: msg.role === "bot" ? "#000" : "#fff",
                  fontSize: 14,
                  lineHeight: 1.5,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  border: msg.role === "bot" ? "1px solid #eee" : "none"
                }}
              >
                {msg.html ? (
                  <div dangerouslySetInnerHTML={{ __html: msg.html }} />
                ) : (
                  msg.text
                )}
                
                {msg.suggestions && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                    {msg.suggestions.map((s, si) => (
                      <button
                        key={si}
                        onClick={() => handleSend(s)}
                        style={{
                          background: "#fff",
                          border: "1px solid #ddd",
                          padding: "5px 10px",
                          borderRadius: 8,
                          fontSize: 12,
                          cursor: "pointer",
                          transition: "border-color .2s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#000"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "#ddd"}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ alignSelf: "flex-start", background: "#fff", padding: "12px 16px", borderRadius: "14px 14px 14px 4px", display: "flex", gap: 4 }}>
              {[1, 2, 3].map(n => (
                <span key={n} className={`sofia-bounce-${n}`} style={{ width: 6, height: 6, background: "#ccc", borderRadius: "50%" }} />
              ))}
            </div>
          )}
          <div ref={msgsEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: 16, borderTop: "1px solid #eee", display: "flex", gap: 10 }}>
          <input
            ref={inputRef}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua dúvida..."
            style={{ flex: 1, border: "1px solid #ddd", borderRadius: 10, padding: "10px 14px", fontSize: 14, outline: "none" }}
          />
          <button
            onClick={() => handleSend()}
            style={{ width: 42, height: 42, borderRadius: "50%", background: "#000", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </>
  );
}
