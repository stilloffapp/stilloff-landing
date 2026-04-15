"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

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

/* ─── Breathing Orb ─────────────────────────────────────────────────────── */
function StillOrb({
  size = 280,
  intense = false,
}: {
  size?: number;
  intense?: boolean;
}) {
  const dur = intense ? "3.6s" : "5.8s";
  return (
    <div
      className="relative select-none pointer-events-none flex-shrink-0"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* outer atmospheric bloom */}
      <div
        style={{
          position: "absolute",
          inset: `-${size * 0.35}px`,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(110,70,55,0.30) 0%, rgba(196,149,106,0.10) 40%, transparent 72%)",
          filter: `blur(${size * 0.14}px)`,
          animation: `orb-breathe ${dur} ease-in-out infinite`,
        }}
      />
      {/* mid shell */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(110,70,55,0.60) 0%, rgba(80,46,35,0.48) 45%, rgba(38,22,16,0.22) 70%, transparent 100%)",
          animation: `orb-breathe ${dur} ease-in-out infinite`,
        }}
      />
      {/* luminous core */}
      <div
        style={{
          position: "absolute",
          inset: `${size * 0.22}px`,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(210,160,110,0.65) 0%, rgba(150,95,68,0.52) 38%, rgba(110,70,55,0.28) 70%, transparent 100%)",
          animation: `orb-core ${dur} ease-in-out infinite`,
        }}
      />
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [phase, setPhase] = useState<"idle" | "locking" | "done">("idle");

  function startDemo() {
    setDemoOpen(true);
    setPhase("locking");
    setTimeout(() => setPhase("done"), 4000);
  }
  function closeDemo() {
    setDemoOpen(false);
    setTimeout(() => setPhase("idle"), 400);
  }

  return (
    <main className="bg-[#0E0D0B] text-[#F4EFE8] min-h-screen overflow-x-hidden">

      {/* ══ NAV ══════════════════════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 inset-x-0 z-50 h-16 flex items-center"
        style={{
          background: "rgba(14,13,11,0.82)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(244,239,232,0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto w-full px-6 flex items-center justify-between">
          <span className="font-serif text-xl tracking-tight">StillOff</span>

          <div className="hidden md:flex gap-8 text-sm" style={{ color: "#7A7068" }}>
            <a href="#how" className="hover:text-[#F4EFE8] transition-colors duration-200">
              How it works
            </a>
            <a href="#pricing" className="hover:text-[#F4EFE8] transition-colors duration-200">
              Pricing
            </a>
          </div>

          <button
            onClick={() =>
              document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })
            }
            className="cta-glow text-sm font-medium px-4 py-2 rounded-xl"
            style={{ background: "#F4EFE8", color: "#0E0D0B" }}
          >
            Get early access
          </button>
        </div>
      </nav>

      {/* ══ HERO ═════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 overflow-hidden">
        {/* warm radial atmosphere */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 48%, rgba(110,70,55,0.20) 0%, rgba(196,149,106,0.05) 45%, transparent 72%)",
          }}
        />

        <motion.div
          className="relative flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Orb */}
          <div className="mb-10">
            <StillOrb size={200} />
          </div>

          <p
            className="text-xs tracking-[0.22em] uppercase mb-6"
            style={{ color: "#7A7068" }}
          >
            Real-time intervention
          </p>

          <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.06] mb-7 max-w-3xl">
            When you can't stop,
            <br />
            <span style={{ color: "#C4956A" }}>StillOff</span> does.
          </h1>

          <p
            className="text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color: "#7A7068" }}
          >
            A 60-second lock that interrupts the spiral before it takes you under.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16">
            <button
              onClick={startDemo}
              className="cta-glow font-medium px-7 py-4 rounded-2xl text-base w-full sm:w-auto"
              style={{ background: "#F4EFE8", color: "#0E0D0B" }}
            >
              Try the 60-second lock
            </button>
            <button
              onClick={() =>
                document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })
              }
              className="cta-glow font-medium px-7 py-4 rounded-2xl text-base w-full sm:w-auto border"
              style={{ borderColor: "rgba(244,239,232,0.18)", color: "#F4EFE8" }}
            >
              Get early access →
            </button>
          </div>

          {/* stats row */}
          <div
            className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-center justify-center"
            style={{ color: "#4A4640" }}
          >
            {[
              { value: "60s", label: "Reset lock" },
              { value: "Real-time", label: "Intervention" },
              { value: "iOS + Android", label: "Coming soon" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-6 sm:gap-12">
                {i > 0 && (
                  <div
                    className="hidden sm:block w-px h-7"
                    style={{ background: "rgba(244,239,232,0.07)" }}
                  />
                )}
                <div className="text-center">
                  <div className="text-2xl font-light" style={{ color: "#9A8E82" }}>
                    {s.value}
                  </div>
                  <div className="text-xs tracking-wider uppercase mt-1">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="scroll-cue" />
        </div>
      </section>

      {/* ══ THE SPIRAL ═══════════════════════════════════════════════════════ */}
      <section className="px-6 py-28 max-w-5xl mx-auto">
        <FadeUp>
          <p
            className="text-xs tracking-[0.22em] uppercase text-center mb-5"
            style={{ color: "#7A7068" }}
          >
            You already know
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-center mb-16 leading-tight">
            The spiral has a feel.
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            "One notification. Then forty-five minutes gone.",
            "You said five minutes. You meant it. It's been an hour.",
            "You know you should stop. Your thumb keeps scrolling.",
          ].map((text, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div
                className="rounded-2xl p-8 h-full"
                style={{
                  background: "#141210",
                  border: "1px solid rgba(244,239,232,0.06)",
                }}
              >
                <div className="mb-5 text-xl" style={{ color: "#3A2E28" }}>
                  ◎
                </div>
                <p
                  className="text-lg font-light leading-relaxed"
                  style={{ color: "#9A8E82" }}
                >
                  {text}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════════════════════════ */}
      <section id="how" className="px-6 py-28 max-w-5xl mx-auto">
        <FadeUp>
          <p
            className="text-xs tracking-[0.22em] uppercase text-center mb-5"
            style={{ color: "#7A7068" }}
          >
            The system
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-center mb-5 leading-tight">
            How it works
          </h2>
          <p
            className="text-center max-w-md mx-auto mb-16 text-base"
            style={{ color: "#7A7068" }}
          >
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
                className="rounded-2xl p-8 h-full flex flex-col"
                style={{
                  background: "#141210",
                  border: "1px solid rgba(244,239,232,0.06)",
                }}
              >
                <div
                  className="text-xs tracking-[0.18em] mb-6"
                  style={{ color: "#3A3630" }}
                >
                  {item.step}
                </div>
                <h3 className="font-serif text-2xl font-light mb-4">{item.title}</h3>
                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: "#7A7068" }}
                >
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
            style={{
              background: "#141210",
              border: "1px solid rgba(244,239,232,0.07)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 105%, rgba(110,70,55,0.22) 0%, transparent 65%)",
              }}
            />
            <div className="relative flex flex-col items-center">
              <div className="mb-8">
                <StillOrb size={88} />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-light mb-4">
                Feel it for yourself.
              </h2>
              <p className="mb-8 text-sm" style={{ color: "#7A7068" }}>
                This is what 60 seconds of control feels like.
              </p>
              <button
                onClick={startDemo}
                className="cta-glow font-medium px-8 py-4 rounded-2xl text-base"
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
          <p
            className="text-xs tracking-[0.22em] uppercase text-center mb-5"
            style={{ color: "#7A7068" }}
          >
            What's inside
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
                style={{
                  background: "#141210",
                  border: "1px solid rgba(244,239,232,0.06)",
                }}
              >
                <div className="text-xl mb-4" style={{ color: "#C4956A" }}>
                  {f.symbol}
                </div>
                <h3 className="text-sm font-medium mb-2">{f.label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#7A7068" }}>
                  {f.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══ PRICING ══════════════════════════════════════════════════════════ */}
      <section id="pricing" className="px-6 py-28 max-w-5xl mx-auto">
        <FadeUp>
          <p
            className="text-xs tracking-[0.22em] uppercase text-center mb-5"
            style={{ color: "#7A7068" }}
          >
            Pricing
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-center mb-5">
            Simple. Honest.
          </h2>
          <p className="text-center mb-16 text-base" style={{ color: "#7A7068" }}>
            Start free. Upgrade when you feel the difference.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-4 items-stretch">

          {/* FREE */}
          <FadeUp delay={0}>
            <div
              className="rounded-2xl p-7 flex flex-col h-full"
              style={{ background: "#141210", border: "1px solid rgba(244,239,232,0.06)" }}
            >
              <p className="text-xs tracking-widest uppercase mb-5" style={{ color: "#4A4640" }}>
                Free
              </p>
              <div className="text-3xl font-light mb-1">$0</div>
              <p className="text-sm mb-7 leading-relaxed flex-1" style={{ color: "#7A7068" }}>
                A taste — intentionally incomplete. Just enough to feel the difference.
              </p>
              <ul className="space-y-3 mb-8 text-sm" style={{ color: "#7A7068" }}>
                {["3 interventions per day", "Basic 60-second lock", "One recovery prompt"].map(
                  (f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span style={{ color: "#3A3630", marginTop: 2 }}>–</span>
                      {f}
                    </li>
                  )
                )}
              </ul>
              <button
                className="cta-glow w-full py-3 rounded-xl text-sm font-medium border"
                style={{ borderColor: "rgba(244,239,232,0.14)", color: "#F4EFE8" }}
              >
                Get early access
              </button>
            </div>
          </FadeUp>

          {/* PLUS — highlighted */}
          <FadeUp delay={0.1}>
            <div
              className="rounded-2xl p-7 flex flex-col h-full relative overflow-hidden"
              style={{
                background: "#1C1712",
                border: "1px solid rgba(196,149,106,0.28)",
              }}
            >
              {/* top accent line */}
              <div
                className="absolute top-0 inset-x-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(196,149,106,0.6), transparent)",
                }}
              />
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs tracking-widest uppercase" style={{ color: "#C4956A" }}>
                  Plus
                </p>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ background: "rgba(196,149,106,0.12)", color: "#C4956A" }}
                >
                  Most popular
                </span>
              </div>
              <div className="text-3xl font-light mb-1">
                $5.99
                <span className="text-base font-normal ml-1" style={{ color: "#4A4640" }}>
                  /mo
                </span>
              </div>
              <p className="text-sm mb-7 leading-relaxed flex-1" style={{ color: "#9A8E82" }}>
                The full StillOff system. Everything you need to break the cycle for good.
              </p>
              <ul className="space-y-3 mb-8 text-sm" style={{ color: "#9A8E82" }}>
                {[
                  "Unlimited interventions",
                  "Extended lock durations",
                  "Therapist-curated prompts",
                  "Full recovery modes",
                  "Detailed usage insights",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span style={{ color: "#C4956A", marginTop: 2 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className="cta-glow w-full py-3 rounded-xl text-sm font-medium"
                style={{ background: "#F4EFE8", color: "#0E0D0B" }}
              >
                Get early access
              </button>
            </div>
          </FadeUp>

          {/* PREMIUM */}
          <FadeUp delay={0.2}>
            <div
              className="rounded-2xl p-7 flex flex-col h-full"
              style={{ background: "#141210", border: "1px solid rgba(244,239,232,0.06)" }}
            >
              <p className="text-xs tracking-widest uppercase mb-5" style={{ color: "#4A4640" }}>
                Premium
              </p>
              <div className="text-3xl font-light mb-1">
                $9.99
                <span className="text-base font-normal ml-1" style={{ color: "#4A4640" }}>
                  /mo
                </span>
              </div>
              <p className="text-sm mb-7 leading-relaxed flex-1" style={{ color: "#7A7068" }}>
                For when the spiral is strongest.
              </p>
              <ul className="space-y-3 mb-8 text-sm" style={{ color: "#7A7068" }}>
                {[
                  "Everything in Plus",
                  "Letter to My Future Self",
                  "Private community access",
                  "Advanced recovery modes",
                  "Therapist prompt library",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span style={{ color: "#3A3630", marginTop: 2 }}>–</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className="cta-glow w-full py-3 rounded-xl text-sm font-medium border"
                style={{ borderColor: "rgba(244,239,232,0.14)", color: "#F4EFE8" }}
              >
                Get early access
              </button>
            </div>
          </FadeUp>

        </div>
      </section>

      {/* ══ FINAL CTA ════════════════════════════════════════════════════════ */}
      <section
        id="waitlist"
        className="relative px-6 py-32 text-center overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 65% at 50% 50%, rgba(110,70,55,0.18) 0%, transparent 70%)",
          }}
        />
        <FadeUp>
          <div className="relative max-w-2xl mx-auto">
            <p
              className="text-xs tracking-[0.22em] uppercase mb-6"
              style={{ color: "#7A7068" }}
            >
              Early access
            </p>
            <h2 className="font-serif text-5xl md:text-6xl font-light mb-6 leading-tight">
              Take back
              <br />
              control.
            </h2>
            <p className="text-lg mb-10" style={{ color: "#7A7068" }}>
              Join the waitlist. Be first when StillOff launches.
            </p>
            <button
              className="cta-glow font-medium px-10 py-4 rounded-2xl text-base"
              style={{ background: "#F4EFE8", color: "#0E0D0B" }}
            >
              Get early access
            </button>
          </div>
        </FadeUp>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer
        className="px-6 py-10"
        style={{ borderTop: "1px solid rgba(244,239,232,0.06)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-serif text-lg" style={{ color: "#4A4640" }}>
            StillOff
          </span>
          <div className="flex gap-6 text-xs" style={{ color: "#4A4640" }}>
            <a href="/privacy" className="hover:text-[#F4EFE8] transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-[#F4EFE8] transition-colors">
              Terms
            </a>
          </div>
          <p className="text-xs" style={{ color: "#3A3630" }}>
            © 2025 StillOff
          </p>
        </div>
      </footer>

      {/* ══ DEMO MODAL ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {demoOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: "rgba(0,0,0,0.90)", backdropFilter: "blur(14px)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeDemo();
            }}
          >
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl p-10 max-w-sm w-full text-center overflow-hidden"
              style={{
                background: "#161412",
                border: "1px solid rgba(244,239,232,0.10)",
              }}
            >
              {/* inner glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 50% at 50% 110%, rgba(110,70,55,0.28) 0%, transparent 65%)",
                }}
              />

              {/* close */}
              <button
                onClick={closeDemo}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full transition-colors text-lg"
                style={{ background: "rgba(244,239,232,0.07)", color: "#7A7068" }}
                aria-label="Close"
              >
                ×
              </button>

              <div className="relative flex flex-col items-center">
                <div className="mb-8">
                  <StillOrb size={100} intense={phase === "locking"} />
                </div>

                <AnimatePresence mode="wait">
                  {phase === "locking" && (
                    <motion.div
                      key="locking"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center"
                    >
                      <p
                        className="text-xs tracking-[0.18em] uppercase mb-4"
                        style={{ color: "#7A7068" }}
                      >
                        Lock active
                      </p>
                      <p className="font-serif text-3xl font-light mb-2">Breathe.</p>
                      <p className="text-sm" style={{ color: "#7A7068" }}>
                        60 seconds. Just this.
                      </p>
                    </motion.div>
                  )}

                  {phase === "done" && (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center"
                    >
                      <p
                        className="text-xs tracking-[0.18em] uppercase mb-4"
                        style={{ color: "#C4956A" }}
                      >
                        Reset complete
                      </p>
                      <p className="font-serif text-3xl font-light mb-3">
                        That felt different.
                      </p>
                      <p
                        className="text-sm mb-8 leading-relaxed"
                        style={{ color: "#7A7068" }}
                      >
                        That's what control feels like.
                      </p>
                      <button
                        className="cta-glow font-medium px-7 py-3 rounded-xl text-sm w-full"
                        style={{ background: "#F4EFE8", color: "#0E0D0B" }}
                      >
                        Get early access
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
