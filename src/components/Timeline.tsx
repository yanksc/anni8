import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Milestone } from "../data/milestones";
import { WEDDING_DATE } from "../data/milestones";
import TimelineDot from "./TimelineDot";

interface TimelineProps {
  milestones: Milestone[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function Timeline({
  milestones,
  activeIndex,
  onSelect,
}: TimelineProps) {
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  // Keep the active dot scrolled into view.
  useEffect(() => {
    const container = scrollRef.current;
    const dots = dotsRef.current;
    if (!container || !dots) return;
    const dot = dots.querySelectorAll("button")[activeIndex] as
      | HTMLElement
      | undefined;
    if (!dot) return;
    const target =
      dot.offsetLeft - container.clientWidth / 2 + dot.clientWidth / 2;
    container.scrollTo({
      left: target,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [activeIndex, reduceMotion]);

  // Multi-color gradient spanning all milestone dot colors.
  const colorStops = milestones.map((m) => m.dotColor).join(", ");
  const lineGradient = `linear-gradient(to right, ${colorStops})`;

  // Progress: how far along the user has explored (0 → 1).
  const progress =
    milestones.length > 1 ? activeIndex / (milestones.length - 1) : 1;
  const rightClip = `${Math.round((1 - progress) * 1000) / 10}%`;

  return (
    <div
      ref={scrollRef}
      className="timeline-scroll w-full overflow-x-auto"
    >
        <div
          ref={dotsRef}
          className="relative mx-auto flex w-max min-w-full items-start justify-between gap-1"
        >
          {/* Timeline line: faint rail always visible; colorful gradient grows as you explore */}
          <div className="pointer-events-none absolute left-0 right-0 top-[1.875rem] h-[3px] -translate-y-1/2">
            {/* faint full-width rail */}
            <div className="absolute inset-0 rounded-full bg-ivory/25" />
            {/* colorful progress line — revealed left-to-right as the user navigates */}
            <motion.div
              className="absolute inset-y-0 left-0 right-0 rounded-full"
              initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
              animate={{ clipPath: `inset(0% ${rightClip} 0% 0%)` }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
              }
              style={{ background: lineGradient }}
            />
          </div>

          {milestones.map((m, i) => (
            <TimelineDot
              key={`${m.date}-${i}`}
              milestone={m}
              index={i}
              isActive={i === activeIndex}
              isPast={i < activeIndex}
              isAnchor={m.date === WEDDING_DATE}
              onSelect={onSelect}
            />
          ))}
        </div>
    </div>
  );
}
