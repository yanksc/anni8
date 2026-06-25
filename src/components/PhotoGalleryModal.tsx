import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Milestone } from "../data/milestones";
import { imageUrl } from "../utils/dateUtils";
import PhotoPlaceholder from "./PhotoPlaceholder";

interface PhotoGalleryModalProps {
  milestone: Milestone | null;
  /** Which photo to open first. */
  startIndex?: number;
  onClose: () => void;
}

/**
 * Full-screen gallery overlay. Shows real photos when available, otherwise a
 * larger styled placeholder. Navigates within the milestone's images and
 * closes on backdrop click, the X button, or Escape.
 */
export default function PhotoGalleryModal({
  milestone,
  startIndex = 0,
  onClose,
}: PhotoGalleryModalProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(startIndex);

  // Treat an empty image set as a single placeholder slide.
  const count = milestone ? Math.max(milestone.images.length, 1) : 0;

  useEffect(() => setIndex(startIndex), [startIndex, milestone]);

  // Esc to close, arrows to navigate; lock body scroll while open.
  useEffect(() => {
    if (!milestone) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % count);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [milestone, count, onClose]);

  const hasPhotos = !!milestone && milestone.images.length > 0;

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          style={{ backgroundColor: "rgba(60, 48, 32, 0.55)", backdropFilter: "blur(4px)" }}
          role="dialog"
          aria-modal="true"
          aria-label={`${milestone.title} photos`}
        >
          <motion.div
            className="relative w-full max-w-3xl"
            initial={reduceMotion ? false : { scale: 0.94, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { scale: 0.96, y: 8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close gallery"
              className="absolute -top-3 -right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ivory text-ink shadow-card transition hover:bg-cream"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {/* Image / placeholder frame */}
            <div className="overflow-hidden rounded-2xl bg-ivory p-2 shadow-card ring-1 ring-gold/20">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-cream">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {hasPhotos ? (
                      <img
                        src={imageUrl(milestone.images[index])}
                        alt={`${milestone.title} — ${index + 1}`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <PhotoPlaceholder milestone={milestone} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Caption */}
            <p className="mt-3 text-center font-serif text-lg text-ivory drop-shadow">
              {milestone.title}
            </p>

            {/* Prev / next + dots, only when there are multiple photos */}
            {count > 1 && (
              <>
                <GalleryArrow side="left" onClick={() => setIndex((i) => (i - 1 + count) % count)} />
                <GalleryArrow side="right" onClick={() => setIndex((i) => (i + 1) % count)} />
                <div className="mt-2 flex justify-center gap-1.5">
                  {Array.from({ length: count }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === index ? "w-5 bg-gold" : "w-1.5 bg-ivory/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GalleryArrow({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={`absolute top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-soft transition hover:bg-ivory ${
        side === "left" ? "-left-3 sm:-left-5" : "-right-3 sm:-right-5"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {side === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}
