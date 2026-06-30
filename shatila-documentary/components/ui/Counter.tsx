"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useTransform,
  motion,
} from "framer-motion";
import { useEffect, useRef } from "react";

export function Counter({
  to,
  from = 0,
  decimals = 0,
  duration = 1.8,
  prefix = "",
  suffix = "",
}: {
  to: number;
  from?: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const count = useMotionValue(from);
  const rounded = useTransform(count, (v) =>
    prefix + v.toFixed(decimals) + suffix
  );

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, {
        duration,
        ease: [0.16, 1, 0.3, 1],
      });
      return controls.stop;
    }
  }, [inView, to, count, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
