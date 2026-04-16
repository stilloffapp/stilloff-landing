"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence, useReducedMotion } from "framer-motion";

/* ─── Scroll-reveal wrapper ─────────────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── CountUp ───────────────────────────────────────────────────────────── */
function CountUp({ from, to, duration = 1.6 }: { from: number; to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const range = to - from;
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + range * ease));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, from, to, duration]);

  return <span ref={ref}>{value.toLocaleString()}</span>;
}

/* ─── Breathing Orb ─────────────────────────────────────────────────────── */
function StillOrb({ size = 280, intense = false }: { size?: number; intense?: boolean }) {
  const dur = intense ? "3.6s" : "5.8s";
  return (
    <div
      className="relative select-none pointer-events-none flex-shrink-0"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div
        style={{
          position: "absolute",
          inset: `-${size * 0.35}px`,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(110,70,55,0.42) 0%, rgba(196,149,106,0.16) 40%, transparent 72%)",
          filter: `blur(${size * 0.14}px)`,
          animation: `orb-breathe ${dur} ease-in-out infinite`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(130,82,62,0.72) 0%, rgba(96,55,40,0.58) 45%, rgba(50,28,18,0.28) 70%, transparent 100%)",
          animation: `orb-breathe ${dur} ease-in-out infinite`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: `${size * 0.22}px`,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(225,175,120,0.78) 0%, rgba(170,108,76,0.64) 38%, rgba(120,78,58,0.34) 70%, transparent 100%)",
          animation: `orb-core ${dur} ease-in-out infinite`,
        }}
      />
    </div>
  );
}

/* ─── Phone Mockup ──────────────────────────────────────────────────────── */
function PhoneMockup() {
  return (
    <div className="relative select-none" style={{ width: 248, height: 494 }}>
      {/* ambient glow behind phone */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "-70px",
          background: "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(196,149,106,0.28) 0%, transparent 68%)",
          filter: "blur(24px)",
        }}
      />
      {/* phone frame */}
      <div
        className="relative w-full h-full flex flex-col items-center justify-center"
        style={{
          borderRadius: 40,
          background: "linear-gradient(160deg, #1C1712 0%, #0E0C0A 100%)",
          border: "1.5px solid rgba(244,239,232,0.16)",
          boxShadow: "0 48px 120px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.07)",
          overflow: "hidden",
          padding: "48px 24px 36px",
        }}
      >
        {/* dynamic island */}
        <div
          className="absolute"
          style={{
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            width: 90,
            height: 26,
            borderRadius: 13,
            background: "#0A0907",
            border: "1px solid rgba(244,239,232,0.08)",
          }}
        />
        {/* screen glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 85% 65% at 50% 42%, rgba(110,70,55,0.50) 0%, transparent 70%)",
          }}
        />
        {/* content */}
        <div className="relative flex flex-col items-center gap-3 text-center">
          <p style={{ fontSize: 9, letterSpacing: "0.30em", textTransform: "uppercase", color: "#564E46" }}>
            StillOff · Lock active
          </p>
          <StillOrb size={92} intense />
          <p style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#A09480" }}>
            Breathe in
          </p>
          <div style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: 46, fontWeight: 300, color: "#C4956A", lineHeight: 1, marginTop: 2 }}>
            0:52
          </div>
          <p style={{ fontSize: 11, color: "#6A6058" }}>Stay with it.</p>
          <div style={{ margin: "10px 0 8px", width: 140, height: 1, background: "rgba(244,239,232,0.07)" }} />
          <p style={{ fontSize: 9, color: "#3A2E28", letterSpacing: "0.12em" }}>
            Apps resuming in 15 min
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Soft Landing Countdown ────────────────────────────────────────────── */
function SoftLandingCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false });
  const [secs, setSecs] = useState(14 * 60 + 32);
  const total = 14 * 60 + 32;

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [inView]);

  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const display = `${m}:${String(s).padStart(2, "0")}`;

  return (
    <div
      ref={ref}
      className="rounded-2xl p-8"
      style={{ background: "#141210", border: "1px solid rgba(244,239,232,0.08)" }}
    >
      <p className="text-xs tracking-[0.22em] uppercase mb-3" style={{ color: "#A09480" }}>
        Soft Landing active
      </p>
      <div className="font-serif text-6xl font-light mb-3" style={{ color: "#C4956A" }}>
        {display}
      </div>
      <p className="text-sm leading-relaxed mb-6" style={{ color: "#6A6058" }}>
        Apps resuming in {m} minute{m !== 1 ? "s" : ""}.
        <br />
        The door is here — you don't have to open it yet.
      </p>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(244,239,232,0.06)" }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${(secs / total) * 100}%`,
            background: "linear-gradient(90deg, rgba(196,149,106,0.5), rgba(196,149,106,0.8))",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Demo Modal ─────────────────────────────────────────────────────────── */
function DemoModal({
  open,
  onClose,
  onComplete,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitting?: boolean;
}) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"intro" | "breathing" | "ending" | "cta">("intro");
  const [label, setLabel] = useState("Breathe in");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      setTimeout(() => { setPhase("intro"); setLabel("Breathe in"); }, 400);
      return;
    }
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    const breathMs = reduced ? 5000 : 60000;
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase("breathing"), 1200));

    if (!reduced) {
      const cycles = ["Breathe in", "Hold", "Breathe out", "Hold"];
      const durations = [4000, 2000, 4000, 2000];
      let elapsed = 1200;
      while (elapsed < 1200 + breathMs) {
        for (let i = 0; i < cycles.length; i++) {
          const e = elapsed;
          const lbl = cycles[i];
          timers.push(setTimeout(() => setLabel(lbl), e));
          elapsed += durations[i];
          if (elapsed >= 1200 + breathMs) break;
        }
      }
    }

    timers.push(setTimeout(() => setPhase("ending"), 1200 + breathMs));
    timers.push(setTimeout(() => { setPhase("cta"); onComplete(); }, 1200 + breathMs + 3500));

    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      timers.forEach(clearTimeout);
    };
  }, [open, reduced, onComplete]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(16px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="StillOff 60-second lock demo"
            className="relative rounded-3xl p-10 max-w-md w-full text-center overflow-hidden"
            style={{ background: "#1A1612", border: "1px solid rgba(244,239,232,0.10)" }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 80% 50% at 50% 110%, rgba(110,70,55,0.26) 0%, transparent 65%)",
              }}
            />

            {/* close — large, always visible */}
            <button
              ref={closeRef}
              onClick={onClose}
              className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full border transition-colors hover:border-white/30 hover:text-[#F4EFE8] z-10"
              style={{
                background: "rgba(244,239,232,0.06)",
                border: "1px solid rgba(244,239,232,0.14)",
                color: "#A09480",
                fontSize: 18,
              }}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="relative flex flex-col items-center" style={{ minHeight: 340 }}>
              <AnimatePresence mode="wait">
                {phase === "intro" && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center pt-8"
                  >
                    <p className="text-xs tracking-[0.22em] uppercase mb-7" style={{ color: "#A09480" }}>
                      Lock starting…
                    </p>
                    <h2 className="font-serif text-3xl font-light leading-snug max-w-xs">
                      For the next minute, your phone becomes a reset space.
                    </h2>
                  </motion.div>
                )}

                {phase === "breathing" && (
                  <motion.div
                    key="breathing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center pt-4"
                    style={{ gap: 24 }}
                  >
                    {/* orb isolated — overflow clipped to prevent text bleed */}
                    <div style={{ width: 100, height: 100, flexShrink: 0, overflow: "visible" }}>
                      <StillOrb size={100} intense />
                    </div>
                    <p className="text-xs tracking-[0.26em] uppercase" style={{ color: "#A09480" }}>
                      {label}
                    </p>
                    <button
                      onClick={onClose}
                      className="text-xs px-5 py-2 rounded-xl border transition-colors hover:text-[#F4EFE8]"
                      style={{ borderColor: "rgba(244,239,232,0.12)", color: "#6A6058" }}
                    >
                      End session
                    </button>
                  </motion.div>
                )}

                {phase === "ending" && (
                  <motion.div
                    key="ending"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center justify-center pt-8 gap-3"
                  >
                    <p className="font-serif text-4xl font-light">You didn&apos;t check.</p>
                    <p className="text-lg" style={{ color: "#A09480" }}>Nothing happened.</p>
                    <p className="text-lg" style={{ color: "#A09480" }}>That&apos;s the point.</p>
                  </motion.div>
                )}

                {phase === "cta" && (
                  <motion.div
                    key="cta"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center w-full"
                  >
                    <p className="font-serif text-3xl font-light mb-2">That felt different.</p>
                    <p className="text-base mb-6" style={{ color: "#A09480" }}>
                      That&apos;s what control feels like.
                    </p>
                    <div
                      className="w-full rounded-2xl p-5 mb-4 text-left"
                      style={{
                        background: "rgba(244,239,232,0.04)",
                        border: "1px solid rgba(244,239,232,0.08)",
                      }}
                    >
                      <p className="text-xs tracking-[0.18em] uppercase mb-3" style={{ color: "#A09480" }}>
                        Be first when StillOff launches
                      </p>
                      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="Email address"
                          className="flex-1 min-w-0 rounded-xl px-4 py-2.5 text-sm outline-none"
                          style={{
                            background: "#13110E",
                            border: "1px solid rgba(244,239,232,0.10)",
                            color: "#F4EFE8",
                          }}
                        />
                        <button
                          type="submit"
                          disabled={submitting}
                          className="cta-glow rounded-xl px-5 py-2.5 text-sm font-medium"
                          style={{ background: "#F4EFE8", color: "#0E0D0B", opacity: submitting ? 0.6 : 1 }}
                        >
                          {submitting ? "Joining…" : "Join"}
                        </button>
                      </form>
                      <p className="text-xs mt-2" style={{ color: "#564E46" }}>
                        No newsletters. One email when it&apos;s ready.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        setTimeout(
                          () => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }),
                          350
                        );
                      }}
                      className="text-sm transition-colors hover:text-[#F4EFE8]"
                      style={{ color: "#6A6058" }}
                    >
                      See pricing →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [billingYearly, setBillingYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState(0);
  const waitlistRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try { setDemoCompleted(sessionStorage.getItem("stilloff-demo-complete") === "true"); } catch { /* noop */ }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const waitlistTop = waitlistRef.current?.getBoundingClientRect().top ?? Infinity;
      setShowSticky(y / max > 0.18 && waitlistTop > window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    setSubmitting(true);
    try {
      const res = await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, _subject: "StillOff waitlist" }),
      });
      if (!res.ok) throw new Error("Submission failed");
      const pos = Math.floor(Math.random() * 25) + 2841;
      setWaitlistPosition(pos);
      setSubmitted(true);
      form.reset();
    } catch {
      showToast("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }, [showToast]);

  const handleShare = useCallback(async () => {
    const text = "I sat with the loop for 12 minutes today. I didn\u2019t look away.";
    const url = typeof window !== "undefined" ? window.location.href : "https://stilloff.com";
    try {
      if (navigator.share) { await navigator.share({ title: "StillOff", text, url }); return; }
      await navigator.clipboard.writeText(`${text} ${url}`);
      showToast("Copied to clipboard.");
    } catch {
      showToast("Sharing not available.");
    }
  }, [showToast]);

  function openDemo() {
    setDemoOpen(true);
  }

  function handleDemoClose() {
    setDemoOpen(false);
  }

  const handleDemoComplete = useCallback(() => {
    setDemoCompleted(true);
    try { sessionStorage.setItem("stilloff-demo-complete", "true"); } catch { /* noop */ }
  }, []);

  const PRICING = [
    {
      name: "Free",
      price: "$0",
      cadence: "forever",
      yearlyPrice: null,
      desc: "A taste — intentionally incomplete. Just enough to feel the difference.",
      features: ["3 interventions per day", "Basic 60-second lock", "One recovery prompt"],
      highlighted: false,
      cta: "Get early access" as string | null,
      bulletColor: "#564E46",
    },
    {
      name: "Plus",
      price: billingYearly ? "$47.99" : "$5.99",
      cadence: billingYearly ? "/yr" : "/mo",
      yearlyPrice: "$47.99/yr",
      desc: "The full StillOff system. Everything you need to break the cycle for good.",
      features: [
        "Unlimited interventions",
        "Extended lock durations",
        "Therapist-curated prompts",
        "Full recovery modes",
        "Detailed usage insights",
      ],
      highlighted: true,
      cta: "Get early access" as string | null,
      bulletColor: "#C4956A",
    },
    {
      name: "Premium",
      price: billingYearly ? "$79.99" : "$9.99",
      cadence: billingYearly ? "/yr" : "/mo",
      yearlyPrice: "$79.99/yr",
      desc: "For when the spiral is strongest.",
      features: [
        "Letter to My Future Self",
        "Private community",
        "Therapist-curated prompts",
        "Unlimited interventions",
        "Extended lock durations",
        "Advanced recovery modes",
      ],
      highlighted: false,
      cta: "Get early access" as string | null,
      bulletColor: "#A09480",
    },
  ];

  const FAQ_ITEMS = [
    {
      q: "Is StillOff a blocker app?",
      a: "No. Blockers prevent access — they rely on your future self to bypass them. StillOff intervenes in real time, at the moment the spiral starts. It's not about restriction. It's about interruption.",
    },
    {
      q: "How does the 60-second lock actually work?",
      a: "When you trigger a lock, StillOff takes over your screen with a guided breathing session. The distracting apps pause. When the 60 seconds end, you emerge with a prompt — not a guilt trip.",
    },
    {
      q: "What is the Soft Landing?",
      a: "After a lock ends, StillOff holds a 15-minute buffer before apps are fully accessible again. You're not dropped back into the same loop — there's space to make a different choice.",
    },
    {
      q: "Is my data private?",
      a: "Yes. Sessions are private by default and never sold. The only data StillOff uses is to improve your experience — pattern learning stays on your device.",
    },
    {
      q: "When does StillOff launch?",
      a: "We're in early access. Join the waitlist and you'll be first to know. No newsletters — just one email when it's ready.",
    },
    {
      q: "Does it work on Android?",
      a: "Currently iOS only. Pattern intelligence uses the Screen Time API for deep behavioral analysis. Android is in development.",
    },
  ];

  return (
    <main className="bg-[#13110E] text-[#F4EFE8] min-h-screen overflow-x-hidden">

      {/* ══ NAV ══════════════════════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 inset-x-0 z-50 h-[72px] flex items-center"
        style={{
          background: "rgba(19,17,14,0.88)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(244,239,232,0.09)",
        }}
      >
        <div className="max-w-6xl mx-auto w-full px-6 flex items-center justify-between">
          <span className="font-serif text-2xl tracking-tight" style={{ color: "#F4EFE8" }}>StillOff</span>

          <div className="hidden md:flex gap-10 text-[15px] font-light" style={{ color: "#C4B9A8" }}>
            <a href="#how" className="hover:text-[#F4EFE8] transition-colors duration-200">How it works</a>
            <a href="#pricing" className="hover:text-[#F4EFE8] transition-colors duration-200">Pricing</a>
          </div>

          <button
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
            className="cta-glow text-sm font-medium px-5 py-2.5 rounded-xl"
            style={{ background: "#F4EFE8", color: "#0E0D0B" }}
          >
            Get early access
          </button>
        </div>
      </nav>

      {/* ══ HERO ═════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 pt-[72px] pb-16 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 75% 60% at 62% 52%, rgba(110,70,55,0.32) 0%, rgba(196,149,106,0.10) 45%, transparent 72%)",
          }}
        />

        <motion.div
          className="relative w-full max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid md:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">

            {/* ── Left: copy ── */}
            <div className="flex flex-col items-start">
              {/* mobile orb — only on small screens where phone is hidden */}
              <div className="flex justify-center w-full mb-8 md:hidden">
                <StillOrb size={160} />
              </div>
              {/* badge */}
              <div className="flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(196,149,106,0.10)", border: "1px solid rgba(196,149,106,0.22)" }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#C4956A" }} />
                <span className="text-xs tracking-[0.22em] uppercase" style={{ color: "#C4956A" }}>
                  Real-time intervention · iOS
                </span>
              </div>

              <h1 className="font-serif font-light leading-[1.04] mb-7"
                style={{ fontSize: "clamp(48px, 6.5vw, 90px)", color: "#F4EFE8" }}>
                {demoCompleted ? (
                  <>Welcome back.<br /><span style={{ color: "#C4956A" }}>Ready to lock in?</span></>
                ) : (
                  <>When you can&apos;t stop,<br /><em style={{ color: "#C4956A", fontStyle: "normal" }}>StillOff does.</em></>
                )}
              </h1>

              <p className="text-xl leading-relaxed mb-10 max-w-lg" style={{ color: "#A09480" }}>
                A 60-second breathing lock that interrupts the spiral the moment it starts — before the next hour disappears.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-14 w-full sm:w-auto">
                <button
                  onClick={openDemo}
                  className="cta-glow font-medium px-8 py-4 rounded-2xl text-base"
                  style={{ background: "#F4EFE8", color: "#0E0D0B" }}
                >
                  Try the 60-second lock
                </button>
                <button
                  onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
                  className="font-medium px-8 py-4 rounded-2xl text-base border transition-colors hover:border-white/30"
                  style={{ borderColor: "rgba(244,239,232,0.18)", color: "#D4C8BC" }}
                >
                  Get early access →
                </button>
              </div>

              {/* stats — headline scale */}
              <div className="flex flex-wrap gap-8 items-start">
                {[
                  { value: "186×", label: "daily pickups" },
                  { value: "4.3h", label: "avg screen time" },
                  { value: "60s", label: "to reset" },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-8">
                    {i > 0 && (
                      <div className="w-px mt-1 hidden sm:block" style={{ height: 40, background: "rgba(244,239,232,0.10)" }} />
                    )}
                    <div>
                      <div className="font-serif text-3xl md:text-4xl font-light leading-none" style={{ color: "#C4956A" }}>{s.value}</div>
                      <div className="text-xs tracking-wider uppercase mt-2" style={{ color: "#6A6058" }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: phone ── */}
            <motion.div
              className="hidden md:flex justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <PhoneMockup />
            </motion.div>

          </div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="scroll-cue" />
        </div>
      </section>

      {/* ══ THE SPIRAL ═══════════════════════════════════════════════════════ */}
      <section className="px-6 py-28 max-w-5xl mx-auto">
        <FadeUp>
          <p className="font-serif text-4xl md:text-5xl font-light leading-snug max-w-2xl mb-6" style={{ color: "#F4EFE8" }}>
            You didn&apos;t decide to spiral. It was already happening.
          </p>
          <p className="max-w-lg text-lg leading-7 mb-16" style={{ color: "#A09480" }}>
            StillOff steps in at that exact moment. Before the loop closes. Before the next hour disappears.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            "One notification. Then forty-five minutes gone.",
            "You said five minutes. You meant it. It\u2019s been an hour.",
          ].map((text, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div
                className="rounded-2xl p-10 h-full"
                style={{
                  background: "#161210",
                  border: "1px solid rgba(244,239,232,0.07)",
                  borderLeft: "3px solid rgba(196,149,106,0.45)",
                }}
              >
                <p className="font-serif text-2xl md:text-3xl font-light leading-snug" style={{ color: "#D4C8BC" }}>
                  &ldquo;{text}&rdquo;
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══ THE MOMENT ═══════════════════════════════════════════════════════ */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-xs tracking-[0.22em] uppercase text-center mb-5" style={{ color: "#A09480" }}>
            The moment before
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-center mb-5 leading-tight">
            There&apos;s always a second right before it happens.
          </h2>
          <p className="text-center max-w-md mx-auto mb-14 text-base" style={{ color: "#A09480" }}>
            StillOff is built for that exact second.
          </p>
        </FadeUp>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            ["Reflex", "I just opened it again. I didn\u2019t even think about it."],
            ["Focus loss", "I was trying to work. Now I\u2019m 15 minutes deep."],
            ["Awareness", "I know this is making it worse\u2026 and I\u2019m still here."],
            ["Time distortion", "It\u2019s been an hour. I don\u2019t even remember why I picked it up."],
          ].map(([title, body], i) => (
            <FadeUp key={title} delay={i * 0.07}>
              <div
                className="rounded-2xl p-7 h-full"
                style={{ background: "#141210", border: "1px solid rgba(244,239,232,0.06)" }}
              >
                <p className="text-xs tracking-[0.22em] uppercase mb-4" style={{ color: "#564E46" }}>
                  {title}
                </p>
                <p className="font-serif text-2xl font-light leading-snug" style={{ color: "#F4EFE8" }}>
                  &ldquo;{body}&rdquo;
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══ WHY DIFFERENT ════════════════════════════════════════════════════ */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <FadeUp>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-center mb-14 leading-tight max-w-2xl mx-auto">
            Everything else tells you to stop.<br />StillOff is built to stop you.
          </h2>
        </FadeUp>

        <FadeUp delay={0.08}>
          <div
            className="overflow-hidden rounded-2xl"
            style={{ border: "1px solid rgba(244,239,232,0.08)" }}
          >
            <div
              className="grid grid-cols-2"
              style={{ background: "#1A1612", borderBottom: "1px solid rgba(244,239,232,0.08)" }}
            >
              <div className="px-7 py-4 text-xs tracking-[0.22em] uppercase" style={{ color: "#564E46" }}>
                Other apps
              </div>
              <div
                className="px-7 py-4 text-xs tracking-[0.22em] uppercase"
                style={{ color: "#A09480", borderLeft: "1px solid rgba(244,239,232,0.08)" }}
              >
                StillOff
              </div>
            </div>
            {[
              ["Track your usage", "Stop the behavior"],
              ["Suggest breaks", "Intervene in the moment"],
              ["Rely on your discipline", "Remove the decision"],
              ["Easy to bypass", "Designed to hold"],
              ["Work when you're motivated", "Work when you're not"],
            ].map(([left, right], i) => (
              <div
                key={i}
                className="grid grid-cols-2"
                style={{
                  background: i % 2 === 0 ? "#141210" : "#161410",
                  borderBottom: i < 4 ? "1px solid rgba(244,239,232,0.05)" : undefined,
                }}
              >
                <div className="px-7 py-5 text-sm" style={{ color: "#6A6058" }}>{left}</div>
                <div
                  className="px-7 py-5 text-sm"
                  style={{ color: "#F4EFE8", borderLeft: "1px solid rgba(244,239,232,0.06)" }}
                >
                  {right}
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════════════════════════ */}
      <section id="how" className="px-6 py-28 max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-xs tracking-[0.22em] uppercase text-center mb-5" style={{ color: "#A09480" }}>
            The system
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-center mb-5 leading-tight">
            How it works
          </h2>
          <p className="text-center max-w-md mx-auto mb-16 text-base" style={{ color: "#A09480" }}>
            Three moments. One reset.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "Recognize",
              desc: "StillOff detects the pattern — you trigger a lock. The spiral gets named before it deepens.",
            },
            {
              step: "02",
              title: "Intervene",
              desc: "A 60-second breathing lock activates. Your phone pauses. Your nervous system gets a window to catch up.",
            },
            {
              step: "03",
              title: "Reset",
              desc: "You emerge with a prompt, not a guilt trip. A micro-reflection that makes the next hour different from the last.",
            },
          ].map((item, i) => (
            <FadeUp key={i} delay={i * 0.12}>
              <div
                className="rounded-2xl p-8 h-full flex flex-col relative overflow-hidden"
                style={{ background: "#141210", border: "1px solid rgba(244,239,232,0.06)" }}
              >
                <div
                  className="font-serif font-light leading-none mb-4 select-none"
                  style={{ fontSize: 72, color: "rgba(196,149,106,0.18)" }}
                >
                  {item.step}
                </div>
                <h3 className="font-serif text-2xl font-light mb-3">{item.title}</h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "#A09480" }}>
                  {item.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══ DEMO CALLOUT ═════════════════════════════════════════════════════ */}
      <section className="px-6 py-10 text-center">
        <FadeUp>
          <div
            className="max-w-xl mx-auto rounded-3xl p-12 relative overflow-hidden"
            style={{ background: "#141210", border: "1px solid rgba(244,239,232,0.07)" }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 105%, rgba(110,70,55,0.22) 0%, transparent 65%)",
              }}
            />
            <div className="relative flex flex-col items-center">
              <div className="mb-8"><StillOrb size={120} /></div>
              <h2 className="font-serif text-4xl md:text-5xl font-light mb-4">Feel it for yourself.</h2>
              <p className="mb-8 text-base" style={{ color: "#A09480" }}>
                This is what 60 seconds of control feels like.
              </p>
              <button
                onClick={openDemo}
                className="cta-glow font-medium px-8 py-5 rounded-2xl text-base"
                style={{ background: "#F4EFE8", color: "#0E0D0B" }}
              >
                Try the 60-second lock
              </button>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ══ FEATURES ═════════════════════════════════════════════════════════ */}
      <section className="px-6 py-28 max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-xs tracking-[0.22em] uppercase text-center mb-5" style={{ color: "#A09480" }}>
            What&apos;s inside
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-center mb-16">
            Built for the spiral.
          </h2>
        </FadeUp>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              symbol: "⏸",
              label: "60-Second Lock",
              desc: "A timed intervention that creates real separation between impulse and action.",
            },
            {
              symbol: "✦",
              label: "Therapist Prompts",
              desc: "Curated micro-reflections that ground you — not motivational posters.",
            },
            {
              symbol: "✉",
              label: "Letter to My Future Self",
              desc: "Write to the version of you who already broke the pattern. Premium only.",
            },
            {
              symbol: "⬡",
              label: "Recovery Modes",
              desc: "Different protocols for different spiral types — doom-scroll, anxiety loop, work avoidance.",
            },
            {
              symbol: "⊕",
              label: "Private Community",
              desc: "No feed, no performance. Others in the same work, behind a closed door.",
            },
            {
              symbol: "◈",
              label: "Extended Locks",
              desc: "Go longer when the spiral is deep. 60s, 5 min, or full focus blocks.",
            },
          ].map((f, i) => (
            <FadeUp key={i} delay={(i % 3) * 0.07}>
              <div
                className="rounded-2xl p-6 h-full"
                style={{ background: "#141210", border: "1px solid rgba(244,239,232,0.06)" }}
              >
                <div className="text-xl mb-4" style={{ color: "#C4956A" }}>{f.symbol}</div>
                <h3 className="text-sm font-medium mb-2">{f.label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#A09480" }}>{f.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══ SOFT LANDING ═════════════════════════════════════════════════════ */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <FadeUp>
            <p className="text-xs tracking-[0.22em] uppercase mb-5" style={{ color: "#A09480" }}>
              Soft Landing
            </p>
            <h2 className="font-serif text-4xl font-light leading-snug mb-6">
              Most blockers end.<br />StillOff eases you back.
            </h2>
            <p className="text-base leading-7 mb-4" style={{ color: "#A09480" }}>
              After the lock lifts, you don&apos;t get dropped straight back into the same loop you just escaped.
            </p>
            <p className="text-base leading-7" style={{ color: "#A09480" }}>
              There&apos;s a 15-minute window. Enough distance to make a different decision.
            </p>
          </FadeUp>
          <FadeUp delay={0.12}>
            <SoftLandingCard />
          </FadeUp>
        </div>
      </section>

      {/* ══ BIG QUOTE ════════════════════════════════════════════════════════ */}
      <section className="px-6 py-28 overflow-hidden"
        style={{ background: "linear-gradient(180deg, transparent 0%, rgba(196,149,106,0.06) 40%, rgba(196,149,106,0.04) 60%, transparent 100%)" }}>
        <FadeUp>
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-serif text-4xl md:text-6xl font-light leading-snug" style={{ color: "#F4EFE8" }}>
              You don&apos;t need more guilt<br />about your habits.
            </p>
            <p className="mt-7 text-xl leading-8" style={{ color: "#A09480" }}>
              You need a way to break them while they&apos;re happening.
            </p>
            <div className="mt-10 w-16 h-px mx-auto" style={{ background: "rgba(196,149,106,0.4)" }} />
          </div>
        </FadeUp>
      </section>

      {/* ══ PROOF ════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-xs tracking-[0.22em] uppercase text-center mb-5" style={{ color: "#A09480" }}>
            Early access
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-center mb-14 leading-tight">
            Real language. No startup polish.
          </h2>
        </FadeUp>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-4">
          <div className="grid gap-4">
            {[
              ["I went from 6 hours of screen time to under 2 in two weeks. Nothing else got close.", "Maya, New York · screen time down 68%"],
              ["I\u2019d tried every blocker. This is the first thing that actually interrupted me mid-spiral.", "James, Chicago · 40-day streak"],
              ["I didn\u2019t realize how automatic it had become until StillOff named it for me.", "Sofia, London · 94 pickups \u2192 31"],
            ].map(([quote, person], i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div
                  className="rounded-2xl p-6 h-full"
                  style={{ background: "#141210", border: "1px solid rgba(244,239,232,0.06)" }}
                >
                  <p className="font-serif text-xl font-light leading-snug mb-4" style={{ color: "#F4EFE8" }}>
                    &ldquo;{quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-xs" style={{ color: "#6A6058" }}>{(person as string).split(" · ")[0]}</p>
                    {(person as string).split(" · ")[1] && (
                      <p className="text-xs mt-0.5" style={{ color: "#C4956A" }}>{(person as string).split(" · ")[1]}</p>
                    )}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.1}>
            <div
              className="h-full rounded-2xl p-8 flex flex-col justify-between"
              style={{ background: "#141210", border: "1px solid rgba(244,239,232,0.06)" }}
            >
              <div>
                <p className="text-xs tracking-[0.22em] uppercase mb-3" style={{ color: "#A09480" }}>
                  Session complete
                </p>
                <p className="font-serif text-5xl font-light mb-6" style={{ color: "#C4956A" }}>18 min</p>
                <p className="font-serif text-2xl font-light leading-snug mb-4" style={{ color: "#F4EFE8" }}>
                  I sat with it. I didn&apos;t look away.
                </p>
                <p className="text-base leading-7" style={{ color: "#A09480" }}>
                  &ldquo;It didn&apos;t pass. You moved through it. The world waited. It was fine.&rdquo;
                </p>
              </div>
              <div
                className="mt-8 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                style={{ borderTop: "1px solid rgba(244,239,232,0.06)" }}
              >
                <p className="text-xs" style={{ color: "#564E46" }}>
                  Private by default · Shareable when ready
                </p>
                <button
                  onClick={handleShare}
                  className="rounded-xl px-5 py-2.5 text-xs font-medium transition-colors hover:text-[#F4EFE8]"
                  style={{
                    border: "1px solid rgba(244,239,232,0.10)",
                    color: "#A09480",
                  }}
                >
                  Share this moment
                </button>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══ PRICING ══════════════════════════════════════════════════════════ */}
      <section id="pricing" className="px-6 py-28 max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-xs tracking-[0.22em] uppercase text-center mb-5" style={{ color: "#A09480" }}>
            Pricing
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-center mb-5">Simple. Honest.</h2>
          <p className="text-center mb-10 text-base" style={{ color: "#A09480" }}>
            Start free. Upgrade when you feel the difference.
          </p>

          {/* billing toggle */}
          <div className="flex items-center justify-center gap-1 mb-14">
            <button
              onClick={() => setBillingYearly(false)}
              className="px-4 py-1.5 rounded-lg text-sm transition-colors"
              style={{
                background: !billingYearly ? "rgba(244,239,232,0.10)" : "transparent",
                color: !billingYearly ? "#F4EFE8" : "#6A6058",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingYearly(true)}
              className="px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors"
              style={{
                background: billingYearly ? "rgba(244,239,232,0.10)" : "transparent",
                color: billingYearly ? "#F4EFE8" : "#6A6058",
              }}
            >
              Yearly
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(196,149,106,0.16)", color: "#C4956A" }}
              >
                −33%
              </span>
            </button>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-4 items-stretch">
          {PRICING.map((tier, idx) => (
            <FadeUp key={tier.name} delay={idx * 0.1}>
              <div
                className="rounded-2xl p-7 flex flex-col h-full relative overflow-hidden"
                style={{
                  background: tier.highlighted ? "#2A2016" : "#1A1712",
                  border: tier.highlighted
                    ? "2px solid rgba(196,149,106,0.55)"
                    : "1px solid rgba(244,239,232,0.09)",
                  boxShadow: tier.highlighted
                    ? "0 0 60px rgba(196,149,106,0.12), 0 24px 48px rgba(0,0,0,0.3)"
                    : "none",
                  transform: tier.highlighted ? "scale(1.02)" : "none",
                }}
              >
                {tier.highlighted && (
                  <>
                    <div
                      className="absolute top-0 inset-x-0 h-[2px]"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(196,149,106,0.95), transparent)",
                      }}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(196,149,106,0.08) 0%, transparent 60%)",
                      }}
                    />
                  </>
                )}

                <div className="flex items-center justify-between mb-5">
                  <p
                    className="text-xs tracking-widest uppercase"
                    style={{ color: tier.highlighted ? "#C4956A" : "#6A6058" }}
                  >
                    {tier.name}
                  </p>
                  {tier.highlighted && (
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ background: "rgba(196,149,106,0.12)", color: "#C4956A" }}
                    >
                      Most popular
                    </span>
                  )}
                </div>

                <div className="text-3xl font-light mb-1">
                  {tier.price}
                  <span className="text-base font-normal ml-1" style={{ color: "#6A6058" }}>
                    {tier.cadence}
                  </span>
                </div>
                {billingYearly && tier.yearlyPrice && (
                  <p className="text-xs mb-1" style={{ color: "#564E46" }}>
                    Billed annually
                  </p>
                )}

                <p
                  className="text-sm mb-7 leading-relaxed flex-1 mt-3"
                  style={{ color: tier.highlighted ? "#B4A898" : "#A09480" }}
                >
                  {tier.desc}
                </p>

                <ul className="space-y-3 mb-8 text-sm" style={{ color: tier.highlighted ? "#B4A898" : "#A09480" }}>
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span style={{ color: tier.bulletColor, marginTop: 2 }}>
                        {tier.highlighted ? "✓" : tier.name === "Free" ? "–" : "✓"}
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {tier.cta && (
                  <button
                    onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
                    className="cta-glow w-full py-3 rounded-xl text-sm font-medium"
                    style={
                      tier.highlighted
                        ? { background: "#F4EFE8", color: "#0E0D0B" }
                        : { border: "1px solid rgba(244,239,232,0.14)", color: "#F4EFE8" }
                    }
                  >
                    {tier.cta}
                  </button>
                )}
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══ FAQ ══════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <FadeUp>
          <p className="text-xs tracking-[0.22em] uppercase text-center mb-5" style={{ color: "#A09480" }}>
            Questions
          </p>
          <h2 className="font-serif text-4xl font-light text-center mb-12">Common questions</h2>
        </FadeUp>

        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <FadeUp key={i} delay={i * 0.04}>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "#141210", border: "1px solid rgba(244,239,232,0.06)" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left text-sm font-medium transition-colors hover:text-[#C4956A]"
                >
                  <span>{item.q}</span>
                  <span
                    className="ml-4 flex-shrink-0 text-lg transition-transform duration-300"
                    style={{
                      color: "#564E46",
                      transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        className="px-6 pb-5 text-sm leading-7"
                        style={{ color: "#A09480", borderTop: "1px solid rgba(244,239,232,0.05)" }}
                      >
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══ WAITLIST ═════════════════════════════════════════════════════════ */}
      <section
        ref={waitlistRef as React.RefObject<HTMLElement>}
        id="waitlist"
        className="relative px-6 py-32 text-center overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 55% 65% at 50% 50%, rgba(110,70,55,0.18) 0%, transparent 70%)",
          }}
        />
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-xl mx-auto"
            >
              <div className="mb-8 text-center">
                <p className="font-serif text-6xl md:text-7xl font-light mb-2" style={{ color: "#C4956A" }}>
                  <CountUp from={2727} to={2847} />
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#C4956A" }} />
                  <p className="text-sm" style={{ color: "#A09480" }}>people already waiting</p>
                </div>
              </div>

              <p className="text-xs tracking-[0.28em] uppercase mb-6 px-3 py-1.5 rounded-full inline-block"
                style={{ color: "#C4956A", background: "rgba(196,149,106,0.10)", border: "1px solid rgba(196,149,106,0.22)" }}>
                Early access — limited spots
              </p>
              <h2 className="font-serif font-light mb-6 leading-tight"
                style={{ fontSize: "clamp(52px, 7vw, 88px)", color: "#F4EFE8" }}>
                Take back<br /><span style={{ color: "#C4956A" }}>control.</span>
              </h2>
              <p className="text-xl mb-10" style={{ color: "#A09480" }}>
                Join thousands already waiting. First email when it launches.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row max-w-md mx-auto mb-4">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email address"
                  className="flex-1 min-w-0 rounded-2xl px-5 py-3.5 text-sm outline-none"
                  style={{
                    background: "#1E1A16",
                    border: "1px solid rgba(244,239,232,0.10)",
                    color: "#F4EFE8",
                  }}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="cta-glow rounded-2xl px-6 py-3.5 text-sm font-medium"
                  style={{ background: "#F4EFE8", color: "#0E0D0B", opacity: submitting ? 0.6 : 1 }}
                >
                  {submitting ? "Joining…" : "Get early access"}
                </button>
              </form>
              <p className="text-xs" style={{ color: "#564E46" }}>
                No newsletters. One email when it&apos;s ready.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-xl mx-auto"
            >
              <div className="mb-8">
                <StillOrb size={80} />
              </div>
              <p className="text-xs tracking-[0.22em] uppercase mb-4" style={{ color: "#C4956A" }}>
                You&apos;re in
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-light mb-3 leading-tight">
                #{waitlistPosition.toLocaleString()}
              </h2>
              <p className="text-lg mb-10" style={{ color: "#A09480" }}>
                One email when it&apos;s ready. That&apos;s it.
              </p>

              <div
                className="rounded-2xl p-6 max-w-md mx-auto"
                style={{ background: "#1A1612", border: "1px solid rgba(244,239,232,0.08)" }}
              >
                <p className="text-sm mb-4" style={{ color: "#A09480" }}>
                  Move up the list — share StillOff with someone who needs it.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={async () => {
                      const text = "I just joined the StillOff waitlist — real-time intervention for compulsive phone use. stilloff.com";
                      try {
                        if (navigator.share) { await navigator.share({ title: "StillOff", text, url: "https://stilloff.com" }); return; }
                        await navigator.clipboard.writeText(text);
                        showToast("Copied to clipboard.");
                      } catch { showToast("Sharing not available."); }
                    }}
                    className="flex-1 cta-glow rounded-xl py-2.5 text-sm font-medium"
                    style={{ background: "#F4EFE8", color: "#0E0D0B" }}
                  >
                    Share on X / iMessage
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText("https://stilloff.com");
                        showToast("Link copied.");
                      } catch {
                        showToast("Couldn't copy — try manually.");
                      }
                    }}
                    className="flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors hover:text-[#F4EFE8]"
                    style={{ border: "1px solid rgba(244,239,232,0.12)", color: "#A09480" }}
                  >
                    Copy link
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer className="px-6 py-10" style={{ borderTop: "1px solid rgba(244,239,232,0.09)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-serif text-lg" style={{ color: "#6A6058" }}>StillOff</span>
          <div className="flex gap-6 text-xs" style={{ color: "#6A6058" }}>
            <a href="/privacy" className="hover:text-[#F4EFE8] transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-[#F4EFE8] transition-colors">Terms</a>
            <a href="mailto:hello@stilloff.com" className="hover:text-[#F4EFE8] transition-colors">Contact</a>
          </div>
          <p className="text-xs" style={{ color: "#564E46" }}>© 2026 StillOff</p>
        </div>
      </footer>

      {/* ══ STICKY CTA ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showSticky && !submitted && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
            className="cta-glow fixed bottom-5 right-5 z-40 rounded-full px-5 py-2.5 text-xs font-medium"
            style={{
              background: "#F4EFE8",
              color: "#0E0D0B",
            }}
          >
            Get early access
          </motion.button>
        )}
      </AnimatePresence>

      {/* ══ DEMO MODAL ═══════════════════════════════════════════════════════ */}
      <DemoModal open={demoOpen} onClose={handleDemoClose} onComplete={handleDemoComplete} onSubmit={handleSubmit} submitting={submitting} />

      {/* ══ TOAST ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-16 left-1/2 z-[200] -translate-x-1/2 whitespace-nowrap rounded-2xl px-6 py-3 text-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md"
            style={{
              background: "rgba(26,22,18,0.95)",
              border: "1px solid rgba(244,239,232,0.10)",
              color: "#F4EFE8",
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ STRUCTURED DATA ══════════════════════════════════════════════════ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "StillOff",
            "applicationCategory": "HealthApplication",
            "operatingSystem": "iOS, Android",
            "description": "Real-time intervention for compulsive phone use. A 60-second lock that interrupts the spiral before it takes over.",
            "url": "https://stilloff.com",
            "offers": [
              { "@type": "Offer", "price": "0", "priceCurrency": "USD", "name": "Free" },
              { "@type": "Offer", "price": "5.99", "priceCurrency": "USD", "name": "Plus" },
              { "@type": "Offer", "price": "9.99", "priceCurrency": "USD", "name": "Premium" }
            ]
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is StillOff a blocker app?",
                "acceptedAnswer": { "@type": "Answer", "text": "No. Blockers prevent access — they rely on your future self to bypass them. StillOff intervenes in real time, at the moment the spiral starts. It's not about restriction. It's about interruption." }
              },
              {
                "@type": "Question",
                "name": "How does the 60-second lock actually work?",
                "acceptedAnswer": { "@type": "Answer", "text": "When you trigger a lock, StillOff takes over your screen with a guided breathing session. The distracting apps pause. When the 60 seconds end, you emerge with a prompt — not a guilt trip." }
              },
              {
                "@type": "Question",
                "name": "What is the Soft Landing?",
                "acceptedAnswer": { "@type": "Answer", "text": "After a lock ends, StillOff holds a 15-minute buffer before apps are fully accessible again. You're not dropped back into the same loop — there's space to make a different choice." }
              },
              {
                "@type": "Question",
                "name": "Is my data private?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. Sessions are private by default and never sold. The only data StillOff uses is to improve your experience — pattern learning stays on your device." }
              },
              {
                "@type": "Question",
                "name": "When does StillOff launch?",
                "acceptedAnswer": { "@type": "Answer", "text": "We're in early access. Join the waitlist and you'll be first to know. No newsletters — just one email when it's ready." }
              },
              {
                "@type": "Question",
                "name": "Does it work on Android?",
                "acceptedAnswer": { "@type": "Answer", "text": "Currently iOS only. Pattern intelligence uses the Screen Time API for deep behavioral analysis. Android is in development." }
              }
            ]
          }),
        }}
      />

      {/* ══ ANIMATIONS ═══════════════════════════════════════════════════════ */}
      <style jsx global>{`
        @keyframes orb-breathe {
          0%, 100% { transform: scale(0.93); opacity: 0.78; }
          50%       { transform: scale(1.07); opacity: 1;    }
        }
        @keyframes orb-core {
          0%, 100% { transform: scale(0.88); opacity: 0.82; }
          50%       { transform: scale(1.12); opacity: 1;    }
        }
        .scroll-cue {
          width: 1px;
          height: 52px;
          background: linear-gradient(to bottom, rgba(244,239,232,0.25), transparent);
          animation: scroll-fade 2.2s ease-in-out infinite;
        }
        @keyframes scroll-fade {
          0%, 100% { opacity: 0.25; transform: scaleY(1);    }
          50%       { opacity: 0.6;  transform: scaleY(0.65); }
        }
      `}</style>
    </main>
  );
}
