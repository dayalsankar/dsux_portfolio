"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { hero } from "@/lib/content";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
      style={{ paddingTop: "clamp(8rem, 18vh, 11rem)" }}
    >
      {/* warm ambient wash, matching the existing case study body::before */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 12% -10%, var(--amber-soft), transparent 55%), radial-gradient(80% 60% at 100% 110%, rgba(29,24,19,0.55), transparent 60%)",
        }}
      />

      <motion.div style={{ y, opacity }} className="wrap">
        <motion.span
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="eyebrow mb-6 block"
        >
          {hero.kicker}
        </motion.span>

        <h1 className="mega">
          {hero.headline.map((line, i) => {
            const cls =
              line.kind === "accent"
                ? "l l-accent"
                : line.kind === "ghost"
                ? "l l-ghost"
                : "l";
            return (
              <motion.span
                key={i}
                className={cls}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.9,
                  delay: 0.15 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {line.hl ? (
                  <>
                    {line.text.split(line.hl)[0]}
                    <span className="hl-h">{line.hl}</span>
                    {line.text.split(line.hl)[1]}
                  </>
                ) : (
                  line.text
                )}
              </motion.span>
            );
          })}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="lede"
          style={{ marginBottom: "2.5rem" }}
        >
          {hero.lede}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="meta max-w-4xl"
        >
          {hero.meta.map((m) => (
            <div key={m.k}>
              <span className="k">{m.k}</span>
              <span className="v">{m.v}</span>
            </div>
          ))}
        </motion.div>

        <motion.a
          href="#summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-12 flex items-center gap-3 text-sm"
          style={{ color: "var(--ink-dim)" }}
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="grid h-10 w-10 place-items-center rounded-full border"
            style={{ borderColor: "var(--hair-strong)" }}
          >
            <ArrowDown size={16} />
          </motion.span>
          Begin the story
        </motion.a>
      </motion.div>
    </section>
  );
}
