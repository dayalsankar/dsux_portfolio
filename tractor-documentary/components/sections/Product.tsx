"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Eye, Languages, Accessibility as A11y } from "lucide-react";
import { Reveal, Stagger, staggerItem } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { asset } from "@/lib/config";
import { features, screens, askTractor, accessibility, designSystem } from "@/lib/content";

/* phone mockup used in the screens gallery + Ask Tractor */
function Phone({ src, alt, w = 250 }: { src: string; alt: string; w?: number }) {
  return (
    <div
      className="shrink-0 overflow-hidden rounded-[32px] border p-[6px]"
      style={{ width: w, background: "var(--bg-elev)", borderColor: "var(--hair-strong)", boxShadow: "var(--shadow)" }}
    >
      <div className="overflow-hidden rounded-[26px]" style={{ background: "#fff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(src)} alt={alt} loading="lazy" className="block h-auto w-full" />
      </div>
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
          kicker="Feature Deep-Dive"
          title="Six features, every one answering a finding."
          lead="From fault translation to offline mode — each feature exists to solve a specific, evidenced failure of the old experience, with the UX reasoning made explicit."
        />
        <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.08}>
          {features.map((f) => (
            <motion.div
              key={f.name}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              className="card flex flex-col p-7"
            >
              <h3 className="mb-4 text-lg" style={{ color: "var(--ink)" }}>{f.name}</h3>
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

/* ---------------- High-fidelity screens gallery ---------------- */
export function Admin() {
  return (
    <section id="admin" className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="wrap">
        <SectionHeader
          index="13"
          kicker="High-Fidelity Screens"
          title="27 screens. Each one traces back to research."
          lead="The design system applied to the priority screens identified through research traceability. If a screen couldn't point back to a finding, it didn't ship. Drag to explore."
        />
      </div>

      {/* full-bleed draggable phone gallery */}
      <Reveal>
        <div className="mt-14 flex snap-x gap-8 overflow-x-auto px-[max(4vw,calc((100vw-var(--maxw))/2))] pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {screens.map((s) => (
            <figure key={s.src} className="flex shrink-0 snap-center flex-col items-center" style={{ width: 250 }}>
              <Phone src={s.src} alt={`${s.name} — ${s.note}`} />
              <figcaption className="mt-5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="mono-num text-xs" style={{ color: "var(--amber)" }}>{s.no}</span>
                  <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>{s.name}</span>
                </div>
                <p className="mt-1 text-xs leading-snug" style={{ color: "var(--ink-faint)" }}>{s.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- Ask Tractor (the one AI surface) ---------------- */
export function AI() {
  return (
    <section id="ai" className="section">
      <div className="wrap">
        <SectionHeader
          index="14"
          kicker="AI Feature · Ask Tractor"
          title={<>Answers, <span className="ai-text">not codes.</span></>}
          lead={askTractor.lead}
        />
        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1fr_auto]">
          <Stagger className="space-y-6" gap={0.08}>
            {askTractor.points.map((p) => (
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

          <Reveal dir="left" className="justify-self-center">
            <Phone src={askTractor.screenshot} alt="Ask Tractor — conversational assistant screen" w={280} />
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
          title="Designed for gloves, glare, and low digital confidence."
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
          title="Extracted from the source. Documented for production."
          lead="A living system, not a flattened picture of one — every token, component, and state below is real and inspectable."
        />

        {/* source boards */}
        <Reveal>
          <div className="-mx-[4vw] mt-12 flex snap-x gap-6 overflow-x-auto px-[4vw] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {designSystem.images.map((im) => (
              <figure
                key={im.src}
                className="card shrink-0 snap-start overflow-hidden"
                style={{ width: "min(86vw, 880px)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(im.src)} alt={im.cap} loading="lazy" className="block h-auto w-full" />
                <figcaption
                  className="px-5 py-4 text-xs"
                  style={{ color: "var(--ink-faint)", fontFamily: "var(--font-label)", letterSpacing: "0.04em" }}
                >
                  {im.cap}
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
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
                      fontFamily: t.font === "Oswald" ? "var(--font-label)" : "var(--font-body)",
                      color: "var(--ink-dim)",
                    }}
                  >
                    {t.sample}
                  </div>
                </div>
              ))}
              <p className="text-xs leading-relaxed" style={{ color: "var(--ink-faint)" }}>
                Oswald is reserved for display numbers and labels; DM Sans carries every sentence a user actually reads — keeping long-form content legible for low-digital-confidence users.
              </p>
            </div>
          </Reveal>

          {/* tokens */}
          <Reveal delay={0.1} className="card p-7">
            <div className="eyebrow mb-5">Tokens & rules</div>
            <div className="space-y-3">
              {designSystem.tokens.map((t) => (
                <div key={t.k} className="flex justify-between gap-4 border-b pb-3 text-sm" style={{ borderColor: "var(--hair)" }}>
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
