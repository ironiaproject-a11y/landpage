"use client";

export function Clinica() {
    return (
        <div
            style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                padding: '16px 20px',
                background: 'rgba(11,11,11,0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
            }}
            id="clinica-topbar"
        >
            {/* Linha 1 */}
            <div>
                <span style={{ 
                    fontSize: '12px', 
                    letterSpacing: '0.2em', 
                    textTransform: 'uppercase', 
                    color: 'rgba(255,255,255,0.7)' 
                }}>
                    CLÍNICA. Odontologia estética avançada
                </span>
            </div>

            {/* Linha 2 */}
            <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.6)',
            }}>
                <span>+12 anos</span>
                <span>+700 pacientes</span>
                <span>Implantes & Estética</span>
                <span>Tecnologia 3D</span>
            </div>

            {/* Linha 3 */}
            <div style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.5)',
            }}>
                Resultados naturais. Planejamento digital. Atendimento humanizado.
            </div>
        </div>
    );
}
