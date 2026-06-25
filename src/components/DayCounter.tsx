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
      <p className="font-sans text-[0.7rem] uppercase tracking-[0.35em] text-ivory/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] sm:text-xs">
        Eight Years, One Story
      </p>

      <div className="relative mt-0.5">
        {/* dark scrim halo so the gold number reads over any photo */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[140%] w-[160%] -translate-x-1/2 -translate-y-1/2 blur-2xl"
          style={{
            background:
              "radial-gradient(50% 55% at 50% 50%, rgba(30,22,12,0.75), transparent 72%)",
          }}
        />
        <motion.span
          key={display === 0 ? "zero" : "num"}
          className="block font-serif leading-none text-gold-soft drop-shadow-[0_3px_16px_rgba(0,0,0,0.65)]"
          style={{ fontSize: "clamp(2.5rem, 8vw, 5.5rem)" }}
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
          className="mt-0.5 font-serif italic text-base text-ivory/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] sm:text-lg"
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
