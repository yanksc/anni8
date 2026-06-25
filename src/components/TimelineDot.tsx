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
  const isFutureAnchor = isAnchor && !isActive && !isPast;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(index)}
      aria-label={`${milestone.year} — ${milestone.title}`}
      aria-current={isActive ? "true" : undefined}
      className="group relative flex w-24 shrink-0 flex-col items-center pt-3 outline-none sm:w-28"
      style={{ pointerEvents: isRevealed ? "auto" : "none" }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isRevealed ? 1 : 0, y: 0 }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 0.55, ease: "easeOut" }
      }
    >
      {/* Dot zone */}
      <span className="relative flex h-9 items-center justify-center">
        {/* Glow halo: full for active, soft shimmer for future anchor */}
        {(isActive || isFutureAnchor) && (
          <motion.span
            layoutId={isActive ? "dot-glow" : undefined}
            className="absolute rounded-full"
            style={{
              width: isActive ? 48 : 34,
              height: isActive ? 48 : 34,
              background: `radial-gradient(circle, ${hexToRgba(
                color,
                isActive ? 0.6 : 0.3,
              )}, transparent 70%)`,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
          />
        )}

        <motion.span
          className="relative rounded-full border-2"
          animate={{
            width: isActive ? 28 : isFutureAnchor ? 20 : 16,
            height: isActive ? 28 : isFutureAnchor ? 20 : 16,
          }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          style={{
            backgroundColor: isActive
              ? color
              : isFutureAnchor
                ? hexToRgba(color, 0.5)
                : isPast
                  ? hexToRgba(color, 0.85)
                  : "rgba(255,255,255,0.15)",
            borderColor:
              isActive || isPast || isAnchor
                ? color
                : "rgba(255,255,255,0.4)",
            boxShadow: isActive
              ? `0 0 0 5px ${hexToRgba(color, 0.22)}, 0 4px 12px rgba(0,0,0,0.4)`
              : "0 2px 6px rgba(0,0,0,0.3)",
          }}
        />

        {/* Pulse ring: fast for active, slow shimmer for future anchor */}
        {isActive && !reduceMotion && (
          <motion.span
            className="absolute rounded-full border"
            style={{ borderColor: color }}
            initial={{ width: 28, height: 28, opacity: 0.5 }}
            animate={{ width: 56, height: 56, opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        {isFutureAnchor && !reduceMotion && (
          <motion.span
            className="absolute rounded-full border"
            style={{ borderColor: color, borderWidth: 1 }}
            initial={{ width: 20, height: 20, opacity: 0.35 }}
            animate={{ width: 46, height: 46, opacity: 0 }}
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
          className="mt-1 text-xs leading-none"
          style={{ color, opacity: isActive ? 1 : isFutureAnchor ? 0.6 : 0.75 }}
        >
          ♥
        </span>
      )}

      {/* Year label */}
      <span
        className={`mt-1 max-w-full truncate px-0.5 text-center font-sans text-[11px] leading-tight tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] transition-colors sm:text-xs ${
          isActive
            ? "font-semibold text-ivory"
            : isFutureAnchor
              ? "text-ivory/60"
              : "text-ivory/75 group-hover:text-ivory"
        }`}
      >
        {milestone.year}
      </span>
    </motion.button>
  );
}
