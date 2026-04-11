'use client';

import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import BreathingOrb from './components/BreathingOrb';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const loopLines = [
  'Unlock.',
  'Check.',
  'Refresh.',
  'Switch apps.',
  'Repeat.',
  'Ten minutes disappear.',
  'Not because you wanted to.',
  'Because the loop already started.',
];

const triggerScenarios = [
  { title: 'Reflex', body: "I just opened it again. I didn't even think about it." },
  { title: 'Focus loss', body: "I was trying to focus. Now I'm 15 minutes deep." },
  { title: 'Awareness', body: "I know this is making it worse and I'm still here." },
  { title: 'Time distortion', body: "It's been an hour. I don't even remember why I picked it up." },
];

const featureCards = [
  { title: 'The Lock', body: 'When StillOff activates, the apps that fuel the spiral go quiet.' },
  { title: 'The Reset', body: 'Breathing, silence, and calm guidance turn your phone into a reset space.' },
  { title: 'The Soft Landing', body: 'A 15-minute post-session firewall keeps high-dopamine apps quiet after the lock ends.' },
  { title: 'Learns your patterns', body: 'StillOff steps in before you have to ask.' },
];

const comparisonRows = [
  ['Track your usage', 'Stop the behavior'],
  ['Suggest breaks', 'Intervene in the moment'],
  ['Rely on your discipline', 'Remove the decision'],
  ['Easy to bypass', 'Designed to hold'],
  ['Work when you\'re motivated', 'Work when you\'re not'],
] as const;

const testimonials = [
  { quote: 'It stopped me before I spiraled.', person: 'Early tester' },
  { quote: 'This is the first thing that actually interrupted me.', person: 'Beta waitlist user' },
  { quote: "I didn't realize how automatic it had become.", person: 'Pilot user' },
];

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    cadence: 'forever',
    annual: null as string | null,
    features: ['3-min sessions', '1 AI suggestion/week', 'Zen & Break modes', 'Basic streak + journal'],
    highlight: false,
    badge: null as string | null,
  },
  {
    name: 'Plus',
    price: '$5.99',
    cadence: '/mo',
    annual: '$47.99/yr — save 33%',
    features: ['Hard Lock', 'Guided Reset', 'Soft Landing', '3 AI interventions/day', '2 scheduled auto-locks', 'Weekly insight report'],
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Premium',
    price: '$9.99',
    cadence: '/mo',
    annual: '$79.99/yr — save 33%',
    features: ['Everything in Plus', 'Unlimited AI interventions', 'Hard Lock Mode', 'Letter to My Future Self', 'Post-session App Firewall'],
    highlight: false,
    badge: null as string | null,
  },
];

const softLandingApps = [
  { name: 'Phone', quiet: false },
  { name: 'Maps', quiet: false },
  { name: 'Notes', quiet: false },
  { name: 'Instagram', quiet: true },
  { name: 'TikTok', quiet: true },
  { name: 'X', quiet: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function FadeIn({
  children,
  delay = 0,
  y = 20,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </m.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16 px-6">
      {eyebrow && (
        <p className="text-xs uppercase tracking-widest text-[#BEB4A7] mb-4">{eyebrow}</p>
      )}
      <h2
        className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#F3EEE6] leading-tight mb-6"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {title}
      </h2>
      {body && (
        <p className="text-[#BEB4A7] text-lg leading-7">{body}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEMO MODAL
// ─────────────────────────────────────────────────────────────────────────────

const BREATH_LABELS = ['Breathe in', 'Hold', 'Breathe out', 'Hold'];
const BREATH_DURATIONS = [4000, 2000, 4000, 2000];

function DemoModal({
  onClose,
  onComplete,
  onShowToast,
}: {
  onClose: () => void;
  onComplete: () => void;
  onShowToast: (msg: string) => void;
}) {
  type Phase = 'intro' | 'breathing' | 'ending' | 'cta';
  const [phase, setPhase] = useState<Phase>('intro');
  const [breathIndex, setBreathIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mql.matches);
  }, []);

  const breathingMs = prefersReduced ? 5000 : 30000;

  // Phase progression
  useEffect(() => {
    if (phase === 'intro') {
      const t = setTimeout(() => setPhase('breathing'), 1200);
      return () => clearTimeout(t);
    }
    if (phase === 'breathing') {
      const t = setTimeout(() => setPhase('ending'), breathingMs);
      return () => clearTimeout(t);
    }
    if (phase === 'ending') {
      const t = setTimeout(() => setPhase('cta'), 3200);
      return () => clearTimeout(t);
    }
  }, [phase, breathingMs]);

  // Breath label cycling
  useEffect(() => {
    if (phase !== 'breathing') return;
    const t = setTimeout(() => {
      setBreathIndex((i) => (i + 1) % BREATH_LABELS.length);
    }, BREATH_DURATIONS[breathIndex]);
    return () => clearTimeout(t);
  }, [phase, breathIndex]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await fetch('https://formspree.io/f/mzdklnwv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, _subject: 'StillOff waitlist signup' }),
      });
      onShowToast("You're on the list. See you on the other side.");
      setEmail('');
      onComplete();
    } catch {
      onShowToast('Something went wrong. Try again.');
    }
  };

  const phaseVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  };

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(7,6,5,0.95)' }}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-[#BEB4A7] text-xl leading-none hover:text-[#F3EEE6] transition-colors w-10 h-10 flex items-center justify-center"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="w-full max-w-sm mx-auto px-8 text-center">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <m.div
              key="intro"
              variants={phaseVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <p className="text-xs uppercase tracking-widest text-[#BEB4A7]">
                Lock starting...
              </p>
              <h2
                className="font-serif text-3xl font-light text-[#F3EEE6] leading-snug"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                For the next minute, your phone becomes a reset space.
              </h2>
            </m.div>
          )}

          {phase === 'breathing' && (
            <m.div
              key="breathing"
              variants={phaseVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-12"
            >
              <BreathingOrb size={260} intense={true} />
              <AnimatePresence mode="wait">
                <m.p
                  key={breathIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-[#BEB4A7] text-lg font-light tracking-widest"
                >
                  {BREATH_LABELS[breathIndex]}
                </m.p>
              </AnimatePresence>
            </m.div>
          )}

          {phase === 'ending' && (
            <m.div
              key="ending"
              variants={phaseVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {["You didn't check.", 'Nothing happened.', "That's the point."].map((line, i) => (
                <m.p
                  key={line}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.7, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                  className="font-serif font-light leading-tight"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: i === 0 ? '2.5rem' : i === 1 ? '1.75rem' : '1.4rem',
                    color: i === 0 ? '#F3EEE6' : i === 1 ? '#BEB4A7' : 'rgba(190,180,167,0.5)',
                  }}
                >
                  {line}
                </m.p>
              ))}
            </m.div>
          )}

          {phase === 'cta' && (
            <m.div
              key="cta"
              variants={phaseVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.6, delay: 1.4 }}
              className="space-y-6"
            >
              <h2
                className="font-serif text-4xl font-light text-[#F3EEE6]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                That felt different.
              </h2>
              <p className="text-[#BEB4A7] text-lg">That&apos;s what control feels like.</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full bg-[#1A1815] border border-[#2A2622] text-[#F3EEE6] placeholder-[#6B6560] rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-[#BEB4A7] transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-[#F3EEE6] text-[#11100E] rounded-full py-4 font-medium text-base hover:bg-white transition-colors"
                >
                  I&apos;m in
                </button>
              </form>
              <p className="text-[#6B6560] text-sm">No newsletters. One email when it&apos;s ready.</p>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </m.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [pulseFast, setPulseFast] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const waitlistRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());

  // Check sessionStorage on mount
  useEffect(() => {
    try {
      setDemoCompleted(sessionStorage.getItem('stilloff-demo-complete') === 'true');
    } catch {
      setDemoCompleted(false);
    }
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = pageHeight > 0 ? scrollY / pageHeight : 0;

      let nearWaitlist = false;
      if (waitlistRef.current) {
        const rect = waitlistRef.current.getBoundingClientRect();
        nearWaitlist = rect.top < window.innerHeight * 0.85;
      }

      setShowSticky(progress > 0.2 && !nearWaitlist);

      const now = Date.now();
      const dt = now - lastScrollTime.current;
      if (dt > 0) {
        const velocity = Math.abs(scrollY - lastScrollY.current) / dt;
        setPulseFast(velocity > 1.2);
      }
      lastScrollY.current = scrollY;
      lastScrollTime.current = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  const openDemo = useCallback(() => {
    setTimeout(() => setDemoOpen(true), 120);
  }, []);

  const handleDemoComplete = useCallback(() => {
    try {
      sessionStorage.setItem('stilloff-demo-complete', 'true');
    } catch {}
    setDemoCompleted(true);
    setDemoOpen(false);
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement | null;
    try {
      await fetch('https://formspree.io/f/mzdklnwv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput?.value,
          _subject: 'StillOff waitlist signup',
        }),
      });
      showToast("You're on the list. See you on the other side.");
      form.reset();
    } catch {
      showToast('Something went wrong. Try again.');
    }
  };

  const handleShare = async () => {
    const text = "I sat with the loop for 12 minutes today. I didn't look away.";
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'StillOff', text, url });
        return;
      }
      await navigator.clipboard.writeText(text + ' ' + url);
      showToast('Copied to clipboard.');
    } catch {
      showToast('Sharing is not available here.');
    }
  };

  const grainOpacity = pulseFast ? 0.06 : 0.04;

  return (
    <LazyMotion features={domAnimation}>
      {/* ── Toast ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <m.div
            key="toast"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] bg-[#1A1815] border border-white/10 backdrop-blur-sm text-[#F3EEE6] text-sm px-6 py-3 rounded-full shadow-xl whitespace-nowrap"
          >
            {toast}
          </m.div>
        )}
      </AnimatePresence>

      {/* ── Demo Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {demoOpen && (
          <DemoModal
            key="demo"
            onClose={() => setDemoOpen(false)}
            onComplete={handleDemoComplete}
            onShowToast={showToast}
          />
        )}
      </AnimatePresence>

      {/* ── Sticky CTA ────────────────────────────────────────── */}
      <AnimatePresence>
        {showSticky && !demoOpen && (
          <m.div
            key="sticky"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.88 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 right-4 md:right-auto md:left-6 z-50"
          >
            <button
              onClick={openDemo}
              className="bg-[#1A1815] border border-[#2A2622] text-[#F3EEE6] text-sm px-5 py-3 rounded-full backdrop-blur-sm hover:border-[#BEB4A7] transition-colors shadow-lg"
            >
              Lock it now
            </button>
          </m.div>
        )}
      </AnimatePresence>

      <main>
        {/* ──────────────────────────────────────────────────────
            SECTION 1: HERO
        ────────────────────────────────────────────────────── */}
        <section className="min-h-screen relative overflow-hidden flex items-center">
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              opacity: grainOpacity,
              mixBlendMode: 'overlay',
            }}
          />

          <div className="container mx-auto px-6 max-w-7xl grid lg:grid-cols-2 gap-16 items-center py-28 lg:py-36 relative z-20">
            {/* Left: text */}
            <div>
              <m.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                className="text-xs uppercase tracking-widest text-[#BEB4A7] mb-8"
              >
                You picked up your phone 84 times today.
              </m.p>

              <m.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-[#F3EEE6] leading-tight mb-8"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {demoCompleted
                  ? 'Welcome back. Ready to lock it in?'
                  : "When you can't stop, StillOff does."}
              </m.h1>

              <m.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="text-[#BEB4A7] text-xl leading-8 mb-12 max-w-lg"
              >
                A real-time intervention that steps in before the spiral takes over.
              </m.p>

              <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={openDemo}
                  className="bg-[#F3EEE6] text-[#11100E] px-8 py-4 rounded-full font-medium text-base hover:bg-white transition-colors"
                >
                  Try the 60-second lock
                </button>
                <button
                  onClick={() =>
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="border border-[#2A2622] text-[#F3EEE6] px-8 py-4 rounded-full font-medium text-base hover:border-[#BEB4A7] transition-colors"
                >
                  See how it works
                </button>
              </m.div>
            </div>

            {/* Right: phone mockup */}
            <div className="relative flex items-center justify-center">
              {/* Ambient glow */}
              <div className="absolute inset-[-20%] bg-[#6E4637]/8 rounded-full blur-3xl" />

              {/* Phone frame */}
              <m.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <div
                  className="relative overflow-hidden shadow-2xl"
                  style={{
                    width: 260,
                    height: 520,
                    borderRadius: 40,
                    background: '#0D0C0B',
                    border: '1px solid rgba(42,38,34,0.8)',
                    boxShadow: '0 0 60px rgba(110,70,55,0.12), 0 40px 80px rgba(0,0,0,0.6)',
                  }}
                >
                  {/* Status bar simulation */}
                  <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 pt-2">
                    <span className="text-[#F3EEE6]/20 text-xs">9:41</span>
                    <div className="w-20 h-5 bg-[#11100E] rounded-full" />
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-1 h-3 bg-[#F3EEE6]/20 rounded-sm" />
                      ))}
                    </div>
                  </div>
                  {/* Orb */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BreathingOrb size={160} intense={false} />
                  </div>
                  {/* Bottom home indicator */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-[#F3EEE6]/15 rounded-full" />
                </div>

                {/* Floating cards — desktop only */}
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="absolute -left-36 top-16 hidden lg:block"
                >
                  <div className="bg-[#1A1815] border border-[#2A2622] rounded-2xl px-5 py-4 min-w-[160px]">
                    <p className="text-[#BEB4A7] text-xs font-light mb-1">Opened 7 times</p>
                    <p className="text-[#4A4440] text-xs font-light">in the last few minutes</p>
                  </div>
                </m.div>

                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="absolute -right-36 bottom-20 hidden lg:block"
                >
                  <div className="bg-[#F3EEE6] rounded-2xl px-5 py-4 min-w-[120px]">
                    <p className="text-[#11100E] font-medium text-2xl leading-tight">18 min</p>
                    <p className="text-[#6B6560] text-xs mt-1">Day 11 🌿</p>
                  </div>
                </m.div>
              </m.div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────
            SECTION 2: THE LOOP
        ────────────────────────────────────────────────────── */}
        <section className="py-32 border-t border-[#2A2622]">
          <div className="container mx-auto px-6 max-w-3xl">
            <FadeIn className="mb-16">
              <p className="text-xs uppercase tracking-widest text-[#BEB4A7] mb-6">The loop</p>
              <p className="text-[#BEB4A7] text-lg leading-7 max-w-xl">
                StillOff interrupts compulsive phone use in real time by locking your phone into a
                guided reset before the loop takes over.
              </p>
            </FadeIn>

            <div className="flex flex-col">
              {loopLines.map((line, i) => {
                const isLarge = i < 5;
                return (
                  <m.div
                    key={line}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: i * 0.09, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div
                      className={`py-5 ${i > 0 ? 'border-t border-white/[0.06]' : ''}`}
                    >
                      <p
                        style={{ fontFamily: isLarge ? 'var(--font-serif)' : undefined }}
                        className={
                          isLarge
                            ? 'font-serif font-light text-[#F3EEE6] text-3xl md:text-4xl'
                            : 'text-[#BEB4A7] text-base md:text-lg font-light'
                        }
                      >
                        {line}
                      </p>
                    </div>
                  </m.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────
            SECTION 3: ALMOST-ACTION MOMENT
        ────────────────────────────────────────────────────── */}
        <section className="py-32 border-t border-[#2A2622]">
          <div className="container mx-auto px-6 max-w-6xl">
            <FadeIn>
              <SectionHeading
                title="There's always a moment right before it happens."
                body="StillOff is built for the exact second control starts slipping."
              />
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {triggerScenarios.map((scenario, i) => (
                <FadeIn key={scenario.title} delay={i * 0.1}>
                  <div className="bg-[#141210] border border-[#2A2622] rounded-3xl p-8 h-full">
                    <p className="text-xs uppercase tracking-widest text-[#BEB4A7] mb-5">
                      {scenario.title}
                    </p>
                    <p
                      className="font-serif font-light italic text-[#F3EEE6] text-2xl leading-snug"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      &ldquo;{scenario.body}&rdquo;
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────
            SECTION 4: PRODUCT CLARITY
        ────────────────────────────────────────────────────── */}
        <section className="py-32 border-t border-[#2A2622]">
          <div className="container mx-auto px-6 max-w-6xl">
            <FadeIn>
              <SectionHeading
                title="StillOff interrupts compulsive phone use in real time."
                body="Your phone becomes a guided reset before the loop takes over."
              />
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureCards.map((card, i) => (
                <FadeIn key={card.title} delay={i * 0.1}>
                  <div className="bg-[#141210] border border-[#2A2622] rounded-3xl p-8 h-full">
                    <h3
                      className="font-serif font-light text-[#F3EEE6] text-2xl mb-4"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {card.title}
                    </h3>
                    <p className="text-[#BEB4A7] text-base leading-6 font-light">{card.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────
            SECTION 5: HOW IT WORKS
        ────────────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-32 border-t border-[#2A2622]">
          <div className="container mx-auto px-6 max-w-5xl">
            <FadeIn>
              <SectionHeading title="A simpler way to break the loop." />
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {[
                'You feel the pull',
                'StillOff steps in',
                'Your phone becomes a reset space',
                'You come back with more control',
              ].map((step, i) => (
                <FadeIn key={step} delay={i * 0.12}>
                  <div className="bg-[#141210] border border-[#2A2622] rounded-3xl p-8">
                    <p className="text-xs uppercase tracking-widest text-[#6B6560] mb-4">
                      Step {i + 1}
                    </p>
                    <p
                      className="font-serif font-light text-[#F3EEE6] text-2xl leading-snug"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {step}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────
            SECTION 6: SOFT LANDING
        ────────────────────────────────────────────────────── */}
        <section className="py-32 border-t border-[#2A2622]">
          <div className="container mx-auto px-6 max-w-6xl grid lg:grid-cols-2 gap-20 items-center">
            {/* Text */}
            <div>
              <FadeIn>
                <h2
                  className="font-serif text-4xl md:text-5xl font-light text-[#F3EEE6] leading-tight mb-10"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Most blockers end. StillOff eases you back.
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <ul className="space-y-5">
                  {[
                    '15-minute post-session firewall.',
                    'High-dopamine apps stay quiet.',
                    'Utility apps stay open so life still works.',
                  ].map((bullet) => (
                    <li key={bullet} className="flex items-start gap-4">
                      <span className="text-[#6E4637] mt-1">—</span>
                      <span className="text-[#BEB4A7] text-lg font-light leading-7">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>

            {/* App status card */}
            <FadeIn delay={0.2}>
              <div className="bg-[#0D0C0B] border border-[#2A2622] rounded-3xl p-8 max-w-sm mx-auto lg:mx-0 w-full">
                <p className="text-xs uppercase tracking-widest text-[#6B6560] mb-6">
                  After your session
                </p>
                <div className="space-y-4">
                  {softLandingApps.map((app) => (
                    <div key={app.name} className="flex items-center justify-between">
                      <span className="text-[#BEB4A7] font-light">{app.name}</span>
                      <span
                        className={`text-sm font-light px-3 py-1 rounded-full ${
                          app.quiet
                            ? 'text-[#6E4637] bg-[#6E4637]/10 border border-[#6E4637]/30'
                            : 'text-[#F3EEE6]/60 bg-white/5 border border-white/10'
                        }`}
                      >
                        {app.quiet ? 'Quiet' : 'Open'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────
            SECTION 7: DIFFERENTIATION
        ────────────────────────────────────────────────────── */}
        <section className="py-32 border-t border-[#2A2622]">
          <div className="container mx-auto px-6 max-w-3xl">
            <FadeIn>
              <SectionHeading title="Everything else tells you to stop. StillOff is built to stop you." />
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="border border-[#2A2622] rounded-3xl overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-2 border-b border-[#2A2622]">
                  <div className="px-8 py-5 border-r border-[#2A2622]">
                    <p className="text-xs uppercase tracking-widest text-[#4A4440]">Everything else</p>
                  </div>
                  <div className="px-8 py-5">
                    <p className="text-xs uppercase tracking-widest text-[#BEB4A7]">StillOff</p>
                  </div>
                </div>

                {/* Rows */}
                {comparisonRows.map(([left, right], i) => {
                  const isLast = i === comparisonRows.length - 1;
                  return (
                    <div
                      key={left}
                      className={`grid grid-cols-2 ${
                        i < comparisonRows.length - 1 ? 'border-b border-[#2A2622]' : ''
                      }`}
                    >
                      <div className="px-8 py-5 border-r border-[#2A2622]">
                        <p className="text-[#4A4440] font-light text-sm">{left}</p>
                      </div>
                      <div className="px-8 py-5">
                        <p
                          className={`font-light text-sm ${
                            isLast
                              ? 'text-[#F3EEE6] font-medium'
                              : 'text-[#BEB4A7]'
                          }`}
                        >
                          {right}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────
            SECTION 8: RELIEF
        ────────────────────────────────────────────────────── */}
        <section className="py-40 border-t border-[#2A2622]">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <FadeIn>
              <h2
                className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#F3EEE6] leading-tight mb-10"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                You don&apos;t need more guilt about your habits.
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-[#BEB4A7] text-xl leading-8 font-light">
                You need a way to break them while they&apos;re happening.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────
            SECTION 9: PROOF
        ────────────────────────────────────────────────────── */}
        <section className="py-32 border-t border-[#2A2622]">
          <div className="container mx-auto px-6 max-w-6xl grid lg:grid-cols-3 gap-8 items-start">
            {/* Testimonials */}
            <div className="flex flex-col gap-6">
              {testimonials.map((t, i) => (
                <FadeIn key={t.person} delay={i * 0.1}>
                  <div className="bg-[#141210] border border-[#2A2622] rounded-3xl p-8">
                    <p
                      className="font-serif font-light italic text-[#F3EEE6] text-xl leading-snug mb-5"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <p className="text-xs uppercase tracking-widest text-[#4A4440]">{t.person}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Proof of Presence card */}
            <FadeIn delay={0.2} className="lg:col-span-2">
              <div className="bg-[#0D0C0B] border border-[#2A2622] rounded-3xl p-10 md:p-12">
                <p className="text-xs uppercase tracking-widest text-[#6B6560] mb-6">
                  Session complete
                </p>
                <p
                  className="font-serif font-light text-[#F3EEE6] text-6xl md:text-7xl mb-5"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  18 min
                </p>
                <p
                  className="font-serif font-light text-[#BEB4A7] text-xl mb-8 leading-snug"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  I sat with the grief. I didn&apos;t look away.
                </p>
                <p
                  className="font-serif font-light italic text-[#6B6560] text-base leading-7 mb-10"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  It didn&apos;t pass. You moved through it. The world waited. It was fine.
                </p>
                <div className="border-t border-[#2A2622] pt-8 space-y-5">
                  <p className="text-xs text-[#4A4440] font-light tracking-wide">
                    StillOff · Private by default · Shareable when ready
                  </p>
                  <button
                    onClick={handleShare}
                    className="text-[#F3EEE6] text-sm font-light hover:text-white transition-colors underline underline-offset-4 decoration-[#2A2622]"
                  >
                    One tap to send it to someone who needs to see it.
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────
            SECTION 10: PRICING
        ────────────────────────────────────────────────────── */}
        <section className="py-32 border-t border-[#2A2622]">
          <div className="container mx-auto px-6 max-w-6xl">
            <FadeIn>
              <SectionHeading
                title="Start free. Go deeper."
                body="The free plan is real — not a 7-day trick."
              />
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {pricingTiers.map((tier, i) => (
                <FadeIn key={tier.name} delay={i * 0.1}>
                  <div
                    className={`rounded-3xl p-8 h-full flex flex-col relative ${
                      tier.highlight
                        ? 'bg-[#F3EEE6]'
                        : 'bg-[#141210] border border-[#2A2622]'
                    }`}
                  >
                    {tier.badge && (
                      <div className="absolute -top-3 left-8">
                        <span
                          className="text-xs font-medium px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: '#6E4637',
                            color: '#F3EEE6',
                          }}
                        >
                          {tier.badge}
                        </span>
                      </div>
                    )}

                    <div className="mb-8">
                      <p
                        className={`text-xs uppercase tracking-widest mb-3 ${
                          tier.highlight ? 'text-[#6B6560]' : 'text-[#6B6560]'
                        }`}
                      >
                        {tier.name}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`font-serif font-light text-4xl ${
                            tier.highlight ? 'text-[#11100E]' : 'text-[#F3EEE6]'
                          }`}
                          style={{ fontFamily: 'var(--font-serif)' }}
                        >
                          {tier.price}
                        </span>
                        <span
                          className={`text-sm font-light ${
                            tier.highlight ? 'text-[#6B6560]' : 'text-[#6B6560]'
                          }`}
                        >
                          {tier.cadence}
                        </span>
                      </div>
                      {tier.annual && (
                        <p
                          className={`text-xs mt-2 font-light ${
                            tier.highlight ? 'text-[#6B6560]' : 'text-[#4A4440]'
                          }`}
                        >
                          {tier.annual}
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 flex-1 mb-8">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <span
                            className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${
                              tier.highlight
                                ? 'bg-[#11100E]/40'
                                : tier.name === 'Free'
                                ? 'bg-[#4A4440]'
                                : 'bg-[#BEB4A7]'
                            }`}
                          />
                          <span
                            className={`text-sm font-light leading-5 ${
                              tier.highlight
                                ? 'text-[#11100E]'
                                : tier.name === 'Free'
                                ? 'text-[#4A4440]'
                                : 'text-[#BEB4A7]'
                            }`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {tier.name !== 'Free' && (
                      <button
                        onClick={() =>
                          waitlistRef.current?.scrollIntoView({ behavior: 'smooth' })
                        }
                        className={`w-full py-4 rounded-full text-sm font-medium transition-colors ${
                          tier.highlight
                            ? 'bg-[#11100E] text-[#F3EEE6] hover:bg-[#1A1815]'
                            : 'border border-[#2A2622] text-[#BEB4A7] hover:border-[#BEB4A7] hover:text-[#F3EEE6]'
                        }`}
                      >
                        {tier.name === 'Plus' ? 'Start free trial' : 'Get Premium'}
                      </button>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────
            SECTION 11: WAITLIST
        ────────────────────────────────────────────────────── */}
        <section
          ref={waitlistRef}
          className="py-40 border-t border-[#2A2622]"
          id="waitlist"
        >
          <div className="container mx-auto px-6 max-w-xl">
            <FadeIn>
              <div className="text-center">
                <p
                  className="font-serif font-light text-[#F3EEE6] text-4xl mb-4"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  That felt different.
                </p>
                <p className="text-[#BEB4A7] text-base mb-12 font-light">
                  That&apos;s what control feels like.
                </p>
                <h2
                  className="font-serif font-light text-[#F3EEE6] text-4xl md:text-5xl leading-tight mb-6"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Be first when StillOff launches.
                </h2>
                <p className="text-[#BEB4A7] text-lg font-light mb-12 leading-7">
                  The first real intervention for compulsive phone behavior.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Your email"
                  className="flex-1 bg-[#1A1815] border border-[#2A2622] text-[#F3EEE6] placeholder-[#4A4440] rounded-full px-6 py-4 text-base focus:outline-none focus:border-[#BEB4A7] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#F3EEE6] text-[#11100E] px-8 py-4 rounded-full font-medium text-base hover:bg-white transition-colors whitespace-nowrap"
                >
                  Get early access
                </button>
              </form>
              <p className="text-[#4A4440] text-sm text-center mt-6 font-light">
                No newsletters. One email when it&apos;s ready.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────
            SECTION 12: FOOTER
        ────────────────────────────────────────────────────── */}
        <footer className="border-t border-[#2A2622] py-12">
          <div className="container mx-auto px-6 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <p
              className="font-serif font-light text-[#F3EEE6] text-2xl"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              StillOff
            </p>
            <nav className="flex items-center gap-6 text-sm text-[#4A4440] font-light">
              <a href="/privacy" className="hover:text-[#BEB4A7] transition-colors">
                Privacy
              </a>
              <span className="text-[#2A2622]">·</span>
              <a href="/terms" className="hover:text-[#BEB4A7] transition-colors">
                Terms
              </a>
              <span className="text-[#2A2622]">·</span>
              <a
                href="mailto:hello@stilloff.com"
                className="hover:text-[#BEB4A7] transition-colors"
              >
                hello@stilloff.com
              </a>
            </nav>
          </div>
        </footer>
      </main>
    </LazyMotion>
  );
}
