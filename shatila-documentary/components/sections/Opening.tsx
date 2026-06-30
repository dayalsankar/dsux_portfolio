"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal, Stagger, staggerItem } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { summary, story, context, problem } from "@/lib/content";

export function Summary() {
  return (
    <section id="summary" className="section">
      <div className="wrap">
        <SectionHeader
          index="00"
          kicker="Executive Summary"
          title="A factory's first digital operating system."
        />
        <div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-7">
            <Reveal>
              <p className="text-xl leading-relaxed" style={{ color: "var(--ink)" }}>
                {summary.overview}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="lead">
                <span className="amber font-medium">The challenge — </span>
                {summary.challenge}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lead">
                <span className="amber font-medium">The outcome — </span>
                {summary.outcome}
              </p>
            </Reveal>
          </div>
          <Stagger className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-[var(--radius)] border lg:grid-cols-1"
            gap={0.07}>
            {summary.facts.map((f) => (
              <motion.div
                key={f.k}
                variants={staggerItem}
                className="p-6"
                style={{ background: "var(--surface)", borderBottom: "1px solid var(--hair)" }}
              >
                <div
                  className="mb-1 text-[11px] uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-label)", color: "var(--amber)" }}
                >
                  {f.k}
                </div>
                <div className="text-base" style={{ color: "var(--ink)" }}>
                  {f.v}
                </div>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

export function Story() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section id="story" ref={ref} className="relative">
      <div className="grid lg:grid-cols-2">
        {/* title side — sticky only on desktop; scrolls normally on mobile */}
        <div className="relative flex items-center px-[6vw] pt-[12vh] pb-8 lg:sticky lg:top-0 lg:h-screen lg:px-0 lg:py-0">
          <div className="lg:pl-[8vw] lg:pr-12">
            <p className="eyebrow mb-5">The Story</p>
            <h2 className="h-section">
              How it started:
              <br />
              <span className="amber">Christmas was coming.</span>
            </h2>
            <motion.div
              className="mt-10 hidden h-[3px] w-40 origin-left lg:block"
              style={{ scaleX: scrollYProgress, background: "var(--amber)" }}
            />
          </div>
        </div>
        {/* scrolling beats */}
        <div className="px-[6vw] pb-[12vh] pt-[2vh] lg:py-[30vh]">
          {story.beats.map((b, i) => (
            <Reveal key={i} className="mb-[12vh] last:mb-0 lg:mb-[18vh]">
              <p
                className="mb-3 text-sm uppercase tracking-widest"
                style={{ fontFamily: "var(--font-label)", color: "var(--ink-faint)" }}
              >
                {String(i + 1).padStart(2, "0")} — {b.kicker}
              </p>
              <p
                className="font-display text-2xl leading-snug sm:text-3xl"
                style={{ fontFamily: "var(--font-display)", fontWeight: 320 }}
              >
                {b.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Context() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="context" className="section">
      <div className="wrap">
        <SectionHeader
          index="01"
          kicker="Business Context"
          title="A craft business, run on relationships."
          lead={context.lead}
        />
      </div>

      {/* full-bleed image band with parallax */}
      <div ref={ref} className="relative mt-16 h-[44vh] overflow-hidden sm:h-[60vh]">
        <motion.div
          style={{
            y,
            background:
              "var(--band-bg), radial-gradient(circle at 30% 30%, var(--amber-soft), transparent 50%)",
          }}
          className="absolute inset-0 -top-[10%] h-[120%]"
        />
        <div className="absolute inset-0 grid place-items-center">
          <p
            className="px-6 text-center"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(1.6rem, 4vw, 3.2rem)",
              lineHeight: 1.15,
              maxWidth: "20ch",
              color: "var(--band-ink)",
            }}
          >
            Every order is different. Every order is{" "}
            <span className="amber">personal.</span>
          </p>
        </div>
      </div>

      <div className="wrap mt-14">
        <Reveal>
          <p className="lead max-w-3xl">{context.body}</p>
        </Reveal>
        <Stagger className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {context.pillars.map((p) => (
            <motion.div key={p.k} variants={staggerItem} className="card p-6">
              <div
                className="mb-2 text-lg"
                style={{ fontFamily: "var(--font-display)", color: "var(--amber)" }}
              >
                {p.k}
              </div>
              <div className="text-sm" style={{ color: "var(--ink-dim)" }}>
                {p.v}
              </div>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function Problem() {
  return (
    <section id="problem" className="section">
      <div className="wrap">
        <SectionHeader
          index="02"
          kicker="Problem Statement"
          title={
            <>
              The problem was never one task.
              <br />
              It was <span className="amber">nobody knowing the state of anything.</span>
            </>
          }
        />
        <Reveal delay={0.1}>
          <p
            className="mt-10 max-w-3xl border-l-2 pl-6 text-xl leading-relaxed"
            style={{ borderColor: "var(--amber)", color: "var(--ink)" }}
          >
            {problem.statement}
          </p>
        </Reveal>

        <Stagger className="mt-16 grid gap-6 md:grid-cols-2" gap={0.1}>
          {problem.painPoints.map((p) => (
            <motion.div
              key={p.n}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              className="card group relative overflow-hidden p-8"
            >
              <div
                className="mb-4 text-5xl font-light"
                style={{ fontFamily: "var(--font-display)", color: "var(--hair-strong)" }}
              >
                {p.n}
              </div>
              <h3 className="mb-3 text-xl" style={{ color: "var(--ink)" }}>
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
                {p.text}
              </p>
              <div
                className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{ background: "var(--amber)" }}
              />
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
