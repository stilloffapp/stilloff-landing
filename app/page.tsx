'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useInView,
} from 'framer-motion';
import BreathingOrb from './components/BreathingOrb';

// ─── Walk-through phases ──────────────────────────────────────────────────────
const WALK_PHASES = ['trigger', 'lock', 'breathing', 'complete', 'firewall'] as const;
type WalkPhase = (typeof WALK_PHASES)[number];

const PHASE_DURATIONS: Record<WalkPhase, number> = {
  trigger: 3500,
  lock: 2500,
  breathing: 4000,
  complete: 3000,
  firewall: 3500,
};

// ─── Toast ────────────────────────────────────────────────────────────────────
type ToastItem = { id: number; msg: string };

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.35 }}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-full text-sm font-sans whitespace-nowrap"
      style={{
        color: '#F4EFE8',
        background: 'rgba(20,18,15,0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {msg}
    </m.div>
  );
}

// ─── CountUp ─────────────────────────────────────────────────────────────────
function CountUp({ target, duration = 1800 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(target - 120);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-80px 0px' });

  useEffect(() => {
    if (!inView) return;
    const start = target - 120;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(start + (target - start) * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return <span ref={ref}>{value.toLocaleString()}</span>;
}

// ─── Pattern Map ──────────────────────────────────────────────────────────────
const PATTERN_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const PATTERN_ROWS = [
  // [day0..day6] intensity 0-3 (0=none, 1=low, 2=med, 3=high)
  [0, 1, 0, 2, 0, 3, 2], // Morning
  [2, 3, 1, 3, 2, 1, 0], // Midday
  [1, 2, 3, 1, 3, 0, 1], // Evening
  [3, 1, 2, 0, 1, 2, 3], // Night
];
const ROW_LABELS = ['AM', 'Noon', 'PM', 'Night'];

function PatternMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-40px 0px' });

  const intensityColor = (v: number) => {
    if (v === 0) return 'rgba(255,255,255,0.04)';
    if (v === 1) return 'rgba(196,113,74,0.18)';
    if (v === 2) return 'rgba(196,113,74,0.42)';
    return 'rgba(196,113,74,0.78)';
  };

  return (
    <div ref={ref} style={{ marginTop: 6 }}>
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1 px-8">
        {PATTERN_DAYS.map((d, i) => (
          <div
            key={i}
            className="text-center"
            style={{ fontSize: '7px', color: 'rgba(190,180,167,0.35)', fontFamily: 'var(--font-sans)' }}
          >
            {d}
          </div>
        ))}
      </div>
      {/* Grid */}
      <div className="flex gap-1.5 px-1">
        {/* Row labels */}
        <div className="flex flex-col gap-1" style={{ paddingTop: 1 }}>
          {ROW_LABELS.map((l) => (
            <div
              key={l}
              className="flex items-center justify-end"
              style={{
                fontSize: '6px',
                color: 'rgba(190,180,167,0.28)',
                fontFamily: 'var(--font-sans)',
                height: 14,
                width: 24,
              }}
            >
              {l}
            </div>
          ))}
        </div>
        {/* Cells */}
        <div className="flex-1 flex flex-col gap-1">
          {PATTERN_ROWS.map((row, ri) => (
            <div key={ri} className="grid grid-cols-7 gap-1">
              {row.map((val, ci) => (
                <m.div
                  key={ci}
                  style={{
                    height: 14,
                    borderRadius: 3,
                    background: inView ? intensityColor(val) : 'rgba(255,255,255,0.04)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: (ri * 7 + ci) * 0.015, duration: 0.4 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <p
        className="text-center mt-3"
        style={{
          fontSize: '8px',
          color: 'rgba(190,180,167,0.28)',
          fontFamily: 'var(--font-sans)',
          letterSpacing: '0.06em',
        }}
      >
        Detected trigger windows · week 3
      </p>
    </div>
  );
}

// ─── FadeIn ───────────────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  y = 24,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });
  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </m.div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ onOpenDemo }: { onOpenDemo: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={
        scrolled
          ? {
              background: 'rgba(14,13,11,0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }
          : {}
      }
    >
      <div
        className="mx-auto px-6 lg:px-10 h-16 flex items-center justify-between"
        style={{ maxWidth: 1140 }}
      >
        <a href="/" className="font-serif text-xl tracking-tight" style={{ color: '#F4EFE8' }}>
          StillOff
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {[
            ['How it works', '#how-it-works'],
            ['Features', '#features'],
            ['Pricing', '#pricing'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-sm font-sans transition-colors duration-200"
              style={{ color: 'rgba(190,180,167,0.58)' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#F4EFE8')}
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(190,180,167,0.58)')
              }
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          onClick={onOpenDemo}
          className="px-5 py-2 rounded-full text-sm font-sans font-medium transition-all duration-200"
          style={{
            background: '#C4714A',
            color: '#F4EFE8',
            boxShadow: '0 0 28px rgba(196,113,74,0.35)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#D4825B';
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 0 36px rgba(196,113,74,0.5)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#C4714A';
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 0 28px rgba(196,113,74,0.35)';
          }}
        >
          Try the 60-second lock
        </button>
      </div>
    </header>
  );
}

// ─── Phone Screen ─────────────────────────────────────────────────────────────
function PhoneScreen({ phase }: { phase: WalkPhase }) {
  const [breathLabel, setBreathLabel] = useState<'in' | 'hold' | 'out' | 'hold2'>('in');

  useEffect(() => {
    if (phase !== 'breathing') return;
    const cycle: Array<{ label: 'in' | 'hold' | 'out' | 'hold2'; dur: number }> = [
      { label: 'in', dur: 4000 },
      { label: 'hold', dur: 2000 },
      { label: 'out', dur: 4000 },
      { label: 'hold2', dur: 2000 },
    ];
    let idx = 0;
    let timer: ReturnType<typeof setTimeout>;
    const next = () => {
      setBreathLabel(cycle[idx % cycle.length].label);
      idx++;
      timer = setTimeout(next, cycle[(idx - 1) % cycle.length].dur);
    };
    next();
    return () => clearTimeout(timer);
  }, [phase]);

  const breathText: Record<typeof breathLabel, string> = {
    in: 'Breathe in...',
    hold: 'Hold...',
    out: 'Breathe out...',
    hold2: 'Hold...',
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ borderRadius: 30, background: '#0C0B09' }}
    >
      {/* Dynamic island */}
      <div
        className="absolute z-10"
        style={{
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 80,
          height: 24,
          background: '#000',
          borderRadius: 12,
        }}
      />

      <AnimatePresence mode="wait">
        {phase === 'trigger' && (
          <m.div
            key="trigger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between px-4 pb-5"
            style={{ paddingTop: 52 }}
          >
            <div className="grid grid-cols-4 gap-2.5 px-1 mt-4">
              {[
                { name: 'IG', badge: 12, color: '#833AB4' },
                { name: 'TK', badge: 7, color: '#111' },
                { name: 'X', badge: 3, color: '#1a1a1a' },
                { name: 'YT', badge: null, color: '#CC0000' },
                { name: 'Msg', badge: 2, color: '#34C759' },
                { name: 'Mail', badge: null, color: '#007AFF' },
                { name: 'Maps', badge: null, color: '#34AADC' },
                { name: 'Cam', badge: null, color: '#2C2C2E' },
              ].map((app) => (
                <div key={app.name} className="relative flex flex-col items-center gap-1">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: app.color }}
                  >
                    <span className="text-[8px] text-white font-sans font-medium">{app.name}</span>
                  </div>
                  {app.badge && (
                    <m.div
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-[7px] text-white font-bold">{app.badge}</span>
                    </m.div>
                  )}
                </div>
              ))}
            </div>
            <m.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mx-1 px-3 py-2 rounded-xl"
              style={{ background: '#1C1917', border: '1px solid rgba(196,113,74,0.22)' }}
            >
              <p className="text-[9px] font-sans font-medium" style={{ color: '#C4714A' }}>
                StillOff detecting...
              </p>
              <p className="text-[9px] font-sans mt-0.5" style={{ color: '#BEB4A7' }}>
                Opened 6× in 8 min
              </p>
            </m.div>
          </m.div>
        )}

        {phase === 'lock' && (
          <m.div
            key="lock"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center gap-5 px-6"
          >
            <m.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(196,113,74,0.12)',
                border: '1px solid rgba(196,113,74,0.35)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="4.5" y="10" width="13" height="9" rx="2" stroke="#C4714A" strokeWidth="1.4" />
                <path
                  d="M7.5 10V7a3.5 3.5 0 0 1 7 0v3"
                  stroke="#C4714A"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </m.div>
            <div className="text-center space-y-1.5">
              <p className="font-serif text-base" style={{ color: '#F4EFE8' }}>
                StillOff has stepped in.
              </p>
              <p className="text-[10px] font-sans" style={{ color: '#BEB4A7' }}>
                Your apps are quiet.
              </p>
            </div>
            <m.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 1.4 }}
              className="w-full h-px"
              style={{
                background: 'linear-gradient(to right, transparent, #C4714A, transparent)',
              }}
            />
          </m.div>
        )}

        {phase === 'breathing' && (
          <m.div
            key="breathing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-5"
          >
            <BreathingOrb size={100} intense />
            <div className="text-center">
              <m.p
                key={breathLabel}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="font-serif text-sm"
                style={{ color: '#F4EFE8' }}
              >
                {breathText[breathLabel]}
              </m.p>
              <p
                className="text-[9px] font-sans mt-1 tracking-wider uppercase"
                style={{ color: 'rgba(190,180,167,0.55)' }}
              >
                Guided Reset
              </p>
            </div>
          </m.div>
        )}

        {phase === 'complete' && (
          <m.div
            key="complete"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center gap-5 px-6"
          >
            <m.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(196,113,74,0.12)',
                border: '1px solid rgba(196,113,74,0.4)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M3 9l4 4 8-7"
                  stroke="#C4714A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </m.div>
            <div className="text-center">
              <p className="font-serif text-base" style={{ color: '#F4EFE8' }}>
                Session complete.
              </p>
              <p className="text-[10px] font-sans mt-1" style={{ color: '#BEB4A7' }}>
                18 min
              </p>
            </div>
          </m.div>
        )}

        {phase === 'firewall' && (
          <m.div
            key="firewall"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-center px-5 pt-12 gap-1"
          >
            <p
              className="text-[9px] font-sans tracking-widest uppercase mb-3"
              style={{ color: 'rgba(190,180,167,0.5)' }}
            >
              App Firewall · 15 min
            </p>
            {[
              { name: 'Instagram', quiet: true },
              { name: 'TikTok', quiet: true },
              { name: 'X / Twitter', quiet: true },
              { name: 'Messages', quiet: false },
              { name: 'Maps', quiet: false },
            ].map((app, i) => (
              <m.div
                key={app.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <span className="text-[11px] font-sans" style={{ color: '#F4EFE8' }}>
                  {app.name}
                </span>
                <span
                  className="text-[9px] font-sans font-medium px-2 py-0.5 rounded-full"
                  style={
                    app.quiet
                      ? { background: 'rgba(196,113,74,0.18)', color: '#C4714A' }
                      : { background: 'rgba(255,255,255,0.06)', color: '#BEB4A7' }
                  }
                >
                  {app.quiet ? 'Quiet' : 'Open'}
                </span>
              </m.div>
            ))}
          </m.div>
        )}
      </AnimatePresence>

      {/* Phase dots */}
      <div
        className="absolute flex gap-1.5 z-10"
        style={{ bottom: 12, left: '50%', transform: 'translateX(-50%)' }}
      >
        {WALK_PHASES.map((p) => (
          <div
            key={p}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              background: p === phase ? '#C4714A' : 'rgba(255,255,255,0.15)',
              width: p === phase ? '1rem' : '0.375rem',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Phone Shell ──────────────────────────────────────────────────────────────
function PhoneShell({
  phase,
  width = 260,
  height = 520,
}: {
  phase: WalkPhase;
  width?: number;
  height?: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 38,
        border: '1px solid rgba(255,255,255,0.09)',
        background: '#0C0B09',
        boxShadow: '0 50px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.02), 0 0 80px rgba(196,113,74,0.07)',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 38,
          border: '1px solid rgba(255,255,255,0.03)',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 2,
          borderRadius: 36,
          overflow: 'hidden',
        }}
      >
        <PhoneScreen phase={phase} />
      </div>
      {/* Side buttons */}
      <div
        style={{
          position: 'absolute',
          left: -1,
          top: 100,
          width: 2,
          height: 28,
          background: '#1C1917',
          borderRadius: '2px 0 0 2px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -1,
          top: 140,
          width: 2,
          height: 28,
          background: '#1C1917',
          borderRadius: '2px 0 0 2px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -1,
          top: 118,
          width: 2,
          height: 48,
          background: '#1C1917',
          borderRadius: '0 2px 2px 0',
        }}
      />
    </div>
  );
}

function PhoneWalkthrough({
  width = 260,
  height = 520,
}: {
  width?: number;
  height?: number;
}) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = WALK_PHASES[phaseIdx];
  useEffect(() => {
    const t = setTimeout(
      () => setPhaseIdx((i) => (i + 1) % WALK_PHASES.length),
      PHASE_DURATIONS[phase]
    );
    return () => clearTimeout(t);
  }, [phaseIdx, phase]);
  return <PhoneShell phase={phase} width={width} height={height} />;
}

// ─── Demo Modal ───────────────────────────────────────────────────────────────
type DemoPhase = 'preframe' | 'breathing' | 'ending' | 'cta';

function DemoModal({
  onClose,
  showToast,
}: {
  onClose: () => void;
  showToast: (msg: string) => void;
}) {
  const [phase, setPhase] = useState<DemoPhase>('preframe');
  const [breathLabel, setBreathLabel] = useState<'in' | 'hold' | 'out' | 'hold2'>('in');
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setPhase('breathing'), 2400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== 'breathing') return;
    const cycle: Array<{ label: 'in' | 'hold' | 'out' | 'hold2'; dur: number }> = [
      { label: 'in', dur: 4000 },
      { label: 'hold', dur: 2000 },
      { label: 'out', dur: 4000 },
      { label: 'hold2', dur: 2000 },
    ];
    let idx = 0;
    let labelTimer: ReturnType<typeof setTimeout>;
    const nextLabel = () => {
      setBreathLabel(cycle[idx % cycle.length].label);
      const dur = cycle[idx % cycle.length].dur;
      idx++;
      labelTimer = setTimeout(nextLabel, dur);
    };
    nextLabel();

    const start = performance.now();
    const DURATION = 60000;
    const progressTimer = setInterval(() => {
      const p = Math.min((performance.now() - start) / DURATION, 1);
      setProgress(p);
      if (p >= 1) {
        clearInterval(progressTimer);
        clearTimeout(labelTimer);
        setPhase('ending');
      }
    }, 80);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(labelTimer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'ending') return;
    const t = setTimeout(() => setPhase('cta'), 1800);
    return () => clearTimeout(t);
  }, [phase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    try {
      const res = await fetch('https://formspree.io/f/mzdklnwv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, source: 'demo-modal' }),
      });
      if (res.ok) {
        sessionStorage.setItem('stilloff-demo-complete', 'true');
        showToast("You're on the list. See you on the other side.");
        onClose();
      } else {
        showToast('Something went wrong. Try again.');
      }
    } catch {
      showToast('Something went wrong. Try again.');
    } finally {
      setSending(false);
    }
  };

  const breathText: Record<typeof breathLabel, string> = {
    in: 'Breathe in',
    hold: 'Hold',
    out: 'Breathe out',
    hold2: 'Hold',
  };

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(10,9,7,0.94)', backdropFilter: 'blur(20px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && phase === 'cta') onClose();
      }}
    >
      <m.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full mx-5"
        style={{
          maxWidth: 400,
          borderRadius: 28,
          background: '#0F0E0C',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        {phase === 'cta' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(190,180,167,0.6)' }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = '#F4EFE8')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(190,180,167,0.6)')
            }
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M1 1l9 9M10 1L1 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        <div
          className="flex flex-col items-center justify-center"
          style={{ padding: 40, minHeight: 460 }}
        >
          <AnimatePresence mode="wait">
            {phase === 'preframe' && (
              <m.div
                key="preframe"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-3"
              >
                <p
                  className="font-sans text-xs tracking-[0.22em] uppercase"
                  style={{ color: 'rgba(196,113,74,0.55)' }}
                >
                  60-second lock
                </p>
                <p
                  className="font-serif text-2xl leading-snug"
                  style={{ color: '#F4EFE8' }}
                >
                  Your apps are about to go quiet.
                </p>
                <p
                  className="font-sans text-sm"
                  style={{ color: 'rgba(190,180,167,0.42)' }}
                >
                  Stay with it.
                </p>
              </m.div>
            )}

            {phase === 'breathing' && (
              <m.div
                key="breathing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-8 w-full"
              >
                <BreathingOrb size={180} intense />
                <m.p
                  key={breathLabel}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="font-serif text-2xl"
                  style={{ color: '#F4EFE8' }}
                >
                  {breathText[breathLabel]}
                </m.p>
                <div
                  className="w-full h-px rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                >
                  <div
                    className="h-full transition-all duration-75 ease-linear"
                    style={{ width: `${progress * 100}%`, background: '#C4714A' }}
                  />
                </div>
              </m.div>
            )}

            {phase === 'ending' && (
              <m.div
                key="ending"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-3"
              >
                <p
                  className="font-serif text-xl leading-relaxed"
                  style={{ color: '#F4EFE8' }}
                >
                  You didn't check. Nothing happened.
                </p>
                <p className="font-serif text-xl italic" style={{ color: '#C4714A' }}>
                  That's the point.
                </p>
              </m.div>
            )}

            {phase === 'cta' && (
              <m.div
                key="cta"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full text-center"
              >
                <p className="font-serif text-xl mb-1" style={{ color: '#F4EFE8' }}>
                  That felt different.
                </p>
                <p
                  className="font-serif text-base italic mb-8"
                  style={{ color: 'rgba(190,180,167,0.58)' }}
                >
                  That's what control feels like.
                </p>
                <p className="text-sm font-sans mb-6" style={{ color: 'rgba(190,180,167,0.45)' }}>
                  Be first when StillOff launches.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl text-sm font-sans placeholder-opacity-40 focus:outline-none transition-colors"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      color: '#F4EFE8',
                      caretColor: '#C4714A',
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = 'rgba(196,113,74,0.55)')
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')
                    }
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3 rounded-xl text-sm font-sans font-medium transition-all disabled:opacity-50"
                    style={{
                      background: '#C4714A',
                      color: '#F4EFE8',
                      boxShadow: '0 0 24px rgba(196,113,74,0.3)',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.background = '#D4825B')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.background = '#C4714A')
                    }
                  >
                    {sending ? 'Joining...' : 'Join the waitlist'}
                  </button>
                </form>
                <p
                  className="text-[11px] font-sans mt-5"
                  style={{ color: 'rgba(190,180,167,0.3)' }}
                >
                  No newsletters. One email when it's ready.
                </p>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </m.div>
    </m.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onOpenDemo }: { onOpenDemo: () => void }) {
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('stilloff-demo-complete')) {
      setReturning(true);
    }
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: '100vh', background: '#0E0D0B' }}
    >
      {/* Deep ambient gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 55% 45%, rgba(196,113,74,0.10) 0%, transparent 65%)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(8,7,5,0.75) 100%)',
        }}
      />

      {/* Orb — static, behind everything */}
      <div
        className="absolute pointer-events-none"
        style={{ left: '42%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}
      >
        <m.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <BreathingOrb size={520} />
        </m.div>
      </div>

      {/* Ambient float cards — desktop only */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 1.8 }}
        className="absolute hidden lg:block pointer-events-none"
        style={{ right: '9%', top: '20%', zIndex: 3, filter: 'blur(0.5px)' }}
      >
        <div
          className="px-4 py-3 rounded-2xl"
          style={{
            background: 'rgba(14,13,11,0.65)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.06)',
            opacity: 0.55,
          }}
        >
          <p
            className="text-[9px] font-sans tracking-widest uppercase"
            style={{ color: 'rgba(190,180,167,0.5)' }}
          >
            Session complete · 18 min
          </p>
          <p className="text-[11px] font-serif mt-0.5" style={{ color: 'rgba(244,239,232,0.6)' }}>
            I sat with it.
          </p>
        </div>
      </m.div>

      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0, duration: 1.8 }}
        className="absolute hidden lg:block pointer-events-none"
        style={{ right: '7%', bottom: '22%', zIndex: 3, filter: 'blur(1px)' }}
      >
        <div
          className="px-4 py-2.5 rounded-2xl"
          style={{
            background: 'rgba(14,13,11,0.55)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(196,113,74,0.15)',
            opacity: 0.45,
          }}
        >
          <p className="text-[9px] font-sans" style={{ color: 'rgba(196,113,74,0.7)' }}>
            App Firewall active
          </p>
          <p className="text-[9px] font-sans mt-0.5" style={{ color: 'rgba(190,180,167,0.4)' }}>
            15 min · Soft Landing
          </p>
        </div>
      </m.div>

      {/* Phone — desktop only */}
      <m.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute hidden lg:block"
        style={{
          right: '13%',
          top: '50%',
          transform: 'translateY(-48%)',
          zIndex: 3,
        }}
      >
        <PhoneWalkthrough width={252} height={510} />
      </m.div>

      {/* Copy */}
      <div
        className="relative flex flex-col justify-center px-8 lg:px-16 xl:px-24"
        style={{ zIndex: 4, minHeight: '100vh', paddingTop: 80 }}
      >
        <div style={{ maxWidth: 560 }}>
          {returning ? (
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-xs font-sans mb-10 tracking-widest uppercase"
              style={{ color: 'rgba(196,113,74,0.65)' }}
            >
              Welcome back.
            </m.p>
          ) : (
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-sans text-xs tracking-[0.18em] uppercase mb-10"
              style={{ color: 'rgba(196,113,74,0.65)' }}
            >
              You picked up your phone 84 times today.
            </m.p>
          )}

          <m.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif leading-[0.95] tracking-tight mb-10"
            style={{
              fontSize: 'clamp(3.2rem, 7vw, 6.4rem)',
              color: '#F4EFE8',
            }}
          >
            {returning ? (
              <>Ready to<br />lock it in?</>
            ) : (
              <>
                When you<br />
                can't stop,<br />
                <span className="italic" style={{ color: '#C4714A' }}>
                  StillOff does.
                </span>
              </>
            )}
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85 }}
            className="font-sans text-[1.05rem] leading-relaxed mb-12"
            style={{ color: 'rgba(190,180,167,0.72)', maxWidth: 420 }}
          >
            A real-time intervention that steps in before the spiral takes over.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => setTimeout(onOpenDemo, 120)}
              className="px-8 py-4 rounded-full font-sans text-sm font-medium transition-all duration-200"
              style={{
                background: '#C4714A',
                color: '#F4EFE8',
                boxShadow: '0 0 32px rgba(196,113,74,0.4)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#D4825B';
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 0 44px rgba(196,113,74,0.55)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#C4714A';
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 0 32px rgba(196,113,74,0.4)';
              }}
            >
              Try the 60-second lock
            </button>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-full font-sans text-sm transition-all duration-200"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(190,180,167,0.65)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#F4EFE8';
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  'rgba(196,113,74,0.35)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(190,180,167,0.65)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  'rgba(255,255,255,0.1)';
              }}
            >
              See how it works
            </a>
          </m.div>

          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-xs font-sans mt-8"
            style={{ color: 'rgba(190,180,167,0.32)' }}
          >
            <CountUp target={2847} /> people on the waitlist
          </m.p>
        </div>

        {/* Mobile phone */}
        <m.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex lg:hidden justify-center mt-16 mb-14 relative"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <BreathingOrb size={480} />
          </div>
          <div className="relative z-10">
            <PhoneWalkthrough width={234} height={472} />
          </div>
        </m.div>
      </div>

      {/* Scroll hint */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute hidden lg:flex flex-col items-center gap-2 pointer-events-none"
        style={{ bottom: 36, left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}
      >
        <m.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        >
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <rect
              x="1"
              y="1"
              width="14"
              height="22"
              rx="7"
              stroke="rgba(190,180,167,0.2)"
              strokeWidth="1.2"
            />
            <m.rect
              x="6.5"
              y="5"
              width="3"
              height="5"
              rx="1.5"
              fill="rgba(190,180,167,0.35)"
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            />
          </svg>
        </m.div>
      </m.div>
    </section>
  );
}

// ─── Stats Strip ──────────────────────────────────────────────────────────────
function StatsStrip() {
  const stats = [
    { number: '186×', label: 'daily pickups, average person' },
    { number: '4.3h', label: 'avg screen time per day' },
    { number: '2min', label: 'before the loop takes hold' },
  ];

  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0A0908' }}>
      <div className="mx-auto" style={{ maxWidth: 1140 }}>
        <div className="grid grid-cols-3">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.08}>
              <div
                className="flex flex-col items-center text-center py-10 px-6"
                style={
                  i < 2
                    ? { borderRight: '1px solid rgba(255,255,255,0.05)' }
                    : {}
                }
              >
                <span
                  className="font-serif leading-none mb-2"
                  style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#F4EFE8' }}
                >
                  {s.number}
                </span>
                <span
                  className="font-sans text-xs tracking-widest uppercase"
                  style={{ color: 'rgba(190,180,167,0.42)' }}
                >
                  {s.label}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── The Spiral ───────────────────────────────────────────────────────────────
const SPIRAL_LINES = [
  { text: 'Unlock.', tier: 0 },
  { text: 'Check.', tier: 0 },
  { text: 'Refresh.', tier: 1 },
  { text: 'Switch apps.', tier: 1 },
  { text: 'Repeat.', tier: 2 },
  { text: 'Ten minutes disappear.', tier: 3 },
  { text: 'Not because you wanted to.', tier: 3 },
  { text: 'Because the loop already started.', tier: 4 },
];

function TheSpiral() {
  return (
    <section
      className="relative py-32 px-6"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0.6 }}
      >
        <div
          style={{
            width: 700,
            height: 700,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(196,113,74,0.06) 0%, transparent 65%)',
            filter: 'blur(80px)',
          }}
        />
      </div>
      <div className="relative mx-auto" style={{ maxWidth: 860 }}>
        <FadeIn y={20} className="mb-24">
          <p
            className="font-serif leading-relaxed"
            style={{
              fontSize: 'clamp(1.15rem, 2vw, 1.45rem)',
              color: 'rgba(190,180,167,0.65)',
              maxWidth: 600,
            }}
          >
            StillOff interrupts compulsive phone use in real time by locking
            your phone into a guided reset before the loop takes over.
          </p>
        </FadeIn>
        <div>
          {SPIRAL_LINES.map((line, i) => {
            const colors = [
              'rgba(190,180,167,0.38)',
              'rgba(190,180,167,0.38)',
              'rgba(210,202,192,0.52)',
              'rgba(210,202,192,0.52)',
              'rgba(230,224,218,0.68)',
              '#F4EFE8',
              '#F4EFE8',
              undefined,
            ];
            const isLast = i === SPIRAL_LINES.length - 1;
            return (
              <FadeIn key={i} delay={i * 0.06} y={18}>
                <p
                  className={`font-serif py-5 leading-tight ${isLast ? 'italic' : ''}`}
                  style={{
                    fontSize: isLast
                      ? 'clamp(2rem, 4vw, 3.5rem)'
                      : i < 4
                      ? 'clamp(1.8rem, 3.5vw, 2.8rem)'
                      : 'clamp(2rem, 4vw, 3.2rem)',
                    color: isLast ? '#C4714A' : colors[i],
                    borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {line.text}
                </p>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── The Moment (Triggers) ────────────────────────────────────────────────────
const TRIGGER_QUOTES = [
  '"I just opened it again. I didn\'t even think about it."',
  '"I was trying to focus. Now I\'m 15 minutes deep."',
  '"I know this is making it worse… and I\'m still here."',
  '"It\'s been an hour. I don\'t even remember why I picked it up."',
];

function TheMoment() {
  return (
    <section
      className="py-28 lg:py-36 px-8 lg:px-16"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <FadeIn y={24} className="mb-16">
          <p
            className="text-[11px] font-sans tracking-[0.26em] uppercase mb-5"
            style={{ color: 'rgba(196,113,74,0.55)' }}
          >
            You know this feeling
          </p>
          <h2
            className="font-serif leading-tight"
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.6rem)',
              color: '#F4EFE8',
              maxWidth: 560,
            }}
          >
            There's always a moment right before it happens.
          </h2>
        </FadeIn>
        <div className="grid sm:grid-cols-2 gap-4">
          {TRIGGER_QUOTES.map((quote, i) => (
            <FadeIn key={i} delay={i * 0.08} y={20}>
              <div
                className="py-8 px-7 rounded-2xl"
                style={{
                  background: 'rgba(15,14,12,0.7)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderLeft: '2px solid rgba(196,113,74,0.3)',
                }}
              >
                <p
                  className="font-serif text-lg leading-relaxed"
                  style={{ color: 'rgba(190,180,167,0.75)' }}
                >
                  {quote}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
const HOW_STEPS = [
  {
    label: 'You feel the pull',
    sub: 'The urge arrives before you\'ve even consciously decided to open the app. StillOff sees it coming.',
    badge: '01',
  },
  {
    label: 'StillOff steps in',
    sub: 'The lock engages. Distracting apps go quiet immediately — not after a warning, right now.',
    badge: '02',
  },
  {
    label: 'Your phone becomes a reset space',
    sub: 'A guided breathing sequence fills the screen. The spiral stops. Your nervous system recalibrates.',
    badge: '03',
  },
  {
    label: 'You come back with control',
    sub: 'The loop broke. The 15-minute Soft Landing holds the window closed so it stays broken.',
    badge: '04',
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-28 lg:py-36 px-8 lg:px-16"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: '#0A0908' }}
    >
      <div className="mx-auto" style={{ maxWidth: 800 }}>
        <FadeIn className="mb-20">
          <p
            className="text-[11px] font-sans tracking-[0.26em] uppercase mb-5"
            style={{ color: 'rgba(196,113,74,0.55)' }}
          >
            The sequence
          </p>
          <h2
            className="font-serif"
            style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4rem)', color: '#F4EFE8' }}
          >
            How it works.
          </h2>
        </FadeIn>

        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute"
            style={{
              left: 20,
              top: 20,
              bottom: 40,
              width: 1,
              background:
                'linear-gradient(to bottom, rgba(196,113,74,0.4) 0%, rgba(196,113,74,0.08) 100%)',
            }}
          />

          {HOW_STEPS.map((step, i) => (
            <FadeIn key={step.label} delay={i * 0.12} y={22}>
              <div className="flex gap-10 pb-14 last:pb-0">
                {/* Node */}
                <div
                  className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: '#0E0D0B',
                    border: '1px solid rgba(196,113,74,0.35)',
                    boxShadow: '0 0 20px rgba(196,113,74,0.12)',
                  }}
                >
                  <span
                    className="font-sans text-[10px] font-medium"
                    style={{ color: 'rgba(196,113,74,0.75)' }}
                  >
                    {step.badge}
                  </span>
                </div>

                <div style={{ paddingTop: 6 }}>
                  <p
                    className="font-serif mb-3"
                    style={{
                      fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
                      color: '#F4EFE8',
                    }}
                  >
                    {step.label}
                  </p>
                  <p
                    className="font-sans text-sm leading-relaxed"
                    style={{ color: 'rgba(190,180,167,0.58)', maxWidth: 440 }}
                  >
                    {step.sub}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    id: 'lock',
    name: 'The Lock',
    tagline: 'Apps that fuel the spiral go quiet.',
    desc: 'When StillOff detects a compulsive pattern, it silences Instagram, TikTok, and any app you choose. No warning. No override prompt. They simply go dark.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="13" width="18" height="12" rx="3" stroke="#C4714A" strokeWidth="1.6" />
        <path
          d="M9 13V9a5 5 0 0 1 10 0v4"
          stroke="#C4714A"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="14" cy="19" r="2" fill="rgba(196,113,74,0.4)" />
      </svg>
    ),
  },
  {
    id: 'reset',
    name: 'The Reset',
    tagline: 'Breathing, silence, ambient sound.',
    desc: 'Your screen becomes a guided breathing space. A simple cycle — in, hold, out — with optional ambient sound. Most sessions take 60 seconds. That\'s enough.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="9" stroke="#C4714A" strokeWidth="1.6" />
        <circle cx="14" cy="14" r="4.5" stroke="#C4714A" strokeWidth="1.2" strokeDasharray="2.5 2.5" />
        <circle cx="14" cy="14" r="1.5" fill="#C4714A" />
      </svg>
    ),
    hasOrb: true,
  },
  {
    id: 'landing',
    name: 'The Soft Landing',
    tagline: '15-minute post-session firewall.',
    desc: 'The first minutes after a reset are where most relapses happen. StillOff keeps high-dopamine apps quiet a little longer — so the window actually holds.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M14 5v14m0 0-4.5-4.5M14 19l4.5-4.5"
          stroke="#C4714A"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M5 22h18" stroke="#C4714A" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'ai',
    name: 'Learns your patterns',
    tagline: 'Steps in before you have to ask.',
    desc: 'Pattern Intelligence (Premium) learns when you\'re most at risk. Over time, StillOff begins stepping in on its own — before the urge even registers.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M4 20l6-8 5 4 6-10"
          stroke="#C4714A"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="23" cy="6" r="2.5" fill="#C4714A" fillOpacity="0.3" stroke="#C4714A" strokeWidth="1.4" />
      </svg>
    ),
    hasPattern: true,
  },
];

function Features() {
  return (
    <section
      id="features"
      className="py-28 lg:py-36 px-8 lg:px-16"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <FadeIn className="mb-20">
          <p
            className="text-[11px] font-sans tracking-[0.26em] uppercase mb-5"
            style={{ color: 'rgba(196,113,74,0.55)' }}
          >
            How it stops the spiral
          </p>
          <h2
            className="font-serif"
            style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4rem)', color: '#F4EFE8' }}
          >
            What StillOff does.
          </h2>
        </FadeIn>

        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <FadeIn key={f.id} delay={i * 0.09} y={22}>
              <div
                className="p-8 rounded-2xl flex flex-col gap-6 h-full"
                style={{
                  background: 'rgba(15,14,12,0.6)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderTop: '1px solid rgba(196,113,74,0.22)',
                  boxShadow: 'inset 0 1px 0 rgba(196,113,74,0.08)',
                }}
              >
                {/* Icon row */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'rgba(196,113,74,0.08)',
                      border: '1px solid rgba(196,113,74,0.18)',
                    }}
                  >
                    {f.icon}
                  </div>
                  {f.id === 'reset' && (
                    <div style={{ opacity: 0.6, marginTop: -4 }}>
                      <BreathingOrb size={52} intense />
                    </div>
                  )}
                </div>

                <div>
                  <p className="font-serif text-xl mb-1" style={{ color: '#F4EFE8' }}>
                    {f.name}
                  </p>
                  <p
                    className="text-xs font-sans tracking-wide uppercase mb-4"
                    style={{ color: 'rgba(196,113,74,0.6)' }}
                  >
                    {f.tagline}
                  </p>
                  <p
                    className="font-sans text-sm leading-relaxed"
                    style={{ color: 'rgba(190,180,167,0.62)' }}
                  >
                    {f.desc}
                  </p>
                  {'hasPattern' in f && f.hasPattern && (
                    <div
                      className="mt-6 rounded-xl py-4 px-3"
                      style={{
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <PatternMap />
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Soft Landing ─────────────────────────────────────────────────────────────
function SoftLandingCard() {
  const [seconds, setSeconds] = useState(14 * 60 + 32); // 14:32 remaining
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: false, margin: '-100px 0px' });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!inView) return;
    timerRef.current = setInterval(() => {
      setSeconds((s) => (s <= 0 ? 14 * 60 + 59 : s - 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [inView]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${mins}:${String(secs).padStart(2, '0')}`;
  const progress = seconds / (15 * 60); // fraction of 15 min remaining

  return (
    <div
      ref={ref}
      className="rounded-2xl overflow-hidden"
      style={{
        border: '1px solid rgba(196,113,74,0.18)',
        background: 'rgba(12,11,9,0.85)',
        boxShadow: '0 0 48px rgba(196,113,74,0.06), 0 24px 48px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{
          borderBottom: '1px solid rgba(196,113,74,0.1)',
          background: 'rgba(196,113,74,0.04)',
        }}
      >
        <div className="flex items-center gap-2">
          <m.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#C4714A' }}
          />
          <p
            className="text-[10px] font-sans tracking-widest uppercase"
            style={{ color: 'rgba(196,113,74,0.7)' }}
          >
            Soft Landing · Active
          </p>
        </div>
        <p
          className="text-[10px] font-sans font-medium tabular-nums"
          style={{ color: 'rgba(196,113,74,0.55)' }}
        >
          {timeStr} remaining
        </p>
      </div>

      {/* App list */}
      <div className="px-5 py-4 space-y-0.5">
        {[
          { name: 'Instagram', quiet: true },
          { name: 'TikTok', quiet: true },
          { name: 'X / Twitter', quiet: true },
          { name: 'Messages', quiet: false },
          { name: 'Maps', quiet: false },
        ].map((app, i) => (
          <div
            key={app.name}
            className="flex items-center justify-between py-2.5"
            style={i < 4 ? { borderBottom: '1px solid rgba(255,255,255,0.04)' } : {}}
          >
            <p
              className="text-sm font-sans"
              style={{ color: app.quiet ? 'rgba(190,180,167,0.35)' : 'rgba(190,180,167,0.72)' }}
            >
              {app.name}
            </p>
            <span
              className="text-[9px] font-sans font-medium px-2.5 py-1 rounded-full"
              style={
                app.quiet
                  ? { background: 'rgba(196,113,74,0.12)', color: '#C4714A' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'rgba(190,180,167,0.4)' }
              }
            >
              {app.quiet ? 'Quiet' : 'Open'}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div
        className="px-5 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div
          className="h-0.5 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${(1 - progress) * 100}%`, background: 'rgba(196,113,74,0.55)' }}
          />
        </div>
        <p
          className="text-[9px] font-sans mt-2"
          style={{ color: 'rgba(190,180,167,0.2)' }}
        >
          Window closes gradually
        </p>
      </div>
    </div>
  );
}

function SoftLanding() {
  return (
    <section
      className="py-24 lg:py-32 px-8 lg:px-16"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="mx-auto" style={{ maxWidth: 1000 }}>
        <div className="grid lg:grid-cols-[1fr_340px] gap-16 lg:gap-24 items-center">
          <FadeIn y={28}>
            <p
              className="text-[11px] font-sans tracking-[0.26em] uppercase mb-6"
              style={{ color: 'rgba(196,113,74,0.55)' }}
            >
              The after
            </p>
            <h2
              className="font-serif leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#F4EFE8' }}
            >
              Most blockers end.{' '}
              <span className="italic" style={{ color: 'rgba(190,180,167,0.5)' }}>
                StillOff eases you back.
              </span>
            </h2>
            <p
              className="font-sans text-base leading-relaxed"
              style={{ color: 'rgba(190,180,167,0.6)', maxWidth: 380 }}
            >
              After a session, high-dopamine apps stay quiet for 15 more minutes.
              Not because you chose to wait — because StillOff holds the window
              until the urge has passed.
            </p>
          </FadeIn>

          <FadeIn delay={0.18} y={22}>
            <SoftLandingCard />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── Why Different ────────────────────────────────────────────────────────────
const DIFF_ROWS = [
  { other: 'Track your usage', still: 'Stop the behavior' },
  { other: 'Suggest breaks', still: 'Intervene in the moment' },
  { other: 'Rely on your discipline', still: 'Remove the decision' },
  { other: 'Easy to bypass', still: 'Designed to hold' },
  { other: "Work when you're motivated", still: "Work when you're not" },
];

function WhyDifferent() {
  return (
    <section
      className="py-28 lg:py-36 px-8 lg:px-16"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: '#0A0908' }}
    >
      <div className="mx-auto" style={{ maxWidth: 860 }}>
        <FadeIn className="mb-16">
          <p
            className="text-[11px] font-sans tracking-[0.26em] uppercase mb-5"
            style={{ color: 'rgba(196,113,74,0.55)' }}
          >
            The difference
          </p>
          <h2
            className="font-serif"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', color: '#F4EFE8' }}
          >
            Different by design.
          </h2>
        </FadeIn>

        <FadeIn delay={0.1} y={16}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* Header */}
            <div className="grid grid-cols-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="px-7 py-4" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <p
                  className="text-[10px] font-sans tracking-widest uppercase"
                  style={{ color: 'rgba(190,180,167,0.28)' }}
                >
                  Other apps
                </p>
              </div>
              <div
                className="px-7 py-4"
                style={{ background: 'rgba(196,113,74,0.04)' }}
              >
                <p
                  className="text-[10px] font-sans tracking-widest uppercase"
                  style={{ color: 'rgba(196,113,74,0.65)' }}
                >
                  StillOff
                </p>
              </div>
            </div>

            {DIFF_ROWS.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-2"
                style={
                  i < DIFF_ROWS.length - 1
                    ? { borderBottom: '1px solid rgba(255,255,255,0.04)' }
                    : {}
                }
              >
                <div
                  className="px-7 py-5"
                  style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <p
                    className="font-sans text-sm"
                    style={{
                      color: 'rgba(190,180,167,0.32)',
                      textDecoration: 'line-through',
                      textDecorationColor: 'rgba(190,180,167,0.15)',
                    }}
                  >
                    {row.other}
                  </p>
                </div>
                <div className="px-7 py-5" style={{ background: 'rgba(196,113,74,0.025)' }}>
                  <p className="font-sans text-sm" style={{ color: '#F4EFE8' }}>
                    {row.still}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Big Quote ────────────────────────────────────────────────────────────────
function BigQuote() {
  return (
    <section
      className="py-24 lg:py-32 px-8 lg:px-16"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="mx-auto" style={{ maxWidth: 860 }}>
        <FadeIn y={36}>
          <p
            className="font-serif leading-[1.3]"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.4rem)',
              color: 'rgba(190,180,167,0.62)',
            }}
          >
            "You don't need more guilt about your habits.{' '}
            <span style={{ color: '#F4EFE8' }}>
              You need a way to break them while they're happening."
            </span>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Proof ────────────────────────────────────────────────────────────────────
function Proof() {
  const handleShare = async () => {
    const text = 'I sat with the loop for 18 minutes today. I didn\'t look away.';
    const url = 'https://stilloff.com';
    try {
      if (navigator.share) {
        await navigator.share({ text, url });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
      }
    } catch {
      // cancelled or unsupported
    }
  };

  return (
    <section
      className="py-28 lg:py-36 px-8 lg:px-16"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: '#0A0908' }}
    >
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        {/* Lead testimonial */}
        <FadeIn y={36} className="mb-24">
          <p
            className="font-serif leading-tight"
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
              color: '#F4EFE8',
              maxWidth: 780,
            }}
          >
            "I didn't realize how deep I was until StillOff locked me out.{' '}
            <span className="italic" style={{ color: 'rgba(190,180,167,0.55)' }}>
              That minute felt like catching a breath I'd forgotten existed.
            </span>"
          </p>
          <p
            className="text-xs font-sans mt-8 tracking-widest uppercase"
            style={{ color: 'rgba(190,180,167,0.28)' }}
          >
            Maya, 28 — New York
          </p>
        </FadeIn>

        {/* Secondary testimonials */}
        <div className="grid sm:grid-cols-2 gap-x-20 gap-y-16 mb-24">
          <FadeIn delay={0.12} y={24}>
            <div style={{ paddingTop: 24 }}>
              <div
                className="w-8 h-px mb-6"
                style={{ background: 'rgba(196,113,74,0.4)' }}
              />
              <p
                className="font-serif text-xl leading-[1.65]"
                style={{ color: 'rgba(190,180,167,0.7)' }}
              >
                "It's not about willpower anymore. It just stops before I can
                talk myself into it."
              </p>
              <p
                className="text-xs font-sans mt-6 tracking-widest uppercase"
                style={{ color: 'rgba(190,180,167,0.25)' }}
              >
                James, 34 — Chicago
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.24} y={24}>
            <div>
              <div
                className="w-8 h-px mb-6"
                style={{ background: 'rgba(196,113,74,0.4)' }}
              />
              <p
                className="font-serif text-xl leading-[1.65]"
                style={{ color: 'rgba(190,180,167,0.7)' }}
              >
                "The soft landing is what got me. I'd reset and immediately
                be back. Now there's actually a buffer."
              </p>
              <p
                className="text-xs font-sans mt-6 tracking-widest uppercase"
                style={{ color: 'rgba(190,180,167,0.25)' }}
              >
                Sofia, 22 — London
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Proof card */}
        <FadeIn delay={0.2} y={24}>
          <div
            className="rounded-2xl p-8 mx-auto"
            style={{
              maxWidth: 440,
              background: 'rgba(15,14,12,0.8)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 0 60px rgba(196,113,74,0.05)',
            }}
          >
            <p
              className="text-[10px] font-sans tracking-widest uppercase mb-6 text-center"
              style={{ color: 'rgba(190,180,167,0.28)' }}
            >
              Session complete · 18 min
            </p>
            <p
              className="font-serif text-xl text-center mb-4"
              style={{ color: '#F4EFE8' }}
            >
              I sat with it. I didn't look away.
            </p>
            <p
              className="font-serif text-base italic leading-relaxed mb-8 text-center"
              style={{ color: 'rgba(190,180,167,0.45)' }}
            >
              "It didn't pass. You moved through it. The world waited. It was fine."
            </p>
            <div
              className="flex items-center justify-between pt-5"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              <p
                className="text-[10px] font-sans leading-snug"
                style={{ color: 'rgba(190,180,167,0.24)', maxWidth: '60%' }}
              >
                StillOff · Private by default · Shareable when ready
              </p>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans transition-colors flex-shrink-0"
                style={{
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'rgba(190,180,167,0.5)',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = '#F4EFE8')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(190,180,167,0.5)')
                }
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M8 1.5 10.5 4 8 6.5M10.5 4H4.5M6 1.5H2a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Share
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: 'How does StillOff actually lock apps?',
    a: "StillOff uses iOS's Screen Time API to restrict access to apps you've designated. When a lock triggers, those apps go dark until the session ends — no override prompt, no 'just five more minutes' dialogue.",
  },
  {
    q: "Won't I just bypass it?",
    a: "The design assumes you'll try. That's why the Soft Landing exists — it holds the window closed for 15 minutes after each reset, the exact period when most relapses occur. Bypassing requires a deliberate 15-minute wait, which is usually enough.",
  },
  {
    q: 'Are calls and texts blocked too?',
    a: 'Never. Emergency calls, regular calls, and any apps you mark as essential are always accessible. StillOff targets compulsive patterns, not your ability to reach people.',
  },
  {
    q: 'Does StillOff track my behavior?',
    a: "Pattern Intelligence runs entirely on your device. No behavioral data, app usage patterns, or session history is ever sent to any server. Your patterns stay yours — that's the design, not just a policy.",
  },
  {
    q: "What's the difference between StillOff and a regular blocker?",
    a: "Blockers require you to decide in advance — you have to be motivated enough to set them up. StillOff reads the moment: the compulsive loop as it's forming. It steps in right then, before the decision is even made. That gap is where every other app fails.",
  },
  {
    q: 'When does StillOff launch?',
    a: "We're in final development. Join the waitlist and you'll receive one email the day it's ready — no newsletters, no re-engagement sequences.",
  },
];

function FAQItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <FadeIn delay={idx * 0.05} y={14}>
      <div
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between py-6 gap-6 text-left"
        >
          <span
            className="font-serif text-lg leading-snug"
            style={{ color: open ? '#F4EFE8' : 'rgba(244,239,232,0.75)' }}
          >
            {q}
          </span>
          <div
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200"
            style={{
              background: open ? 'rgba(196,113,74,0.15)' : 'rgba(255,255,255,0.05)',
              border: open ? '1px solid rgba(196,113,74,0.3)' : '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              style={{
                transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s ease',
              }}
            >
              <path
                d="M5 1v8M1 5h8"
                stroke={open ? '#C4714A' : 'rgba(190,180,167,0.5)'}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </button>
        <m.div
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: 'hidden' }}
        >
          <p
            className="font-sans text-sm leading-relaxed pb-6"
            style={{ color: 'rgba(190,180,167,0.6)', maxWidth: 640 }}
          >
            {a}
          </p>
        </m.div>
      </div>
    </FadeIn>
  );
}

function FAQ() {
  return (
    <section
      className="py-28 lg:py-36 px-8 lg:px-16"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: '#0A0908' }}
    >
      <div className="mx-auto" style={{ maxWidth: 860 }}>
        <FadeIn className="mb-14">
          <p
            className="text-[11px] font-sans tracking-[0.26em] uppercase mb-5"
            style={{ color: 'rgba(196,113,74,0.55)' }}
          >
            Questions
          </p>
          <h2
            className="font-serif"
            style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4rem)', color: '#F4EFE8' }}
          >
            Answered honestly.
          </h2>
        </FadeIn>

        <div
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
const PRICING_TIERS = [
  {
    name: 'Free',
    price: null as null,
    badge: null,
    features: [
      'Guided Reset (3/day)',
      'Basic session tracking',
      'Breathing exercises',
    ],
  },
  {
    name: 'Plus',
    price: { monthly: '$5.99', yearly: '$47.99' },
    badge: null,
    features: [
      'Hard Lock',
      'Guided Reset (unlimited)',
      'Soft Landing',
      'Weekly insights',
      'Custom lock duration',
    ],
  },
  {
    name: 'Premium',
    price: { monthly: '$9.99', yearly: '$79.99' },
    badge: 'Most Popular',
    features: [
      'Everything in Plus',
      'Pattern Intelligence (AI)',
      'Predictive intervention',
      'Emotional state detection',
      'Priority support',
    ],
  },
];

function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section
      id="pricing"
      className="py-28 lg:py-36 px-8 lg:px-16"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="mx-auto" style={{ maxWidth: 920 }}>
        <FadeIn className="mb-14">
          <h2
            className="font-serif mb-8"
            style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4rem)', color: '#F4EFE8' }}
          >
            Simple pricing.
          </h2>
          <div className="flex items-center gap-3">
            <span
              className="text-sm font-sans"
              style={{ color: yearly ? 'rgba(190,180,167,0.38)' : '#F4EFE8' }}
            >
              Monthly
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              className="relative rounded-full transition-colors duration-200"
              style={{
                width: 40,
                height: 22,
                background: yearly ? '#C4714A' : 'rgba(255,255,255,0.1)',
              }}
            >
              <div
                className="absolute rounded-full transition-transform duration-200"
                style={{
                  width: 16,
                  height: 16,
                  top: 3,
                  left: 3,
                  background: '#F4EFE8',
                  transform: yearly ? 'translateX(18px)' : 'translateX(0)',
                }}
              />
            </button>
            <span
              className="text-sm font-sans"
              style={{ color: yearly ? '#F4EFE8' : 'rgba(190,180,167,0.38)' }}
            >
              Yearly{' '}
              <span style={{ color: '#C4714A', fontSize: '0.75rem' }}>· save 30%</span>
            </span>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-3 gap-4">
          {PRICING_TIERS.map((tier, i) => {
            const isPremium = tier.name === 'Premium';
            return (
              <FadeIn key={tier.name} delay={i * 0.08} y={18}>
                <div
                  className="p-7 rounded-2xl h-full flex flex-col"
                  style={{
                    background: isPremium ? 'rgba(196,113,74,0.05)' : 'rgba(15,14,12,0.7)',
                    border: isPremium
                      ? '1px solid rgba(196,113,74,0.35)'
                      : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: isPremium
                      ? '0 0 60px rgba(196,113,74,0.08), inset 0 1px 0 rgba(196,113,74,0.15)'
                      : 'none',
                    position: 'relative',
                  }}
                >
                  {tier.badge && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-sans font-medium tracking-wide"
                      style={{ background: '#C4714A', color: '#F4EFE8' }}
                    >
                      {tier.badge}
                    </div>
                  )}

                  <p className="font-serif text-xl mb-3" style={{ color: '#F4EFE8' }}>
                    {tier.name}
                  </p>

                  <div className="mb-8">
                    {tier.price ? (
                      <p className="font-serif" style={{ fontSize: '2rem', color: '#F4EFE8' }}>
                        {yearly ? tier.price.yearly : tier.price.monthly}
                        <span
                          className="text-sm font-sans ml-1.5"
                          style={{ color: 'rgba(190,180,167,0.4)' }}
                        >
                          {yearly ? '/yr' : '/mo'}
                        </span>
                      </p>
                    ) : (
                      <p className="font-serif" style={{ fontSize: '2rem', color: 'rgba(244,239,232,0.38)' }}>
                        Free
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <div
                          className="flex-shrink-0 rounded-full mt-1.5"
                          style={{
                            width: 5,
                            height: 5,
                            background: isPremium
                              ? '#C4714A'
                              : 'rgba(196,113,74,0.4)',
                          }}
                        />
                        <span
                          className="text-sm font-sans leading-snug"
                          style={{ color: 'rgba(190,180,167,0.62)' }}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#waitlist"
                    className="mt-8 w-full py-3 rounded-xl text-sm font-sans font-medium transition-all text-center block"
                    style={
                      isPremium
                        ? {
                            background: '#C4714A',
                            color: '#F4EFE8',
                            boxShadow: '0 0 24px rgba(196,113,74,0.3)',
                          }
                        : {
                            background: 'rgba(255,255,255,0.06)',
                            color: 'rgba(190,180,167,0.7)',
                            border: '1px solid rgba(255,255,255,0.08)',
                          }
                    }
                    onMouseEnter={(e) => {
                      if (isPremium) {
                        (e.currentTarget as HTMLAnchorElement).style.background = '#D4825B';
                      } else {
                        (e.currentTarget as HTMLAnchorElement).style.color = '#F4EFE8';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isPremium) {
                        (e.currentTarget as HTMLAnchorElement).style.background = '#C4714A';
                      } else {
                        (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(190,180,167,0.7)';
                      }
                    }}
                  >
                    {tier.price ? 'Join waitlist' : 'Start free'}
                  </a>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.3} className="mt-8 text-center">
          <p className="text-xs font-sans" style={{ color: 'rgba(190,180,167,0.28)' }}>
            All plans include a 7-day free trial. No card required to join the waitlist.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Waitlist ─────────────────────────────────────────────────────────────────
function Waitlist({ showToast }: { showToast: (msg: string) => void }) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    try {
      const res = await fetch('https://formspree.io/f/mzdklnwv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, source: 'waitlist' }),
      });
      if (res.ok) {
        showToast("You're on the list. See you on the other side.");
        setEmail('');
      } else {
        showToast('Something went wrong. Try again.');
      }
    } catch {
      showToast('Something went wrong. Try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        minHeight: '90vh',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        background: '#0A0908',
      }}
    >
      {/* Orb backdrop */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0.55 }}
      >
        <BreathingOrb size={640} />
      </div>

      {/* Radial fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(10,9,8,0.82) 100%)',
        }}
      />

      <div
        className="relative text-center px-8 py-24"
        style={{ zIndex: 10, maxWidth: 560 }}
      >
        <FadeIn y={44}>
          <div className="flex items-center justify-center gap-2 mb-6">
            <m.div
              animate={{ opacity: [1, 0.25, 1], scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
              style={{ width: 5, height: 5, borderRadius: '50%', background: '#C4714A', flexShrink: 0 }}
            />
            <p
              className="text-[11px] font-sans tracking-[0.26em] uppercase"
              style={{ color: 'rgba(196,113,74,0.55)' }}
            >
              <CountUp target={2847} /> people waiting
            </p>
          </div>

          <p
            className="font-serif italic mb-6"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(190,180,167,0.48)',
            }}
          >
            That felt different. That's what control feels like.
          </p>

          <h2
            className="font-serif leading-tight mb-14"
            style={{
              fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
              color: '#F4EFE8',
            }}
          >
            Be first when StillOff launches.
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-5 py-4 rounded-full text-sm font-sans focus:outline-none transition-colors"
              style={{
                background: 'rgba(15,14,12,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#F4EFE8',
                backdropFilter: 'blur(12px)',
                caretColor: '#C4714A',
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = 'rgba(196,113,74,0.5)')
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')
              }
            />
            <button
              type="submit"
              disabled={sending}
              className="px-8 py-4 rounded-full text-sm font-sans font-medium transition-all whitespace-nowrap disabled:opacity-50"
              style={{
                background: '#C4714A',
                color: '#F4EFE8',
                boxShadow: '0 0 36px rgba(196,113,74,0.4)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#D4825B';
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 0 48px rgba(196,113,74,0.55)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#C4714A';
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 0 36px rgba(196,113,74,0.4)';
              }}
            >
              {sending ? 'Joining...' : 'Join the waitlist'}
            </button>
          </form>

          <p
            className="text-[11px] font-sans mt-6"
            style={{ color: 'rgba(190,180,167,0.25)' }}
          >
            No newsletters. One email when it's ready.
          </p>

          {/* iOS badge */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <svg width="12" height="15" viewBox="0 0 12 15" fill="none">
                <rect x="1" y="2" width="10" height="12" rx="2.5" stroke="rgba(190,180,167,0.3)" strokeWidth="1.1" />
                <rect x="4" y="0.5" width="4" height="2" rx="1" fill="none" stroke="rgba(190,180,167,0.3)" strokeWidth="1.1" />
                <circle cx="6" cy="11" r="1" fill="rgba(190,180,167,0.3)" />
              </svg>
              <span
                className="text-[10px] font-sans"
                style={{ color: 'rgba(190,180,167,0.3)', letterSpacing: '0.06em' }}
              >
                iOS · Coming soon
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="py-10 px-8 lg:px-16"
      style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div
        className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-5"
        style={{ maxWidth: 1100 }}
      >
        <p className="font-serif text-xl" style={{ color: '#F4EFE8' }}>
          StillOff
        </p>
        <p className="font-sans text-xs" style={{ color: 'rgba(190,180,167,0.3)' }}>
          © 2026 StillOff · When you can't stop, StillOff does.
        </p>
        <div className="flex items-center gap-7">
          {[
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'hello@stilloff.com', href: 'mailto:hello@stilloff.com' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-sans transition-colors"
              style={{ color: 'rgba(190,180,167,0.38)' }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = '#F4EFE8')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(190,180,167,0.38)')
              }
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Sticky CTA ───────────────────────────────────────────────────────────────
function StickyCTA({ onOpenDemo }: { onOpenDemo: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollPct =
        window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const waitlist = document.querySelector('#waitlist');
      const nearWaitlist = waitlist
        ? waitlist.getBoundingClientRect().top < window.innerHeight * 0.85
        : false;
      setVisible(scrollPct > 0.18 && !nearWaitlist);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 0.92, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button
            onClick={onOpenDemo}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-sans transition-all shadow-2xl"
            style={{
              background: 'rgba(20,18,15,0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(196,113,74,0.2)',
              color: '#F4EFE8',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.borderColor =
                'rgba(196,113,74,0.45)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.borderColor =
                'rgba(196,113,74,0.2)')
            }
          >
            <div
              className="rounded-full"
              style={{ width: 6, height: 6, background: '#C4714A', boxShadow: '0 0 8px #C4714A' }}
            />
            Try the 60-second lock
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Page() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [toast, setToast] = useState<ToastItem | null>(null);
  const toastIdRef = useRef(0);

  const showToast = useCallback((msg: string) => {
    toastIdRef.current += 1;
    setToast({ id: toastIdRef.current, msg });
  }, []);

  const openDemo = useCallback(() => setDemoOpen(true), []);
  const closeDemo = useCallback(() => setDemoOpen(false), []);

  return (
    <LazyMotion features={domAnimation}>
      <Nav onOpenDemo={openDemo} />

      <main>
        <Hero onOpenDemo={openDemo} />
        <StatsStrip />
        <TheSpiral />
        <TheMoment />
        <HowItWorks />
        <Features />
        <SoftLanding />
        <WhyDifferent />
        <BigQuote />
        <Proof />
        <FAQ />
        <Pricing />
        <Waitlist showToast={showToast} />
      </main>

      <Footer />
      <StickyCTA onOpenDemo={openDemo} />

      <AnimatePresence>
        {demoOpen && (
          <DemoModal onClose={closeDemo} showToast={showToast} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast
            key={toast.id}
            msg={toast.msg}
            onDone={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
