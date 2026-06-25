import { useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion, useReducedMotion } from "motion/react";
import { counterLabel, formatCount } from "../utils/dateUtils";

interface DayCounterProps {
  /** Day count (relative to the wedding) of the active milestone. */
  days: number;
}

/**
 * Large animated day counter. The displayed integer eases from the previous
 * value to the new one whenever the active milestone changes.
 */
export default function DayCounter({ days }: DayCounterProps) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(days);
  const prev = useRef(days);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(days);
      prev.current = days;
      return;
    }
    const controls = animate(prev.current, days, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prev.current = days;
    return () => controls.stop();
  }, [days, reduceMotion]);

  const label = counterLabel(display);

  return (
    <div className="flex flex-col items-center text-center select-none">
      <p className="font-sans text-[0.7rem] sm:text-xs uppercase tracking-[0.35em] text-ink-soft">
        Eight Years, One Story
      </p>

      <div className="relative mt-2">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 blur-2xl opacity-40"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 50%, var(--color-gold-soft), transparent 70%)",
          }}
        />
        <motion.span
          key={display === 0 ? "zero" : "num"}
          className="block font-serif leading-none text-gold drop-shadow-[0_2px_10px_rgba(199,154,75,0.25)]"
          style={{ fontSize: "clamp(3.75rem, 13vw, 8.5rem)" }}
          initial={reduceMotion ? false : { scale: 0.96 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
        >
          {formatCount(display)}
        </motion.span>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={label}
          className="mt-1 font-serif italic text-base sm:text-lg text-ink-soft"
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
        >
          {label}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
