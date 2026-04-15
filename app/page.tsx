"use client";

import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <main className="bg-[#11100E] text-[#F3EEE6] min-h-screen">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#11100E]/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-light tracking-tight">StillOff</div>

          <div className="hidden md:flex gap-8 text-sm text-[#BEB4A7]">
            <a href="#how" className="hover:text-[#F3EEE6] transition">How it works</a>
            <a href="#pricing" className="hover:text-[#F3EEE6] transition">Pricing</a>
          </div>

          <button className="cta-glow bg-[#F3EEE6] text-[#11100E] px-4 py-2 rounded-xl text-sm font-semibold">
            Get early access
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-36 pb-24 px-6 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-light leading-tight mb-6">
          When you can't stop,<br />StillOff does.
        </h1>

        <p className="text-[#BEB4A7] text-lg mb-10">
          A real-time intervention that steps in before the spiral takes over.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setOpen(true)}
            className="cta-glow bg-[#F3EEE6] text-[#11100E] px-6 py-4 rounded-2xl font-semibold"
          >
            Try the 60-second lock
          </button>

          <button className="cta-glow border border-[#F3EEE6]/50 text-[#F3EEE6] px-6 py-4 rounded-2xl font-semibold">
            Get early access
          </button>
        </div>
      </section>

      {/* THE LOOP */}
      <section id="how" className="px-6 py-20 max-w-2xl mx-auto text-center">
        <p className="text-lg text-[#BEB4A7] leading-relaxed">
          You know the feeling. One check becomes ten. Ten becomes an hour gone.
          StillOff breaks that cycle in real time — so the moment you reach for
          your phone, something finally pushes back.
        </p>
      </section>

      {/* DEMO MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="relative bg-[#1a1916] rounded-3xl p-8 max-w-sm w-full text-center">

            {/* Close — large, obvious */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-xl leading-none"
              aria-label="Close"
            >
              ×
            </button>

            {/* Orb — contained, no overlap */}
            <div className="w-20 h-20 mx-auto rounded-full bg-[#6E4637] animate-pulse mb-6 flex-shrink-0" />

            <p className="text-[#BEB4A7] text-sm mb-3">Lock starting…</p>

            <p className="mb-8 text-lg font-light">
              That felt different.<br />That's what control feels like.
            </p>

            <button className="cta-glow bg-[#F3EEE6] text-[#11100E] px-6 py-4 rounded-2xl font-semibold w-full">
              Get early access
            </button>

          </div>
        </div>
      )}

      {/* PRICING */}
      <section id="pricing" className="px-6 py-24 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl mb-12">Simple pricing</h2>

        <div className="grid md:grid-cols-3 gap-6 text-left">

          {/* FREE */}
          <div className="border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-xl font-light mb-3">Free</h3>
            <p className="text-[#BEB4A7] text-sm mb-4 leading-relaxed">
              A taste — intentionally incomplete. Just enough to feel the
              difference. You'll want the rest.
            </p>
            <ul className="text-sm text-[#BEB4A7] space-y-2 mb-8 flex-1">
              <li>3 interventions per day</li>
              <li>Basic 60-second lock</li>
              <li>One recovery prompt</li>
            </ul>
            <button className="cta-glow w-full py-3 border border-white/20 rounded-xl text-sm">
              Get early access
            </button>
          </div>

          {/* PLUS */}
          <div className="border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-xl font-light mb-3">Plus — $5.99</h3>
            <p className="text-[#BEB4A7] text-sm mb-4 leading-relaxed">
              The full StillOff system. Everything you need to break the cycle
              for good.
            </p>
            <ul className="text-sm text-[#BEB4A7] space-y-2 mb-8 flex-1">
              <li>Unlimited interventions</li>
              <li>Extended lock durations</li>
              <li>Therapist-curated prompts</li>
              <li>Full recovery modes</li>
            </ul>
            <button className="cta-glow w-full py-3 bg-[#F3EEE6] text-[#11100E] rounded-xl text-sm font-semibold">
              Get early access
            </button>
          </div>

          {/* PREMIUM */}
          <div className="border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-xl font-light mb-3">Premium — $9.99</h3>
            <p className="text-[#BEB4A7] text-sm mb-4 leading-relaxed">
              For when the spiral is strongest.
            </p>
            <ul className="text-sm text-[#BEB4A7] space-y-2 mb-8 flex-1">
              <li>Everything in Plus</li>
              <li>Letter to My Future Self</li>
              <li>Private community access</li>
              <li>Advanced recovery modes</li>
              <li>Therapist-curated prompt library</li>
            </ul>
            <button className="cta-glow w-full py-3 border border-white/20 rounded-xl text-sm">
              Get early access
            </button>
          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-3xl font-light mb-6">Take back control.</h2>

        <button className="cta-glow bg-[#F3EEE6] text-[#11100E] px-8 py-4 rounded-2xl font-semibold">
          Get early access
        </button>
      </section>

      {/* GLOW */}
      <style jsx global>{`
        .cta-glow {
          box-shadow: 0 0 24px rgba(243,238,230,0.30), 0 0 8px rgba(243,238,230,0.15);
          transition: box-shadow 0.3s;
        }
        .cta-glow:hover {
          box-shadow: 0 0 40px rgba(243,238,230,0.55), 0 0 14px rgba(243,238,230,0.25);
        }
      `}</style>

    </main>
  );
}
