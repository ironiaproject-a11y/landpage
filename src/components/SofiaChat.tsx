"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { WHATSAPP_NUMBER } from "@/config/constants";

/* ─── CONFIG ─────────────────────────────────────────────────────────── */
const GEMINI_KEY = "AIzaSyAtMq6u226Jugt_D3W-M6gC-dF60ussci8";
const CLINICA    = "Clínica Premium";

const SYSTEM_PROMPT = `Você é Sofia, assistente virtual da ${CLINICA}, clínica odontológica. Acolha visitantes da landing page e conduza-os ao agendamento.
Tom: caloroso, humano, objetivo. Idioma: português do Brasil.
Regras: nunca dê diagnóstico; nunca prometa resultado garantido; nunca invente preços; máximo 3 linhas por resposta; uma pergunta por vez; não saia do tema odontológico.
Serviços: limpeza dental, clareamento, restauração, tratamento de canal, implantes, lentes de contato dental, urgência odontológica.
Fluxo: cumprimente > identifique a necessidade (dor/urgência, estética, prevenção, preço, agendamento) > responda simples e empático > conduza ao próximo passo > peça nome e telefone quando houver interesse.
Se dor: acolha e priorize encaixe rápido. Se estética: destaque melhora no sorriso. Se preço: diga que depende da avaliação. Se indeciso: faça uma pergunta curta.
Quando o cliente quiser contato direto ou urgência, inclua exatamente [WHATSAPP] no final da mensagem.`;

/* ─── TYPES ──────────────────────────────────────────────────────────── */
interface HistoryEntry {
  role: "user" | "model";
  parts: { text: string }[];
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

const WaIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.526 5.855L.057 23.943l6.268-1.645A11.936 11.936 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.814 9.814 0 0 1-5.015-1.374l-.36-.214-3.724.977.994-3.634-.234-.374A9.786 9.786 0 0 1 2.182 12c0-5.414 4.404-9.818 9.818-9.818 5.414 0 9.818 4.404 9.818 9.818z" />
  </svg>
);

/* ─── UTILITIES ──────────────────────────────────────────────────────── */
function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

function renderBotText(text: string): string {
  const hasWa = text.includes("[WHATSAPP]");
  const cleaned = esc(text.replace("[WHATSAPP]", "")).trim();
  const waBtn = hasWa
    ? `<br><br><a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;background:#25D366;color:#fff;padding:8px 14px;border-radius:20px;text-decoration:none;font-size:13px;font-weight:600;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.526 5.855L.057 23.943l6.268-1.645A11.936 11.936 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.814 9.814 0 0 1-5.015-1.374l-.36-.214-3.724.977.994-3.634-.234-.374A9.786 9.786 0 0 1 2.182 12c0-5.414 4.404-9.818 9.818-9.818 5.414 0 9.818 4.404 9.818 9.818z"/></svg>
        Falar pelo WhatsApp
      </a>`
    : "";
  return cleaned + waBtn;
}

/* ─── COMPONENT ──────────────────────────────────────────────────────── */
export function SofiaChat() {
  const [isOpen, setIsOpen]         = useState(false);
  const [isVisible, setIsVisible]   = useState(false);
  const [messages, setMessages]     = useState<{ role: "bot" | "user"; text: string }[]>([]);
  const [inputVal, setInputVal]     = useState("");
  const [isBusy, setIsBusy]         = useState(false);
  const [isTyping, setIsTyping]     = useState(false);
  const historyRef                   = useRef<HistoryEntry[]>([]);
  const msgsEndRef                   = useRef<HTMLDivElement>(null);
  const inputRef                     = useRef<HTMLInputElement>(null);
  const didGreet                     = useRef(false);

  /* Reveal after preloader */
  useEffect(() => {
    const show = () => setIsVisible(true);
    window.addEventListener("preloader-exiting", show);
    if (!(window as { __PRELOADER_ACTIVE__?: boolean }).__PRELOADER_ACTIVE__) setIsVisible(true);
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

  /* Greeting on first open */
  const greet = useCallback(async () => {
    if (didGreet.current) return;
    didGreet.current = true;

    setIsTyping(true);
    await new Promise(r => setTimeout(r, 900));
    const greeting = `Olá! 😊 Seja bem-vindo(a) à ${CLINICA}! Sou a Sofia, assistente virtual da clínica. Em que posso te ajudar hoje?`;
    setIsTyping(false);
    setMessages([{ role: "bot", text: greeting }]);
    historyRef.current.push({ role: "model", parts: [{ text: greeting }] });
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen(prev => {
      const next = !prev;
      if (next && !didGreet.current) greet();
      return next;
    });
  }, [greet]);

  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleSend = useCallback(async () => {
    const text = inputVal.trim();
    if (!text || isBusy) return;

    setInputVal("");
    setMessages(prev => [...prev, { role: "user", text }]);
    historyRef.current.push({ role: "user", parts: [{ text }] });

    setIsBusy(true);
    setIsTyping(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: historyRef.current,
            generationConfig: { maxOutputTokens: 200, temperature: 0.75 },
          }),
        }
      );

      const data = await response.json();
      const reply: string =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "Desculpe, tive um probleminha. Pode repetir? 😅";

      setIsTyping(false);
      setMessages(prev => [...prev, { role: "bot", text: reply }]);
      historyRef.current.push({ role: "model", parts: [{ text: reply }] });
    } catch {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: "bot", text: "Ops, instabilidade momentânea. Tente novamente. 😅" }]);
    } finally {
      setIsBusy(false);
    }
  }, [inputVal, isBusy]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

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
          #sofia-window{bottom:0!important;}
        }
      `}</style>

      {/* ── FAB ────────────────────────────────────────────────────────── */}
      <button
        id="sofia-fab"
        aria-label="Abrir chat com Sofia"
        onClick={handleToggle}
        style={{
          position: "fixed",
          bottom: 100,
          right: 28,
          width: 62,
          height: 62,
          background: "linear-gradient(135deg, #0d9e8c, #05c8a8)",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 40px rgba(13,158,140,.35), 0 2px 8px rgba(0,0,0,.15)",
          border: "none",
          transition: "transform .25s, box-shadow .25s, opacity .6s",
          zIndex: 9998,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1)" : "scale(0.7)",
          color: "#fff",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        <ChatBubbleIcon />
        {/* Pulse ring */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 62,
            height: 62,
            borderRadius: "50%",
            border: "2px solid #0d9e8c",
            animation: "sofia-pulse 2.4s infinite",
            pointerEvents: "none",
          }}
        />
      </button>

      {/* ── CHAT WINDOW ─────────────────────────────────────────────────── */}
      <div
        id="sofia-window"
        role="dialog"
        aria-label="Chat com Sofia"
        style={{
          position: "fixed",
          bottom: 174,
          right: 28,
          width: 380,
          maxWidth: "calc(100vw - 32px)",
          height: 560,
          maxHeight: "calc(100vh - 130px)",
          background: "#ffffff",
          borderRadius: 18,
          boxShadow: "0 8px 40px rgba(13,158,140,.18), 0 2px 8px rgba(0,0,0,.12)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 9999,
          transform: isOpen ? "scale(1) translateY(0)" : "scale(.92) translateY(16px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "all" : "none",
          transition: "opacity .3s ease, transform .3s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #0d9e8c 0%, #05c8a8 100%)",
            padding: "18px 20px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "rgba(255,255,255,.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "#fff",
            }}
          >
            <BotIcon size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Jost, sans-serif", fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>
              Sofia – Assistente da Clínica
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.82)", display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#7effc8", display: "inline-block", boxShadow: "0 0 6px #7effc8" }} />
              Online agora
            </div>
          </div>
          <button
            id="sofia-close-btn"
            onClick={handleClose}
            aria-label="Fechar chat"
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.85)", padding: 4, display: "flex" }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Messages */}
        <div
          id="sofia-msgs"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: "#f7f5f2",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className="sofia-msg-anim"
              style={{
                display: "flex",
                gap: 8,
                alignSelf: msg.role === "bot" ? "flex-start" : "flex-end",
                flexDirection: msg.role === "bot" ? "row" : "row-reverse",
                maxWidth: "84%",
              }}
            >
              {msg.role === "bot" && (
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "#0d9e8c",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 2,
                    color: "#fff",
                  }}
                >
                  <BotIcon size={15} />
                </div>
              )}
              <div
                style={{
                  padding: "11px 15px",
                  borderRadius: msg.role === "bot" ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                  fontFamily: "Jost, sans-serif",
                  fontSize: 14,
                  lineHeight: 1.55,
                  background: msg.role === "bot" ? "#ffffff" : "#0d9e8c",
                  color: msg.role === "bot" ? "#1a1a2e" : "#fff",
                  boxShadow: msg.role === "bot" ? "0 1px 4px rgba(0,0,0,.07)" : "none",
                }}
                dangerouslySetInnerHTML={{
                  __html: msg.role === "bot" ? renderBotText(msg.text) : esc(msg.text),
                }}
              />
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div
              className="sofia-msg-anim"
              style={{ display: "flex", gap: 8, alignSelf: "flex-start", maxWidth: "84%" }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "#0d9e8c",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 2,
                  color: "#fff",
                }}
              >
                <BotIcon size={15} />
              </div>
              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: "16px 16px 16px 4px",
                  background: "#fff",
                  boxShadow: "0 1px 4px rgba(0,0,0,.07)",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {[1, 2, 3].map(n => (
                  <span
                    key={n}
                    className={`sofia-bounce-${n}`}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#5c6472",
                      display: "inline-block",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={msgsEndRef} />
        </div>

        {/* Input area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 16px",
            borderTop: "1px solid #edeae6",
            background: "#ffffff",
            flexShrink: 0,
          }}
        >
          <input
            ref={inputRef}
            id="sofia-chat-input"
            type="text"
            placeholder="Digite sua mensagem…"
            autoComplete="off"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isBusy}
            style={{
              flex: 1,
              border: "1.5px solid #e2dfd9",
              borderRadius: 24,
              padding: "10px 16px",
              fontFamily: "Jost, sans-serif",
              fontSize: 14,
              color: "#1a1a2e",
              background: "#f7f5f2",
              outline: "none",
              height: 42,
              transition: "border-color .2s, background .2s",
            }}
            onFocus={e => {
              e.target.style.borderColor = "#0d9e8c";
              e.target.style.background = "#fff";
            }}
            onBlur={e => {
              e.target.style.borderColor = "#e2dfd9";
              e.target.style.background = "#f7f5f2";
            }}
          />
          <button
            id="sofia-send-btn"
            onClick={handleSend}
            disabled={isBusy || !inputVal.trim()}
            aria-label="Enviar mensagem"
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: isBusy || !inputVal.trim() ? "#ccc" : "#0d9e8c",
              border: "none",
              cursor: isBusy || !inputVal.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background .2s",
              flexShrink: 0,
              color: "#fff",
            }}
          >
            <SendIcon />
          </button>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "#b0aca6",
            padding: "0 16px 10px",
            fontFamily: "Jost, sans-serif",
            background: "#fff",
          }}
        >
          🔒 Suas informações são tratadas com sigilo.
        </div>
      </div>
    </>
  );
}
