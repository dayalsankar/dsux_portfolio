"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Quote } from "lucide-react";
import { Reveal, Stagger, staggerItem } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Counter } from "@/components/ui/Counter";
import {
  research,
  competitors,
  roles,
  personas,
  journey,
  insights,
} from "@/lib/content";

/* ---------------- Research ---------------- */
export function Research() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="research" className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="wrap">
        <SectionHeader
          index="03"
          kicker="Research"
          title="Five methods. One clear picture."
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
              <p className="eyebrow mb-6">Six findings, one direction</p>
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
          title="The gap was real — and specific."
          lead="BakeSmart, MarketMan, Craftybase, Katana MRP and plain paper, scored against what a custom-order factory actually needs. Tap a capability to spotlight it."
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

/* ---------------- Stakeholders: personas + role matrix ---------------- */
export function Stakeholders() {
  const [active, setActive] = useState(0);
  return (
    <section id="stakeholders" className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="wrap">
        <SectionHeader
          index="05"
          kicker="Stakeholders & Roles"
          title="Three people. Five roles. One shared order."
          lead="The people the system serves — and the permission structure that became its foundation."
        />

        {/* personas */}
        <Stagger className="mt-14 grid gap-6 md:grid-cols-3" gap={0.1}>
          {personas.map((p) => (
            <motion.figure
              key={p.name}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              className="card flex flex-col p-7"
            >
              <Quote size={22} style={{ color: "var(--amber)" }} />
              <blockquote
                className="my-5 text-lg leading-snug"
                style={{ fontFamily: "var(--font-display)", fontWeight: 320 }}
              >
                “{p.quote}”
              </blockquote>
              <figcaption className="mt-auto">
                <div className="text-base font-medium">{p.name}</div>
                <div className="text-xs" style={{ color: "var(--ink-faint)" }}>
                  {p.role}
                </div>
                <div className="mt-4 space-y-2 text-sm" style={{ color: "var(--ink-dim)" }}>
                  <p><span className="amber">Needs · </span>{p.need}</p>
                  <p><span style={{ color: "var(--red)" }}>Frustration · </span>{p.frustration}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </Stagger>

        {/* role explorer */}
        <div className="mt-20 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-2">
            <Reveal><p className="eyebrow mb-3">The 5-role permission system</p></Reveal>
            {roles.map((r, i) => (
              <button
                key={r.name}
                onClick={() => setActive(i)}
                className="card flex items-center justify-between p-4 text-left transition-all"
                style={{
                  borderColor: active === i ? "var(--amber)" : "var(--hair)",
                  background: active === i ? "var(--amber-soft)" : "var(--surface)",
                }}
              >
                <span className="font-medium">{r.name}</span>
                <span className="text-xs" style={{ color: "var(--ink-faint)", fontFamily: "var(--font-label)" }}>
                  {r.scope}
                </span>
              </button>
            ))}
          </div>
          <div className="card p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="h-section" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)" }}>
                  {roles[active].name}
                </h3>
                <p className="mt-4 lead" style={{ fontSize: "1.05rem" }}>
                  {roles[active].blurb}
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="eyebrow mb-2" style={{ color: "var(--green)" }}>Key modules</div>
                    <p className="text-sm" style={{ color: "var(--ink-dim)" }}>{roles[active].modules}</p>
                  </div>
                  <div>
                    <div className="eyebrow mb-2" style={{ color: "var(--red)" }}>Restricted from</div>
                    <p className="text-sm" style={{ color: "var(--ink-dim)" }}>{roles[active].restricted}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Journey scrubber ---------------- */
export function Journey() {
  const [step, setStep] = useState(0);
  const s = journey.stages[step];
  return (
    <section id="journey" className="section">
      <div className="wrap">
        <SectionHeader
          index="06"
          kicker="Journey Mapping"
          title="One order, intake to invoice."
          lead={journey.intro}
        />

        {/* timeline */}
        <div className="mt-14">
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
                    color: i <= step ? "#0c0a08" : "var(--ink-faint)",
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
              className="card mt-10 grid gap-6 p-8 md:grid-cols-3"
            >
              <h3 className="h-section md:col-span-3" style={{ fontSize: "clamp(1.5rem,3vw,2.3rem)" }}>
                <span className="amber mono-num">{s.n}</span> &nbsp;{s.title}
              </h3>
              <div>
                <div className="eyebrow mb-2">Admin sees</div>
                <p className="text-sm" style={{ color: "var(--ink-dim)" }}>{s.sees}</p>
              </div>
              <div>
                <div className="eyebrow mb-2" style={{ color: "var(--green)" }}>Admin does</div>
                <p className="text-sm" style={{ color: "var(--ink-dim)" }}>{s.does}</p>
              </div>
              <div>
                <div className="eyebrow mb-2" style={{ color: "var(--red)" }}>Before (manual)</div>
                <p className="text-sm" style={{ color: "var(--ink-dim)" }}>{s.manual}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="mt-4 text-center text-xs" style={{ color: "var(--ink-faint)" }}>
            “How does the next person know?” appeared at every single stage transition.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Insights (animated stats) ---------------- */
const kindLabel: Record<string, { t: string; c: string }> = {
  actual: { t: "Stated by client", c: "var(--green)" },
  research: { t: "Research-backed", c: "var(--amber)" },
  projected: { t: "Projected · not measured", c: "var(--ai)" },
};
function parseStat(v: string) {
  // pull a leading number for the counter, keep the rest as suffix text
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
          lead="Every figure is labelled by provenance — research-backed context, what the client stated, and honest design-target projections. No invented business results."
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
                      <Counter to={parsed.num} decimals={s.value.includes(".") ? 0 : 0} />
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
