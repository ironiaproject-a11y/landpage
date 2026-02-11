"use client";

import VisualContainer from "./VisualContainer";

export default function ThreeDCardDemo() {
    return (
        <div className="flex justify-center py-10">
            <VisualContainer
                width="400px"
                height="550px"
                hoverColor="rgba(212, 175, 55, 0.2)" // Gold glow
                sideHeight="20px"
                transformDuration="0.5s"
                header={<h2 className="font-display text-xl font-bold text-white uppercase tracking-wider">Protocolo de Elite</h2>}
                footer={<p className="text-sm text-[var(--color-silver-bh)] font-medium text-center">Tecnologia & Precisão Digital</p>}
            >
                <div key="1" className="flex flex-col items-center gap-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-silver-bh)] to-[#B8860B] flex items-center justify-center shadow-2xl">
                        <span className="text-black font-display text-3xl font-bold">3D</span>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white text-2xl font-display font-medium">Experiência Imersiva</p>
                        <p className="text-[var(--color-text-secondary)] text-sm max-w-[250px]">Toque e interaja com o futuro da odontologia moderna.</p>
                    </div>
                </div>
            </VisualContainer>
        </div>
    );
}
