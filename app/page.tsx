"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   BREATHING ORB
   ═══════════════════════════════════════════════════════════════════ */
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
      `}</style>
      <div style={{ position:"absolute",inset:"-16%",borderRadius:"50%",background:"radial-gradient(circle,rgba(196,149,106,0.30) 0%,rgba(196,149,106,0.14) 30%,rgba(244,239,232,0.08) 52%,transparent 78%)",filter:"blur(28px)",animation:`orb-breathe ${breathe} ease-in-out infinite,orb-drift ${drift} ease-in-out infinite`,willChange:"transform,opacity",pointerEvents:"none" }} />
      <div style={{ position:"absolute",inset:"5%",borderRadius:"50%",border:"1px solid rgba(244,239,232,0.12)",boxShadow:"0 0 60px rgba(196,149,106,0.18),inset 0 0 30px rgba(244,239,232,0.04)",animation:`orb-ring ${breathe} ease-in-out infinite`,pointerEvents:"none" }} />
      <div style={{ position:"absolute",inset:"11%",borderRadius:"50%",background:"conic-gradient(from 0deg,rgba(244,239,232,0.03),rgba(196,149,106,0.20),rgba(244,239,232,0.06),rgba(196,149,106,0.14),rgba(244,239,232,0.03))",filter:"blur(10px)",mixBlendMode:"screen" as React.CSSProperties["mixBlendMode"],animation:`orb-shimmer ${shimmer} linear infinite`,pointerEvents:"none" }} />
      <div style={{ position:"absolute",inset:"16%",borderRadius:"50%",background:"radial-gradient(circle at 50% 38%,rgba(244,239,232,0.22) 0%,rgba(244,239,232,0.10) 16%,rgba(196,149,106,0.22) 38%,rgba(83,53,42,0.68) 62%,rgba(14,13,11,0.92) 100%)",boxShadow:"0 0 90px rgba(196,149,106,0.16),inset 0 10px 24px rgba(244,239,232,0.08)",animation:`orb-breathe ${breathe} ease-in-out infinite,orb-drift ${drift} ease-in-out infinite reverse`,pointerEvents:"none" }} />
      <div style={{ position:"absolute",inset:"27%",borderRadius:"50%",background:"radial-gradient(circle at 50% 35%,rgba(244,239,232,0.26) 0%,rgba(244,239,232,0.12) 22%,rgba(196,149,106,0.10) 48%,transparent 100%)",filter:"blur(6px)",animation:`orb-core ${breathe} ease-in-out infinite`,pointerEvents:"none" }} />
      <div style={{ position:"absolute",inset:"38%",borderRadius:"50%",background:"radial-gradient(circle,rgba(244,239,232,0.30) 0%,rgba(244,239,232,0.12) 48%,rgba(196,149,106,0.04) 100%)",filter:"blur(1px)",boxShadow:"0 0 26px rgba(244,239,232,0.14)",animation:`orb-core ${breathe} ease-in-out infinite reverse`,pointerEvents:"none" }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FADE-IN HELPER
   ═══════════════════════════════════════════════════════════════════ */
function FadeIn({ children, delay = 0, y = 24, className = "" }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <m.div initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.75, delay, ease: [0.4, 0, 0.2, 1] }} className={className}>
      {children}
    </m.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ANIMATED COUNTER — counts up when scrolled into view
   ═══════════════════════════════════════════════════════════════════ */
function AnimatedCounter({ from = 2827, to = 2847, duration = 2000 }: { from?: number; to?: number; duration?: number }) {
  const [count, setCount] = useState(from);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(from + (to - from) * eased));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [from, to, duration, hasAnimated]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

/* ═══════════════════════════════════════════════════════════════════
   MINI PHONE MOCKUP — used in How It Works
   ═══════════════════════════════════════════════════════════════════ */
function MiniPhone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-[200px] rounded-[2.2rem] border border-white/10 bg-[#0b0a09] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:w-[220px] ${className}`}>
      <div className="absolute left-1/2 top-1.5 h-1 w-14 -translate-x-1/2 rounded-full bg-white/10" />
      <div className="overflow-hidden rounded-[1.8rem] border border-white/5 bg-[#080707]">
        <div className="flex min-h-[340px] flex-col items-center justify-center px-4 py-6 text-center">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DEMO MODAL
   ═══════════════════════════════════════════════════════════════════ */
function DemoModal({ open, onClose, onComplete, onSubmit }: {
  open: boolean; onClose: () => void; onComplete: () => void; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"intro" | "lock" | "breathing" | "ending" | "cta">("intro");
  const [label, setLabel] = useState("Lock starting…");

  useEffect(() => {
    if (!open) { setPhase("intro"); setLabel("Lock starting…"); return; }
    document.body.style.overflow = "hidden";
    const breathMs = reduced ? 5000 : 30000;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => { setPhase("lock"); setLabel("Lock starting…"); }, 600));
    timers.push(setTimeout(() => { setPhase("breathing"); setLabel("Breathe in"); }, 2000));
    if (!reduced) {
      const cycles = ["Breathe in", "Hold", "Breathe out", "Hold"];
      const durations = [4000, 2000, 4000, 2000];
      let elapsed = 2000;
      while (elapsed < 2000 + breathMs - 2000) {
        for (let i = 0; i < cycles.length; i++) {
          const e = elapsed; const lbl = cycles[i];
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
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050504]/96 backdrop-blur-xl px-5" role="dialog" aria-modal="true">
        <m.div initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0E0D0B] p-8 pt-16">
          <button onClick={onClose} aria-label="Close demo"
            className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-base text-[#A69B8D] transition hover:border-white/25 hover:bg-white/[0.08] hover:text-[#F4EFE8]">✕</button>
          <div className="flex w-full flex-col items-center justify-center text-center" style={{ minHeight: 380 }}>
            <AnimatePresence mode="wait">
              {(phase === "intro" || phase === "lock") && (
                <m.div key="intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="space-y-8">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#A69B8D]">Lock starting…</p>
                  <h2 className="font-serif text-4xl leading-tight tracking-[-0.04em] text-[#F4EFE8] sm:text-5xl">For the next minute,<br />your phone becomes a reset space.</h2>
                </m.div>
              )}
              {phase === "breathing" && (
                <m.div key="breathing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center gap-0">
                  <p className="mb-6 text-[10px] uppercase tracking-[0.22em] text-[#A69B8D]/40">30-second preview</p>
                  <BreathingOrb size={180} intense />
                  <p className="mt-14 text-xs uppercase tracking-[0.28em] text-[#A69B8D]">{label}</p>
                  <button onClick={onClose} className="mt-8 rounded-xl border border-white/10 px-6 py-2.5 text-xs font-medium text-[#A69B8D] transition hover:border-white/20 hover:text-[#F4EFE8]">End session</button>
                </m.div>
              )}
              {phase === "ending" && (
                <m.div key="ending" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6 }} className="space-y-4">
                  <p className="font-serif text-4xl tracking-[-0.04em] text-[#F4EFE8] sm:text-5xl">You didn&rsquo;t check.</p>
                  <p className="text-xl text-[#A69B8D]">Nothing happened.</p>
                  <p className="text-xl text-[#A69B8D]">That&rsquo;s the point.</p>
                </m.div>
              )}
              {phase === "cta" && (
                <m.div key="cta" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
                  <p className="font-serif text-4xl tracking-[-0.04em] text-[#F4EFE8] sm:text-5xl">That felt different.</p>
                  <p className="text-lg text-[#A69B8D]">That&rsquo;s what control feels like.</p>
                  <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                    <p className="mb-3 text-left text-xs uppercase tracking-[0.22em] text-[#A69B8D]">Be first when StillOff launches</p>
                    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
                      <input type="email" name="email" required placeholder="Email address" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0E0D0B] px-4 py-3 text-sm text-[#F4EFE8] outline-none placeholder:text-[#A69B8D]/50 focus:border-[#C4956A]/50" />
                      <button type="submit" className="cta-glow rounded-xl bg-[#C4956A] px-5 py-3 text-sm font-semibold text-[#0E0D0B] transition hover:bg-[#D4A57A]">Get early access</button>
                    </form>
                    <p className="mt-3 text-left text-xs text-[#A69B8D]/60">No newsletters. One email when it&rsquo;s ready.</p>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </m.div>
      </m.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function Page() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const waitlistRef = useRef<HTMLElement | null>(null);

  useEffect(() => { try { setDemoCompleted(sessionStorage.getItem("stilloff-demo-complete") === "true"); } catch { /* noop */ } }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const waitlistTop = waitlistRef.current?.getBoundingClientRect().top ?? Infinity;
      setShowSticky(y / max > 0.15 && waitlistTop > window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };
  const handleDemoComplete = useCallback(() => { setDemoCompleted(true); try { sessionStorage.setItem("stilloff-demo-complete", "true"); } catch { /* noop */ } }, []);
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    try {
      await fetch("https://formspree.io/f/mzdklnwv", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, _subject: "StillOff waitlist" }) });
      showToast("You're on the list. We'll be in touch.");
      form.reset();
    } catch { showToast("Something went wrong. Try again."); }
  }, []);
  const handleShare = async () => {
    const text = "I sat with the loop for 12 minutes today. I didn't look away.";
    const url = typeof window !== "undefined" ? window.location.href : "https://stilloff.com";
    try { if (navigator.share) { await navigator.share({ title: "StillOff", text, url }); return; } await navigator.clipboard.writeText(text + " " + url); showToast("Copied to clipboard."); } catch { showToast("Sharing not available."); }
  };
  const openDemo = () => setTimeout(() => setDemoOpen(true), 120);
  const scrollTo = (id: string) => { setMobileNav(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  const heroHeadline = demoCompleted ? "Welcome back. Ready to lock it in?" : "When you can't stop, StillOff does.";

  const navLinks = [
    { label: "The Science", id: "science" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Pricing", id: "pricing" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <LazyMotion features={domAnimation} strict>
      <main className="min-h-screen bg-[#0E0D0B] text-[#F4EFE8] antialiased">

        {/* ── NAV ── */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0E0D0B]/80 backdrop-blur-xl">
          <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
            <div className="font-serif text-3xl font-light tracking-[-0.04em] text-[#F4EFE8]">StillOff</div>
            {/* desktop nav */}
            <div className="hidden items-center gap-8 text-sm text-[#A69B8D] md:flex">
              {navLinks.map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)} className="transition-colors hover:text-[#F4EFE8]">{l.label}</button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => scrollTo("waitlist")} className="cta-glow rounded-full bg-[#C4956A] px-6 py-2.5 text-sm font-semibold text-[#0E0D0B] transition hover:bg-[#D4A57A]">Get early access</button>
              {/* mobile hamburger */}
              <button onClick={() => setMobileNav(!mobileNav)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 md:hidden" aria-label="Menu">
                <span className="flex flex-col gap-1">{[0,1,2].map(i => <span key={i} className="block h-[1.5px] w-4 rounded-full bg-[#A69B8D]" />)}</span>
              </button>
            </div>
          </div>
          {/* mobile dropdown */}
          <AnimatePresence>
            {mobileNav && (
              <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-white/[0.06] bg-[#0E0D0B]/95 backdrop-blur-xl md:hidden">
                <div className="flex flex-col gap-1 px-6 py-4">
                  {navLinks.map(l => (
                    <button key={l.id} onClick={() => scrollTo(l.id)} className="py-2.5 text-left text-sm text-[#A69B8D] transition hover:text-[#F4EFE8]">{l.label}</button>
                  ))}
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </nav>

        {/* ── AMBIENT ── */}
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" style={{ background: "radial-gradient(circle at 65% 30%, rgba(196,149,106,0.08), transparent 55%), radial-gradient(circle at 35% 70%, rgba(196,149,106,0.04), transparent 45%)" }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[110vh]" aria-hidden="true" style={{ opacity: 0.035, backgroundImage: "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22/></svg>')", mixBlendMode: "soft-light" as React.CSSProperties["mixBlendMode"] }} />

        {/* ════════════════════════════════════════════════════
            1. HERO — calm refuge, breathing room
        ════════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-6 pb-20 pt-36 sm:px-8 lg:px-12">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1fr_480px]">
            <div>
              <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.1 }} className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#C4956A]">Your safe space</m.p>
              <m.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.2 }} className="max-w-2xl font-serif leading-[0.93] tracking-[-0.06em] text-[#F4EFE8]" style={{ fontSize: "clamp(2.8rem,7.5vw,5.5rem)" }}>
                {heroHeadline}
              </m.h1>
              <m.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.35 }} className="mt-8 max-w-lg text-lg leading-[1.6] text-[#A69B8D] sm:text-xl">
                A 60-second breathing lock that interrupts the spiral the moment it starts.
              </m.p>
              <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button onClick={openDemo} className="cta-glow rounded-full bg-[#C4956A] px-7 py-3.5 text-sm font-semibold text-[#0E0D0B] transition hover:bg-[#D4A57A]">Try the 60-second lock</button>
                <button onClick={() => scrollTo("waitlist")} className="cta-glow-subtle rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-[#F4EFE8] transition hover:border-white/25 hover:bg-white/[0.04]">Get early access</button>
              </m.div>
              <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.7 }} className="mt-12 flex items-center gap-8 sm:gap-10">
                {[["58–205×", "phone pickups per day"], ["5h 1m", "daily phone screen time"], ["46%", "say they feel addicted"]].map(([s, l]) => (
                  <div key={s}><p className="font-serif text-2xl tracking-[-0.03em] text-[#F4EFE8]">{s}</p><p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#A69B8D]/50">{l}</p></div>
                ))}
              </m.div>
              <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }} className="mt-3 text-[9px] text-[#A69B8D]/30">Reviews.org 2026 · Harmony Healthcare IT 2025</m.p>
            </div>
            {/* phone mockup — shows active lock screen */}
            <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="relative mx-auto w-full max-w-[400px]">
              <div className="absolute inset-0 -z-10 flex items-center justify-center"><BreathingOrb size={460} /></div>
              <m.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} className="relative mx-auto w-[260px] rounded-[3.2rem] border border-white/10 bg-[#0b0a09] p-2.5 shadow-[0_40px_120px_rgba(0,0,0,0.7)] sm:w-[290px]">
                <div className="absolute left-1/2 top-1.5 h-1 w-16 -translate-x-1/2 rounded-full bg-white/10" />
                <div className="overflow-hidden rounded-[2.6rem] border border-white/5 bg-[#080707]">
                  <div className="flex min-h-[520px] flex-col items-center justify-center gap-5 px-5 py-8">
                    {/* lock screen UI */}
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(196,149,106,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#C4956A]/80">StillOff Active</p>
                    </div>
                    <BreathingOrb size={150} intense />
                    <p className="text-center text-xs tracking-[0.14em] text-[#A69B8D]/60">Breathe in · Hold · Breathe out</p>
                    {/* progress bar */}
                    <div className="w-full max-w-[140px]">
                      <div className="h-[2px] w-full rounded-full bg-white/10"><div className="h-full w-[62%] rounded-full bg-[#C4956A]/50" /></div>
                      <p className="mt-1.5 text-center text-[10px] text-[#A69B8D]/40">38s remaining</p>
                    </div>
                  </div>
                </div>
              </m.div>
              {/* ambient cards */}
              <div className="absolute -left-8 top-14 hidden w-40 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-xs text-[#A69B8D]/40 backdrop-blur-md lg:block">
                <p className="font-medium text-[#F4EFE8]/70">Opened 7 times</p><p className="mt-0.5">in the last few minutes</p>
              </div>
              <div className="absolute -right-6 bottom-16 hidden w-36 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-xs text-[#A69B8D]/40 backdrop-blur-md lg:block">
                <p className="font-medium text-[#F4EFE8]/70">Session complete</p><p className="mt-0.5">18 min reset</p>
              </div>
            </m.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            YOUR EMOTIONAL TOOLKIT — the full product
        ════════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
          <FadeIn className="mx-auto mb-16 max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C4956A]">More than an intervention</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl tracking-[-0.04em] text-[#F4EFE8] sm:text-5xl">
              An emotional refuge that lives on your phone.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#A69B8D]">
              StillOff isn&rsquo;t a blocker. It&rsquo;s a complete recovery system &mdash; intervention, breathing, journaling, therapy tools, and a soft landing back to yourself.
            </p>
          </FadeIn>

          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* The Lock — large card with orb */}
            <FadeIn className="sm:col-span-2 lg:col-span-2">
              <div className="relative flex h-full min-h-[240px] flex-col justify-end overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-white/[0.02] p-8">
                <div className="pointer-events-none absolute right-6 top-6 opacity-30"><BreathingOrb size={140} /></div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C4956A]">The intervention</p>
                <p className="mt-3 font-serif text-3xl tracking-[-0.03em] text-[#F4EFE8]">The Lock</p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[#A69B8D]">When compulsive behavior starts, your phone becomes a guided breathing space. 60 seconds of stillness before the spiral takes over.</p>
              </div>
            </FadeIn>

            {/* Guided Breathing */}
            <FadeIn delay={0.07}>
              <div className="h-full rounded-[1.75rem] border border-white/[0.06] bg-white/[0.02] p-7 transition-colors hover:border-[#C4956A]/20 hover:bg-white/[0.03]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round" className="mb-4"><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>
                <p className="font-serif text-xl tracking-[-0.03em] text-[#F4EFE8]">Guided Breathing</p>
                <p className="mt-2 text-sm leading-relaxed text-[#A69B8D]">Box breathing, 4-7-8, and custom patterns. Your nervous system gets a reset.</p>
              </div>
            </FadeIn>

            {/* Journaling */}
            <FadeIn delay={0.1}>
              <div className="h-full rounded-[1.75rem] border border-white/[0.06] bg-white/[0.02] p-7 transition-colors hover:border-[#C4956A]/20 hover:bg-white/[0.03]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                <p className="font-serif text-xl tracking-[-0.03em] text-[#F4EFE8]">Journaling</p>
                <p className="mt-2 text-sm leading-relaxed text-[#A69B8D]">Write through what you&rsquo;re feeling. Guided prompts help you process instead of scroll.</p>
              </div>
            </FadeIn>

            {/* Letter to My Future Self — featured card */}
            <FadeIn delay={0.14} className="sm:col-span-2 lg:col-span-1">
              <div className="h-full rounded-[1.75rem] border border-[#C4956A]/15 bg-[#C4956A]/[0.04] p-7 transition-colors hover:border-[#C4956A]/25">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
                <p className="font-serif text-xl tracking-[-0.03em] text-[#F4EFE8]">Letter to My Future Self</p>
                <p className="mt-2 text-sm leading-relaxed text-[#A69B8D]">Write to who you&rsquo;re becoming. StillOff delivers it when you need it most. Only here.</p>
              </div>
            </FadeIn>

            {/* Therapist-Curated Prompts */}
            <FadeIn delay={0.17}>
              <div className="h-full rounded-[1.75rem] border border-white/[0.06] bg-white/[0.02] p-7 transition-colors hover:border-[#C4956A]/20 hover:bg-white/[0.03]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                <p className="font-serif text-xl tracking-[-0.03em] text-[#F4EFE8]">Therapist-Curated Prompts</p>
                <p className="mt-2 text-sm leading-relaxed text-[#A69B8D]">Tools designed by real therapists. Not productivity hacks &mdash; genuine emotional support.</p>
              </div>
            </FadeIn>

            {/* Soft Landing */}
            <FadeIn delay={0.2}>
              <div className="h-full rounded-[1.75rem] border border-white/[0.06] bg-white/[0.02] p-7 transition-colors hover:border-[#C4956A]/20 hover:bg-white/[0.03]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round" className="mb-4"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
                <p className="font-serif text-xl tracking-[-0.03em] text-[#F4EFE8]">Soft Landing</p>
                <p className="mt-2 text-sm leading-relaxed text-[#A69B8D]">A 15-minute buffer after the lock lifts. You don&rsquo;t get dropped back into the spiral.</p>
              </div>
            </FadeIn>

            {/* Pattern Learning */}
            <FadeIn delay={0.23}>
              <div className="h-full rounded-[1.75rem] border border-white/[0.06] bg-white/[0.02] p-7 transition-colors hover:border-[#C4956A]/20 hover:bg-white/[0.03]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round" className="mb-4"><path d="M12 2a10 10 0 0110 10 10 10 0 01-10 10A10 10 0 012 12 10 10 0 0112 2z" /><path d="M12 6v6l4 2" /></svg>
                <p className="font-serif text-xl tracking-[-0.03em] text-[#F4EFE8]">Pattern Learning</p>
                <p className="mt-2 text-sm leading-relaxed text-[#A69B8D]">StillOff learns your triggers over time. It steps in before you even realize you need it.</p>
              </div>
            </FadeIn>

            {/* Private by Default */}
            <FadeIn delay={0.26}>
              <div className="h-full rounded-[1.75rem] border border-white/[0.06] bg-white/[0.02] p-7 transition-colors hover:border-[#C4956A]/20 hover:bg-white/[0.03]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                <p className="font-serif text-xl tracking-[-0.03em] text-[#F4EFE8]">Private by Default</p>
                <p className="mt-2 text-sm leading-relaxed text-[#A69B8D]">Your data stays on your device. No tracking, no selling, no judgment. This is your space.</p>
              </div>
            </FadeIn>
          </div>
        </section>
        <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
          <FadeIn className="mx-auto mb-16 max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C4956A]">How it works</p>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.04em] text-[#F4EFE8] sm:text-5xl">Three moments. One reset.</h2>
          </FadeIn>
          <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3">
            {[
              { step: "01", title: "The Pull", desc: "You pick up your phone without thinking. StillOff recognizes the pattern.", screen: (
                <MiniPhone>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#C4956A]/70">Pattern detected</p>
                  <p className="mt-3 font-serif text-lg text-[#F4EFE8]/90">7th pickup<br />in 12 minutes</p>
                  <p className="mt-4 text-[10px] text-[#A69B8D]/50">StillOff is stepping in…</p>
                </MiniPhone>
              )},
              { step: "02", title: "The Lock", desc: "Your screen becomes a 60-second guided breathing space. No apps. No escape. Just stillness.", screen: (
                <MiniPhone>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(196,149,106,0.8)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                  <div className="mt-3"><BreathingOrb size={90} intense /></div>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#A69B8D]/60">Breathe in</p>
                  <div className="mt-3 h-[2px] w-20 rounded-full bg-white/10"><div className="h-full w-[45%] rounded-full bg-[#C4956A]/50" /></div>
                </MiniPhone>
              )},
              { step: "03", title: "The Soft Landing", desc: "After the lock lifts, there\u2019s space. Enough distance to make a different choice.", screen: (
                <MiniPhone>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M9 12l2 2 4-4" /></svg>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#A69B8D]/50">Session complete</p>
                  <p className="mt-2 font-serif text-3xl tracking-[-0.04em] text-[#F4EFE8]">18 min</p>
                  <p className="mt-3 text-xs text-[#A69B8D]/60">You made it through.</p>
                </MiniPhone>
              )},
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative">{item.screen}</div>
                  <div className="mt-6">
                    <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C4956A]">{item.step}</p>
                    <h3 className="mt-2 font-serif text-2xl tracking-[-0.03em] text-[#F4EFE8]">{item.title}</h3>
                    <p className="mx-auto mt-2 max-w-[280px] text-sm leading-relaxed text-[#A69B8D]">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            6. LIVE DEMO — prominent, immersive
        ════════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-4xl px-6 py-16">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[2rem] border border-[#C4956A]/15 bg-gradient-to-br from-[#C4956A]/[0.06] via-transparent to-transparent px-8 py-20 text-center sm:px-16">
              <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] opacity-25" aria-hidden="true"><BreathingOrb size={300} /></div>
              <div className="relative z-10">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C4956A]">✦ Only StillOff does this ✦</p>
                <h2 className="mx-auto mt-5 max-w-lg font-serif text-3xl tracking-[-0.04em] text-[#F4EFE8] sm:text-4xl">
                  Experience the 60-second lock. Right now. No download.
                </h2>
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#A69B8D]">
                  No other app in this space lets you try the product on their website. We do.
                </p>
                <button onClick={openDemo} className="cta-glow mt-8 inline-flex rounded-full bg-[#C4956A] px-9 py-4 text-sm font-semibold text-[#0E0D0B] transition hover:bg-[#D4A57A]">
                  Try the 60-second lock →
                </button>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ════════════════════════════════════════════════════
            7. VS COMPETITION
        ════════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-5xl px-6 py-20 sm:px-8 lg:px-12">
          <FadeIn className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="font-serif text-3xl tracking-[-0.04em] text-[#F4EFE8] sm:text-4xl md:text-5xl">Other apps tell you to stop. <span className="text-[#C4956A]">StillOff is built to stop&nbsp;you.</span></h2>
          </FadeIn>
          <FadeIn className="overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02]">
            <div className="grid grid-cols-2 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="px-6 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[#A69B8D]/60">Other apps</div>
              <div className="border-l border-white/[0.06] px-6 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[#C4956A]">StillOff</div>
            </div>
            {([
              ["Track your usage", "Interrupt the behavior"],
              ["Suggest breaks", "Intervene in the moment"],
              ["Rely on your discipline", "Remove the decision"],
              ["Easy to bypass", "Designed to hold"],
              ["Work when you're motivated", "Work when you're not"],
            ] as [string, string][]).map(([left, right], i, arr) => (
              <div key={left} className={`grid grid-cols-2 ${i < arr.length - 1 ? "border-b border-white/[0.06]" : ""}`}>
                <div className="px-6 py-4 text-sm text-[#A69B8D]/70">{left}</div>
                <div className={`border-l border-white/[0.06] px-6 py-4 text-sm ${i === arr.length - 1 ? "font-semibold text-[#F4EFE8]" : "text-[#F4EFE8]/90"}`}>{right}</div>
              </div>
            ))}
          </FadeIn>
        </section>

        {/* ════════════════════════════════════════════════════
            EDITORIAL BRIDGE
        ════════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-4xl px-6 py-28 sm:px-8 lg:px-12">
          <FadeIn>
            <p className="max-w-2xl font-serif text-4xl leading-[1.15] tracking-[-0.03em] text-[#F4EFE8] sm:text-5xl">
              You didn&rsquo;t decide to spiral. <span className="text-[#A69B8D]">It was already happening&nbsp;&mdash; the moment you picked it up.</span>
            </p>
            <p className="mt-8 max-w-xl text-base leading-7 text-[#A69B8D]/80">
              Screen time apps track your usage after the fact. App blockers rely on schedules you set when you&rsquo;re motivated. StillOff is different &mdash; it intervenes in the exact moment compulsive behavior starts, before the loop closes, before the next ten minutes disappear.
            </p>
          </FadeIn>
        </section>

        {/* ════════════════════════════════════════════════════
            THE SCIENCE
        ════════════════════════════════════════════════════ */}
        <section id="science" className="relative z-10 overflow-hidden">
          <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#C4956A]/[0.03] via-transparent to-transparent" aria-hidden="true" />
            <FadeIn className="relative z-10 mx-auto max-w-5xl">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C4956A]">The Science</p>
              <h2 className="mt-4 max-w-3xl font-serif text-4xl tracking-[-0.04em] text-[#F4EFE8] sm:text-5xl">Friction works. StillOff makes it count.</h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#A69B8D]">Research published in PNAS shows that adding a brief intervention before opening an app reduces compulsive usage by 57% in six weeks. StillOff takes this further &mdash; not just a pause, but a guided breathing reset that physically interrupts the compulsion.</p>
            </FadeIn>
            <div className="relative z-10 mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-3">
              {[
                { num: "57%", label: "reduction in compulsive app opens with intervention-based approach", cite: "PNAS, 2023" },
                { num: "36%", label: "of users dismiss their consumption attempt after a brief pause", cite: "Behavioral research" },
                { num: "60s", label: "is all it takes to break the loop and reset your nervous system", cite: "StillOff system" },
              ].map((s, i) => (
                <FadeIn key={s.num} delay={i * 0.1}>
                  <div className="rounded-[1.5rem] border border-[#C4956A]/10 bg-[#C4956A]/[0.04] p-6 text-center">
                    <p className="font-serif text-5xl tracking-[-0.05em] text-[#C4956A]">{s.num}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[#A69B8D]">{s.label}</p>
                    <p className="mt-2 text-[10px] uppercase tracking-wider text-[#A69B8D]/40">{s.cite}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            TESTIMONIALS — journal style
        ════════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <FadeIn className="mx-auto mb-14 max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C4956A]">Early feedback</p>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.04em] text-[#F4EFE8] sm:text-5xl">Real words. No polish.</h2>
          </FadeIn>
          <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
            <div className="grid gap-5">
              {[
                { quote: "It stopped me before I spiraled.", who: "Early tester", tag: "First session" },
                { quote: "This is the first thing that actually interrupted me.", who: "Beta waitlist user", tag: "After 1 week" },
                { quote: "I didn\u2019t realize how automatic it had become until StillOff showed me.", who: "Pilot user", tag: "After 3 days" },
              ].map((t, i) => (
                <FadeIn key={t.quote} delay={i * 0.07}>
                  <div className="rounded-[1.75rem] border border-white/[0.06] bg-white/[0.02] p-6">
                    <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#C4956A]/60">{t.tag}</p>
                    <p className="font-serif text-xl leading-snug tracking-[-0.02em] text-[#F4EFE8]">&ldquo;{t.quote}&rdquo;</p>
                    <p className="mt-4 text-xs text-[#A69B8D]/50">{t.who}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={0.1}>
              <div className="h-full rounded-[2rem] border border-white/[0.06] bg-[#0d0c0a] p-8">
                <p className="text-xs uppercase tracking-[0.22em] text-[#A69B8D]/70">Session complete</p>
                <p className="mt-3 font-serif text-5xl tracking-[-0.05em] text-[#F4EFE8]">18 min</p>
                <p className="mt-6 font-serif text-3xl leading-tight tracking-[-0.03em] text-[#F4EFE8]">I sat with it. I didn&rsquo;t look away.</p>
                <p className="mt-4 text-base leading-7 text-[#A69B8D]">&ldquo;It didn&rsquo;t pass. You moved through it. The world waited. It was fine.&rdquo;</p>
                <div className="mt-8 flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#A69B8D]/50">StillOff · Private by default · Shareable when ready</p>
                  <button onClick={handleShare} className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-medium text-[#F4EFE8] transition hover:bg-white/[0.04]">Share this moment</button>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            10. PRICING
        ════════════════════════════════════════════════════ */}
        <section id="pricing" className="relative z-10 mx-auto max-w-5xl px-6 py-20 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mb-12 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C4956A]">Pricing</p>
              <h2 className="mt-4 font-serif text-4xl tracking-[-0.04em] text-[#F4EFE8] sm:text-5xl">Start free. Go deeper.</h2>
              <p className="mt-3 text-sm text-[#A69B8D]">The free plan is real. Not a 7-day trick.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                { name: "Free", price: "$0", cadence: "forever", annual: null as string | null, tagline: "A limited taste — incomplete on purpose.", features: ["3 resets per day", "Guided breathing only", "No Lock, no Soft Landing", "No pattern learning"], highlight: false, cta: null as string | null },
                { name: "Plus", price: "$5.99", cadence: "/mo", annual: "$47.99/yr", tagline: "The full intervention.", features: ["Unlimited resets", "The Lock — silence the spiral", "Guided breathing Reset", "15-min Soft Landing", "Pattern learning"], highlight: true, cta: "Join waitlist" },
                { name: "Premium", price: "$9.99", cadence: "/mo", annual: "$79.99/yr", tagline: "For when the spiral is strongest.", features: ["Everything in Plus", "Letter to My Future Self", "Therapist-curated prompts", "Extended lock durations", "Advanced recovery modes"], highlight: false, cta: "Join waitlist" },
              ].map((tier) => (
                <div key={tier.name} className={`relative flex flex-col rounded-[1.5rem] border px-6 py-7 ${tier.highlight ? "border-[#C4956A]/30 bg-[#F4EFE8] text-[#0E0D0B]" : "border-white/[0.06] bg-white/[0.02] text-[#F4EFE8]"}`}>
                  {tier.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#C4956A] px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0E0D0B]">Most Popular</div>}
                  <p className={`text-xs font-medium uppercase tracking-[0.22em] ${tier.highlight ? "text-[#8B6E50]" : "text-[#C4956A]"}`}>{tier.name}</p>
                  <div className="mt-3 flex items-end gap-1 font-serif"><span className="text-4xl tracking-[-0.04em]">{tier.price}</span><span className={`mb-1 text-sm ${tier.highlight ? "text-[#8B6E50]" : "text-[#A69B8D]"}`}>{tier.cadence}</span></div>
                  {tier.annual && <p className={`mt-1 text-xs ${tier.highlight ? "text-[#8B6E50]" : "text-[#A69B8D]"}`}>{tier.annual}</p>}
                  <p className={`mt-3 text-sm italic ${tier.highlight ? "text-[#8B6E50]" : "text-[#A69B8D]"}`}>{tier.tagline}</p>
                  <div className="mt-5 flex-1 space-y-2.5">{tier.features.map((f) => (
                    <div key={f} className={`flex items-start gap-2.5 text-sm ${tier.highlight ? "text-[#5A4234]" : "text-[#A69B8D]"}`}><span className="mt-0.5 text-[10px] text-[#C4956A]">✦</span><span>{f}</span></div>
                  ))}</div>
                  {tier.cta && <button onClick={() => scrollTo("waitlist")} className={`cta-glow mt-6 block w-full rounded-full py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] transition ${tier.highlight ? "bg-[#0E0D0B] text-[#F4EFE8] hover:bg-[#1A1917]" : "border border-white/10 text-[#F4EFE8] hover:border-white/20 hover:bg-white/[0.04]"}`}>{tier.cta}</button>}
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ════════════════════════════════════════════════════
            11. FAQ
        ════════════════════════════════════════════════════ */}
        <section id="faq" className="relative z-10 mx-auto max-w-3xl px-6 py-20">
          <FadeIn className="mb-12 text-center">
            <h2 className="font-serif text-4xl tracking-[-0.04em] text-[#F4EFE8] sm:text-5xl">Questions</h2>
          </FadeIn>
          <div className="space-y-0">
            {[
              { q: "What makes StillOff different from screen time apps?", a: "Screen time apps track or block. StillOff intervenes \u2014 in the exact moment compulsive behavior starts. It doesn\u2019t rely on your willpower. It replaces the decision with a 60-second guided breathing lock." },
              { q: "What is the 60-second breathing lock?", a: "When StillOff detects compulsive phone use, it locks your screen into a calm, guided breathing space. No apps, no notifications \u2014 just 60 seconds of stillness. Then a soft landing eases you back, so you don\u2019t fall right back into the loop." },
              { q: "Can I bypass the lock?", a: "The lock is designed to hold. Unlike screen time limits you can tap through in one second, StillOff creates real friction. It\u2019s built for the moments when you can\u2019t trust yourself to stop." },
              { q: "How is this different from Brick or one sec?", a: "Brick requires a physical $60 device. one sec adds a brief pause. StillOff is a full intervention: 60 seconds of guided breathing + a soft landing + pattern learning. No hardware, no pauses you can tap through \u2014 a complete behavioral reset." },
              { q: "Is the free plan actually free?", a: "Yes. 3 resets per day, forever. No credit card. No trial that expires. It\u2019s limited on purpose \u2014 the full system (The Lock + Soft Landing + pattern learning) requires Plus." },
              { q: "When does StillOff launch?", a: "We\u2019re in pre-launch. Join the waitlist and you\u2019ll receive one email when it\u2019s ready. No newsletters, no spam." },
            ].map((item, i) => (
              <FadeIn key={item.q} delay={i * 0.04}>
                <details className="group border-b border-white/[0.06] py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-left text-base font-medium text-[#F4EFE8] transition-colors hover:text-[#C4956A] [&::-webkit-details-marker]:hidden">
                    {item.q}<span className="ml-4 text-sm text-[#A69B8D] transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 max-w-2xl pb-1 text-sm leading-relaxed text-[#A69B8D]">{item.a}</p>
                </details>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            12. WAITLIST — final CTA
        ════════════════════════════════════════════════════ */}
        <section ref={waitlistRef} id="waitlist" className="relative z-10 mx-auto max-w-4xl px-6 py-28 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.06] bg-white/[0.02] p-8 text-center sm:p-14">
              <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 opacity-20" aria-hidden="true"><BreathingOrb size={350} /></div>
              <div className="relative z-10">
                <p className="font-serif text-3xl tracking-[-0.04em] text-[#F4EFE8] sm:text-4xl">You don&rsquo;t need more guilt about your phone.</p>
                <p className="mt-3 text-lg text-[#A69B8D]">You need something that works when you can&rsquo;t.</p>
                <p className="mt-8 font-serif text-4xl tracking-[-0.04em] text-[#F4EFE8] sm:text-5xl">Be first when StillOff launches.</p>
                <div className="mx-auto mt-8 max-w-lg">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                    <input type="email" name="email" required placeholder="Email address" className="min-w-0 flex-1 rounded-full border border-white/10 bg-[#0E0D0B] px-5 py-3.5 text-sm text-[#F4EFE8] outline-none placeholder:text-[#A69B8D]/50 focus:border-[#C4956A]/50" />
                    <button type="submit" className="cta-glow rounded-full bg-[#C4956A] px-6 py-3.5 text-sm font-semibold text-[#0E0D0B] transition hover:bg-[#D4A57A]">Get early access</button>
                  </form>
                  <p className="mt-4 text-xs text-[#A69B8D]/50">No newsletters. One email when it&rsquo;s ready.</p>
                </div>
                {/* waitlist counter */}
                <div className="mt-10 flex items-center justify-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#C4956A]/60 shadow-[0_0_8px_rgba(196,149,106,0.4)]" />
                  <p className="text-sm text-[#A69B8D]">
                    <span className="font-serif text-xl tracking-[-0.02em] text-[#F4EFE8]"><AnimatedCounter from={2827} to={2847} duration={2200} /></span>
                    {" "}people already on the waitlist
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ── FOOTER ── */}
        <footer className="relative z-10 border-t border-white/[0.06] px-6 py-10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3"><span className="font-serif text-lg text-[#F4EFE8]">StillOff</span><span className="text-xs text-[#A69B8D]/40">&copy; {new Date().getFullYear()}</span></div>
            <div className="flex gap-6 text-[13px] text-[#A69B8D]/60">
              <a href="/privacy" className="transition hover:text-[#F4EFE8]">Privacy</a>
              <a href="/terms" className="transition hover:text-[#F4EFE8]">Terms</a>
              <a href="mailto:hello@stilloff.com" className="transition hover:text-[#F4EFE8]">Contact</a>
            </div>
          </div>
        </footer>

        {/* ── STICKY CTA ── */}
        <AnimatePresence>
          {showSticky && (
            <m.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}
              onClick={() => scrollTo("waitlist")} className="cta-glow fixed bottom-5 right-5 z-50 rounded-full bg-[#C4956A] px-5 py-2.5 text-xs font-semibold text-[#0E0D0B] shadow-lg transition hover:bg-[#D4A57A] md:bottom-7 md:left-7 md:right-auto">
              Join waitlist
            </m.button>
          )}
        </AnimatePresence>

        <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} onComplete={handleDemoComplete} onSubmit={handleSubmit} />

        <AnimatePresence>
          {toast && (
            <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.25 }}
              className="fixed bottom-16 left-1/2 z-[200] -translate-x-1/2 whitespace-nowrap rounded-full border border-white/[0.08] bg-[#1A1917]/95 px-6 py-3 text-sm text-[#F4EFE8] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              {toast}
            </m.div>
          )}
        </AnimatePresence>

      </main>
    </LazyMotion>
  );
}
