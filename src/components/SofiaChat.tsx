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

/* ─── BOT LOGIC ──────────────────────────────────────────────────────── */
function handleBotFlow(input: string, ctx: any): BotResponse {
  const kw = String(input || '').toLowerCase();

  // 1. Booking intent
  if (/agend|marcar|consulta|hora/.test(kw)) {
    return {
      title: 'Agendamento',
      text: 'Perfeito — posso agendar uma avaliação. Informe um dia da semana e horário aproximado (ex: terça de manhã) e se precisa prioridade.',
      suggestions: ['Terça de manhã', 'Quarta à tarde', 'Sexta de manhã', 'Preciso urgente', 'Enviar pelo WhatsApp']
    };
  }

  // 2. Emergency/acute signs
  if (/(sangra|sangramento|incha|inchaço|inchado|dor intensa|dor forte|febre|dificuldade para respirar|difícil engolir|engolir)/.test(kw)) {
    return {
      title: 'Sinais de emergência',
      text: 'Se há sangramento intenso, inchaço que dificulta respirar/engolir, febre alta ou dor insuportável, procure emergência imediatamente. Posso ligar para a clínica ou priorizar sua vaga — prefere isso?',
      suggestions: ['Ligar pra clínica', 'Marcar primeira vaga', 'Explicar sintomas']
    };
  }

  // 3. Duration/severity follow-up
  if (/(há|faz)\s*\d+|dias|semanas|meses|há pouco tempo|sumiu|melhorou|piorou/.test(kw) || /(leve|moderada|forte|insuportável|intensa)/.test(kw)) {
    return {
      title: 'Obrigado pela informação',
      text: 'Obrigado — isso ajuda. Para priorizar: você tem febre, inchaço visível ou secreção/pus na boca?',
      suggestions: ['Tenho febre', 'Há inchaço', 'Não, só dor']
    };
  }

  // 4. Toothache general
  if (/(dor de dente|dor no dente|toothache|doendo|dor aguda)/.test(kw)) {
    ctx.lastIssue = 'dor_de_dente';
    return {
      title: 'Dor de dente',
      text: 'A dor de dente pode ser por cárie, infecção (pulpite), fratura ou sensibilidade. Para alívio imediato: enxágue com água morna e sal, evite mastigar do lado afetado e analgésico conforme tolerância. Quer que eu agende uma avaliação ou prefere orientações para dor agora?',
      suggestions: ['Agendar avaliação', 'Dicas para alívio agora', 'Quero falar com atendente']
    };
  }

  // 5. Pain when chewing
  if (/(mastig|dor ao mastig|dói ao mastig)/.test(kw)) {
    ctx.lastIssue = 'dor_mastigar';
    return {
      title: 'Dor ao mastigar',
      text: 'Dor ao mastigar normalmente indica problema estrutural (fratura) ou cárie profunda. Evite mastigar do lado afetado e faça bochechos mornos. Deseja que eu verifique opções de horário ou envie orientações por WhatsApp?',
      suggestions: ['Ver horários', 'Enviar pelo WhatsApp', 'Dúvidas']
    };
  }

  // 6. Nocturnal/night pain
  if (/(dor à noite|acorda à noite|dor noturna|acordo com dor)/.test(kw)) {
    ctx.lastIssue = 'dor_noturna';
    return {
      title: 'Dor noturna',
      text: 'Dor que acorda à noite costuma indicar inflamação pulpar (necessidade de tratamento de canal) ou infecção. Recomendo agendar avaliação com prioridade. Deseja que eu confira horários?',
      suggestions: ['Sim, verificar horários', 'Quero orientações para dormir', 'Dúvidas']
    };
  }

  // 7. Sensitivity
  if (/sensibilidade|sensível|frio|doe com frio|sensível ao frio|sensível ao doce/.test(kw)) {
    ctx.lastIssue = 'sensibilidade';
    return {
      title: 'Sensibilidade dentária',
      text: 'Sensibilidade ao frio/doce pode vir de desgaste do esmalte, retração gengival ou restauração com fim de vida útil. Tente creme dental dessensibilizante e escova macia; podemos avaliar e aplicar flúor profissional.',
      suggestions: ['Marcar avaliação', 'Produtos recomendados', 'Dúvidas']
    };
  }

  // 8. Broken filling / lost crown
  if (/(coroa|coroa caiu|restauração caiu|obturação caiu|plomb|caiu|colocou|coroa solta|protese solta)/.test(kw)) {
    ctx.lastIssue = 'restauracao_solta';
    return {
      title: 'Restauração / prótese solta',
      text: 'Se uma restauração ou coroa caiu, guarde o fragmento e evite mastigar. Trazer o fragmento pode facilitar a reparação. Deseja agendar urgente para recolocação?',
      suggestions: ['Agendar urgente', 'Como guardar o fragmento', 'Dúvidas']
    };
  }

  // 9. Implant / peri-implantitis pain
  if (/(implante|dor no implante|peri-implantite|parafuso solto)/.test(kw)) {
    ctx.lastIssue = 'implante';
    return {
      title: 'Problema com implante',
      text: 'Dor ao redor de um implante pode ser sinal de inflamação peri-implantar ou sobrecarga. É importante avaliar em breve para evitar perda. Posso priorizar seu atendimento ou enviar instruções para higiene local?',
      suggestions: ['Agendar avaliação', 'Instruções de higiene', 'Dúvidas']
    };
  }

  // 10. Post-op pain
  if (/(extração recente|operação|sair sangue pós|pós-operatório|pós operatório|fora|dentro de pouco tempo.*extração)/.test(kw)) {
    ctx.lastIssue = 'pos_op';
    return {
      title: 'Pós-operatório',
      text: 'Para dor pós-operatória siga as orientações do cirurgião: gelo nas primeiras 24h (externo), evitar cuspir e esforço, e analgesia conforme receitado. Se houver sangramento ativo, febre ou pus, procure contato urgente.',
      suggestions: ['Preciso de ajuda agora', 'Agendar revisão', 'Dúvidas']
    };
  }

  // 11. Loose tooth
  if (/(dente mole|dente solto|mole|solto|bate)/.test(kw)) {
    ctx.lastIssue = 'dente_mole';
    return {
      title: 'Dente solto',
      text: 'Dente solto em adulto pode indicar doença periodontal avançada, trauma ou problemas de suporte ósseo. Evite mexer no dente e agende avaliação para investigar e tratar o mais rápido possível.',
      suggestions: ['Agendar avaliação', 'O que evitar fazer', 'Dúvidas']
    };
  }

  // 12. Orthodontic concerns
  if (/(apinhamento|apinhado|sorriso torto|alinhamento|aparelho ortodôntico|aparelho|ortodontia)/.test(kw)) {
    ctx.lastIssue = 'ortodontia';
    return {
      title: 'Ortodontia / alinhamento',
      text: 'Temos opções de ortodontia convencional e alinhadores. Posso agendar uma avaliação para plano de tratamento e orçamento. Quer marcar uma avaliação gratuita (triagem)?',
      suggestions: ['Sim, agendar triagem', 'Quero orçamento', 'Dúvidas']
    };
  }

  // 13. Cosmetic
  if (/(clareamento|faceta|veneers|facetas|estética|sorriso bonito|estético)/.test(kw)) {
    ctx.lastIssue = 'estetica';
    return {
      title: 'Estética dentária',
      text: 'Oferecemos clareamento, facetas e restaurações estéticas. Uma avaliação define opções e custos. Deseja agendar para avaliação estética?',
      suggestions: ['Agendar avaliação estética', 'Ver opções de tratamento', 'Dúvidas']
    };
  }

  // 14. Halitosis
  if (/(halitose|mau hálito|mau halito|cheiro ruim)/.test(kw)) {
    ctx.lastIssue = 'mau_halito';
    return {
      title: 'Mau hálito (halitose)',
      text: 'Mau hálito pode vir de placa, cáries, gengivite ou problemas sistêmicos. Inicialmente escove língua, use fio dental e enxágue; podemos marcar limpeza e avaliação para descobrir a causa.',
      suggestions: ['Agendar limpeza', 'Produtos recomendados', 'Dúvidas']
    };
  }

  // 15. Price / info
  if (/preço|valor|quanto custa|custa/.test(kw)) {
    return {
      title: 'Informações de preço',
      text: 'Os valores dependem do diagnóstico. Posso agendar uma avaliação para orçamento personalizado ou enviar uma estimativa por WhatsApp se preferir.',
      suggestions: ['Agendar avaliação', 'Enviar estimativa por WhatsApp', 'Não, obrigado']
    };
  }

  // 16. Treatments overview
  if (/como funciona|tratament|tratamento|o que fazem/.test(kw)) {
    return {
      title: 'Tratamentos oferecidos',
      html: '<strong>Oferecemos:</strong><ul style="padding-left:20px;margin-top:8px;"><li>Restaurações e tratamentos de canal</li><li>Limpeza, tratamento periodontal</li><li>Clareamento e estética</li><li>Implantes e próteses</li><li>Ortodontia e alinhadores</li></ul>',
      suggestions: ['Agendar avaliação', 'Dúvidas']
    };
  }

  // 17. Anxiety
  if (/(medo|ansiedade|fobia|tenso|nervoso|sinto medo)/.test(kw)) {
    return {
      title: 'Medo de dentista',
      text: 'Entendo perfeitamente. Temos atendimento acolhedor, explicamos cada passo e usamos técnicas para seu conforto. Quer falar com nosso atendente humano sobre isso?',
      suggestions: ['Falar com atendente', 'Quero marcar com cuidado', 'Dúvidas']
    };
  }

  // 18. Pediatric
  if (/(criança|filho|bebê|dente de leite|dente de criança|cárie infantil)/.test(kw)) {
    ctx.lastIssue = 'pediatria';
    return {
      title: 'Atendimento infantil',
      text: 'Atendemos crianças com abordagem lúdica e tranquila. Deseja agendar uma consulta para seu filho(a)?',
      suggestions: ['Agendar para criança', 'Dicas para escovação infantil', 'Dúvidas']
    };
  }

  // 19. Human Attendant
  if (/(atendente|falar com atendente|atendimento humano|humano|falar com humano)/.test(kw)) {
    return {
      title: 'Atendimento humano',
      text: 'Posso encaminhar para um atendente humano. Deseja solicitação imediata ou prefere que entrem em contato mais tarde?',
      suggestions: ['Solicitar agora', 'Prefiro horário', 'Dúvidas']
    };
  }

  if (/solicitar atendimento agora|solicitar atendimento|solicitar atendente|solicitar atendimento já/.test(kw)) {
    return {
      title: 'Encaminhando para atendente',
      text: 'Certo — estou encaminhando seu pedido para a recepção. A equipe entrará em contato em breve. Deseja enviar seu nome para facilitar?',
      suggestions: ['Enviar nome', 'Não, obrigado'],
      escalate: true
    };
  }

  // 20. Confirm booking options
  if (/marcar primeira vaga|marcar vaga|marcar urgência|marcar avaliação|agendar avaliação|sim, agendar|sim agendar|sim, agendar avaliação/.test(kw)) {
    return {
      title: 'Confirmar agendamento',
      text: 'Agendei uma pré-reserva. Nosso atendente confirmará o horário em até 24h. Deseja que eu registre sua preferência de horário?',
      suggestions: ['Sim, registrar preferência', 'Não, obrigado', 'Enviar pelo WhatsApp']
    };
  }

  // 21. WhatsApp booking
  if (/(enviar pelo whatsapp|enviar pelo whats|enviar pelo zap|whatsapp|whats|zap)/.test(kw)) {
    const issueLabel = ctx.lastIssue ? ctx.lastIssue.replace(/_/g, ' ') : 'agendamento';
    const preText = `Olá! Gostaria de agendar uma avaliação na clínica "${CLINICA}". Motivo: ${issueLabel}. Pode confirmar horários disponíveis, por favor?`;
    const url = `https://wa.me/${CLINIC_WA}?text=${encodeURIComponent(preText)}`;
    return {
      title: 'Enviar pelo WhatsApp',
      html: `Clique para abrir o WhatsApp:<br><br><a href="${url}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;background:#25D366;color:#fff;padding:8px 14px;border-radius:20px;text-decoration:none;font-size:13px;font-weight:600;">Abrir WhatsApp</a>`,
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
export function ClinicChat() {
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
        @keyframes chat-pulse { 0% { transform: scale(1); opacity: .4 } 70%, 100% { transform: scale(1.6); opacity: 0 } }
        @keyframes chat-fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes chat-bounce { 0%, 60%, 100% { transform: translateY(0) } 30% { transform: translateY(-5px) } }
        
        .chat-msg-anim { animation: chat-fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .chat-bounce-1 { animation: chat-bounce 1.2s infinite; }
        .chat-bounce-2 { animation: chat-bounce 1.2s .2s infinite; }
        .chat-bounce-3 { animation: chat-bounce 1.2s .4s infinite; }

        #chat-window ::-webkit-scrollbar { width: 5px; }
        #chat-window ::-webkit-scrollbar-track { background: transparent; }
        #chat-window ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        #chat-window ::-webkit-scrollbar-thumb:hover { background: #444; }

        @media(max-width: 440px) {
          #chat-window { bottom: 0 !important; right: 0 !important; width: 100vw !important; max-width: 100vw !important; height: 100dvh !important; max-height: 100dvh !important; border-radius: 0 !important; }
          #chat-fab { bottom: 20px !important; right: 20px !important; width: 56px !important; height: 56px !important; }
        }
      `}</style>

      {/* ── FAB ────────────────────────────────────────────────────────── */}
      <button
        id="chat-fab"
        aria-label="Abrir chat"
        onClick={handleToggle}
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          width: 64,
          height: 64,
          background: "#000",
          color: "#fff",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
          border: "none",
          transition: "transform .3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity .6s",
          zIndex: 9998,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? (isOpen ? "scale(0) rotate(-90deg)" : "scale(1)") : "scale(0.5)",
          pointerEvents: isOpen ? "none" : "auto",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        <ChatBubbleIcon />
        <span
          style={{
            position: "absolute",
            inset: -2,
            borderRadius: "50%",
            border: "2px solid #fff",
            animation: "chat-pulse 2s infinite",
            pointerEvents: "none",
          }}
        />
      </button>

      {/* ── CHAT WINDOW ─────────────────────────────────────────────────── */}
      <div
        id="chat-window"
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          width: 400,
          maxWidth: "calc(100vw - 32px)",
          height: 640,
          maxHeight: "calc(100vh - 64px)",
          background: "#0D0D0D",
          borderRadius: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 9999,
          transformOrigin: "bottom right",
          transform: isOpen ? "scale(1) translateY(0)" : "scale(.8) translateY(40px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "all" : "none",
          transition: "all .4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header */}
        <div style={{ background: "#141414", padding: "20px 24px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #222, #111)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <BotIcon size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 16, letterSpacing: "-0.01em" }}>{CLINICA}</div>
            <div style={{ color: "#888", fontSize: 12, display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981" }} />
              {status}
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", cursor: "pointer", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", background: "#0D0D0D", display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map((msg, i) => (
            <div key={i} className="chat-msg-anim" style={{ alignSelf: msg.role === "bot" ? "flex-start" : "flex-end", maxWidth: "88%" }}>
              {msg.role === "bot" && msg.title && (
                <div style={{ fontSize: 11, color: "#666", marginBottom: 6, marginLeft: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>{msg.title}</div>
              )}
              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: msg.role === "bot" ? "20px 20px 20px 4px" : "20px 20px 4px 20px",
                  background: msg.role === "bot" ? "#1A1A1A" : "#FFFFFF",
                  color: msg.role === "bot" ? "#E0E0E0" : "#000000",
                  fontSize: 14,
                  lineHeight: 1.6,
                  boxShadow: msg.role === "bot" ? "0 4px 15px rgba(0,0,0,0.2)" : "0 4px 15px rgba(255,255,255,0.1)",
                  border: msg.role === "bot" ? "1px solid rgba(255,255,255,0.05)" : "none"
                }}
              >
                {msg.html ? (
                  <div dangerouslySetInnerHTML={{ __html: msg.html }} />
                ) : (
                  msg.text
                )}
                
                {msg.suggestions && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                    {msg.suggestions.map((s, si) => (
                      <button
                        key={si}
                        onClick={() => handleSend(s)}
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "#fff",
                          padding: "6px 12px",
                          borderRadius: 100,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all .2s ease"
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                        }}
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
            <div style={{ alignSelf: "flex-start", background: "#1A1A1A", padding: "14px 20px", borderRadius: "20px 20px 20px 4px", display: "flex", gap: 5, border: "1px solid rgba(255,255,255,0.05)" }}>
              {[1, 2, 3].map(n => (
                <span key={n} className={`chat-bounce-${n}`} style={{ width: 6, height: 6, background: "#555", borderRadius: "50%" }} />
              ))}
            </div>
          )}
          <div ref={msgsEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "20px 24px", background: "#141414", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              ref={inputRef}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Como podemos ajudar?"
              style={{ 
                width: "100%", 
                background: "#0D0D0D", 
                color: "#fff", 
                border: "1px solid rgba(255,255,255,0.1)", 
                borderRadius: 14, 
                padding: "12px 16px", 
                fontSize: 14, 
                outline: "none",
                transition: "border-color .2s"
              }}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim()}
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: "50%", 
              background: inputVal.trim() ? "#FFFFFF" : "#222", 
              color: inputVal.trim() ? "#000000" : "#555", 
              border: "none", 
              cursor: inputVal.trim() ? "pointer" : "default", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              transition: "all .3s ease"
            }}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </>
  );
}

// Keep the old export for backward compatibility if needed, but point to the new one
export const SofiaChat = ClinicChat;
