```javascript
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
                                                <h3 className="font-display text-2xl md:text-3xl text-[#F5F5DC] font-light">Sua disponibilidade</h3>
                                                <p className="text-[#F5F5DC]/60 font-sans text-sm">Quando fica melhor para você?</p>
                                            </div>

                                            <div className="flex flex-col gap-5">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#F5F5DC]/50 font-sans mb-1">Período Ideal</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {['Manhã', 'Tarde'].map((time) => (
                                                            <button
                                                                key={time}
                                                                onClick={() => setFormData({ ...formData, time })}
                                                                className={`py - 4 rounded - xl border transition - all duration - 300 ${ formData.time === time ? 'border-[#F5F5DC]/60 bg-[#F5F5DC]/10 shadow-[0_0_20px_rgba(245,245,220,0.05)]' : 'border-[#F5F5DC]/10 hover:border-[#F5F5DC]/30 hover:bg-[#F5F5DC]/5' } `}
                                                            >
                                                                <span className="font-sans text-[15px] font-medium text-[#F5F5DC]/90">{time}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    // Submission logic simulation
                                                    setFormStep(4);
                                                }}
                                                disabled={!formData.time}
                                                className="mt-6 border border-[#F5F5DC]/20 bg-[#F5F5DC] text-[#0B0B0B] py-4 rounded-full font-sans font-medium text-sm transition-all hover:scale-[1.02] shadow-[0_4px_20px_rgba(245,245,220,0.15)] disabled:opacity-30 disabled:bg-[#F5F5DC]/5 disabled:text-[#F5F5DC] disabled:hover:scale-100 disabled:shadow-none"
                                            >
                                                Finalizar Agendamento
                                            </button>
                                        </m.div>
                                    )}

                                    {/* Step 4: Success */}
                                    {formStep === 4 && (
                                        <m.div
                                            initial={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
                                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="flex flex-col items-center justify-center text-center gap-7 py-8"
                                        >
                                            <div className="w-20 h-20 rounded-full border border-[#F5F5DC]/20 flex items-center justify-center relative">
                                                <div className="absolute inset-0 bg-[#F5F5DC]/5 rounded-full animate-pulse" />
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                                                    <path d="M5 13L9 17L19 7" stroke="#F5F5DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <h3 className="font-display text-3xl md:text-3xl text-[#F5F5DC] font-light leading-tight">
                                                    Em breve,<br />sua nova assinatura visual começa.
                                                </h3>
                                                <p className="text-[#F5F5DC]/50 font-sans text-[15px] max-w-[280px] mx-auto leading-relaxed">
                                                    Nossa Concierge entrará em contato via WhatsApp para alinhar os últimos detalhes.
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => { setIsFormOpen(false); setTimeout(() => setFormStep(1), 800); setFormData({ name: '', phone: '', email: '', treatment: '', date: '', time: '' }); }}
                                                className="mt-6 text-[#F5F5DC]/60 hover:text-[#F5F5DC] text-xs uppercase tracking-[0.2em] font-sans transition-colors border-b border-transparent hover:border-[#F5F5DC]/30 pb-1"
                                            >
                                                Voltar ao início
                                            </button>
                                        </m.div>
                                    )}
                                </m.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Atmospheric Glows (Disabled for cleaner look) */}
                {/* <div className="absolute top-[-10%] left-[-10%] w-[80%] lg:w-[50%] h-[50%] glow-blob-warm opacity-15 pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[70%] lg:w-[40%] h-[40%] glow-blob opacity-10 pointer-events-none" /> */}

                {/* Cinematic Progress Line (Desktop) (Disabled for cleaner look) */}
                {/* {!isMobile && (
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 h-32 w-[1px] bg-white/10 overflow-hidden z-50">
                        <div
                            ref={progressLineRef}
                            className="absolute top-0 left-0 w-full h-full bg-[var(--color-silver-bh)] origin-top scale-y-0"
                        />
                    </div>
                )} */}

                <m.div
                    ref={scrollHintRef}
                    initial={{ opacity: 0, x: "-50%" }}
                    animate={{
                        opacity: [0.35, 0.7, 0.35],
                        x: "-50%",
                        y: [0, 5, 0]
                    }}
                    transition={{
                        opacity: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                        y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                        delay: 5
                    }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[30] pointer-events-none"
                    style={{ opacity: 0.7 }}
                >
                    <span className="uppercase text-white text-[10px] tracking-[0.4em] font-light">Scroll</span>
                </m.div>

                {/* Vertical Cinematic Depth Gradient (Final Polish) */}
                <div
                    className="absolute inset-x-0 top-0 h-[40vh] z-[12] pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)' }}
                />
                <div
                    className="absolute inset-x-0 bottom-0 h-[30vh] z-[12] pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)' }}
                />
            </div>
        </section>
    );
}

