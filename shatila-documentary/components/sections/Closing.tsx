"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { Reveal, Stagger, staggerItem } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { tech, impact, reflection, roadmap, takeaways } from "@/lib/content";

/* ---------------- Prototype ---------------- */
export function Prototype() {
  return (
    <section id="prototype" className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="wrap">
        <SectionHeader
          index="17"
          kicker="Live Prototype"
          title="See it in motion."
          lead="Built in Figma Make — a working React + Tailwind application generated from the design. Not a static mockup, but a navigable product the client could experience."
        />
        <Reveal className="mt-14">
          <a
            href="#"
            className="group card relative flex aspect-[16/8] items-center justify-center overflow-hidden"
            style={{ borderColor: "var(--amber-soft)" }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(circle at 50% 40%, var(--amber-soft), transparent 60%)" }}
            />
            <div className="relative flex flex-col items-center gap-4">
              <motion.span
                whileHover={{ scale: 1.08 }}
                className="grid h-20 w-20 place-items-center rounded-full"
                style={{ background: "var(--amber)", color: "#0c0a08" }}
              >
                <Play size={28} fill="#0c0a08" />
              </motion.span>
              <span className="text-sm" style={{ color: "var(--ink-dim)" }}>
                Launch the interactive prototype
              </span>
            </div>
          </a>
        </Reveal>
        <div className="mt-6 flex flex-wrap gap-3">
          {["Try: Create an order", "Try: View AR aging", "Try: Add a customer with AI Auto-Fill"].map((t) => (
            <span
              key={t}
              className="rounded-full border px-4 py-2 text-xs"
              style={{ borderColor: "var(--hair-strong)", color: "var(--ink-dim)", fontFamily: "var(--font-label)" }}
            >
              {t}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs" style={{ color: "var(--ink-faint)" }}>
          Replace the launch target with your Figma Make / Figma prototype URL and embed a walkthrough video here.
        </p>
      </div>
    </section>
  );
}

/* ---------------- Tech architecture ---------------- */
export function Tech() {
  return (
    <section id="tech" className="section">
      <div className="wrap">
        <SectionHeader
          index="18"
          kicker="Technical Architecture"
          title="Designed in code, not just pixels."
          lead={tech.lead}
        />
        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <Stagger className="grid gap-px overflow-hidden rounded-[var(--radius)] border" gap={0.05}>
            {tech.stack.map((s) => (
              <motion.div
                key={s.k}
                variants={staggerItem}
                className="flex items-center justify-between p-5"
                style={{ background: "var(--surface)", borderBottom: "1px solid var(--hair)" }}
              >
                <span className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-label)", color: "var(--amber)" }}>
                  {s.k}
                </span>
                <span className="text-right text-sm" style={{ color: "var(--ink-dim)" }}>{s.v}</span>
              </motion.div>
            ))}
          </Stagger>
          <Reveal dir="left">
            <div className="card h-full p-8">
              <div className="eyebrow mb-5">What's next, technically</div>
              <ul className="space-y-4">
                {tech.future.map((f) => (
                  <li key={f} className="flex gap-3 text-sm" style={{ color: "var(--ink-dim)" }}>
                    <ArrowRight size={16} className="mt-1 shrink-0" style={{ color: "var(--amber)" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-xs leading-relaxed" style={{ color: "var(--ink-faint)" }}>
                The 5-role permission system is built into the foundation, so authentication and
                server-enforced permissions have real infrastructure to attach to — not a retrofit.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Impact (before / after) ---------------- */
export function Impact() {
  return (
    <section id="impact" className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="wrap">
        <SectionHeader
          index="19"
          kicker="Impact"
          title="What this design solves."
          lead={impact.note}
        />
        <div className="mt-14 space-y-4">
          {impact.rows.map((r, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="grid items-stretch gap-4 md:grid-cols-2">
                <div
                  className="rounded-[var(--radius)] border p-6"
                  style={{ borderColor: "var(--hair)", background: "var(--surface)" }}
                >
                  <div className="eyebrow mb-2" style={{ color: "var(--red)" }}>Before</div>
                  <p style={{ color: "var(--ink-dim)" }}>{r.before}</p>
                </div>
                <div
                  className="relative rounded-[var(--radius)] border p-6"
                  style={{ borderColor: "var(--amber-soft)", background: "var(--amber-soft)" }}
                >
                  <ArrowRight
                    size={22}
                    className="absolute -left-3 top-1/2 hidden -translate-y-1/2 md:block"
                    style={{ color: "var(--amber)" }}
                  />
                  <div className="eyebrow mb-2" style={{ color: "var(--green)" }}>After</div>
                  <p style={{ color: "var(--ink)" }}>{r.after}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Reflection ---------------- */
export function Reflection() {
  return (
    <section id="reflection" className="section">
      <div className="wrap">
        <SectionHeader
          index="20"
          kicker="Reflection"
          title="What I learned."
        />
        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {reflection.map((r, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div>
                <div
                  className="mb-4 text-5xl font-light"
                  style={{ fontFamily: "var(--font-display)", color: "var(--hair-strong)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-2xl" style={{ fontFamily: "var(--font-display)", fontWeight: 320, color: "var(--ink)" }}>
                  {r.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>{r.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Roadmap timeline ---------------- */
export function Roadmap() {
  return (
    <section id="roadmap" className="section" style={{ background: "var(--bg-elev)" }}>
      <div className="wrap">
        <SectionHeader
          index="21"
          kicker="Future Roadmap"
          title="What comes next."
        />
        <div className="relative mt-14 pl-8">
          <div
            className="absolute left-[7px] top-2 h-full w-[2px]"
            style={{ background: "var(--hair)" }}
          />
          {roadmap.map((r, i) => (
            <Reveal key={r.n} delay={i * 0.04}>
              <div className="relative mb-10 last:mb-0">
                <span
                  className="absolute -left-8 top-1.5 h-4 w-4 rounded-full border-2"
                  style={{ borderColor: "var(--amber)", background: "var(--bg-elev)" }}
                />
                <div className="flex items-baseline gap-3">
                  <span className="mono-num text-xs" style={{ color: "var(--amber)" }}>{r.n}</span>
                  <h3 className="text-xl" style={{ color: "var(--ink)" }}>{r.title}</h3>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>{r.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Takeaways / ending ---------------- */
export function Takeaways() {
  return (
    <section id="takeaways" className="section">
      <div className="wrap-narrow text-center">
        <Reveal>
          <p className="eyebrow mb-8">Final Takeaways</p>
        </Reveal>
        <Reveal delay={0.05}>
          <p
            className="text-balance"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
              lineHeight: 1.15,
            }}
          >
            {takeaways.closing}
          </p>
        </Reveal>

        <Stagger className="mx-auto mt-16 grid max-w-xl gap-3 text-left" gap={0.08}>
          {takeaways.bullets.map((b) => (
            <motion.div
              key={b}
              variants={staggerItem}
              className="card flex items-center gap-3 p-5"
            >
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--amber)" }} />
              <span className="text-sm" style={{ color: "var(--ink)" }}>{b}</span>
            </motion.div>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#prototype"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
              style={{ background: "var(--amber)", color: "#0c0a08" }}
            >
              View the prototype <ArrowUpRight size={16} />
            </a>
            <a
              href="#hero"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm"
              style={{ borderColor: "var(--hair-strong)", color: "var(--ink)" }}
            >
              Back to the top
            </a>
          </div>
        </Reveal>
      </div>

      <footer
        className="mt-24 border-t py-10 text-center"
        style={{ borderColor: "var(--hair)" }}
      >
        <p className="text-sm" style={{ color: "var(--ink-dim)" }}>
          Shatila Bakery Factory · Staff &amp; Admin Dashboard · UX/UI Case Study
        </p>
        <p className="mt-2 text-xs" style={{ color: "var(--ink-faint)" }}>
          Dayala Sankaran · UI/UX Designer · Built with Next.js, React, Tailwind &amp; Framer Motion
        </p>
      </footer>
    </section>
  );
}
