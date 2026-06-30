"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Eye, Languages, Accessibility as A11y } from "lucide-react";
import { Reveal, Stagger, staggerItem } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Counter } from "@/components/ui/Counter";
import { features, adminKpis, ai, accessibility, designSystem } from "@/lib/content";

/* Mock browser frame used in feature + admin sections */
function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div
      className="overflow-hidden rounded-[var(--radius)] border"
      style={{ background: "var(--bg)", boxShadow: "var(--shadow)" }}
    >
      <div
        className="flex items-center gap-2 border-b px-4 py-3"
        style={{ borderColor: "var(--hair)" }}
      >
        <span className="h-3 w-3 rounded-full" style={{ background: "#e0564f" }} />
        <span className="h-3 w-3 rounded-full" style={{ background: "#e6b94f" }} />
        <span className="h-3 w-3 rounded-full" style={{ background: "#5fb97a" }} />
        <span className="ml-3 text-xs" style={{ color: "var(--ink-faint)", fontFamily: "var(--font-label)" }}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ---------------- Feature showcase ---------------- */
export function Features() {
  return (
    <section id="features" className="section">
      <div className="wrap">
        <SectionHeader
          index="12"
          kicker="Feature Showcase"
          title="Six features, one coherent system."
          lead="From customer selection to the status pipeline — each built to answer a specific operational failure, with the UX reasoning made explicit."
        />
        <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.08}>
          {features.map((f) => (
            <motion.div
              key={f.name}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              className="card flex flex-col p-7"
            >
              <div className="mb-5 flex items-center gap-2">
                {f.ai && <Sparkles size={16} style={{ color: "var(--ai)" }} />}
                <h3 className="text-lg" style={{ color: f.ai ? "var(--ai)" : "var(--ink)" }}>
                  {f.name}
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
                {f.desc}
              </p>
              <p
                className="mt-5 border-t pt-4 text-xs leading-relaxed"
                style={{ borderColor: "var(--hair)", color: "var(--ink-faint)" }}
              >
                <span className="amber">Why · </span>{f.reason}
              </p>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------------- Admin dashboard with live KPIs ---------------- */
export function Admin() {
  return (
    <section id="admin" className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="wrap">
        <SectionHeader
          index="13"
          kicker="Admin Dashboard"
          title="The morning overview, in one screen."
          lead="The stakeholder's first priority: see all orders and their status simultaneously. Six KPIs, AR/AP aging, and quick actions — the digital answer to walking the floor."
        />
        <Reveal className="mt-14">
          <Frame label="shatila · admin / dashboard">
            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
              {adminKpis.map((k, i) => (
                <motion.div
                  key={k.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border p-5"
                  style={{ borderColor: "var(--hair)", background: "var(--surface)" }}
                >
                  <div
                    className="text-xs uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-label)", color: "var(--ink-faint)" }}
                  >
                    {k.label}
                  </div>
                  <div
                    className="mt-2 text-4xl font-light"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: k.tone === "green" ? "var(--green)" : k.tone === "amber" ? "var(--amber)" : "var(--ink)",
                    }}
                  >
                    {k.money ? (
                      <Counter to={k.value2 as number} prefix="$" />
                    ) : (
                      <Counter to={k.value} />
                    )}
                  </div>
                  <div className="mt-1 text-xs" style={{ color: "var(--ink-faint)" }}>{k.delta}</div>
                </motion.div>
              ))}
            </div>
            {/* faux aging bars */}
            <div className="border-t p-6" style={{ borderColor: "var(--hair)" }}>
              <div className="mb-3 text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-label)", color: "var(--ink-faint)" }}>
                AR aging
              </div>
              {[["Current", 64, "var(--green)"], ["1–30 days", 22, "var(--amber)"], ["31–60 days", 9, "var(--amber)"], ["60+ days", 5, "var(--red)"]].map(([label, pct, color]) => (
                <div key={label as string} className="mb-3 flex items-center gap-3">
                  <span className="w-24 text-xs" style={{ color: "var(--ink-dim)" }}>{label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ background: color as string }}
                    />
                  </div>
                  <span className="mono-num w-10 text-right text-xs" style={{ color: "var(--ink-dim)" }}>{pct as number}%</span>
                </div>
              ))}
            </div>
          </Frame>
        </Reveal>
        <p className="mt-4 text-center text-xs" style={{ color: "var(--ink-faint)" }}>
          Representative data — the prototype uses placeholder records, no real Shatila orders or customer information.
        </p>
      </div>
    </section>
  );
}

/* ---------------- AI feature ---------------- */
export function AI() {
  return (
    <section id="ai" className="section">
      <div className="wrap">
        <SectionHeader
          index="14"
          kicker="AI Feature · Auto-Fill"
          title={<>AI removes typing. <span className="ai-text">It never removes judgement.</span></>}
          lead={ai.lead}
        />
        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1fr]">
          <Stagger className="space-y-6" gap={0.08}>
            {ai.points.map((p) => (
              <motion.div key={p.title} variants={staggerItem} className="flex gap-4">
                <span
                  className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full"
                  style={{ background: "var(--ai-soft)" }}
                >
                  <Sparkles size={15} style={{ color: "var(--ai)" }} />
                </span>
                <div>
                  <h3 className="text-lg" style={{ color: "var(--ink)" }}>{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>{p.text}</p>
                </div>
              </motion.div>
            ))}
          </Stagger>

          {/* faux auto-fill animation */}
          <Reveal dir="left">
            <div className="card p-7" style={{ borderColor: "var(--ai-soft)" }}>
              <div className="mb-4 flex items-center gap-2">
                <Sparkles size={15} style={{ color: "var(--ai)" }} />
                <span className="text-sm" style={{ color: "var(--ai)" }}>AI Auto-Fill · review before save</span>
              </div>
              <div
                className="mb-5 rounded-xl border p-4 text-xs leading-relaxed"
                style={{ borderColor: "var(--hair)", background: "var(--surface)", color: "var(--ink-dim)" }}
              >
                “Hi, this is Amira Haddad, 3120 Schaefer Rd, Dearborn MI 48126. Need 6 trays of mixed baklava for Saturday pickup, no pistachio please.”
              </div>
              {[
                ["Name", "Amira Haddad"],
                ["Address", "3120 Schaefer Rd, Dearborn, MI 48126"],
                ["Order", "6 trays · mixed baklava"],
                ["Note", "No pistachio · Saturday pickup"],
              ].map(([k, v], i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.25 }}
                  className="mb-2 flex items-center justify-between rounded-lg px-4 py-3"
                  style={{ background: "var(--ai-soft)" }}
                >
                  <span className="text-xs" style={{ color: "var(--ink-faint)", fontFamily: "var(--font-label)" }}>{k}</span>
                  <span className="text-sm" style={{ color: "var(--ink)" }}>{v}</span>
                </motion.div>
              ))}
              <motion.button
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.4 }}
                className="mt-3 w-full rounded-lg py-3 text-sm font-medium"
                style={{ background: "var(--ai)", color: "#fff" }}
              >
                Review &amp; confirm — a human always decides
              </motion.button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Accessibility / Ethics ---------------- */
const a11yIcons = [ShieldCheck, Eye, Languages, A11y];
export function Accessibility() {
  return (
    <section id="accessibility" className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="wrap">
        <SectionHeader
          index="15"
          kicker="Accessibility & Ethics"
          title="Trust is a design requirement, not a feature."
          lead={accessibility.lead}
        />
        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2" gap={0.08}>
          {accessibility.commitments.map((c, i) => {
            const Icon = a11yIcons[i % a11yIcons.length];
            return (
              <motion.div key={c.title} variants={staggerItem} className="card flex gap-5 p-7">
                <Icon size={22} style={{ color: "var(--amber)" }} className="mt-1 shrink-0" />
                <div>
                  <h3 className="text-lg" style={{ color: "var(--ink)" }}>{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>{c.text}</p>
                </div>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------------- Design system ---------------- */
export function DesignSystem() {
  return (
    <section id="system" className="section">
      <div className="wrap">
        <SectionHeader
          index="16"
          kicker="Design System"
          title="The language of the interface."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {/* colour */}
          <Reveal className="card p-7">
            <div className="eyebrow mb-5">Colour</div>
            <div className="space-y-3">
              {designSystem.colors.map((c) => (
                <div key={c.name} className="flex items-center gap-3">
                  <span
                    className="h-9 w-9 shrink-0 rounded-lg border"
                    style={{ background: c.hex, borderColor: "var(--hair-strong)" }}
                  />
                  <div>
                    <div className="text-sm" style={{ color: "var(--ink)" }}>
                      {c.name} <span className="mono-num text-xs" style={{ color: "var(--ink-faint)" }}>{c.hex}</span>
                    </div>
                    <div className="text-xs" style={{ color: "var(--ink-faint)" }}>{c.use}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* type */}
          <Reveal delay={0.05} className="card p-7">
            <div className="eyebrow mb-5">Typography</div>
            <div className="space-y-6">
              {designSystem.type.map((t) => (
                <div key={t.font}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-sm" style={{ color: "var(--ink)" }}>{t.font}</span>
                    <span className="text-xs" style={{ color: "var(--ink-faint)" }}>{t.role}</span>
                  </div>
                  <div
                    className="text-2xl"
                    style={{
                      fontFamily: t.font === "Fraunces" ? "var(--font-display)" : t.font === "Oswald" ? "var(--font-label)" : "var(--font-body)",
                      color: "var(--ink-dim)",
                    }}
                  >
                    {t.sample}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* tokens */}
          <Reveal delay={0.1} className="card p-7">
            <div className="eyebrow mb-5">Tokens & components</div>
            <div className="space-y-3">
              {designSystem.tokens.map((t) => (
                <div key={t.k} className="flex justify-between border-b pb-3 text-sm" style={{ borderColor: "var(--hair)" }}>
                  <span style={{ color: "var(--ink-faint)" }}>{t.k}</span>
                  <span className="text-right" style={{ color: "var(--ink-dim)" }}>{t.v}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
