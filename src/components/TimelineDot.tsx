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

function shortCity(location: string): string {
  // e.g. "Yellowstone National Park" → "Yellowstone"
  const parkMatch = location.match(/^(.+?)\s+(?:National|State)\b/);
  if (parkMatch) return parkMatch[1].trim();

  const parts = location.split(",").map((s) => s.trim());
  const first = parts[0];
  // If first part looks like a venue or long address, prefer the next segment
  const isVenue =
    first.length > 12 ||
    /University|Campus|Beach|Avenue|Road|Street/i.test(first);
  const city = isVenue && parts[1] ? parts[1] : first;
  // Drop secondary parts like "Albany / Berkeley" → "Albany"
  return city.split(/\s*[/·&]\s*|\s+and\s+/)[0].trim();
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
      className="group relative flex w-24 shrink-0 flex-col items-center pt-2 outline-none sm:w-28"
      style={{ pointerEvents: isRevealed ? "auto" : "none" }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isRevealed ? 1 : 0, y: 0 }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 0.55, ease: "easeOut" }
      }
    >
      {/* City label */}
      <span
        className={`mb-1 max-w-full truncate px-0.5 text-center font-sans text-[9px] leading-none tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] ${
          isActive ? "text-ivory/90" : "text-ivory/45"
        }`}
      >
        {shortCity(milestone.location)}
      </span>

      {/* Dot zone */}
      <span className="relative flex h-9 items-center justify-center">
        {/* Outer glow halo */}
        {(isActive || isFutureAnchor) && (
          <motion.span
            layoutId={isActive ? "dot-glow" : undefined}
            className="absolute rounded-full"
            style={{
              width: isActive ? (isAnchor ? 64 : 48) : 58,
              height: isActive ? (isAnchor ? 64 : 48) : 58,
              background: `radial-gradient(circle, ${hexToRgba(
                color,
                isActive ? (isAnchor ? 0.75 : 0.6) : 0.5,
              )}, transparent 68%)`,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
          />
        )}

        {/* Inner bright halo — wedding anchor only */}
        {isAnchor && (
          <span
            className="absolute rounded-full"
            style={{
              width: 32,
              height: 32,
              background: `radial-gradient(circle, ${hexToRgba(color, isActive ? 0.9 : 0.65)}, transparent 60%)`,
            }}
          />
        )}

        <motion.span
          className="relative rounded-full border-2"
          animate={{
            width: isActive ? 28 : isFutureAnchor ? 24 : 16,
            height: isActive ? 28 : isFutureAnchor ? 24 : 16,
          }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          style={{
            backgroundColor: isActive
              ? color
              : isFutureAnchor
                ? hexToRgba(color, isAnchor ? 0.72 : 0.5)
                : isPast
                  ? hexToRgba(color, 0.85)
                  : "rgba(255,255,255,0.15)",
            borderColor:
              isActive || isPast || isAnchor
                ? color
                : "rgba(255,255,255,0.4)",
            boxShadow: isActive
              ? isAnchor
                ? `0 0 0 5px ${hexToRgba(color, 0.3)}, 0 0 20px 4px ${hexToRgba(color, 0.45)}, 0 4px 12px rgba(0,0,0,0.4)`
                : `0 0 0 5px ${hexToRgba(color, 0.22)}, 0 4px 12px rgba(0,0,0,0.4)`
              : isFutureAnchor
                ? `0 0 0 3px ${hexToRgba(color, 0.2)}, 0 0 14px 2px ${hexToRgba(color, 0.35)}, 0 2px 8px rgba(0,0,0,0.35)`
                : "0 2px 6px rgba(0,0,0,0.3)",
          }}
        />

        {/* Pulse rings */}
        {isActive && !reduceMotion && (
          <motion.span
            className="absolute rounded-full border"
            style={{ borderColor: color, borderWidth: isAnchor ? 1.5 : 1 }}
            initial={{ width: 28, height: 28, opacity: isAnchor ? 0.7 : 0.5 }}
            animate={{ width: isAnchor ? 66 : 56, height: isAnchor ? 66 : 56, opacity: 0 }}
            transition={{ duration: isAnchor ? 2.2 : 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        {/* Wedding anchor: always has two slow glowing rings */}
        {isFutureAnchor && !reduceMotion && (
          <>
            <motion.span
              className="absolute rounded-full border"
              style={{ borderColor: color, borderWidth: 1.5 }}
              initial={{ width: 24, height: 24, opacity: 0.55 }}
              animate={{ width: 54, height: 54, opacity: 0 }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              className="absolute rounded-full border"
              style={{ borderColor: color, borderWidth: 1 }}
              initial={{ width: 24, height: 24, opacity: 0.35 }}
              animate={{ width: 72, height: 72, opacity: 0 }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
            />
          </>
        )}
      </span>

      {/* Heart accent for the wedding anchor */}
      {isAnchor && (
        <span
          aria-hidden
          className={`leading-none ${isActive || isFutureAnchor ? "mt-1 text-sm" : "mt-1 text-xs"}`}
          style={{
            color,
            opacity: isActive ? 1 : isFutureAnchor ? 0.9 : 0.8,
            textShadow: isFutureAnchor || isActive
              ? `0 0 8px ${hexToRgba(color, 0.8)}, 0 0 20px ${hexToRgba(color, 0.5)}`
              : "none",
          }}
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
