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

// ─── Constants ────────────────────────────────────────────────────────────────

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
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-full text-sm font-sans text-[#F3EEE6] bg-[#1C1A17]/90 backdrop-blur-md border border-[#2A2622] shadow-xl whitespace-nowrap"
    >
      {msg}
    </m.div>
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
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });
  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </m.div>
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
      const dur = cycle[idx % cycle.length].dur;
      idx++;
      timer = setTimeout(next, dur);
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
    <div className="relative w-full h-full overflow-hidden rounded-[30px] bg-[#0C0B09] flex flex-col">
      {/* Dynamic Island */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-10" />

      <AnimatePresence mode="wait">
        {phase === 'trigger' && (
          <m.div key="trigger" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between px-4 pt-12 pb-5">
            <div className="text-center">
              <p className="text-[10px] text-[#BEB4A7] font-sans tracking-widest uppercase">9:41</p>
            </div>
            <div className="grid grid-cols-4 gap-2.5 px-1">
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
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: app.color }}>
                    <span className="text-[8px] text-white font-sans font-medium">{app.name}</span>
                  </div>
                  {app.badge && (
                    <m.div animate={{ scale: [1, 1.25, 1] }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-[7px] text-white font-bold">{app.badge}</span>
                    </m.div>
                  )}
                </div>
              ))}
            </div>
            <m.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 2 }}
              className="mx-1 px-3 py-2 rounded-xl bg-[#1C1917] border border-[#2A2622]">
              <p className="text-[9px] text-[#6E4637] font-sans font-medium">StillOff detecting...</p>
              <p className="text-[9px] text-[#BEB4A7] font-sans mt-0.5">Opened 6× in 8 min</p>
            </m.div>
          </m.div>
        )}

        {phase === 'lock' && (
          <m.div key="lock" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} className="flex-1 flex flex-col items-center justify-center gap-5 px-6">
            <m.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-12 h-12 rounded-2xl bg-[#6E4637]/20 border border-[#6E4637]/40 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="4.5" y="10" width="13" height="9" rx="2" stroke="#6E4637" strokeWidth="1.4" />
                <path d="M7.5 10V7a3.5 3.5 0 0 1 7 0v3" stroke="#6E4637" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </m.div>
            <div className="text-center space-y-1.5">
              <p className="font-serif text-base text-[#F3EEE6]">StillOff has stepped in.</p>
              <p className="text-[10px] text-[#BEB4A7] font-sans">Your apps are quiet.</p>
            </div>
            <m.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 1.4 }}
              className="w-full h-px bg-gradient-to-r from-transparent via-[#6E4637] to-transparent" />
          </m.div>
        )}

        {phase === 'breathing' && (
          <m.div key="breathing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-5">
            <BreathingOrb size={100} intense />
            <div className="text-center">
              <m.p key={breathLabel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }} className="font-serif text-sm text-[#F3EEE6]">
                {breathText[breathLabel]}
              </m.p>
              <p className="text-[9px] text-[#BEB4A7] font-sans mt-1 tracking-wider uppercase">Guided Reset</p>
            </div>
          </m.div>
        )}

        {phase === 'complete' && (
          <m.div key="complete" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} className="flex-1 flex flex-col items-center justify-center gap-5 px-6">
            <m.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
              className="w-11 h-11 rounded-full bg-[#6E4637]/20 border border-[#6E4637]/50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9l4 4 8-7" stroke="#6E4637" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </m.div>
            <div className="text-center">
              <p className="font-serif text-base text-[#F3EEE6]">Session complete.</p>
              <p className="text-[10px] text-[#BEB4A7] font-sans mt-1">18 min · Day 11 · streak active</p>
            </div>
          </m.div>
        )}

        {phase === 'firewall' && (
          <m.div key="firewall" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-center px-5 pt-12 gap-1">
            <p className="text-[9px] text-[#BEB4A7] font-sans tracking-widest uppercase mb-3">App Firewall · 15 min</p>
            {[
              { name: 'Instagram', quiet: true },
              { name: 'TikTok', quiet: true },
              { name: 'X / Twitter', quiet: true },
              { name: 'Messages', quiet: false },
              { name: 'Maps', quiet: false },
            ].map((app, i) => (
              <m.div key={app.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center justify-between py-2 border-b border-[#2A2622]/60">
                <span className="text-[11px] text-[#F3EEE6] font-sans">{app.name}</span>
                <span className={`text-[9px] font-sans font-medium px-2 py-0.5 rounded-full ${
                  app.quiet ? 'bg-[#6E4637]/25 text-[#6E4637]' : 'bg-[#2A2622] text-[#BEB4A7]'}`}>
                  {app.quiet ? 'Quiet' : 'Open'}
                </span>
              </m.div>
            ))}
          </m.div>
        )}
      </AnimatePresence>

      {/* Phase dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {WALK_PHASES.map((p) => (
          <div key={p} className={`h-1.5 rounded-full transition-all duration-500 ${
            p === phase ? 'bg-[#6E4637] w-4' : 'bg-[#2A2622] w-1.5'}`} />
        ))}
      </div>
    </div>
  );
}

// ─── Phone Shell ──────────────────────────────────────────────────────────────

function PhoneShell({ phase, width = 260, height = 520 }: { phase: WalkPhase; width?: number; height?: number }) {
  return (
    <div
      style={{ width, height }}
      className="relative rounded-[38px] border border-[#2A2622] bg-[#0C0B09] shadow-[0_40px_80px_rgba(0,0,0,0.6)] flex-shrink-0"
    >
      <div className="absolute inset-0 rounded-[38px] border border-[#F3EEE6]/[0.04] pointer-events-none z-20" />
      <div className="absolute inset-[2px] rounded-[36px] overflow-hidden">
        <PhoneScreen phase={phase} />
      </div>
      <div className="absolute left-[-1px] top-[100px] w-[2px] h-7 bg-[#1C1917] rounded-l" />
      <div className="absolute left-[-1px] top-[140px] w-[2px] h-7 bg-[#1C1917] rounded-l" />
      <div className="absolute right-[-1px] top-[118px] w-[2px] h-12 bg-[#1C1917] rounded-r" />
    </div>
  );
}

// Self-cycling phone (hero)
function PhoneWalkthrough({ width = 260, height = 520 }: { width?: number; height?: number }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = WALK_PHASES[phaseIdx];
  useEffect(() => {
    const t = setTimeout(() => setPhaseIdx((i) => (i + 1) % WALK_PHASES.length), PHASE_DURATIONS[phase]);
    return () => clearTimeout(t);
  }, [phaseIdx, phase]);
  return <PhoneShell phase={phase} width={width} height={height} />;
}

// ─── Demo Modal ───────────────────────────────────────────────────────────────

type DemoPhase = 'preframe' | 'breathing' | 'ending' | 'cta';

function DemoModal({ onClose, showToast }: { onClose: () => void; showToast: (msg: string) => void }) {
  const [phase, setPhase] = useState<DemoPhase>('preframe');
  const [breathLabel, setBreathLabel] = useState<'in' | 'hold' | 'out' | 'hold2'>('in');
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  // Preframe → breathing
  useEffect(() => {
    const t = setTimeout(() => setPhase('breathing'), 2800);
    return () => clearTimeout(t);
  }, []);

  // Breathing cycle + progress
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
    const progressTimer = setInterval(() => {
      const p = Math.min((performance.now() - start) / 30000, 1);
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

  // Ending → CTA
  useEffect(() => {
    if (phase !== 'ending') return;
    const t = setTimeout(() => setPhase('cta'), 2600);
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
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#11100E]/96 backdrop-blur-lg"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <m.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm mx-5 rounded-3xl bg-[#0F0E0C] border border-[#2A2622] overflow-hidden">
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#1C1917] flex items-center justify-center text-[#BEB4A7] hover:text-[#F3EEE6] transition-colors">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="p-8 min-h-[460px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === 'preframe' && (
              <m.div key="preframe" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} className="text-center space-y-2">
                <p className="font-serif text-2xl text-[#F3EEE6] leading-snug">
                  "You didn't plan to scroll.
                </p>
                <p className="font-serif text-2xl text-[#6E4637] italic leading-snug">
                  StillOff stepped in."
                </p>
                <p className="text-xs text-[#BEB4A7] font-sans mt-6 pt-4">Starting your reset...</p>
              </m.div>
            )}

            {phase === 'breathing' && (
              <m.div key="breathing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-8 w-full">
                <BreathingOrb size={180} intense />
                <m.p key={breathLabel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }} className="font-serif text-2xl text-[#F3EEE6]">
                  {breathText[breathLabel]}
                </m.p>
                <div className="w-full h-px bg-[#2A2622] rounded-full overflow-hidden">
                  <div className="h-full bg-[#6E4637] transition-all duration-75 ease-linear"
                    style={{ width: `${progress * 100}%` }} />
                </div>
              </m.div>
            )}

            {phase === 'ending' && (
              <m.div key="ending" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} className="text-center space-y-2">
                <p className="font-serif text-xl text-[#F3EEE6] leading-relaxed">
                  You didn't check. Nothing happened.
                </p>
                <p className="font-serif text-xl text-[#6E4637] italic">That's the point.</p>
              </m.div>
            )}

            {phase === 'cta' && (
              <m.div key="cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="w-full text-center">
                <p className="font-serif text-xl text-[#F3EEE6] mb-1">That felt different.</p>
                <p className="text-sm text-[#BEB4A7] font-sans mb-8">Be first when StillOff launches.</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#1C1917] border border-[#2A2622] text-[#F3EEE6] text-sm font-sans placeholder-[#BEB4A7]/40 focus:outline-none focus:border-[#6E4637] transition-colors" />
                  <button type="submit" disabled={sending}
                    className="w-full py-3 rounded-xl bg-[#6E4637] text-[#F3EEE6] text-sm font-sans font-medium hover:bg-[#7D5040] transition-colors disabled:opacity-50">
                    {sending ? 'Joining...' : 'Join the waitlist'}
                  </button>
                </form>
                <p className="text-[11px] text-[#BEB4A7]/50 font-sans mt-4">No newsletters. One email when it's ready.</p>
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
  const [grainOpacity, setGrainOpacity] = useState(0.04);
  const [supportLine, setSupportLine] = useState('Break the loop before it owns the next hour.');
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    lastScrollTime.current = performance.now();
    if (sessionStorage.getItem('stilloff-demo-complete') === 'true') {
      setSupportLine('Welcome back. Ready to lock it in?');
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const now = performance.now();
      const delta = Math.abs(window.scrollY - lastScrollY.current);
      const dt = now - lastScrollTime.current;
      const velocity = dt > 0 ? delta / dt : 0;
      setGrainOpacity(velocity > 1.8 ? 0.06 : 0.04);
      lastScrollY.current = window.scrollY;
      lastScrollTime.current = now;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative min-h-[108vh] flex items-center overflow-hidden pt-24 pb-24">
      {/* Grain overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-700"
        style={{
          opacity: grainOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '160px 160px',
        }} />
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#6E4637]/[0.07] blur-[140px] pointer-events-none" />

      <div className="relative z-[2] w-full max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Copy */}
          <div>
            <m.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[11px] font-sans tracking-[0.22em] uppercase text-[#6E4637] mb-7">
              Real-time intervention
            </m.p>
            <m.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-5xl sm:text-6xl lg:text-[5.2rem] text-[#F3EEE6] leading-[1.06] mb-7">
              When discipline disappears, StillOff steps in.
            </m.h1>
            <m.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="font-serif text-xl italic text-[#BEB4A7] mb-4 leading-relaxed">
              {supportLine}
            </m.p>
            <m.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.52 }}
              className="text-sm text-[#BEB4A7] font-sans leading-loose mb-11 max-w-md">
              StillOff detects and interrupts compulsive phone behavior in real time, locking your device into a guided reset before the loop deepens.
            </m.p>
            <m.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.66 }}
              className="flex flex-wrap gap-4">
              <a href="#waitlist"
                className="px-7 py-3.5 rounded-full bg-[#6E4637] text-[#F3EEE6] text-sm font-sans font-medium hover:bg-[#7D5040] transition-colors">
                Join Waitlist
              </a>
              <button onClick={() => setTimeout(onOpenDemo, 120)}
                className="px-7 py-3.5 rounded-full border border-[#2A2622] text-[#BEB4A7] text-sm font-sans hover:border-[#6E4637]/60 hover:text-[#F3EEE6] transition-all">
                Watch 60-sec demo
              </button>
            </m.div>
          </div>

          {/* Phone + ambient cards */}
          <m.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center items-center min-h-[560px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none">
              <BreathingOrb size={340} />
            </div>
            <PhoneWalkthrough width={260} height={520} />
            {/* Ambient card left */}
            <m.div animate={{ y: [0, -9, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden lg:block absolute left-[-60px] top-[22%] max-w-[172px] p-3.5 rounded-2xl bg-[#1C1917]/85 border border-[#2A2622] backdrop-blur-sm shadow-xl">
              <p className="text-[10px] text-[#6E4637] font-sans font-medium mb-1">Pattern detected</p>
              <p className="text-[10px] text-[#BEB4A7] font-sans leading-snug">Opened 6 times in the last 8 minutes</p>
            </m.div>
            {/* Ambient card right */}
            <m.div animate={{ y: [0, 9, 0] }} transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
              className="hidden lg:block absolute right-[-48px] bottom-[22%] max-w-[172px] p-3.5 rounded-2xl bg-[#1C1917]/85 border border-[#2A2622] backdrop-blur-sm shadow-xl">
              <p className="text-[10px] text-[#6E4637] font-sans font-medium mb-1">Session complete</p>
              <p className="text-[10px] text-[#BEB4A7] font-sans leading-snug">18 min · Day 11</p>
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
  );
}

// ─── The Loop ─────────────────────────────────────────────────────────────────

const LOOP_LINES = [
  { text: "You weren't going to scroll.", color: 'text-[#BEB4A7]', size: 'text-3xl sm:text-4xl lg:text-[2.6rem]', italic: false },
  { text: 'You checked one thing.', color: 'text-[#BEB4A7]', size: 'text-3xl sm:text-4xl lg:text-[2.6rem]', italic: false },
  { text: 'You stayed longer than you meant to.', color: 'text-[#C8C0B5]', size: 'text-3xl sm:text-4xl lg:text-[2.8rem]', italic: false },
  { text: 'You felt worse and kept going.', color: 'text-[#D4CCC4]', size: 'text-3xl sm:text-4xl lg:text-[2.8rem]', italic: false },
  { text: "The problem isn't awareness.", color: 'text-[#E4DDD5]', size: 'text-3xl sm:text-4xl lg:text-5xl', italic: false },
  { text: "It's the moment awareness loses.", color: 'text-[#6E4637]', size: 'text-3xl sm:text-4xl lg:text-5xl', italic: true },
];

function LoopLine({ line, index }: { line: typeof LOOP_LINES[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px 0px' });
  return (
    <m.div ref={ref} initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      className="py-8 border-b border-[#2A2622]/30 text-center last:border-b-0">
      <p className={`font-serif leading-tight ${line.size} ${line.color} ${line.italic ? 'italic' : ''}`}>
        {line.text}
      </p>
    </m.div>
  );
}

function TheLoop() {
  return (
    <section className="relative py-36 px-6">
      <div className="max-w-3xl mx-auto">
        {LOOP_LINES.map((line, i) => (
          <LoopLine key={i} line={line} index={i} />
        ))}
      </div>
    </section>
  );
}

// ─── Category Shift ───────────────────────────────────────────────────────────

const CONTRAST_BLOCKS = [
  "Screen time trackers measure the damage after it happens.",
  "Blockers rely on the willpower you've already lost.",
  "Meditation apps only work when you choose them.",
];

function CategoryShift() {
  return (
    <section className="py-32 px-6 border-t border-[#2A2622]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-20">
          {CONTRAST_BLOCKS.map((text, i) => (
            <FadeIn key={i} delay={i * 0.14} y={20}>
              <div className="py-8 border-b border-[#2A2622] flex items-start gap-6">
                <span className="text-[#2A2622] font-sans text-xs mt-2 shrink-0 w-6">0{i + 1}</span>
                <p className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#BEB4A7] leading-snug">{text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.45} y={32}>
          <div className="text-center pt-4">
            <p className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F3EEE6] leading-tight max-w-3xl mx-auto">
              StillOff intervenes in the exact moment{' '}
              <span className="italic text-[#6E4637]">control starts slipping.</span>
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    n: '01', title: 'Detection', copy: 'StillOff reads the pattern before you notice it.',
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="6" stroke="#6E4637" strokeWidth="1.3" />
      <circle cx="9" cy="9" r="2.5" fill="#6E4637" />
      <path d="M9 1.5v1.5M9 15v1.5M1.5 9H3M15 9h1.5" stroke="#6E4637" strokeWidth="1.3" strokeLinecap="round" />
    </svg>,
  },
  {
    n: '02', title: 'Lock', copy: 'The apps that pull you under go quiet.',
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3.5" y="8.5" width="11" height="8" rx="2" stroke="#6E4637" strokeWidth="1.3" />
      <path d="M6.5 8.5V5.5a2.5 2.5 0 0 1 5 0v3" stroke="#6E4637" strokeWidth="1.3" strokeLinecap="round" />
    </svg>,
  },
  {
    n: '03', title: 'Guided Reset', copy: 'Your phone becomes a breathing space.',
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="6" stroke="#6E4637" strokeWidth="1.3" />
      <circle cx="9" cy="9" r="3" stroke="#6E4637" strokeWidth="1.3" strokeDasharray="1.8 1.8" />
    </svg>,
  },
  {
    n: '04', title: 'Soft Landing', copy: 'High-dopamine apps stay quiet for 15 minutes after.',
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 3v9m0 0-3-3m3 3 3-3" stroke="#6E4637" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 14.5h13" stroke="#6E4637" strokeWidth="1.3" strokeLinecap="round" />
    </svg>,
  },
  {
    n: '05', title: 'Pattern Learning', copy: 'Every session makes the next intervention smarter.',
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2 13l4-5 4 3 6-7" stroke="#6E4637" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="4" r="1.75" fill="#6E4637" />
    </svg>,
  },
];

function HowItWorks() {
  return (
    <section className="py-32 px-6 border-t border-[#2A2622]">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-[#6E4637] mb-4">The system</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#F3EEE6] mb-16">How it works.</h2>
        </FadeIn>
        <div>
          {HOW_STEPS.map((step, i) => (
            <FadeIn key={step.n} delay={i * 0.1} y={18}>
              <div className="grid grid-cols-[52px_1fr] gap-5 py-8 border-b border-[#2A2622] last:border-b-0">
                <div className="flex flex-col items-center gap-2 pt-0.5">
                  <div className="w-9 h-9 rounded-xl bg-[#1C1917] border border-[#2A2622] flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-[10px] text-[#6E4637] font-sans tracking-wider">{step.n}</span>
                    <h3 className="font-serif text-xl text-[#F3EEE6]">{step.title}</h3>
                  </div>
                  <p className="text-sm text-[#BEB4A7] font-sans leading-relaxed">{step.copy}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Product Demo Section ─────────────────────────────────────────────────────

const DEMO_STEPS: Array<{ phase: WalkPhase; label: string; sub: string }> = [
  { phase: 'trigger', label: 'Trigger detected', sub: 'Pattern recognized in real time' },
  { phase: 'lock', label: 'Lock engages', sub: 'Apps go quiet before you open them' },
  { phase: 'breathing', label: 'Reset begins', sub: 'Guided breath cycle activates' },
  { phase: 'complete', label: 'Session complete', sub: '18 min · streak maintained' },
  { phase: 'firewall', label: 'Firewall active', sub: 'Post-session protection window' },
];

function ProductDemo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activePhase = DEMO_STEPS[activeIdx].phase;

  useEffect(() => {
    const t = setTimeout(() => setActiveIdx((i) => (i + 1) % DEMO_STEPS.length), PHASE_DURATIONS[activePhase]);
    return () => clearTimeout(t);
  }, [activeIdx, activePhase]);

  return (
    <section className="py-32 px-6 border-t border-[#2A2622]">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-[#6E4637] mb-4">Live system</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#F3EEE6] mb-16">See it happen.</h2>
        </FadeIn>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn delay={0.15} className="flex justify-center">
            <PhoneShell phase={activePhase} width={260} height={520} />
          </FadeIn>
          <div>
            {DEMO_STEPS.map((step, i) => (
              <FadeIn key={step.label} delay={i * 0.08} y={14}>
                <button onClick={() => setActiveIdx(i)} className="w-full text-left">
                  <div className="py-5 border-b border-[#2A2622] flex items-start gap-5">
                    <div className={`mt-2 w-2 h-2 rounded-full shrink-0 transition-all duration-500 ${
                      activeIdx === i ? 'bg-[#6E4637] scale-125' : 'bg-[#2A2622]'}`} />
                    <div>
                      <p className={`font-serif text-lg transition-colors duration-300 ${
                        activeIdx === i ? 'text-[#F3EEE6]' : 'text-[#BEB4A7]'}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-[#BEB4A7]/50 font-sans mt-0.5">{step.sub}</p>
                    </div>
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Why It Works ─────────────────────────────────────────────────────────────

const WHY_POINTS = [
  'Removes the decision in your weakest moment.',
  'Interrupts the behavior before it becomes automatic.',
  'Adds enough friction to break the reflex.',
  'Replaces the loop with a reset.',
  'Protects the minutes after the session ends.',
];

function WhyItWorks() {
  return (
    <section className="py-32 px-6 border-t border-[#2A2622]">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-[#6E4637] mb-4">Behavioral design</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#F3EEE6] mb-16">Why it works.</h2>
        </FadeIn>
        <div>
          {WHY_POINTS.map((point, i) => (
            <FadeIn key={i} delay={i * 0.1} y={16}>
              <div className="py-8 border-b border-[#2A2622] last:border-b-0 flex items-center gap-8">
                <span className="font-serif text-4xl sm:text-5xl text-[#6E4637]/25 font-light shrink-0 w-10 text-right tabular-nums">
                  {i + 1}
                </span>
                <p className="font-serif text-xl sm:text-2xl text-[#F3EEE6] leading-snug">{point}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Credibility ──────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: "I didn't realize how deep I was until StillOff locked me out. That minute felt like catching a breath I'd forgotten existed.",
    author: 'Early tester, 28',
  },
  {
    quote: "It's not about willpower anymore. It just stops before I can talk myself into it.",
    author: 'Beta user, 34',
  },
  {
    quote: "The soft landing is what got me. I'd reset and then immediately be back on Instagram. Now there's actually a buffer.",
    author: 'Early tester, 22',
  },
];

function Credibility() {
  return (
    <section className="py-32 px-6 border-t border-[#2A2622]">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1917] border border-[#2A2622] mb-14">
            <div className="w-1.5 h-1.5 rounded-full bg-[#6E4637]" />
            <p className="text-xs text-[#BEB4A7] font-sans">Built for the moment most apps miss</p>
          </div>
        </FadeIn>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={i} delay={i * 0.14} y={20}>
              <div className="p-6 rounded-2xl bg-[#0F0E0C] border border-[#2A2622] h-full flex flex-col justify-between gap-5">
                <p className="font-serif text-[15px] text-[#F3EEE6] leading-relaxed">"{t.quote}"</p>
                <p className="text-[11px] text-[#BEB4A7]/55 font-sans">{t.author}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <FadeIn delay={0.2} y={16}>
            <div className="p-6 rounded-2xl bg-[#0F0E0C] border border-[#2A2622] flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-[#1C1917] border border-[#2A2622] flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z" stroke="#6E4637" strokeWidth="1.2" />
                  <path d="M7 4.5v3l2 1" stroke="#6E4637" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="font-serif text-[15px] text-[#F3EEE6] mb-1.5">Your sessions are private by default.</p>
                <p className="text-xs text-[#BEB4A7] font-sans leading-relaxed">We don't sell behavior data. StillOff runs on your device and reports to no one but you.</p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.3} y={16}>
            <div className="p-6 rounded-2xl bg-[#0F0E0C] border border-[#2A2622] flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-[#1C1917] border border-[#2A2622] flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="#6E4637" strokeWidth="1.2" />
                  <path d="M4.5 7l2 2 3.5-3.5" stroke="#6E4637" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="font-serif text-[15px] text-[#F3EEE6] mb-1.5">Built for the moment willpower fails.</p>
                <p className="text-xs text-[#BEB4A7] font-sans leading-relaxed">Not for the person who decided to change. For the person mid-loop who doesn't know how to stop.</p>
              </div>
            </div>
          </FadeIn>
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
    desc: 'Start here.',
    features: ['3-min sessions', '1 AI suggestion/week', 'Basic streak tracking'],
    cta: null as null,
    featured: false,
    badge: null as null,
  },
  {
    name: 'Plus',
    price: { monthly: '$5.99', yearly: '$47.99' },
    desc: 'For people ready to break the loop.',
    features: ['Hard Lock', 'Guided Reset', 'Soft Landing', '3 AI interventions/day', 'Full streak history'],
    cta: 'Start free trial',
    featured: true,
    badge: 'Most Popular',
  },
  {
    name: 'Premium',
    price: { monthly: '$9.99', yearly: '$79.99' },
    desc: 'Everything, maximized.',
    features: ['Everything in Plus', 'Unlimited AI interventions', 'Hard Lock Mode', 'App Firewall', 'Priority support'],
    cta: 'Get Premium',
    featured: false,
    badge: null as null,
  },
];

function Pricing({ showToast }: { showToast: (msg: string) => void }) {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="py-32 px-6 border-t border-[#2A2622]">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-[#6E4637] mb-4">Access</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#F3EEE6] mb-3">Simple pricing.</h2>
          <p className="text-sm text-[#BEB4A7] font-sans mb-8">The free plan is real. Not a 7-day trick.</p>
          <div className="flex items-center gap-3 mb-14">
            <span className={`text-sm font-sans transition-colors ${!yearly ? 'text-[#F3EEE6]' : 'text-[#BEB4A7]'}`}>Monthly</span>
            <button onClick={() => setYearly(!yearly)}
              className={`relative w-10 h-5 rounded-full transition-colors ${yearly ? 'bg-[#6E4637]' : 'bg-[#2A2622]'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-[#F3EEE6] transition-transform duration-200 ${yearly ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className={`text-sm font-sans transition-colors ${yearly ? 'text-[#F3EEE6]' : 'text-[#BEB4A7]'}`}>
              Yearly <span className="text-[#6E4637] text-xs">· Save ~30%</span>
            </span>
          </div>
        </FadeIn>
        <div className="grid sm:grid-cols-3 gap-4">
          {PRICING_TIERS.map((tier, i) => (
            <FadeIn key={tier.name} delay={i * 0.12} y={20}>
              <div className={`relative rounded-2xl p-7 h-full flex flex-col ${
                tier.featured ? 'bg-[#F3EEE6]' : 'bg-[#0F0E0C] border border-[#2A2622]'}`}>
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#6E4637] text-[#F3EEE6] text-[10px] font-sans font-medium tracking-wide whitespace-nowrap">
                    {tier.badge}
                  </span>
                )}
                <div className="mb-7">
                  <p className={`font-serif text-xl mb-1 ${tier.featured ? 'text-[#11100E]' : 'text-[#F3EEE6]'}`}>{tier.name}</p>
                  <p className={`text-xs font-sans mb-4 ${tier.featured ? 'text-[#6E4637]' : 'text-[#BEB4A7]'}`}>{tier.desc}</p>
                  {tier.price ? (
                    <p className={`font-serif text-3xl ${tier.featured ? 'text-[#11100E]' : 'text-[#F3EEE6]'}`}>
                      {yearly ? tier.price.yearly : tier.price.monthly}
                      <span className={`text-sm font-sans ${tier.featured ? 'text-[#6E4637]' : 'text-[#BEB4A7]'}`}>
                        {yearly ? '/yr' : '/mo'}
                      </span>
                    </p>
                  ) : (
                    <p className={`font-serif text-3xl ${tier.featured ? 'text-[#11100E]' : 'text-[#F3EEE6]'}`}>Free</p>
                  )}
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M1.5 5.5l2.5 2.5 5.5-5" stroke="#6E4637" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className={`text-xs font-sans ${tier.featured ? 'text-[#11100E]/75' : 'text-[#BEB4A7]'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                {tier.cta ? (
                  <button onClick={() => showToast('Launching soon — join the waitlist below!')}
                    className={`w-full py-2.5 rounded-xl text-sm font-sans font-medium transition-colors ${
                      tier.featured
                        ? 'bg-[#6E4637] text-[#F3EEE6] hover:bg-[#7D5040]'
                        : 'bg-[#1C1917] text-[#BEB4A7] border border-[#2A2622] hover:text-[#F3EEE6]'}`}>
                    {tier.cta}
                  </button>
                ) : (
                  <p className="text-[11px] font-sans text-center text-[#BEB4A7]/40">No account needed to start</p>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
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
    <section id="waitlist" className="py-40 px-6 border-t border-[#2A2622]">
      <div className="max-w-lg mx-auto text-center">
        <FadeIn y={36}>
          <div className="flex justify-center mb-14">
            <BreathingOrb size={80} />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#F3EEE6] leading-tight mb-6">
            You don't need another app that watches you lose control.
          </h2>
          <p className="font-serif text-xl italic text-[#BEB4A7] mb-3">
            You need one that steps in before you do.
          </p>
          <p className="text-sm text-[#BEB4A7] font-sans mb-12">Be first when StillOff launches.</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-5 py-3.5 rounded-full bg-[#0F0E0C] border border-[#2A2622] text-[#F3EEE6] text-sm font-sans placeholder-[#BEB4A7]/40 focus:outline-none focus:border-[#6E4637] transition-colors" />
            <button type="submit" disabled={sending}
              className="px-7 py-3.5 rounded-full bg-[#6E4637] text-[#F3EEE6] text-sm font-sans font-medium hover:bg-[#7D5040] transition-colors disabled:opacity-50 whitespace-nowrap">
              {sending ? 'Joining...' : 'Join waitlist'}
            </button>
          </form>
          <p className="text-[11px] text-[#BEB4A7]/45 font-sans mt-5">No newsletters. One email when it's ready.</p>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-[#2A2622] py-10 px-6">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-serif text-xl text-[#F3EEE6]">StillOff</p>
        <div className="flex items-center gap-7">
          {[
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'hello@stilloff.com', href: 'mailto:hello@stilloff.com' },
          ].map((link) => (
            <a key={link.label} href={link.href}
              className="text-xs text-[#BEB4A7] font-sans hover:text-[#F3EEE6] transition-colors">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Sticky CTA ───────────────────────────────────────────────────────────────

function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollPct = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const waitlist = document.querySelector('#waitlist');
      const nearWaitlist = waitlist ? waitlist.getBoundingClientRect().top < window.innerHeight * 0.85 : false;
      setVisible(scrollPct > 0.2 && !nearWaitlist);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <m.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 0.88, y: 0 }}
          exit={{ opacity: 0, y: 14 }} transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 lg:right-auto lg:left-6 z-50">
          <a href="#waitlist"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C1917]/92 backdrop-blur-md border border-[#2A2622] text-[#F3EEE6] text-sm font-sans hover:bg-[#2A2622]/90 transition-colors shadow-2xl">
            <div className="w-1.5 h-1.5 rounded-full bg-[#6E4637]" />
            Join waitlist
          </a>
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

  return (
    <LazyMotion features={domAnimation} strict>
      <main>
        <Hero onOpenDemo={() => setDemoOpen(true)} />
        <TheLoop />
        <CategoryShift />
        <HowItWorks />
        <ProductDemo />
        <WhyItWorks />
        <Credibility />
        <Pricing showToast={showToast} />
        <Waitlist showToast={showToast} />
        <Footer />
        <StickyCTA />
      </main>

      <AnimatePresence>
        {demoOpen && (
          <DemoModal key="demo" onClose={() => setDemoOpen(false)} showToast={showToast} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast key={toast.id} msg={toast.msg} onDone={() => setToast(null)} />
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
