"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { sections } from "@/lib/content";

/* Top reading-progress bar */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 top-0 z-50 h-[3px] w-full origin-left"
    >
      <div
        style={{ background: "var(--amber)" }}
        className="h-full w-full"
      />
    </motion.div>
  );
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="grid h-9 w-9 place-items-center rounded-full border transition-colors"
      style={{ borderColor: "var(--hair-strong)", color: "var(--ink)" }}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

/* Floating chapter index that tracks the active section */
export function SideNav() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = sections.findIndex((s) => s.id === e.target.id);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <nav
      aria-label="Chapters"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2.5 lg:flex"
    >
      {sections.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="group flex items-center justify-end gap-2"
        >
          <span
            className="whitespace-nowrap text-[11px] font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{
              fontFamily: "var(--font-label)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: active === i ? "var(--amber)" : "var(--ink-dim)",
            }}
          >
            {s.label}
          </span>
          <span
            className="block rounded-full transition-all duration-300"
            style={{
              width: active === i ? 22 : 9,
              height: 3,
              background: active === i ? "var(--amber)" : "var(--hair-strong)",
            }}
          />
        </a>
      ))}
    </nav>
  );
}

export function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 transition-all duration-500"
      style={{
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        background: scrolled ? "color-mix(in srgb, var(--bg) 72%, transparent)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--hair)" : "1px solid transparent",
      }}
    >
      <div className="wrap flex items-center justify-between py-4">
        <a
          href="#hero"
          className="text-sm font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-label)", letterSpacing: "0.18em" }}
        >
          SHATILA<span style={{ color: "var(--amber)" }}>·</span>CASE STUDY
        </a>
        <div className="flex items-center gap-3">
          <a
            href="#prototype"
            className="hidden text-xs font-medium sm:inline"
            style={{
              fontFamily: "var(--font-label)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ink-dim)",
            }}
          >
            Prototype
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
