"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, ArrowRight, Sparkles } from "lucide-react";
import { Reveal, Stagger, staggerItem } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { principles, ia, flows, decisions } from "@/lib/content";

/* ---------------- Design principles ---------------- */
export function Principles() {
  return (
    <section id="principles" className="section">
      <div className="wrap">
        <SectionHeader
          index="08"
          kicker="Design Principles"
          title="Five rules that filtered every decision."
        />
        <div className="mt-14 space-y-px overflow-hidden rounded-[var(--radius)] border">
          {principles.map((p) => (
            <Reveal key={p.n}>
              <div
                className="group grid items-baseline gap-4 p-7 transition-colors sm:grid-cols-[80px_1fr_220px]"
                style={{ background: "var(--surface)", borderBottom: "1px solid var(--hair)" }}
              >
                <div
                  className="text-4xl font-light"
                  style={{ fontFamily: "var(--font-display)", color: "var(--amber)" }}
                >
                  {p.n}
                </div>
                <div>
                  <h3 className="text-xl" style={{ color: "var(--ink)" }}>{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
                    {p.text}
                  </p>
                </div>
                <div
                  className="text-xs uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-label)", color: "var(--ink-faint)" }}
                >
                  Traces to {p.traces}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Information architecture ---------------- */
export function IA() {
  return (
    <section id="ia" className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="wrap">
        <SectionHeader
          index="09"
          kicker="Information Architecture"
          title="Everything in its place."
          lead={ia.intro}
        />
        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" gap={0.06}>
          {ia.groups.map((g) => (
            <motion.div key={g.name} variants={staggerItem} className="card p-6">
              <h3
                className="mb-4 text-sm uppercase tracking-widest"
                style={{ fontFamily: "var(--font-label)", color: "var(--amber)" }}
              >
                {g.name}
              </h3>
              <ul className="space-y-2">
                {g.items.map((it) => (
                  <li key={it} className="text-sm" style={{ color: "var(--ink-dim)" }}>
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </Stagger>
        <Reveal delay={0.1}>
          <p
            className="mt-10 max-w-3xl border-l-2 pl-6 text-lg leading-relaxed"
            style={{ borderColor: "var(--amber)", color: "var(--ink-dim)" }}
          >
            {ia.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- User flows ---------------- */
export function Flows() {
  const [active, setActive] = useState(0);
  const f = flows[active];
  return (
    <section id="flows" className="section">
      <div className="wrap">
        <SectionHeader
          index="10"
          kicker="User Flows"
          title="Four flows that carry the operation."
        />
        <div className="mt-12 flex flex-wrap gap-2">
          {flows.map((fl, i) => (
            <button
              key={fl.name}
              onClick={() => setActive(i)}
              className="rounded-full border px-4 py-2 text-xs transition-colors"
              style={{
                borderColor: active === i ? "var(--amber)" : "var(--hair-strong)",
                background: active === i ? "var(--amber-soft)" : "transparent",
                color: active === i ? "var(--amber)" : "var(--ink-dim)",
                fontFamily: "var(--font-label)",
              }}
            >
              {fl.ai && <Sparkles size={12} className="mr-1 inline" style={{ color: "var(--ai)" }} />}
              {fl.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="mt-10"
          >
            <p className="lead mb-8 max-w-2xl">{f.blurb}</p>
            <div className="flex flex-wrap items-center gap-3">
              {f.steps.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <span
                    className="rounded-xl border px-4 py-3 text-sm"
                    style={{
                      borderColor: f.ai ? "var(--ai-soft)" : "var(--hair-strong)",
                      background: "var(--surface)",
                      color: "var(--ink)",
                    }}
                  >
                    <span className="mono-num mr-2 text-xs" style={{ color: f.ai ? "var(--ai)" : "var(--amber)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step}
                  </span>
                  {i < f.steps.length - 1 && (
                    <ArrowRight size={16} style={{ color: "var(--ink-faint)" }} />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ---------------- Major design decisions ---------------- */
export function Decisions() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="decisions" className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="wrap">
        <SectionHeader
          index="11"
          kicker="Major Design Decisions"
          title="Five decisions that shaped the build."
          lead="Each one with the challenge, the alternatives considered, why this path won, the impact, and the lesson. Expand to read the full reasoning."
        />
        <div className="mt-14 space-y-4">
          {decisions.map((d, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={d.n} delay={i * 0.03}>
                <div
                  className="card overflow-hidden"
                  style={{ borderColor: isOpen ? "var(--amber)" : "var(--hair)" }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center gap-5 p-6 text-left"
                  >
                    <span
                      className="text-3xl font-light"
                      style={{ fontFamily: "var(--font-display)", color: "var(--amber)" }}
                    >
                      {d.n}
                    </span>
                    <h3 className="flex-1 text-xl" style={{ color: "var(--ink)" }}>{d.title}</h3>
                    <Plus
                      size={20}
                      className="transition-transform"
                      style={{ transform: isOpen ? "rotate(45deg)" : "none", color: "var(--ink-dim)" }}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-6 px-6 pb-8 sm:grid-cols-2 lg:grid-cols-3">
                          {[
                            ["Challenge", d.challenge, "var(--ink-faint)"],
                            ["The decision", d.decision, "var(--amber)"],
                            ["Alternatives", d.alternatives, "var(--ink-faint)"],
                            ["Why this won", d.why, "var(--amber)"],
                            ["Impact", d.impact, "var(--green)"],
                            ["Lesson", d.lesson, "var(--ai)"],
                          ].map(([k, v, c]) => (
                            <div key={k as string}>
                              <div className="eyebrow mb-2" style={{ color: c as string }}>{k}</div>
                              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>{v}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
