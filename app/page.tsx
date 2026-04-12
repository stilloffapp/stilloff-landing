"use client";

import { motion } from "framer-motion";
import BreathingOrb from "./components/BreathingOrb";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const sectionFade = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <span className="inline-flex items-center rounded-full border border-[#3A342E] bg-[#181614] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#BEB4A7]">
        {children}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-[#2A2622]" />;
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#F3EEE6] px-6 py-3 text-sm font-semibold text-[#11100E] transition hover:scale-[1.01] hover:bg-white">
      {children}
    </button>
  );
}

function SecondaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#4A433D] bg-[#181614] px-6 py-3 text-sm font-semibold text-[#F3EEE6] transition hover:border-[#6E4637] hover:bg-[#1D1A17]">
      {children}
    </button>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[28px] border border-[#2F2A26] bg-[#181614] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.28)] ${className}`}
    >
      {children}
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-[#11100E] text-[#F3EEE6]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#6E4637]/10 blur-3xl" />
        <div className="absolute bottom-[-160px] right-[-120px] h-[340px] w-[340px] rounded-full bg-[#6E4637]/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative flex min-h-screen items-center py-16 md:py-24"
        >
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="max-w-2xl">
              <div className="mb-6">
                <span className="inline-flex items-center rounded-full border border-[#3A342E] bg-[#181614] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#BEB4A7]">
                  You picked up your phone 84 times today.
                </span>
              </div>

              <h1
                className="max-w-2xl text-5xl leading-[0.95] text-[#F3EEE6] md:text-7xl"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                When you can’t stop,
                <br />
                StillOff does.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#D0C6B8] md:text-xl">
                A real-time intervention that steps in before the spiral takes
                over.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <PrimaryButton>Try the 60-second lock</PrimaryButton>
                <SecondaryButton>See how it works</SecondaryButton>
              </div>

              <div className="mt-12 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  ["Interrupts the loop", "Before the scroll turns automatic"],
                  ["Built for real moments", "When willpower is already gone"],
                  ["Control you can feel", "Not content. Not motivation. Action."],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-[#2D2925] bg-[#151311] px-4 py-4"
                  >
                    <p className="text-sm font-semibold text-[#F3EEE6]">
                      {title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#BEB4A7]">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px]">
              <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_center,rgba(110,70,55,0.18),transparent_58%)] blur-2xl" />
              <Card className="relative overflow-hidden p-5 md:p-6">
                <div className="rounded-[30px] border border-[#2F2A26] bg-[#13110F] p-5 md:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[#9F9386]">
                        Live intervention
                      </p>
                      <p className="mt-2 text-base font-semibold text-[#F3EEE6]">
                        60-second lock
                      </p>
                    </div>
                    <div className="rounded-full border border-[#3A342E] bg-[#181614] px-3 py-1 text-xs text-[#C9BEAF]">
                      Active
                    </div>
                  </div>

                  <div className="flex justify-center py-6">
                    <BreathingOrb />
                  </div>

                  <div className="space-y-3 rounded-[24px] border border-[#2B2723] bg-[#171411] p-4">
                    <p className="text-sm text-[#AFA395]">Lock starting…</p>
                    <Divider />
                    <p className="text-lg leading-8 text-[#F3EEE6]">
                      You didn’t check. Nothing happened. That’s the point.
                    </p>
                    <p className="text-sm leading-7 text-[#BEB4A7]">
                      That felt different. That’s what control feels like.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.section>

        <Divider />

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionFade}
          className="py-24 md:py-32"
        >
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="max-w-lg">
              <SectionLabel>The problem</SectionLabel>
              <h2
                className="text-4xl leading-tight text-[#F3EEE6] md:text-5xl"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                The hardest moment is not knowing better.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {[
                [
                  "It starts before you notice",
                  "The reach happens before the thought. By the time you realize it, you’re already in.",
                ],
                [
                  "Motivation doesn’t show up on time",
                  "Quotes, streaks, and reminders only help when you still have distance from the urge.",
                ],
                [
                  "The scroll becomes the state",
                  "One check becomes twenty minutes. Then the day feels fractured, noisy, and gone.",
                ],
                [
                  "You do not need more content",
                  "You need something that interrupts the behavior while it’s happening.",
                ],
              ].map(([title, body]) => (
                <Card key={title} className="p-6">
                  <p className="text-lg font-semibold text-[#F3EEE6]">{title}</p>
                  <p className="mt-3 text-[15px] leading-7 text-[#BEB4A7]">
                    {body}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>

        <Divider />

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionFade}
          className="py-24 md:py-32"
        >
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="max-w-xl">
              <SectionLabel>How it works</SectionLabel>
              <h2
                className="text-4xl leading-tight text-[#F3EEE6] md:text-5xl"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                StillOff steps in before the spiral takes over.
              </h2>
              <p className="mt-6 text-lg leading-8 text-[#CFC4B6]">
                It does not ask you to become a different person in the moment.
                It creates enough friction, enough space, and enough calm to let
                your nervous system come back online.
              </p>
            </div>

            <div className="space-y-5">
              {[
                [
                  "01",
                  "The trigger happens",
                  "You reach for your phone the same way you always do.",
                ],
                [
                  "02",
                  "StillOff intercepts",
                  "A lock starts in real time before the loop can fully form.",
                ],
                [
                  "03",
                  "Your state changes",
                  "The nervous system settles. The urgency loses momentum.",
                ],
                [
                  "04",
                  "You regain choice",
                  "Not because you tried harder. Because the loop was broken.",
                ],
              ].map(([num, title, body]) => (
                <Card key={num} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#5A4034] bg-[#231A16] text-sm font-semibold text-[#E6D9CB]">
                      {num}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-[#F3EEE6]">
                        {title}
                      </p>
                      <p className="mt-2 text-[15px] leading-7 text-[#BEB4A7]">
                        {body}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>

        <Divider />

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionFade}
          className="py-24 md:py-32"
        >
          <div className="mx-auto max-w-5xl">
            <SectionLabel>What the demo shows</SectionLabel>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                [
                  "Lock starting…",
                  "The interruption begins immediately. No decision tree. No extra thinking.",
                ],
                [
                  "You didn’t check. Nothing happened. That’s the point.",
                  "The moment passes without the old pattern winning by default.",
                ],
                [
                  "That felt different. That’s what control feels like.",
                  "StillOff is not theory. It is a change in state you can feel.",
                ],
              ].map(([title, body]) => (
                <Card key={title} className="h-full p-6">
                  <p className="text-lg font-semibold leading-7 text-[#F3EEE6]">
                    {title}
                  </p>
                  <p className="mt-4 text-[15px] leading-7 text-[#BEB4A7]">
                    {body}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>

        <Divider />

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionFade}
          className="py-24 md:py-32"
        >
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <div className="max-w-xl">
              <SectionLabel>Why it feels different</SectionLabel>
              <h2
                className="text-4xl leading-tight text-[#F3EEE6] md:text-5xl"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Most products talk to you after the damage.
              </h2>
              <p className="mt-6 text-lg leading-8 text-[#CFC4B6]">
                StillOff is designed for the exact moment you lose the thread.
                It is not about productivity. It is about intervention.
              </p>
            </div>

            <Card className="overflow-hidden p-3">
              <div className="grid md:grid-cols-2">
                <div className="border-b border-[#2A2622] bg-[#151311] p-6 md:border-b-0 md:border-r">
                  <p className="text-sm uppercase tracking-[0.16em] text-[#9F9386]">
                    Most tools
                  </p>
                  <ul className="mt-5 space-y-4 text-[15px] leading-7 text-[#BEB4A7]">
                    <li>Track behavior after it happens</li>
                    <li>Depend on motivation</li>
                    <li>Add more content to consume</li>
                    <li>Help when you are already calm</li>
                  </ul>
                </div>
                <div className="bg-[#191613] p-6">
                  <p className="text-sm uppercase tracking-[0.16em] text-[#C9B29F]">
                    StillOff
                  </p>
                  <ul className="mt-5 space-y-4 text-[15px] leading-7 text-[#F3EEE6]">
                    <li>Intervenes while the loop is forming</li>
                    <li>Works when willpower is gone</li>
                    <li>Creates space instead of more noise</li>
                    <li>Returns control in the moment that matters</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </motion.section>

        <Divider />

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionFade}
          className="py-24 md:py-32"
        >
          <Card className="overflow-hidden">
            <div className="grid gap-8 p-8 md:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div className="max-w-2xl">
                <SectionLabel>Final CTA</SectionLabel>
                <h2
                  className="text-4xl leading-tight text-[#F3EEE6] md:text-6xl"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  When the urge hits, meet it with something stronger than
                  intention.
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-[#CFC4B6]">
                  StillOff is a real-time intervention for compulsive phone use.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
                <PrimaryButton>Try the 60-second lock</PrimaryButton>
                <SecondaryButton>See how it works</SecondaryButton>
              </div>
            </div>
          </Card>
        </motion.section>
      </div>
    </main>
  );
}