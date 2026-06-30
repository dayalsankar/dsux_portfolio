"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Quote } from "lucide-react";
import { Reveal, Stagger, staggerItem } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Counter } from "@/components/ui/Counter";
import { asset } from "@/lib/config";
import {
  research,
  competitors,
  personas,
  journey,
  insights,
} from "@/lib/content";

/* shared: a draggable horizontal strip of captioned images */
function ImageStrip({
  items,
  width = 760,
}: {
  items: { src: string; cap: string }[];
  width?: number;
}) {
  return (
    <div className="-mx-[4vw] mt-10 flex snap-x gap-6 overflow-x-auto px-[4vw] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((it) => (
        <figure
          key={it.src}
          className="card shrink-0 snap-start overflow-hidden"
          style={{ width: `min(86vw, ${width}px)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(it.src)}
            alt={it.cap}
            loading="lazy"
            className="block h-auto w-full"
          />
          <figcaption
            className="px-5 py-4 text-xs"
            style={{ color: "var(--ink-faint)", fontFamily: "var(--font-label)", letterSpacing: "0.04em" }}
          >
            {it.cap}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* ---------------- Research ---------------- */
export function Research() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="research" className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="wrap">
        <SectionHeader
          index="03"
          kicker="Research"
          title="Ten methods. Seven findings. Every decision traceable."
          lead={research.lead}
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          {/* methods — expandable */}
          <div className="space-y-3">
            {research.methods.map((mth, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={mth.tag} delay={i * 0.04}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="card w-full p-5 text-left transition-colors"
                    style={{ borderColor: isOpen ? "var(--amber)" : "var(--hair)" }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="mono-num text-sm"
                        style={{ color: "var(--amber)" }}
                      >
                        {mth.tag}
                      </span>
                      <span className="flex-1 text-lg">{mth.name}</span>
                      <ChevronDown
                        size={18}
                        className="transition-transform"
                        style={{ transform: isOpen ? "rotate(180deg)" : "none", color: "var(--ink-dim)" }}
                      />
                    </div>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="pt-4 text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
                            {mth.detail}
                          </p>
                          <p
                            className="mt-3 text-[11px] uppercase tracking-widest"
                            style={{ fontFamily: "var(--font-label)", color: "var(--ink-faint)" }}
                          >
                            Sources · {mth.sources}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </Reveal>
              );
            })}
          </div>

          {/* findings */}
          <div>
            <Reveal>
              <p className="eyebrow mb-6">Seven findings, one direction</p>
            </Reveal>
            <Stagger className="space-y-4" gap={0.06}>
              {research.findings.map((f) => (
                <motion.div key={f.id} variants={staggerItem} className="flex gap-4">
                  <span
                    className="mono-num shrink-0 text-sm"
                    style={{ color: "var(--amber)" }}
                  >
                    {f.id}
                  </span>
                  <div>
                    <h4 className="text-base font-medium" style={{ color: "var(--ink)" }}>
                      {f.title}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
                      {f.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </div>

        {/* synthesis boards */}
        <Reveal>
          <ImageStrip
            items={[
              { src: "/image/10 methods. 7 findings. Every decision traceable..png", cap: "User-interview insights board · synthesised findings" },
              { src: "/image/Tractor Affinity mapping workshop.png", cap: "Affinity mapping · clustering findings into themes" },
            ]}
          />
        </Reveal>

        {/* voices */}
        <Reveal className="mt-12">
          <p className="eyebrow mb-6">In their words</p>
        </Reveal>
        <Stagger className="grid gap-6 md:grid-cols-3" gap={0.1}>
          {research.quotes.map((q) => (
            <motion.figure key={q} variants={staggerItem} className="card p-7">
              <Quote size={20} style={{ color: "var(--amber)" }} />
              <blockquote
                className="mt-4 text-base leading-snug"
                style={{ fontFamily: "var(--font-display)", fontWeight: 320, color: "var(--ink)" }}
              >
                “{q}”
              </blockquote>
            </motion.figure>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------------- Competitive matrix ---------------- */
function scoreColor(s: string) {
  if (s === "✓") return "var(--green)";
  if (s === "✗") return "var(--red)";
  return "var(--ink-faint)";
}
export function Competitive() {
  const [filter, setFilter] = useState<number | null>(null);
  return (
    <section id="competitive" className="section">
      <div className="wrap">
        <SectionHeader
          index="04"
          kicker="Competitive Analysis"
          title="The gap was real — and it was about clarity."
          lead="John Deere, myKubota, Mahindra and New Holland, scored against what a connected-tractor owner actually needs. Tap a capability to spotlight it."
        />

        <div className="mt-12 flex flex-wrap gap-2">
          {competitors.capabilities.map((c, i) => (
            <button
              key={c}
              onClick={() => setFilter(filter === i ? null : i)}
              className="rounded-full border px-4 py-2 text-xs transition-colors"
              style={{
                borderColor: filter === i ? "var(--amber)" : "var(--hair-strong)",
                background: filter === i ? "var(--amber-soft)" : "transparent",
                color: filter === i ? "var(--amber)" : "var(--ink-dim)",
                fontFamily: "var(--font-label)",
                letterSpacing: "0.06em",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <Reveal className="mt-8">
          <div className="card overflow-x-auto">
            <table className="w-full border-collapse text-sm" style={{ minWidth: 720 }}>
              <thead>
                <tr>
                  <th className="p-4 text-left font-medium" style={{ color: "var(--ink-faint)" }}>
                    Capability
                  </th>
                  {competitors.tools.map((t) => (
                    <th
                      key={t.name}
                      className="p-4 text-center text-xs font-medium"
                      style={{
                        color: t.us ? "var(--amber)" : "var(--ink-dim)",
                        fontFamily: "var(--font-label)",
                      }}
                    >
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {competitors.capabilities.map((cap, ri) => {
                  const dim = filter !== null && filter !== ri;
                  return (
                    <tr
                      key={cap}
                      style={{
                        borderTop: "1px solid var(--hair)",
                        opacity: dim ? 0.28 : 1,
                        background:
                          filter === ri ? "var(--amber-soft)" : "transparent",
                        transition: "opacity .3s, background .3s",
                      }}
                    >
                      <td className="p-4" style={{ color: "var(--ink)" }}>
                        {cap}
                      </td>
                      {competitors.tools.map((t) => (
                        <td
                          key={t.name}
                          className="p-4 text-center text-lg font-semibold"
                          style={{
                            color: t.us ? "var(--amber)" : scoreColor(t.scores[ri]),
                          }}
                        >
                          {t.scores[ri]}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Reveal>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs" style={{ color: "var(--ink-faint)" }}>
          <span><b style={{ color: "var(--green)" }}>✓</b> Fully supported</span>
          <span><b>~</b> Partially supported</span>
          <span><b style={{ color: "var(--red)" }}>✗</b> Not supported</span>
          <span><b>·</b> Not documented</span>
        </div>

        <Reveal delay={0.1}>
          <p
            className="mt-10 max-w-3xl border-l-2 pl-6 text-lg leading-relaxed"
            style={{ borderColor: "var(--amber)", color: "var(--ink-dim)" }}
          >
            {competitors.takeaway}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Users: personas + explorer ---------------- */
export function Stakeholders() {
  const [active, setActive] = useState(0);
  const p = personas[active];
  return (
    <section id="stakeholders" className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="wrap">
        <SectionHeader
          index="05"
          kicker="The Users"
          title="Three people. Three relationships with the same machine."
          lead="One anxious owner, one efficient fleet manager, one speed-driven technician — the incompatible mental models the single architecture had to serve."
        />

        {/* persona cards with portraits */}
        <Stagger className="mt-14 grid gap-6 md:grid-cols-3" gap={0.1}>
          {personas.map((person, i) => (
            <motion.button
              key={person.name}
              variants={staggerItem}
              onClick={() => setActive(i)}
              whileHover={{ y: -6 }}
              className="card flex flex-col overflow-hidden text-left transition-colors"
              style={{ borderColor: active === i ? "var(--amber)" : "var(--hair)" }}
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(person.photo)}
                  alt={`${person.name} — ${person.role}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <span
                  className="absolute left-0 top-0 h-full w-[4px]"
                  style={{ background: person.accent }}
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="text-lg font-medium" style={{ color: "var(--ink)" }}>{person.name}</div>
                <div className="text-xs" style={{ color: "var(--ink-faint)" }}>{person.role}</div>
                <blockquote
                  className="mt-4 text-base leading-snug"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 320, color: "var(--ink-dim)" }}
                >
                  “{person.quote}”
                </blockquote>
                <span
                  className="mt-auto pt-5 text-[11px] uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-label)", color: person.accent }}
                >
                  {person.segment}
                </span>
              </div>
            </motion.button>
          ))}
        </Stagger>

        {/* explorer — goals / pains / tasks for the selected persona */}
        <div className="card mt-8 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="grid gap-8 md:grid-cols-3"
            >
              <div>
                <div className="eyebrow mb-3" style={{ color: "var(--green)" }}>Goals</div>
                <ul className="space-y-2">
                  {p.goals.map((g) => (
                    <li key={g} className="text-sm" style={{ color: "var(--ink-dim)" }}>{g}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="eyebrow mb-3" style={{ color: "var(--red)" }}>Pain points</div>
                <ul className="space-y-2">
                  {p.pains.map((g) => (
                    <li key={g} className="text-sm" style={{ color: "var(--ink-dim)" }}>{g}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="eyebrow mb-3">Key tasks</div>
                <p className="text-sm" style={{ color: "var(--ink-dim)" }}>{p.tasks}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Journey: maps + emotional scrubber ---------------- */
export function Journey() {
  const [step, setStep] = useState(0);
  const s = journey.stages[step];
  return (
    <section id="journey" className="section">
      <div className="wrap">
        <SectionHeader
          index="06"
          kicker="Journey Mapping"
          title="The emotional arc behind every interaction."
          lead={journey.intro}
        />

        {/* current vs future journey maps */}
        <Reveal>
          <ImageStrip items={journey.images} width={980} />
        </Reveal>

        {/* Robert's emotional scrubber */}
        <div className="mt-14">
          <p className="eyebrow mb-8">Robert&apos;s fault journey · drag through the arc</p>
          <div className="relative flex justify-between">
            <div
              className="absolute top-[14px] h-[2px] w-full"
              style={{ background: "var(--hair)" }}
            />
            <motion.div
              className="absolute top-[14px] h-[2px] origin-left"
              style={{ background: "var(--amber)", width: `${(step / (journey.stages.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
            {journey.stages.map((st, i) => (
              <button
                key={st.n}
                onClick={() => setStep(i)}
                className="relative z-10 flex flex-col items-center"
                style={{ flex: 1 }}
              >
                <span
                  className="grid h-7 w-7 place-items-center rounded-full text-xs transition-all"
                  style={{
                    background: i <= step ? "var(--amber)" : "var(--bg-elev)",
                    color: i <= step ? "#fff" : "var(--ink-faint)",
                    border: `1px solid ${i <= step ? "var(--amber)" : "var(--hair-strong)"}`,
                    fontFamily: "var(--font-label)",
                  }}
                >
                  {st.n}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="card mt-10 grid gap-6 p-8 md:grid-cols-[1fr_1fr_1fr]"
            >
              <div className="md:col-span-3 flex flex-wrap items-baseline gap-4">
                <h3 className="h-section" style={{ fontSize: "clamp(1.5rem,3vw,2.3rem)" }}>
                  <span className="amber mono-num">{s.n}</span> &nbsp;{s.title}
                </h3>
                <span
                  className="rounded-full px-3 py-1 text-xs"
                  style={{ background: "var(--amber-soft)", color: "var(--amber)", fontFamily: "var(--font-label)", letterSpacing: "0.1em", textTransform: "uppercase" }}
                >
                  Feeling · {s.feeling}
                </span>
              </div>
              <div className="md:col-span-2">
                <div className="eyebrow mb-2" style={{ color: "var(--green)" }}>What the redesign does</div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>{s.after}</p>
              </div>
              <div>
                <div className="eyebrow mb-2" style={{ color: "var(--red)" }}>Before · the old app</div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>{s.before}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* three persona arcs */}
        <Stagger className="mt-12 grid gap-6 md:grid-cols-3" gap={0.1}>
          {journey.moments.map((m) => (
            <motion.div
              key={m.name}
              variants={staggerItem}
              className="card p-7"
              style={{ borderLeft: `3px solid ${m.accent}` }}
            >
              <h3 className="mb-3 text-lg" style={{ color: "var(--ink)" }}>{m.name}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>{m.text}</p>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------------- Insights (animated stats) ---------------- */
const kindLabel: Record<string, { t: string; c: string }> = {
  actual: { t: "Audited / stated", c: "var(--green)" },
  research: { t: "Research-backed", c: "var(--amber)" },
  projected: { t: "Projected · not measured", c: "var(--ai)" },
};
function parseStat(v: string) {
  const m = v.match(/^([\d.]+)(.*)$/);
  if (!m) return null;
  return { num: parseFloat(m[1]), rest: m[2] };
}
export function Insights() {
  return (
    <section id="insights" className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="wrap">
        <SectionHeader
          index="07"
          kicker="Research Insights"
          title="The numbers behind the decision."
          lead="Every figure is labelled by provenance — research-backed context and what the audit found directly. No invented business results."
        />
        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" gap={0.1}>
          {insights.map((s) => {
            const parsed = parseStat(s.value);
            return (
              <motion.div key={s.value} variants={staggerItem} className="card flex flex-col p-7">
                <div
                  className="text-5xl font-light leading-none sm:text-6xl"
                  style={{ fontFamily: "var(--font-display)", color: "var(--amber)" }}
                >
                  {parsed ? (
                    <>
                      <Counter to={parsed.num} decimals={s.decimals ?? 0} />
                      <span>{parsed.rest}</span>
                    </>
                  ) : (
                    s.value
                  )}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed" style={{ color: "var(--ink)" }}>
                  {s.label}
                </p>
                <div className="mt-5 flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: kindLabel[s.kind].c }}
                  />
                  <span
                    className="text-[10px] uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-label)", color: kindLabel[s.kind].c }}
                  >
                    {kindLabel[s.kind].t}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-snug" style={{ color: "var(--ink-faint)" }}>
                  {s.note}
                </p>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
