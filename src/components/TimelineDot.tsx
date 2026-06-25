import { motion, useReducedMotion } from "motion/react";
import type { Milestone } from "../data/milestones";

interface TimelineDotProps {
  milestone: Milestone;
  index: number;
  isActive: boolean;
  isPast: boolean;
  /** Marks the wedding-day milestone (Day 0) — always visible as a permanent anchor. */
  isAnchor: boolean;
  onSelect: (index: number) => void;
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function TimelineDot({
  milestone,
  index,
  isActive,
  isPast,
  isAnchor,
  onSelect,
}: TimelineDotProps) {
  const reduceMotion = useReducedMotion();
  const color = milestone.dotColor;

  // Dots are invisible until the user has passed through them — except the
  // wedding-day anchor, which is always visible as a fixed landmark.
  const isRevealed = isActive || isPast || isAnchor;
  // A future anchor = the wedding dot before the user has reached it.
  const isFutureAnchor = isAnchor && !isActive && !isPast;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(index)}
      aria-label={`${milestone.year} — ${milestone.title}`}
      aria-current={isActive ? "true" : undefined}
      className="group relative flex w-20 shrink-0 flex-col items-center pt-4 outline-none sm:w-24"
      style={{ pointerEvents: isRevealed ? "auto" : "none" }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isRevealed ? 1 : 0, y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.55, ease: "easeOut" }
      }
    >
      {/* Dot */}
      <span className="relative flex h-7 items-center justify-center">
        {/* Glow halo: full for active, soft shimmer for future anchor */}
        {(isActive || isFutureAnchor) && (
          <motion.span
            layoutId={isActive ? "dot-glow" : undefined}
            className="absolute rounded-full"
            style={{
              width: isActive ? 36 : 28,
              height: isActive ? 36 : 28,
              background: `radial-gradient(circle, ${hexToRgba(color, isActive ? 0.45 : 0.25)}, transparent 70%)`,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
          />
        )}

        <motion.span
          className="relative rounded-full border-2 transition-colors"
          animate={{
            width: isActive ? 20 : isFutureAnchor ? 15 : 12,
            height: isActive ? 20 : isFutureAnchor ? 15 : 12,
          }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          style={{
            backgroundColor: isActive
              ? color
              : isFutureAnchor
                ? hexToRgba(color, 0.45)
                : isPast
                  ? hexToRgba(color, 0.6)
                  : "var(--color-ivory)",
            borderColor:
              isActive || isPast || isAnchor ? color : "var(--color-sand)",
            boxShadow: isActive ? `0 0 0 4px ${hexToRgba(color, 0.18)}` : "none",
          }}
        />

        {/* Pulse ring: fast for active, slow gentle shimmer for future anchor */}
        {isActive && !reduceMotion && (
          <motion.span
            className="absolute rounded-full border"
            style={{ borderColor: color }}
            initial={{ width: 20, height: 20, opacity: 0.5 }}
            animate={{ width: 40, height: 40, opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        {isFutureAnchor && !reduceMotion && (
          <motion.span
            className="absolute rounded-full border"
            style={{ borderColor: color, borderStyle: "solid", borderWidth: 1 }}
            initial={{ width: 15, height: 15, opacity: 0.35 }}
            animate={{ width: 36, height: 36, opacity: 0 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.8,
            }}
          />
        )}
      </span>

      {/* Heart accent for the wedding anchor */}
      {isAnchor && (
        <span
          aria-hidden
          className="mt-0.5 text-[10px] leading-none transition-opacity"
          style={{ color, opacity: isActive ? 1 : isFutureAnchor ? 0.55 : 0.6 }}
        >
          ♥
        </span>
      )}

      {/* Year label */}
      <span
        className={`mt-1 max-w-full truncate px-0.5 text-center font-sans text-[10px] leading-tight tracking-wide transition-colors sm:text-[11px] ${
          isActive
            ? "font-semibold text-ink"
            : isFutureAnchor
              ? "text-ink-soft/70"
              : "text-ink-soft group-hover:text-ink"
        }`}
      >
        {milestone.year}
      </span>
    </motion.button>
  );
}
