import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Milestone } from "../data/milestones";
import { daysFromWedding } from "../utils/dateUtils";

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface MilestoneSlideProps {
  milestone: Milestone;
  /** Stable key (the active index) so content re-animates on change. */
  slideKey: number;
  /** Direction of travel: 1 = forward, -1 = backward (for slide-in). */
  direction: number;
  onOpenGallery: (startIndex: number) => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The warm-glass content panel for the active milestone. Floats over the
 * full-screen photo (rendered by PhotoStage). Translucent so the photo shows
 * through. Slides/fades in by direction whenever the milestone changes.
 */
export default function MilestoneSlide({
  milestone,
  slideKey,
  direction,
  onOpenGallery,
}: MilestoneSlideProps) {
  const reduceMotion = useReducedMotion();
  const days = daysFromWedding(milestone.date);
  const dayBadge =
    days === 0 ? "Day 0" : days > 0 ? `Day ${days.toLocaleString()}` : null;

  const enterX = reduceMotion ? 0 : direction >= 0 ? 40 : -40;
  const exitX = reduceMotion ? 0 : direction >= 0 ? -40 : 40;

  const color = milestone.dotColor;
  const hasPhotos = milestone.images.length > 0;

  return (
    <div className="relative mx-auto w-full max-w-2xl px-4">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.article
          key={slideKey}
          className="relative overflow-hidden rounded-[1.5rem] border border-ivory/25 bg-ivory/10 px-6 py-4 backdrop-blur-xl sm:px-8 sm:py-5"
          style={{
            boxShadow: `0 20px 60px -24px rgba(0,0,0,0.7), inset 0 1px 0 0 ${hexToRgba(
              "#fbf7ef",
              0.18,
            )}`,
          }}
          initial={{ opacity: 0, x: enterX, y: 14 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: exitX, y: 8 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, ease }}
        >
          {/* faint accent glow tied to the milestone color */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: hexToRgba(color, 0.35) }}
          />

          <div className="relative flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="font-sans text-[0.7rem] uppercase tracking-[0.28em] sm:text-xs"
                style={{ color: "var(--color-gold-soft)" }}
              >
                {milestone.year}
                {milestone.approximate && (
                  <span className="ml-1 normal-case tracking-normal text-ivory/55">
                    · around
                  </span>
                )}
              </span>
              {dayBadge && (
                <span
                  className="rounded-full px-2.5 py-0.5 font-sans text-[11px] font-semibold text-ivory"
                  style={{ backgroundColor: hexToRgba(color, 0.5) }}
                >
                  {dayBadge}
                </span>
              )}
            </div>

            <h2 className="mt-1 font-serif text-[1.55rem] leading-tight text-ivory drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-4xl">
              {milestone.title}
            </h2>

            <p className="mt-1.5 flex items-start gap-1.5 font-sans text-sm text-ivory/85">
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: "var(--color-gold-soft)" }}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" />
                <circle cx="12" cy="11" r="2" />
              </svg>
              {milestone.location}
            </p>

            <p className="mt-2 line-clamp-2 max-w-prose font-sans text-[0.9rem] leading-relaxed text-ivory/90 sm:line-clamp-4">
              {milestone.description}
            </p>

            {hasPhotos && (
              <button
                type="button"
                onClick={() => onOpenGallery(0)}
                className="group mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-ivory/30 bg-ivory/10 px-3.5 py-1.5 font-sans text-xs font-semibold text-ivory transition hover:bg-ivory/20"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4-4M11 8v6M8 11h6" />
                </svg>
                View {milestone.images.length > 1 ? "photos" : "photo"}
              </button>
            )}
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
}
