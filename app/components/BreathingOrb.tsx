'use client';

interface BreathingOrbProps {
  size?: number;
  intense?: boolean;
}

export default function BreathingOrb({ size = 220, intense = false }: BreathingOrbProps) {
  const duration = intense ? '4s' : '5.2s';
  const baseAnimation = `stilloff-breathe ${duration} ease-in-out infinite`;

  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      {/* Outer blur glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(110,70,55,0.5) 0%, rgba(243,238,230,0.06) 60%, transparent 100%)',
          filter: 'blur(10px)',
          animation: baseAnimation,
          willChange: 'transform',
        }}
      />
      {/* Middle ring */}
      <div
        style={{
          position: 'absolute',
          inset: '10%',
          borderRadius: '50%',
          border: '1px solid rgba(243,238,230,0.18)',
          boxShadow:
            '0 0 30px rgba(110,70,55,0.35), inset 0 0 20px rgba(110,70,55,0.08)',
          animation: baseAnimation,
          willChange: 'transform',
        }}
      />
      {/* Inner core — reverse */}
      <div
        style={{
          position: 'absolute',
          inset: '22%',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(243,238,230,0.12) 0%, rgba(110,70,55,0.08) 100%)',
          filter: 'blur(2px)',
          animation: `stilloff-breathe ${duration} ease-in-out infinite reverse`,
          willChange: 'transform',
        }}
      />
    </div>
  );
}
