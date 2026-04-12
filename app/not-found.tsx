'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function NotFound() {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = orbRef.current;
    if (!el) return;
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.004;
      const scale = 0.92 + Math.sin(t) * 0.08;
      const opacity = 0.75 + Math.sin(t * 0.7) * 0.18;
      el.style.transform = `scale(${scale})`;
      el.style.opacity = String(opacity);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      style={{ background: '#0E0D0B', minHeight: '100vh', color: '#F4EFE8' }}
      className="font-sans flex flex-col"
    >
      {/* Nav */}
      <header
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        className="px-6 lg:px-10 h-16 flex items-center"
      >
        <Link
          href="/"
          className="font-serif text-xl tracking-tight"
          style={{ color: '#F4EFE8' }}
        >
          StillOff
        </Link>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-8 relative overflow-hidden">
        {/* Orb backdrop */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            ref={orbRef}
            style={{
              width: 480,
              height: 480,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(196,113,74,0.12) 0%, rgba(196,113,74,0.05) 40%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
        </div>

        <div className="relative text-center" style={{ maxWidth: 500 }}>
          <p
            className="font-sans text-xs tracking-[0.22em] uppercase mb-8"
            style={{ color: 'rgba(196,113,74,0.55)' }}
          >
            404
          </p>
          <h1
            className="font-serif leading-tight mb-6"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', color: '#F4EFE8' }}
          >
            Lost in the loop?
          </h1>
          <p
            className="font-serif text-lg leading-relaxed mb-12"
            style={{ color: 'rgba(190,180,167,0.55)' }}
          >
            This page doesn&apos;t exist. But you noticed — which means you&apos;re
            paying attention.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-sans font-medium transition-all duration-200"
            style={{
              background: '#C4714A',
              color: '#F4EFE8',
              boxShadow: '0 0 28px rgba(196,113,74,0.35)',
            }}
          >
            Back to StillOff
          </Link>
        </div>
      </div>
    </div>
  );
}
