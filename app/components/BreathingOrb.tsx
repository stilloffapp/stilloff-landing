'use client';

interface BreathingOrbProps {
  size?: number;
  intense?: boolean;
}

export default function BreathingOrb({ size = 220, intense = false }: BreathingOrbProps) {
  const breathe = intense ? '4.2s' : '5.8s';
  const drift = intense ? '8s' : '11s';
  const shimmer = intense ? '5.5s' : '7.5s';

  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <style jsx>{`
        @keyframes orb-breathe { 0%,100%{transform:scale(0.94);opacity:0.82} 50%{transform:scale(1.06);opacity:1} }
        @keyframes orb-core { 0%,100%{transform:scale(0.92);opacity:0.88} 50%{transform:scale(1.08);opacity:1} }
        @keyframes orb-drift { 0%{transform:translate3d(0,0,0)} 25%{transform:translate3d(2px,-3px,0)} 50%{transform:translate3d(-2px,2px,0)} 75%{transform:translate3d(3px,2px,0)} 100%{transform:translate3d(0,0,0)} }
        @keyframes orb-shimmer { 0%,100%{opacity:0.26;transform:rotate(0deg) scale(1)} 50%{opacity:0.42;transform:rotate(180deg) scale(1.03)} }
        @keyframes orb-ring { 0%,100%{transform:scale(0.98);opacity:0.30} 50%{transform:scale(1.08);opacity:0.52} }
      `}</style>
      {/* Outer ambient glow */}
      <div style={{
        position: 'absolute', inset: '-16%', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,113,74,0.32) 0%, rgba(196,113,74,0.16) 30%, rgba(244,239,232,0.08) 52%, transparent 78%)',
        filter: 'blur(28px)',
        animation: `orb-breathe ${breathe} ease-in-out infinite, orb-drift ${drift} ease-in-out infinite`,
        willChange: 'transform,opacity', pointerEvents: 'none',
      }} />
      {/* Ring */}
      <div style={{
        position: 'absolute', inset: '5%', borderRadius: '50%',
        border: '1px solid rgba(244,239,232,0.14)',
        boxShadow: '0 0 60px rgba(196,113,74,0.20), inset 0 0 30px rgba(244,239,232,0.05)',
        animation: `orb-ring ${breathe} ease-in-out infinite`,
        pointerEvents: 'none',
      }} />
      {/* Shimmer layer */}
      <div style={{
        position: 'absolute', inset: '11%', borderRadius: '50%',
        background: 'conic-gradient(from 0deg, rgba(244,239,232,0.03), rgba(196,113,74,0.22), rgba(244,239,232,0.07), rgba(196,113,74,0.16), rgba(244,239,232,0.03))',
        filter: 'blur(10px)', mixBlendMode: 'screen',
        animation: `orb-shimmer ${shimmer} linear infinite`,
        pointerEvents: 'none',
      }} />
      {/* Core sphere */}
      <div style={{
        position: 'absolute', inset: '16%', borderRadius: '50%',
        background: 'radial-gradient(circle at 50% 38%, rgba(244,239,232,0.24) 0%, rgba(244,239,232,0.12) 16%, rgba(196,113,74,0.28) 38%, rgba(140,75,50,0.72) 62%, rgba(24,18,14,0.94) 100%)',
        boxShadow: '0 0 90px rgba(196,113,74,0.18), inset 0 10px 24px rgba(244,239,232,0.08)',
        animation: `orb-breathe ${breathe} ease-in-out infinite, orb-drift ${drift} ease-in-out infinite reverse`,
        pointerEvents: 'none',
      }} />
      {/* Inner highlight */}
      <div style={{
        position: 'absolute', inset: '27%', borderRadius: '50%',
        background: 'radial-gradient(circle at 50% 35%, rgba(244,239,232,0.28) 0%, rgba(244,239,232,0.14) 22%, rgba(196,113,74,0.12) 48%, transparent 100%)',
        filter: 'blur(6px)',
        animation: `orb-core ${breathe} ease-in-out infinite`,
        pointerEvents: 'none',
      }} />
      {/* Specular */}
      <div style={{
        position: 'absolute', inset: '38%', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(244,239,232,0.32) 0%, rgba(244,239,232,0.14) 48%, rgba(196,113,74,0.05) 100%)',
        filter: 'blur(1px)',
        boxShadow: '0 0 26px rgba(244,239,232,0.16)',
        animation: `orb-core ${breathe} ease-in-out infinite reverse`,
        pointerEvents: 'none',
      }} />
    </div>
  );
}
