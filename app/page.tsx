"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   BREATHING ORB
   ═══════════════════════════════════════════════════════════════════ */

function BreathingOrb({
  size = 220,
  intense = false,
}: {
  size?: number;
  intense?: boolean;
}) {
  const breathe = intense ? "4.2s" : "5.8s";
  const drift = intense ? "8s" : "11s";
  const shimmer = intense ? "5.5s" : "7.5s";

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes orb-breathe{0%,100%{transform:scale(0.94);opacity:0.84}50%{transform:scale(1.06);opacity:1}}
        @keyframes orb-core{0%,100%{transform:scale(0.92);opacity:0.9}50%{transform:scale(1.08);opacity:1}}
        @keyframes orb-drift{0%{transform:translate3d(0,0,0)}25%{transform:translate3d(2px,-3px,0)}50%{transform:translate3d(-2px,2px,0)}75%{transform:translate3d(3px,2px,0)}100%{transform:translate3d(0,0,0)}}
        @keyframes orb-shimmer{0%,100%{opacity:0.28;transform:rotate(0deg) scale(1)}50%{opacity:0.44;transform:rotate(180deg) scale(1.03)}}
        @keyframes orb-ring{0%,100%{transform:scale(0.98);opacity:0.32}50%{transform:scale(1.08);opacity:0.55}}
      `}</style>
      {/* glow */}
      <div
        style={{
          position: "absolute",
          inset: "-16%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(196,149,106,0.30) 0%,rgba(196,149,106,0.14) 30%,rgba(244,239,232,0.08) 52%,transparent 78%)",
          filter: "blur(28px)",
          animation: `orb-breathe ${breathe} ease-in-out infinite,orb-drift ${drift} ease-in-out infinite`,
          willChange: "transform,opacity",
          pointerEvents: "none",
        }}
      />
      {/* ring */}
      <div
        style={{
          position: "absolute",
          inset: "5%",
          borderRadius: "50%",
          border: "1px solid rgba(244,239,232,0.12)",
          boxShadow:
            "0 0 60px rgba(196,149,106,0.18),inset 0 0 30px rgba(244,239,232,0.04)",
          animation: `orb-ring ${breathe} ease-in-out infinite`,
          pointerEvents: "none",
        }}
      />
      {/* shimmer */}
      <div
        style={{
          position: "absolute",
          inset: "11%",
          borderRadius: "50%",
          background:
            "conic-gradient(from 0deg,rgba(244,239,232,0.03),rgba(196,149,106,0.20),rgba(244,239,232,0.06),rgba(196,149,106,0.14),rgba(244,239,232,0.03))",
          filter: "blur(10px)",
          mixBlendMode: "screen" as React.CSSProperties["mixBlendMode"],
          animation: `orb-shimmer ${shimmer} linear infinite`,
          pointerEvents: "none",
        }}
      />
      {/* body */}
      <div
        style={{
          position: "absolute",
          inset: "16%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 38%,rgba(244,239,232,0.22) 0%,rgba(244,239,232,0.10) 16%,rgba(196,149,106,0.22) 38%,rgba(83,53,42,0.68) 62%,rgba(14,13,11,0.92) 100%)",
          boxShadow:
            "0 0 90px rgba(196,149,106,0.16),inset 0 10px 24px rgba(244,239,232,0.08)",
          animation: `orb-breathe ${breathe} ease-in-out infinite,orb-drift ${drift} ease-in-out infinite reverse`,
          pointerEvents: "none",
        }}
      />
      {/* inner glow */}
      <div
        style={{
          position: "absolute",
          inset: "27%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 35%,rgba(244,239,232,0.26) 0%,rgba(244,239,232,0.12) 22%,rgba(196,149,106,0.10) 48%,transparent 100%)",
          filter: "blur(6px)",
          animation: `orb-core ${breathe} ease-in-out infinite`,
          pointerEvents: "none",
        }}
      />
      {/* core */}
      <div
        style={{
          position: "absolute",
          inset: "38%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(244,239,232,0.30) 0%,rgba(244,239,232,0.12) 48%,rgba(196,149,106,0.04) 100%)",
          filter: "blur(1px)",
          boxShadow: "0 0 26px rgba(244,239,232,0.14)",
          animation: `orb-core ${breathe} ease-in-out infinite reverse`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FADE-IN HELPER
   ═══════════════════════════════════════════════════════════════════ */

function FadeIn({
  children,
  delay = 0,
  y = 20,
  className = "",
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
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </m.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DEMO MODAL — The 60-second lock experience
   ═══════════════════════════════════════════════════════════════════ */

function DemoModal({
  open,
  onClose,
  onComplete,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<
    "intro" | "lock" | "breathing" | "ending" | "cta"
  >("intro");
  const [label, setLabel] = useState("Lock starting…");

  useEffect(() => {
    if (!open) {
      setPhase("intro");
      setLabel("Lock starting…");
      return;
    }
    document.body.style.overflow = "hidden";
    const breathMs = reduced ? 5000 : 60000;
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        setPhase("lock");
        setLabel("Lock starting…");
      }, 600)
    );
    timers.push(
      setTimeout(() => {
        setPhase("breathing");
        setLabel("Breathe in");
      }, 2000)
    );

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
    timers.push(
      setTimeout(() => {
        setPhase("cta");
        onComplete();
      }, 2000 + breathMs + 4200)
    );

    return () => {
      document.body.style.overflow = "";
      timers.forEach(clearTimeout);
    };
  }, [open, reduced, onComplete]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050504]/96 backdrop-blur-xl px-5"
        role="dialog"
        aria-modal="true"
        aria-label="60-second breathing lock demo"
      >
        <m.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0E0D0B] p-8 pt-16"
        >
          <button
            onClick={onClose}
            aria-label="Close demo"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-sm text-[#A69B8D] transition hover:border-white/25 hover:bg-white/[0.08] hover:text-[#F4EFE8]"
          >
            ✕
          </button>

          <div
            className="flex w-full flex-col items-center justify-center text-center"
            style={{ minHeight: 380 }}
          >
            <AnimatePresence mode="wait">
              {(phase === "intro" || phase === "lock") && (
                <m.div
                  key="intro"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-[#A69B8D]">
                    Lock starting…
                  </p>
                  <h2 className="font-serif text-4xl leading-tight tracking-[-0.04em] text-[#F4EFE8] sm:text-5xl">
                    For the next minute,
                    <br />
                    your phone becomes a reset space.
                  </h2>
                </m.div>
              )}

              {phase === "breathing" && (
                <m.div
                  key="breathing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center gap-0"
                >
                  <BreathingOrb size={180} intense />
                  <p className="mt-14 text-xs uppercase tracking-[0.28em] text-[#A69B8D]">
                    {label}
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-8 rounded-xl border border-white/10 px-6 py-2.5 text-xs font-medium text-[#A69B8D] transition hover:border-white/20 hover:text-[#F4EFE8]"
                  >
                    End session
                  </button>
                </m.div>
              )}

              {phase === "ending" && (
                <m.div
                  key="ending"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4"
                >
                  <p className="font-serif text-4xl tracking-[-0.04em] text-[#F4EFE8] sm:text-5xl">
                    You didn&rsquo;t check.
                  </p>
                  <p className="text-xl text-[#A69B8D]">Nothing happened.</p>
                  <p className="text-xl text-[#A69B8D]">
                    That&rsquo;s the point.
                  </p>
                </m.div>
              )}

              {phase === "cta" && (
                <m.div
                  key="cta"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <p className="font-serif text-4xl tracking-[-0.04em] text-[#F4EFE8] sm:text-5xl">
                    That felt different.
                  </p>
                  <p className="text-lg text-[#A69B8D]">
                    That&rsquo;s what control feels like.
                  </p>
                  <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                    <p className="mb-3 text-left text-xs uppercase tracking-[0.22em] text-[#A69B8D]">
                      Be first when StillOff launches
                    </p>
                    <form
                      onSubmit={onSubmit}
                      className="flex flex-col gap-3 sm:flex-row"
                    >
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="Email address"
                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0E0D0B] px-4 py-3 text-sm text-[#F4EFE8] outline-none placeholder:text-[#A69B8D]/50 focus:border-[#C4956A]/50"
                      />
                      <button
                        type="submit"
                        className="cta-glow rounded-xl bg-[#C4956A] px-5 py-3 text-sm font-semibold text-[#0E0D0B] transition hover:bg-[#D4A57A]"
                      >
                        Get early access
                      </button>
                    </form>
                    <p className="mt-3 text-left text-xs text-[#A69B8D]/60">
                      No newsletters. One email when it&rsquo;s ready.
                    </p>
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
  const [toast, setToast] = useState<string | null>(null);
  const waitlistRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      setDemoCompleted(
        sessionStorage.getItem("stilloff-demo-complete") === "true"
      );
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = y / max;
      const waitlistTop =
        waitlistRef.current?.getBoundingClientRect().top ?? Infinity;
      setShowSticky(
        progress > 0.15 && waitlistTop > window.innerHeight * 0.85
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleDemoComplete = useCallback(() => {
    setDemoCompleted(true);
    try {
      sessionStorage.setItem("stilloff-demo-complete", "true");
    } catch {
      /* noop */
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const email = (form.elements.namedItem("email") as HTMLInputElement)
        ?.value;
      try {
        await fetch("https://formspree.io/f/mzdklnwv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, _subject: "StillOff waitlist" }),
        });
        showToast("You're on the list. We'll be in touch.");
        form.reset();
      } catch {
        showToast("Something went wrong. Try again.");
      }
    },
    []
  );

  const openDemo = () => setTimeout(() => setDemoOpen(true), 120);
  const scrollToWaitlist = () =>
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });

  const heroHeadline = demoCompleted
    ? "Welcome back. Ready to lock it in?"
    : "When you can't stop, StillOff does.";

  return (
    <LazyMotion features={domAnimation} strict>
      <main className="min-h-screen bg-[#0E0D0B] text-[#F4EFE8] antialiased">
        {/* ── NAV ─────────────────────────────────────────── */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0E0D0B]/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <div className="font-serif text-2xl font-light tracking-[-0.04em] text-[#F4EFE8]">
              StillOff
            </div>
            <div className="hidden items-center gap-8 text-[13px] text-[#A69B8D] md:flex">
              <a
                href="#how-it-works"
                className="transition-colors hover:text-[#F4EFE8]"
              >
                How it works
              </a>
              <a
                href="#pricing"
                className="transition-colors hover:text-[#F4EFE8]"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="transition-colors hover:text-[#F4EFE8]"
              >
                FAQ
              </a>
            </div>
            <button
              onClick={scrollToWaitlist}
              className="cta-glow rounded-full bg-[#C4956A] px-5 py-2 text-[13px] font-semibold text-[#0E0D0B] transition hover:bg-[#D4A57A]"
            >
              Get early access
            </button>
          </div>
        </nav>

        {/* ── AMBIENT BG ── */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 20%, rgba(196,149,106,0.06), transparent 60%), radial-gradient(circle at 30% 80%, rgba(196,149,106,0.03), transparent 40%)",
          }}
        />

        {/* ── GRAIN ── */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[120vh]"
          aria-hidden="true"
          style={{
            opacity: 0.035,
            backgroundImage:
              "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22/></svg>')",
            mixBlendMode: "soft-light" as React.CSSProperties["mixBlendMode"],
          }}
        />

        {/* ════════════════════════════════════════════════════
            SECTION 1 — HERO
        ════════════════════════════════════════════════════ */}
        <section className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 pb-24 pt-28 text-center">
          {/* floating orb behind hero */}
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40"
            aria-hidden="true"
          >
            <BreathingOrb size={500} />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl">
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#C4956A]"
            >
              Your safe space
            </m.p>

            <m.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="font-serif leading-[0.92] tracking-[-0.05em] text-[#F4EFE8]"
              style={{ fontSize: "clamp(2.75rem, 7.5vw, 5.5rem)" }}
            >
              {heroHeadline}
            </m.h1>

            <m.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-[#A69B8D] sm:text-xl"
            >
              A 60-second breathing lock that interrupts the spiral the moment
              it starts. Not a blocker. Not a timer.{" "}
              <span className="text-[#F4EFE8]">A real-time intervention.</span>
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.32 }}
              className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            >
              <button
                onClick={openDemo}
                className="cta-glow rounded-full bg-[#C4956A] px-8 py-3.5 text-sm font-semibold text-[#0E0D0B] transition hover:bg-[#D4A57A]"
              >
                Try the 60-second lock
              </button>
              <button
                onClick={scrollToWaitlist}
                className="rounded-full border border-white/15 px-8 py-3.5 text-sm font-semibold text-[#F4EFE8] transition hover:border-white/25 hover:bg-white/[0.04]"
              >
                Get early access
              </button>
            </m.div>

            {/* social proof stats */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mx-auto mt-14 flex max-w-md items-center justify-center gap-8 sm:gap-12"
            >
              {[
                ["186×", "avg daily pickups"],
                ["4.3h", "lost to scrolling"],
                ["60s", "to break the loop"],
              ].map(([stat, label]) => (
                <div key={stat} className="text-center">
                  <p className="font-serif text-2xl tracking-[-0.03em] text-[#F4EFE8] sm:text-3xl">
                    {stat}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[#A69B8D]/70">
                    {label}
                  </p>
                </div>
              ))}
            </m.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 2 — PROBLEM RECOGNITION
        ════════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-3xl px-6 py-28 text-center">
          <FadeIn>
            <p className="font-serif text-3xl leading-[1.2] tracking-[-0.03em] text-[#F4EFE8] sm:text-4xl md:text-[2.75rem]">
              You didn&rsquo;t decide to spiral.
              <br />
              <span className="text-[#A69B8D]">
                It was already happening&nbsp;&mdash; the moment you picked it
                up.
              </span>
            </p>
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-[#A69B8D]/80">
              Other apps track your screen time or block apps on a schedule.
              StillOff steps in at the exact moment compulsive behavior starts
              &mdash; before the loop closes, before the next ten minutes
              disappear.
            </p>
          </FadeIn>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 3 — HOW IT WORKS
        ════════════════════════════════════════════════════ */}
        <section
          id="how-it-works"
          className="relative z-10 mx-auto max-w-5xl px-6 py-20"
        >
          <FadeIn className="mb-16 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C4956A]">
              How it works
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl tracking-[-0.04em] text-[#F4EFE8] sm:text-5xl">
              Three moments. One reset.
            </h2>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "The Pull",
                body: "You pick up your phone without thinking. StillOff recognizes the pattern.",
              },
              {
                step: "02",
                title: "The Lock",
                body: "Your screen becomes a 60-second guided breathing space. No apps. No escape. Just stillness.",
              },
              {
                step: "03",
                title: "The Soft Landing",
                body: "After the lock lifts, there\u2019s space. Enough distance to make a different choice.",
              },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.1}>
                <div className="group h-full rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] p-7 transition-colors hover:border-[#C4956A]/20 hover:bg-white/[0.03]">
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C4956A]">
                    {item.step}
                  </p>
                  <h3 className="mt-4 font-serif text-2xl tracking-[-0.03em] text-[#F4EFE8]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#A69B8D]">
                    {item.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 4 — LIVE DEMO CTA
        ════════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.06] bg-white/[0.02] px-8 py-16 sm:px-16">
              {/* ambient orb */}
              <div
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] opacity-30"
                aria-hidden="true"
              >
                <BreathingOrb size={300} />
              </div>

              <div className="relative z-10">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C4956A]">
                  Feel it for yourself
                </p>
                <h2 className="mx-auto mt-5 max-w-lg font-serif text-3xl tracking-[-0.04em] text-[#F4EFE8] sm:text-4xl">
                  Experience the 60-second lock right now.
                </h2>
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#A69B8D]">
                  No download needed. One minute of guided breathing, right here
                  in your browser.
                </p>
                <button
                  onClick={openDemo}
                  className="cta-glow mt-8 inline-flex rounded-full bg-[#C4956A] px-8 py-3.5 text-sm font-semibold text-[#0E0D0B] transition hover:bg-[#D4A57A]"
                >
                  Try the 60-second lock
                </button>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 5 — DIFFERENTIATION
        ════════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-5xl px-6 py-20">
          <FadeIn className="mb-14 text-center">
            <h2 className="mx-auto max-w-2xl font-serif text-3xl tracking-[-0.04em] text-[#F4EFE8] sm:text-4xl md:text-5xl">
              Other apps tell you to stop.
              <br />
              <span className="text-[#C4956A]">
                StillOff is built to stop&nbsp;you.
              </span>
            </h2>
          </FadeIn>

          <FadeIn className="overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02]">
            <div className="grid grid-cols-2 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="px-6 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[#A69B8D]/60">
                Other apps
              </div>
              <div className="border-l border-white/[0.06] px-6 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[#C4956A]">
                StillOff
              </div>
            </div>
            {(
              [
                ["Track your usage", "Interrupt the behavior"],
                ["Suggest breaks", "Intervene in the moment"],
                ["Rely on your discipline", "Remove the decision"],
                ["Easy to bypass", "Designed to hold"],
                ["Work when you're motivated", "Work when you're not"],
              ] as [string, string][]
            ).map(([left, right], i, arr) => (
              <div
                key={left}
                className={`grid grid-cols-2 ${i < arr.length - 1 ? "border-b border-white/[0.06]" : ""}`}
              >
                <div className="px-6 py-4 text-sm text-[#A69B8D]/70">
                  {left}
                </div>
                <div
                  className={`border-l border-white/[0.06] px-6 py-4 text-sm ${i === arr.length - 1 ? "font-semibold text-[#F4EFE8]" : "text-[#F4EFE8]/90"}`}
                >
                  {right}
                </div>
              </div>
            ))}
          </FadeIn>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 6 — PROOF / TESTIMONIALS
        ════════════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-5xl px-6 py-20">
          <FadeIn className="mb-14 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C4956A]">
              Early feedback
            </p>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.04em] text-[#F4EFE8] sm:text-5xl">
              Real words. No polish.
            </h2>
          </FadeIn>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                quote: "It stopped me before I spiraled.",
                person: "Early tester",
              },
              {
                quote:
                  "This is the first thing that actually interrupted me.",
                person: "Beta waitlist user",
              },
              {
                quote:
                  "I didn\u2019t realize how automatic it had become until StillOff showed me.",
                person: "Pilot user",
              },
            ].map((t, i) => (
              <FadeIn key={t.quote} delay={i * 0.08}>
                <div className="flex h-full flex-col justify-between rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] p-7">
                  <p className="font-serif text-xl leading-snug tracking-[-0.02em] text-[#F4EFE8]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="mt-6 text-xs uppercase tracking-[0.18em] text-[#A69B8D]/60">
                    {t.person}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 7 — PRICING
        ════════════════════════════════════════════════════ */}
        <section
          id="pricing"
          className="relative z-10 mx-auto max-w-5xl px-6 py-20"
        >
          <FadeIn>
            <div className="mb-12 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C4956A]">
                Pricing
              </p>
              <h2 className="mt-4 font-serif text-4xl tracking-[-0.04em] text-[#F4EFE8] sm:text-5xl">
                Start free. Go deeper.
              </h2>
              <p className="mt-3 text-sm text-[#A69B8D]">
                The free plan is real. Not a 7-day trick.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  name: "Free",
                  price: "$0",
                  cadence: "forever",
                  annual: null as string | null,
                  tagline: "A limited taste — incomplete on purpose.",
                  features: [
                    "3 resets per day",
                    "Guided breathing only",
                    "No Lock, no Soft Landing",
                    "No pattern learning",
                  ],
                  highlight: false,
                  cta: null as string | null,
                },
                {
                  name: "Plus",
                  price: "$5.99",
                  cadence: "/mo",
                  annual: "$47.99/yr",
                  tagline: "The full intervention.",
                  features: [
                    "Unlimited resets",
                    "The Lock — silence the spiral",
                    "Guided breathing Reset",
                    "15-min Soft Landing",
                    "Pattern learning",
                  ],
                  highlight: true,
                  cta: "Join waitlist",
                },
                {
                  name: "Premium",
                  price: "$9.99",
                  cadence: "/mo",
                  annual: "$79.99/yr",
                  tagline: "For when the spiral is strongest.",
                  features: [
                    "Everything in Plus",
                    "Letter to My Future Self",
                    "Therapist-curated prompts",
                    "Extended lock durations",
                    "Advanced recovery modes",
                  ],
                  highlight: false,
                  cta: "Join waitlist",
                },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className={`relative flex flex-col rounded-[1.5rem] border px-6 py-7 ${
                    tier.highlight
                      ? "border-[#C4956A]/30 bg-[#F4EFE8] text-[#0E0D0B]"
                      : "border-white/[0.06] bg-white/[0.02] text-[#F4EFE8]"
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#C4956A] px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0E0D0B]">
                      Most Popular
                    </div>
                  )}
                  <p
                    className={`text-xs font-medium uppercase tracking-[0.22em] ${tier.highlight ? "text-[#8B6E50]" : "text-[#C4956A]"}`}
                  >
                    {tier.name}
                  </p>
                  <div className="mt-3 flex items-end gap-1 font-serif">
                    <span className="text-4xl tracking-[-0.04em]">
                      {tier.price}
                    </span>
                    <span
                      className={`mb-1 text-sm ${tier.highlight ? "text-[#8B6E50]" : "text-[#A69B8D]"}`}
                    >
                      {tier.cadence}
                    </span>
                  </div>
                  {tier.annual && (
                    <p
                      className={`mt-1 text-xs ${tier.highlight ? "text-[#8B6E50]" : "text-[#A69B8D]"}`}
                    >
                      {tier.annual}
                    </p>
                  )}
                  <p
                    className={`mt-3 text-sm italic ${tier.highlight ? "text-[#8B6E50]" : "text-[#A69B8D]"}`}
                  >
                    {tier.tagline}
                  </p>
                  <div className="mt-5 flex-1 space-y-2.5">
                    {tier.features.map((f) => (
                      <div
                        key={f}
                        className={`flex items-start gap-2.5 text-sm ${tier.highlight ? "text-[#5A4234]" : "text-[#A69B8D]"}`}
                      >
                        <span className="mt-0.5 text-[10px] text-[#C4956A]">
                          ✦
                        </span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  {tier.cta && (
                    <button
                      onClick={scrollToWaitlist}
                      className={`mt-6 block w-full rounded-full py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] transition ${
                        tier.highlight
                          ? "bg-[#0E0D0B] text-[#F4EFE8] hover:bg-[#1A1917]"
                          : "border border-white/10 text-[#F4EFE8] hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      {tier.cta}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 8 — FAQ
        ════════════════════════════════════════════════════ */}
        <section
          id="faq"
          className="relative z-10 mx-auto max-w-3xl px-6 py-20"
        >
          <FadeIn className="mb-12 text-center">
            <h2 className="font-serif text-4xl tracking-[-0.04em] text-[#F4EFE8] sm:text-5xl">
              Questions
            </h2>
          </FadeIn>

          <div className="space-y-0">
            {[
              {
                q: "What makes StillOff different from screen time apps?",
                a: "Screen time apps track or block. StillOff intervenes — in the exact moment compulsive behavior starts. It doesn\u2019t rely on your willpower. It replaces the decision with a 60-second guided breathing lock.",
              },
              {
                q: "What is the 60-second breathing lock?",
                a: "When StillOff detects compulsive phone use, it locks your screen into a calm, guided breathing space. No apps, no notifications — just 60 seconds of stillness. Then a soft landing eases you back, so you don\u2019t fall right back into the loop.",
              },
              {
                q: "Can I bypass the lock?",
                a: "The lock is designed to hold. Unlike screen time limits you can tap through in one second, StillOff creates real friction. It\u2019s built for the moments when you can\u2019t trust yourself to stop.",
              },
              {
                q: "Is the free plan actually free?",
                a: "Yes. 3 resets per day, forever. No credit card. No trial that expires. It\u2019s limited on purpose — the full system (The Lock + Soft Landing + pattern learning) requires Plus.",
              },
              {
                q: "When does StillOff launch?",
                a: "We\u2019re in pre-launch. Join the waitlist and you\u2019ll receive one email when it\u2019s ready. No newsletters, no spam.",
              },
            ].map((item, i) => (
              <FadeIn key={item.q} delay={i * 0.05}>
                <details className="group border-b border-white/[0.06] py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-left text-base font-medium text-[#F4EFE8] transition-colors hover:text-[#C4956A] [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="ml-4 text-sm text-[#A69B8D] transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl pb-1 text-sm leading-relaxed text-[#A69B8D]">
                    {item.a}
                  </p>
                </details>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            SECTION 9 — WAITLIST / FINAL CTA
        ════════════════════════════════════════════════════ */}
        <section
          ref={waitlistRef}
          id="waitlist"
          className="relative z-10 mx-auto max-w-3xl px-6 py-28"
        >
          <FadeIn>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.06] bg-white/[0.02] p-8 text-center sm:p-14">
              {/* ambient */}
              <div
                className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 opacity-20"
                aria-hidden="true"
              >
                <BreathingOrb size={350} />
              </div>

              <div className="relative z-10">
                <p className="font-serif text-3xl tracking-[-0.04em] text-[#F4EFE8] sm:text-4xl">
                  You don&rsquo;t need more guilt about your phone.
                </p>
                <p className="mt-3 text-lg text-[#A69B8D]">
                  You need something that works when you can&rsquo;t.
                </p>

                <div className="mx-auto mt-10 max-w-md">
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3 sm:flex-row"
                  >
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Email address"
                      className="min-w-0 flex-1 rounded-full border border-white/10 bg-[#0E0D0B] px-5 py-3.5 text-sm text-[#F4EFE8] outline-none placeholder:text-[#A69B8D]/50 focus:border-[#C4956A]/50"
                    />
                    <button
                      type="submit"
                      className="cta-glow rounded-full bg-[#C4956A] px-6 py-3.5 text-sm font-semibold text-[#0E0D0B] transition hover:bg-[#D4A57A]"
                    >
                      Get early access
                    </button>
                  </form>
                  <p className="mt-4 text-xs text-[#A69B8D]/50">
                    No newsletters. One email when it&rsquo;s ready.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ── FOOTER ─────────────────────────────────────── */}
        <footer className="relative z-10 border-t border-white/[0.06] px-6 py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="font-serif text-lg text-[#F4EFE8]">
                StillOff
              </span>
              <span className="text-xs text-[#A69B8D]/40">
                © {new Date().getFullYear()}
              </span>
            </div>
            <div className="flex gap-6 text-[13px] text-[#A69B8D]/60">
              <a href="/privacy" className="transition hover:text-[#F4EFE8]">
                Privacy
              </a>
              <a href="/terms" className="transition hover:text-[#F4EFE8]">
                Terms
              </a>
              <a
                href="mailto:hello@stilloff.com"
                className="transition hover:text-[#F4EFE8]"
              >
                Contact
              </a>
            </div>
          </div>
        </footer>

        {/* ── STICKY CTA ── */}
        <AnimatePresence>
          {showSticky && (
            <m.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              onClick={scrollToWaitlist}
              className="cta-glow fixed bottom-5 right-5 z-50 rounded-full bg-[#C4956A] px-5 py-2.5 text-xs font-semibold text-[#0E0D0B] shadow-lg transition hover:bg-[#D4A57A] md:bottom-7 md:left-7 md:right-auto"
            >
              Join waitlist
            </m.button>
          )}
        </AnimatePresence>

        {/* ── DEMO MODAL ── */}
        <DemoModal
          open={demoOpen}
          onClose={() => setDemoOpen(false)}
          onComplete={handleDemoComplete}
          onSubmit={handleSubmit}
        />

        {/* ── TOAST ── */}
        <AnimatePresence>
          {toast && (
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25 }}
              className="fixed bottom-16 left-1/2 z-[200] -translate-x-1/2 whitespace-nowrap rounded-full border border-white/[0.08] bg-[#1A1917]/95 px-6 py-3 text-sm text-[#F4EFE8] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >
              {toast}
            </m.div>
          )}
        </AnimatePresence>
      </main>
    </LazyMotion>
  );
}
