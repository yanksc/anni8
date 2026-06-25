import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Milestone } from "../data/milestones";
import { daysFromWedding, imageUrl } from "../utils/dateUtils";
import PhotoPlaceholder from "./PhotoPlaceholder";

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

/** The centered "scene" for the active milestone. */
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

  const enterX = reduceMotion ? 0 : direction >= 0 ? 48 : -48;
  const exitX = reduceMotion ? 0 : direction >= 0 ? -48 : 48;

  // The first (or only) image to preview on the card.
  const hasPhotos = milestone.images.length > 0;
  const color = milestone.dotColor;

  return (
    <div className="relative mx-auto w-full max-w-4xl px-4">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.article
          key={slideKey}
          className="grid grid-cols-1 items-center gap-6 rounded-3xl bg-ivory/80 p-5 shadow-card backdrop-blur-sm sm:gap-8 sm:p-8 md:grid-cols-2"
          style={{ boxShadow: `var(--shadow-card), 0 0 0 1px ${hexToRgba(color, 0.18)}` }}
          initial={{ opacity: 0, x: enterX }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: exitX }}
          transition={{ duration: 0.5, ease }}
        >
          {/* Photo card */}
          <motion.button
            type="button"
            onClick={() => onOpenGallery(0)}
            aria-label={`Open photos for ${milestone.title}`}
            className="group relative w-full overflow-hidden rounded-2xl shadow-soft transition focus:outline-none focus-visible:ring-2"
            style={{
              outline: `1px solid ${hexToRgba(color, 0.25)}`,
              background: hexToRgba(color, 0.07),
              height: "280px",
            }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
            whileHover={reduceMotion ? undefined : { scale: 1.015 }}
          >
            {hasPhotos ? (
              <img
                src={imageUrl(milestone.images[0])}
                alt={milestone.title}
                className="h-full w-full object-contain"
              />
            ) : (
              <PhotoPlaceholder milestone={milestone} />
            )}

            {/* hover hint */}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/35 to-transparent py-3 text-xs font-sans text-ivory opacity-0 transition-opacity group-hover:opacity-100">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4-4M11 8v6M8 11h6" />
              </svg>
              View {milestone.images.length > 1 ? `${milestone.images.length} photos` : "photo"}
            </span>

            {/* multi-photo corner badge */}
            {milestone.images.length > 1 && (
              <span className="absolute right-2 top-2 rounded-full bg-ivory/90 px-2 py-0.5 text-[10px] font-semibold text-ink shadow">
                {milestone.images.length}
              </span>
            )}
          </motion.button>

          {/* Text content */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="font-sans text-xs uppercase tracking-[0.25em]"
                style={{ color }}
              >
                {milestone.year}
                {milestone.approximate && (
                  <span className="ml-1 text-ink-soft/70 normal-case tracking-normal">
                    · around
                  </span>
                )}
              </span>
              {dayBadge && (
                <span
                  className="rounded-full px-2.5 py-0.5 font-sans text-[11px] font-semibold"
                  style={{
                    color,
                    backgroundColor: hexToRgba(color, 0.12),
                  }}
                >
                  {dayBadge}
                </span>
              )}
            </div>

            <h2 className="mt-2 font-serif text-3xl leading-tight text-ink sm:text-4xl">
              {milestone.title}
            </h2>

            <p className="mt-2 flex items-start gap-1.5 font-sans text-sm text-ink-soft">
              <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" style={{ color }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" />
                <circle cx="12" cy="11" r="2" />
              </svg>
              {milestone.location}
            </p>

            <p className="mt-4 font-sans text-[0.95rem] leading-relaxed text-ink/90">
              {milestone.description}
            </p>
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
}
