import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { imageUrl } from "../utils/dateUtils";

interface PhotoStageProps {
  /** The active milestone's primary image path (e.g. "/images/foo.jpg"). */
  image?: string;
  /** Accent color of the active milestone, used as a warm ambient tint. */
  color: string;
  /** Unique key for the active milestone so layers crossfade on change. */
  stageKey: string | number;
}

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Full-bleed cinematic background. A blurred, darkened copy of the photo fills
 * the entire viewport while the sharp, complete photo floats on top
 * (object-contain) so nothing is ever cropped. Layers crossfade between
 * milestones and the sharp photo drifts with a gentle Ken Burns.
 */
export default function PhotoStage({ image, color, stageKey }: PhotoStageProps) {
  const reduceMotion = useReducedMotion();
  const src = image ? imageUrl(image) : null;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* Warm base wash so letterbox areas never read as dead space */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 120% at 50% 0%, ${hexToRgba(
            color,
            0.22,
          )}, var(--color-ink) 75%)`,
        }}
      />

      <AnimatePresence mode="sync">
        <motion.div
          key={stageKey}
          className="absolute inset-0"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease }}
        >
          {src && (
            <>
              {/* Blur-fill layer: covers the whole screen, blurred + darkened */}
              <motion.img
                src={src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: "blur(28px) brightness(0.5) saturate(1.05)" }}
                initial={reduceMotion ? false : { scale: 1.12 }}
                animate={{ scale: 1.18 }}
                transition={{
                  duration: reduceMotion ? 0 : 12,
                  ease: "linear",
                }}
              />

              {/* Sharp layer: full photo, never cropped, gentle Ken Burns */}
              <motion.img
                src={src}
                alt=""
                className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                initial={reduceMotion ? false : { scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: reduceMotion ? 0 : 7,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Warm scrims for legibility: soft at top (counter), stronger at bottom */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(40,30,18,0.55) 0%, rgba(40,30,18,0.05) 22%, rgba(40,30,18,0) 42%, rgba(40,30,18,0.15) 60%, rgba(34,25,15,0.78) 100%)",
        }}
      />
    </div>
  );
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
