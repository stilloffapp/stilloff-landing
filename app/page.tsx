"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

// ─── Breathing Orb ────────────────────────────────────────────────────────────

function BreathingOrb({ size = 220, intense = false }: { size?: number; intense?: boolean }) {
  const breathe = intense ? "4.2s" : "5.8s";
  const drift = intense ? "8s" : "11s";
  const shimmer = intense ? "5.5s" : "7.5s";

  return (
    <div style={{ width: size, height: size, position: "relative", flexShrink: 0 }} aria-hidden="true">
      <style>{`
        @keyframes orb-breathe{0%,100%{transform:scale(0.94);opacity:0.84}50%{transform:scale(1.06);opacity:1}}
        @keyframes orb-core{0%,100%{transform:scale(0.92);opacity:0.9}50%{transform:scale(1.08);opacity:1}}
        @keyframes orb-drift{0%{transform:translate3d(0,0,0)}25%{transform:translate3d(2px,-3px,0)}50%{transform:translate3d(-2px,2px,0)}75%{transform:translate3d(3px,2px,0)}100%{transform:translate3d(0,0,0)}}
        @keyframes orb-shimmer{0%,100%{opacity:0.28;transform:rotate(0deg) scale(1)}50%{opacity:0.44;transform:rotate(180deg) scale(1.03)}}
        @keyframes orb-ring{0%,100%{transform:scale(0.98);opacity:0.32}50%{transform:scale(1.08);opacity:0.55}}
        @keyframes stilloff-breathe{0%,100%{transform:scale(0.92);opacity:0.88}50%{transform:scale(1.08);opacity:1}}
      `}</style>
      <div style={{ position:"absolute",inset:"-16%",borderRadius:"50%",background:"radial-gradient(circle,rgba(110,70,55,0.34) 0%,rgba(110,70,55,0.18) 30%,rgba(243,238,230,0.10) 52%,transparent 78%)",filter:"blur(28px)",animation:`orb-breathe ${breathe} ease-in-out infinite,orb-drift ${drift} ease-in-out infinite`,willChange:"transform,opacity",pointerEvents:"none" }} />
      <div style={{ position:"absolute",inset:"5%",borderRadius:"50%",border:"1px solid rgba(243,238,230,0.18)",boxShadow:"0 0 60px rgba(110,70,55,0.22),inset 0 0 30px rgba(243,238,230,0.06)",animation:`orb-ring ${breathe} ease-in-out infinite`,pointerEvents:"none" }} />
      <div style={{ position:"absolute",inset:"11%",borderRadius:"50%",background:"conic-gradient(from 0deg,rgba(243,238,230,0.04),rgba(110,70,55,0.24),rgba(243,238,230,0.08),rgba(110,70,55,0.18),rgba(243,238,230,0.04))",filter:"blur(10px)",mixBlendMode:"screen",animation:`orb-shimmer ${shimmer} linear infinite`,pointerEvents:"none" }} />
      <div style={{ position:"absolute",inset:"16%",borderRadius:"50%",background:"radial-gradient(circle at 50% 38%,rgba(243,238,230,0.26) 0%,rgba(243,238,230,0.14) 16%,rgba(110,70,55,0.26) 38%,rgba(83,53,42,0.72) 62%,rgba(30,24,20,0.92) 100%)",boxShadow:"0 0 90px rgba(110,70,55,0.20),inset 0 10px 24px rgba(243,238,230,0.10)",animation:`orb-breathe ${breathe} ease-in-out infinite,orb-drift ${drift} ease-in-out infinite reverse`,pointerEvents:"none" }} />
      <div style={{ position:"absolute",inset:"27%",borderRadius:"50%",background:"radial-gradient(circle at 50% 35%,rgba(243,238,230,0.30) 0%,rgba(243,238,230,0.16) 22%,rgba(110,70,55,0.14) 48%,transparent 100%)",filter:"blur(6px)",animation:`orb-core ${breathe} ease-in-out infinite`,pointerEvents:"none" }} />
      <div style={{ position:"absolute",inset:"38%",borderRadius:"50%",background:"radial-gradient(circle,rgba(243,238,230,0.34) 0%,rgba(243,238,230,0.16) 48%,rgba(110,70,55,0.06) 100%)",filter:"blur(1px)",boxShadow:"0 0 26px rgba(243,238,230,0.18)",animation:`orb-core ${breathe} ease-in-out infinite reverse`,pointerEvents:"none" }} />
    </div>
  );
}

// ─── FadeIn helper ────────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, y = 24, className = "" }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.75, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </m.div>
  );
}

// ─── Demo Modal ───────────────────────────────────────────────────────────────

function DemoModal({ open, onClose, onComplete, onSubmit }: {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"intro" | "lock" | "breathing" | "ending" | "cta">("intro");
  const [label, setLabel] = useState("Lock starting…");

  useEffect(() => {
    if (!open) { setPhase("intro"); setLabel("Lock starting…"); return; }
    document.body.style.overflow = "hidden";
    const breathMs = reduced ? 5000 : 60000;
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => { setPhase("lock"); setLabel("Lock starting…"); }, 600));
    timers.push(setTimeout(() => { setPhase("breathing"); setLabel("Breathe in"); }, 2000));

    if (!reduced) {
      const cycles = ["Breathe in", "Hold", "Breathe out", "Hold"];
      const durations = [4000, 2000, 4000, 2000];
      let elapsed = 2000;
      while (elapsed < 2000 + breathMs - 2000) {
        for (let i = 0; i < cycles.length; i++) {
          const e = elapsed;
          const lbl = cycles[i];
          timers.push(setTimeout(() => setLabel(lbl), e));
          elapsed += durations[i];
          if (elapsed >= 2000 + breathMs) break;
        }
      }
    }

    timers.push(setTimeout(() => setPhase("ending"), 2000 + breathMs));
    timers.push(setTimeout(() => { setPhase("cta"); onComplete(); }, 2000 + breathMs + 4200));

    return () => { document.body.style.overflow = ""; timers.forEach(clearTimeout); };
  }, [open, reduced, onComplete]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070605]/95 backdrop-blur-md px-6"
        role="dialog"
        aria-modal="true"
      >
        <m.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0c0a] p-8 pt-16"
        >
          {/* Close button — large, top-right, always visible */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-base text-[#BEB4A7] transition hover:border-white/35 hover:bg-white/[0.08] hover:text-[#F3EEE6]"
          >
            ✕
          </button>

        <div className="flex w-full flex-col items-center justify-center text-center" style={{ minHeight: 380 }}>
          <AnimatePresence mode="wait">
            {(phase === "intro" || phase === "lock") && (
              <m.div key="intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="space-y-8">
                <p className="text-xs uppercase tracking-[0.28em] text-[#BEB4A7]">Lock starting…</p>
                <h2 className="font-serif text-4xl leading-tight tracking-[-0.04em] text-[#F3EEE6] sm:text-5xl" style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }}>
                  For the next minute,<br />your phone becomes a reset space.
                </h2>
              </m.div>
            )}

            {phase === "breathing" && (
              <m.div key="breathing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center gap-0">
                <div style={{ position: "relative", zIndex: 0 }}>
                  <BreathingOrb size={180} intense />
                </div>
                <p className="mt-14 text-xs uppercase tracking-[0.28em] text-[#BEB4A7]">{label}</p>
                <button onClick={onClose} className="mt-8 rounded-xl border border-white/10 px-6 py-2.5 text-xs font-medium text-[#BEB4A7] transition hover:border-white/20 hover:text-[#F3EEE6]">End session</button>
              </m.div>
            )}

            {phase === "ending" && (
              <m.div key="ending" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6 }} className="space-y-4">
                <p className="font-serif text-4xl tracking-[-0.04em] text-[#F3EEE6] sm:text-5xl" style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }}>You didn't check.</p>
                <p className="text-xl text-[#BEB4A7]">Nothing happened.</p>
                <p className="text-xl text-[#BEB4A7]">That's the point.</p>
              </m.div>
            )}

            {phase === "cta" && (
              <m.div key="cta" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
                <p className="font-serif text-4xl tracking-[-0.04em] text-[#F3EEE6] sm:text-5xl" style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }}>That felt different.</p>
                <p className="text-lg text-[#BEB4A7]">That's what control feels like.</p>
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-base text-[#BEB4A7]">Want this every day?</p>
                  <button
                    onClick={() => {
                      onClose();
                      document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="cta-glow mt-3 w-full rounded-2xl bg-[#F3EEE6] px-8 py-4 text-sm font-semibold text-[#11100E] hover:opacity-90"
                  >
                    Get early access
                  </button>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="mb-3 text-left text-xs uppercase tracking-[0.22em] text-[#BEB4A7]">Be first when StillOff launches</p>
                  <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
                    <input type="email" name="email" required placeholder="Email address" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#11100E] px-4 py-3 text-sm text-[#F3EEE6] outline-none placeholder:text-[#BEB4A7]/50 focus:border-[#6E4637]" />
                    <button type="submit" className="cta-glow rounded-xl bg-[#F3EEE6] px-5 py-3 text-sm font-semibold text-[#11100E] transition hover:opacity-90">Get early access</button>
                  </form>
                  <p className="mt-3 text-left text-xs text-[#BEB4A7]/60">No newsletters. One email when it's ready.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setTimeout(() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }), 350);
                  }}
                  className="mt-1 text-sm text-[#BEB4A7] transition hover:text-[#F3EEE6]"
                >
                  Start my free plan — $5.99/mo →
                </button>
              </m.div>
            )}
          </AnimatePresence>
        </div>
        </m.div>
      </m.div>
    </AnimatePresence>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const waitlistRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try { setDemoCompleted(sessionStorage.getItem("stilloff-demo-complete") === "true"); } catch { /* noop */ }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = y / max;
      const waitlistTop = waitlistRef.current?.getBoundingClientRect().top ?? Infinity;
      setShowSticky(progress > 0.2 && waitlistTop > window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleDemoComplete = useCallback(() => {
    setDemoCompleted(true);
    try { sessionStorage.setItem("stilloff-demo-complete", "true"); } catch { /* noop */ }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    try {
      await fetch("https://formspree.io/f/mzdklnwv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, _subject: "StillOff waitlist" }),
      });
      showToast("You're on the list. See you on the other side.");
      form.reset();
    } catch { showToast("Something went wrong. Try again."); }
  }, []);

  const handleShare = async () => {
    const text = "I sat with the loop for 12 minutes today. I didn't look away.";
    const url = typeof window !== "undefined" ? window.location.href : "https://stilloff.com";
    try {
      if (navigator.share) { await navigator.share({ title: "StillOff", text, url }); return; }
      await navigator.clipboard.writeText(text + " " + url);
      showToast("Copied to clipboard.");
    } catch { showToast("Sharing not available."); }
  };

  const openDemo = () => setTimeout(() => setDemoOpen(true), 120);

  const heroHeadline = demoCompleted ? "Welcome back. Ready to lock it in?" : "When you can't stop, StillOff does.";

  const comparisonRows: [string, string][] = [
    ["Track your usage", "Stop the behavior"],
    ["Suggest breaks", "Intervene in the moment"],
    ["Rely on your discipline", "Remove the decision"],
    ["Easy to bypass", "Designed to hold"],
    ["Work when you're motivated", "Work when you're not"],
  ];

  return (
    <LazyMotion features={domAnimation} strict>
      <main className="min-h-screen bg-[#11100E] text-[#F3EEE6] antialiased">

        {/* ── top nav ── */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#11100E]/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <div
              className="text-2xl font-light tracking-[-0.04em] text-[#F3EEE6]"
              style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }}
            >
              StillOff
            </div>

            <div className="hidden items-center gap-8 text-sm text-[#BEB4A7] md:flex">
              <a href="#how-it-works" className="transition-colors hover:text-[#F3EEE6]">
                How it works
              </a>
              <a href="#pricing" className="transition-colors hover:text-[#F3EEE6]">
                Pricing
              </a>
            </div>

            <button
              onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
              className="cta-glow rounded-2xl bg-[#F3EEE6] px-6 py-2.5 text-sm font-semibold text-[#11100E]"
            >
              Get early access
            </button>
          </div>
        </nav>

        {/* ── ambient bg ── */}
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" style={{ background: "radial-gradient(circle at 65% 30%, rgba(110,70,55,0.10), transparent 55%), radial-gradient(circle at 35% 70%, rgba(110,70,55,0.06), transparent 45%)" }} />

        {/* ── grain (hero only) ── */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[110vh]" aria-hidden="true" style={{ opacity: 0.04, backgroundImage: "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.95%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22/></svg>')", mixBlendMode: "soft-light" as React.CSSProperties["mixBlendMode"] }} />

        {/* ══════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-6 pb-20 pt-36 sm:px-8 lg:px-12">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_520px]">

            {/* left — copy */}
            <div>
              <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="mb-5 text-xs uppercase tracking-[0.26em] text-[#BEB4A7]">
                You picked up your phone 84 times today.
              </m.p>
              <m.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.08 }} className="max-w-2xl leading-[0.93] tracking-[-0.06em] text-[#F3EEE6]" style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(3rem,8vw,6rem)" }}>
                {heroHeadline}
              </m.h1>
              <m.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.16 }} className="mt-8 max-w-xl text-xl leading-[1.4] text-[#BEB4A7] sm:text-2xl">
                A real-time intervention that steps in before the spiral takes over.
              </m.p>
              <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.26 }} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button onClick={openDemo} className="cta-glow rounded-2xl bg-[#F3EEE6] px-7 py-3.5 text-sm font-semibold text-[#11100E] transition hover:opacity-90">
                  Try the 60-second lock
                </button>
                <button onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })} className="rounded-2xl border border-white/20 px-7 py-3.5 text-sm font-semibold text-[#F3EEE6] transition hover:bg-white/5">
                  Get early access
                </button>
              </m.div>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#BEB4A7]">
                <span>Free plan available</span>
                <span className="text-[#6E4637]">•</span>
                <span>Plans from $5.99/mo</span>
              </div>
            </div>

            {/* right — phone + orb */}
            <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="relative mx-auto w-full max-w-[420px]">
              {/* orb bleeds behind phone */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center">
                <BreathingOrb size={480} />
              </div>
              {/* phone frame */}
              <m.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} className="relative mx-auto w-[280px] rounded-[3.5rem] border border-white/10 bg-[#0b0a09] p-3 shadow-[0_40px_120px_rgba(0,0,0,0.7)] sm:w-[320px]">
                <div className="absolute left-1/2 top-2 h-1.5 w-20 -translate-x-1/2 rounded-full bg-white/10" />
                <div className="overflow-hidden rounded-[2.8rem] border border-white/5 bg-[#080707]">
                  <div className="flex min-h-[580px] flex-col items-center justify-center gap-8 px-6 py-10">
                    <p className="text-sm tracking-[0.18em] text-[#BEB4A7]/70">StillOff</p>
                    <BreathingOrb size={160} />
                    <p className="text-center text-xs tracking-[0.14em] text-[#BEB4A7]/60">Breathe in · Hold · Breathe out</p>
                  </div>
                </div>
              </m.div>
              {/* ambient cards */}
              <div className="absolute -left-10 top-16 hidden w-44 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-xs text-[#BEB4A7]/40 backdrop-blur-md lg:block">
                <p className="font-medium text-[#F3EEE6]/70">Opened 7 times</p>
                <p className="mt-1">in the last few minutes</p>
              </div>
              <div className="absolute -right-8 bottom-20 hidden w-36 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-xs text-[#BEB4A7]/40 backdrop-blur-md lg:block">
                <p className="font-medium text-[#F3EEE6]/70">Session complete</p>
                <p className="mt-1">18 min reset</p>
              </div>
            </m.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            THE LOOP
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-4xl px-6 py-28 sm:px-8 lg:px-12">
          <FadeIn>
            <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="max-w-2xl text-4xl leading-[1.15] tracking-[-0.03em] text-[#F3EEE6] sm:text-5xl">
              You didn&rsquo;t decide to spiral. It was already happening&nbsp;&mdash; the moment you picked it up.
            </p>
            <p className="mt-8 max-w-xl text-base leading-7 text-[#BEB4A7]">
              StillOff steps in at that exact moment. Before the loop closes. Before the next ten minutes disappear.
            </p>
          </FadeIn>
        </section>

        {/* ══════════════════════════════════════════════════
            ALMOST-ACTION MOMENT
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <FadeIn className="mx-auto mb-14 max-w-3xl text-center">
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="text-4xl tracking-[-0.04em] text-[#F3EEE6] sm:text-5xl">
              There's always a moment right before it happens.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#BEB4A7]">
              StillOff is built for the exact second control starts slipping.
            </p>
          </FadeIn>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Reflex", "I just opened it again. I didn't even think about it."],
              ["Focus loss", "I was trying to focus. Now I'm 15 minutes deep."],
              ["Awareness", "I know this is making it worse… and I'm still here."],
              ["Time distortion", "It's been an hour. I don't even remember why I picked it up."],
            ].map(([title, body], i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div className="h-full rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#BEB4A7]/70">{title}</p>
                  <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="mt-5 text-2xl leading-tight tracking-[-0.02em] text-[#F3EEE6]">
                    {body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            PRODUCT CLARITY
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <FadeIn className="mx-auto mb-14 max-w-3xl text-center">
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="text-4xl tracking-[-0.04em] text-[#F3EEE6] sm:text-5xl">
              StillOff interrupts compulsive phone use in real time.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#BEB4A7]">
              Your phone becomes a guided reset before the loop takes over.
            </p>
          </FadeIn>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["The Lock", "Silence lands before the spiral does."],
              ["The Reset", "Sixty seconds of guided breathing. You come back to yourself."],
              ["The Soft Landing", "After the lock lifts, there's space. Enough to make a different choice."],
              ["Learns your patterns", "StillOff steps in before you have to ask."],
            ].map(([title, body], i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div className="h-full rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
                  <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="text-2xl tracking-[-0.03em] text-[#F3EEE6]">{title}</p>
                  <p className="mt-4 text-sm leading-7 text-[#BEB4A7]">{body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════════ */}
        <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <FadeIn className="mx-auto mb-14 max-w-3xl text-center">
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="text-4xl tracking-[-0.04em] text-[#F3EEE6] sm:text-5xl">
              A simpler way to break the loop.
            </h2>
          </FadeIn>
          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2">
            {["You feel the pull", "StillOff steps in", "Your phone becomes a reset space", "You come back with more control"].map((step, i) => (
              <FadeIn key={step} delay={i * 0.07}>
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#BEB4A7]/70">Step {i + 1}</p>
                  <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="mt-4 text-3xl tracking-[-0.04em] text-[#F3EEE6]">{step}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            SOFT LANDING
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center sm:px-8 lg:px-12">
          <FadeIn>
            <p className="mb-5 text-xs uppercase tracking-[0.24em] text-[#BEB4A7]/60">Soft landing</p>
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="text-4xl tracking-[-0.04em] text-[#F3EEE6] sm:text-5xl">
              Most blockers end.<br />StillOff eases you back.
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-[#BEB4A7]/75">
              You don&rsquo;t get dropped straight back into the same loop you just escaped. There&rsquo;s space. There&rsquo;s distance. Enough to make a different decision.
            </p>
          </FadeIn>
        </section>

        {/* ══════════════════════════════════════════════════
            DIFFERENTIATION
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <FadeIn className="mx-auto mb-14 max-w-3xl text-center">
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="text-4xl tracking-[-0.04em] text-[#F3EEE6] sm:text-5xl">
              Everything else tells you to stop. StillOff is built to stop you.
            </h2>
          </FadeIn>
          <FadeIn className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
            <div className="grid grid-cols-2 border-b border-white/10 bg-white/[0.02]">
              <div className="px-6 py-4 text-xs uppercase tracking-[0.22em] text-[#BEB4A7]/70">Other apps</div>
              <div className="border-l border-white/10 px-6 py-4 text-xs uppercase tracking-[0.22em] text-[#BEB4A7]/70">StillOff</div>
            </div>
            {comparisonRows.map(([left, right], i) => (
              <div key={left} className="grid grid-cols-2 border-b border-white/10 last:border-b-0">
                <div className="px-6 py-5 text-sm text-[#BEB4A7]">{left}</div>
                <div className={`border-l border-white/10 px-6 py-5 text-sm ${i === comparisonRows.length - 1 ? "font-semibold text-[#F3EEE6]" : "text-[#F3EEE6]"}`}>{right}</div>
              </div>
            ))}
          </FadeIn>
        </section>

        {/* ══════════════════════════════════════════════════
            READY NUDGE
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-3xl px-6 py-16 text-center sm:px-8 lg:px-12">
          <FadeIn>
            <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="text-3xl tracking-[-0.03em] text-[#F3EEE6] sm:text-4xl">
              Ready to stop the loop in real life?
            </p>
            <div className="mt-7">
              <a
                href="#pricing"
                onClick={(e) => { e.preventDefault(); document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-block rounded-2xl border border-white/10 px-7 py-3.5 text-sm font-semibold text-[#F3EEE6] transition hover:border-white/20 hover:bg-white/5"
              >
                See pricing &amp; start free
              </a>
            </div>
          </FadeIn>
        </section>

        {/* ══════════════════════════════════════════════════
            RELIEF
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center sm:px-8 lg:px-12">
          <FadeIn>
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="text-4xl tracking-[-0.04em] text-[#F3EEE6] sm:text-5xl">
              You don't need more guilt about your habits.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#BEB4A7]">
              You need a way to break them while they're happening.
            </p>
          </FadeIn>
        </section>

        {/* ══════════════════════════════════════════════════
            PROOF
        ══════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <FadeIn className="mx-auto mb-14 max-w-3xl text-center">
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="text-4xl tracking-[-0.04em] text-[#F3EEE6] sm:text-5xl">Proof</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#BEB4A7]">Real language. No startup polish.</p>
          </FadeIn>
          <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
            <div className="grid gap-5">
              {[
                ["It stopped me before I spiraled.", "Early tester"],
                ["This is the first thing that actually interrupted me.", "Beta waitlist user"],
                ["I didn't realize how automatic it had become.", "Pilot user"],
              ].map(([quote, person], i) => (
                <FadeIn key={quote as string} delay={i * 0.07}>
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
                    <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="text-2xl leading-tight tracking-[-0.02em] text-[#F3EEE6]">
                      &ldquo;{quote as string}&rdquo;
                    </p>
                    <p className="mt-4 text-xs text-[#BEB4A7]/70">{person as string}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={0.1}>
              <div className="h-full rounded-[2rem] border border-white/10 bg-[#0d0c0b] p-8">
                <p className="text-xs uppercase tracking-[0.22em] text-[#BEB4A7]/70">Session complete</p>
                <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="mt-3 text-5xl tracking-[-0.05em] text-[#F3EEE6]">18 min</p>
                <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="mt-6 text-3xl leading-tight tracking-[-0.03em] text-[#F3EEE6]">
                  I sat with it. I didn't look away.
                </p>
                <p className="mt-4 text-base leading-7 text-[#BEB4A7]">
                  &ldquo;It didn't pass. You moved through it. The world waited. It was fine.&rdquo;
                </p>
                <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#BEB4A7]/60">StillOff · Private by default · Shareable when ready</p>
                  <button onClick={handleShare} className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-medium text-[#F3EEE6] transition hover:bg-white/5">
                    Share this moment
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            PRICING
        ══════════════════════════════════════════════════ */}
        <section id="pricing" className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mb-10 text-center">
              <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="text-4xl tracking-[-0.04em] text-[#F3EEE6] sm:text-5xl">Start free. Go deeper.</h2>
              <p className="mt-3 text-sm text-[#BEB4A7]">The free plan is real. Not a 7-day trick.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  name: "Free",
                  price: "$0",
                  cadence: "forever",
                  annual: null,
                  tagline: "A limited taste — incomplete on purpose." as string | null,
                  features: [
                    "3 resets per day",
                    "Guided breathing only",
                    "No Lock, no Soft Landing",
                    "No pattern learning",
                  ],
                  highlight: false,
                  cta: null,
                },
                {
                  name: "Plus",
                  price: "$5.99",
                  cadence: "/mo",
                  annual: "$47.99/yr",
                  tagline: "The core, complete product." as string | null,
                  features: [
                    "Full StillOff system",
                    "Unlimited resets",
                    "The Lock — silence the spiral",
                    "Guided breathing Reset",
                    "15-min Soft Landing",
                  ],
                  highlight: true,
                  cta: "Start free trial",
                },
                {
                  name: "Premium",
                  price: "$9.99",
                  cadence: "/mo",
                  annual: "$79.99/yr",
                  tagline: "For when the spiral is strongest." as string | null,
                  features: [
                    "Everything in Plus",
                    "Letter to My Future Self",
                    "Private community",
                    "Therapist-curated prompts",
                    "Unlimited interventions",
                    "Extended lock durations",
                    "Advanced recovery modes",
                  ],
                  highlight: false,
                  cta: "Get Premium",
                },
              ].map((tier) => (
                <div key={tier.name} className={`relative flex flex-col rounded-[1.5rem] border px-5 py-7 ${tier.highlight ? "border-[#6E4637]/40 bg-[#F3EEE6] text-[#11100E]" : "border-white/8 bg-white/[0.02] text-[#F3EEE6]"}`}>
                  {tier.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#6E4637] px-4 py-1 text-[9px] uppercase tracking-[0.2em] text-[#F3EEE6]">Most Popular</div>}
                  <p className={`text-xs uppercase tracking-[0.22em] ${tier.highlight ? "text-[#6E4637]" : "text-[#BEB4A7]"}`}>{tier.name}</p>
                  <div className="mt-3 flex items-end gap-1" style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }}>
                    <span className="text-4xl tracking-[-0.04em]">{tier.price}</span>
                    <span className={`mb-1 text-sm ${tier.highlight ? "text-[#8A5848]" : "text-[#BEB4A7]"}`}>{tier.cadence}</span>
                  </div>
                  {tier.annual && <p className={`mt-1 text-xs ${tier.highlight ? "text-[#8A5848]" : "text-[#BEB4A7]"}`}>{tier.annual}</p>}
                  {tier.tagline && <p className="mt-3 text-sm italic text-[#BEB4A7]">{tier.tagline}</p>}
                  <div className="mt-5 flex-1 space-y-2.5">
                    {tier.features.map((f) => (
                      <div key={f} className={`flex items-start gap-2 text-sm ${tier.highlight ? "text-[#6E4637]" : "text-[#BEB4A7]"}`}>
                        <span className="mt-px text-xs">✓</span><span>{f}</span>
                      </div>
                    ))}
                  </div>
                  {tier.cta && (
                    <a href="#waitlist" className={`cta-glow mt-6 block rounded-2xl py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] transition ${tier.highlight ? "bg-[#11100E] text-[#F3EEE6] hover:opacity-90" : "border border-white/10 text-[#F3EEE6] hover:bg-white/5"}`}>
                      {tier.cta}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ══════════════════════════════════════════════════
            WAITLIST
        ══════════════════════════════════════════════════ */}
        <section ref={waitlistRef} id="waitlist" className="relative z-10 mx-auto max-w-4xl px-6 py-24 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center sm:p-12">
              <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="text-3xl tracking-[-0.04em] text-[#F3EEE6] sm:text-4xl">That felt different.</p>
              <p className="mt-3 text-lg text-[#BEB4A7]">That's what control feels like.</p>
              <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="mt-8 text-4xl tracking-[-0.04em] text-[#F3EEE6] sm:text-5xl">Be first when StillOff launches.</p>
              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#BEB4A7]">The first real intervention for compulsive phone behavior.</p>
              <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
                <input type="email" name="email" required placeholder="Email address" className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#11100E] px-4 py-3.5 text-sm text-[#F3EEE6] outline-none placeholder:text-[#BEB4A7]/50 focus:border-[#6E4637]" />
                <button type="submit" className="cta-glow rounded-2xl bg-[#F3EEE6] px-6 py-3.5 text-sm font-semibold text-[#11100E] transition hover:opacity-90">Get early access</button>
              </form>
              <p className="mt-4 text-xs text-[#BEB4A7]/60">No newsletters. One email when it's ready.</p>
            </div>
          </FadeIn>
        </section>

        {/* ── footer ── */}
        <footer className="relative z-10 border-t border-white/8 px-6 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-[#BEB4A7]/60 sm:flex-row">
            <span style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }} className="text-base text-[#F3EEE6]">StillOff</span>
            <div className="flex gap-5">
              <a href="#" className="transition hover:text-[#F3EEE6]">Privacy</a>
              <a href="#" className="transition hover:text-[#F3EEE6]">Terms</a>
              <a href="mailto:hello@stilloff.com" className="transition hover:text-[#F3EEE6]">Contact</a>
            </div>
          </div>
        </footer>

        {/* ── sticky CTA ── */}
        <AnimatePresence>
          {showSticky && (
            <m.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
              className="cta-glow fixed bottom-4 right-4 z-50 rounded-full border border-white/10 bg-[#11100E]/90 px-5 py-2.5 text-xs font-semibold text-[#F3EEE6] backdrop-blur-md transition hover:border-white/20 md:bottom-6 md:left-6 md:right-auto"
            >
              Join waitlist
            </m.button>
          )}
        </AnimatePresence>

        {/* ── demo modal ── */}
        <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} onComplete={handleDemoComplete} onSubmit={handleSubmit} />

        {/* ── toast ── */}
        <AnimatePresence>
          {toast && (
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25 }}
              className="fixed bottom-16 left-1/2 z-[200] -translate-x-1/2 whitespace-nowrap rounded-2xl border border-white/10 bg-[#1A1815]/95 px-6 py-3 text-sm text-[#F3EEE6] shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md"
            >
              {toast}
            </m.div>
          )}
        </AnimatePresence>

      </main>
    </LazyMotion>
  );
}
