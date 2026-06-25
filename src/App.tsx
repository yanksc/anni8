import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { milestones } from "./data/milestones";
import { daysFromWedding } from "./utils/dateUtils";
import DayCounter from "./components/DayCounter";
import Timeline from "./components/Timeline";
import MilestoneSlide from "./components/MilestoneSlide";
import NavigationControls from "./components/NavigationControls";
import PhotoGalleryModal from "./components/PhotoGalleryModal";
import PhotoStage from "./components/PhotoStage";

export default function App() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [panelVisible, setPanelVisible] = useState(true);
  const [gallery, setGallery] = useState<{ open: boolean; start: number }>({
    open: false,
    start: 0,
  });

  const prevIndex = useRef(0);
  const active = milestones[activeIndex];
  const total = milestones.length;

  const goTo = useCallback(
    (next: number) => {
      setActiveIndex((curr) => {
        const clamped = Math.max(0, Math.min(total - 1, next));
        setDirection(clamped >= curr ? 1 : -1);
        prevIndex.current = curr;
        return clamped;
      });
    },
    [total],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);

  // Arrow-key navigation (ignored while the gallery modal is open).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gallery.open) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, gallery.open]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      {/* Full-bleed cinematic background */}
      <PhotoStage
        image={active.images[0]}
        color={active.dotColor}
        stageKey={activeIndex}
      />

      {/* Foreground chrome */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Counter (top) */}
        <header className="px-4 pt-3 sm:pt-6">
          <DayCounter days={daysFromWedding(active.date)} />
        </header>

        {/* Open middle — lets the sharp photo breathe behind the glass */}
        <div className="flex-1" />

        {/* Bottom cluster: glass panel → timeline → indicator */}
        <div className="flex flex-col gap-2 pb-3 sm:gap-3 sm:pb-5">
          {/* Toggle button row — always visible */}
          <div className="flex items-center justify-end px-4">
            <button
              type="button"
              onClick={() => setPanelVisible((v) => !v)}
              aria-label={panelVisible ? "Hide info panel" : "Show info panel"}
              className="flex items-center gap-1.5 rounded-full border border-ivory/25 bg-ink/40 px-3 py-1 font-sans text-[11px] text-ivory/70 backdrop-blur-md transition hover:bg-ink/60 hover:text-ivory"
            >
              {panelVisible ? (
                <>
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                  Hide
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Show
                </>
              )}
            </button>
          </div>

          {/* Panel (animated in/out) */}
          <AnimatePresence mode="wait">
            {panelVisible && (
              <motion.div
                key="panel"
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <MilestoneSlide
                  milestone={active}
                  slideKey={activeIndex}
                  direction={direction}
                  onOpenGallery={(start) => setGallery({ open: true, start })}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Timeline
            milestones={milestones}
            activeIndex={activeIndex}
            onSelect={goTo}
          />

          <NavigationControls
            index={activeIndex}
            total={total}
            onPrev={goPrev}
            onNext={goNext}
          />
        </div>
      </div>

      {/* Photo gallery modal */}
      <PhotoGalleryModal
        milestone={gallery.open ? active : null}
        startIndex={gallery.start}
        onClose={() => setGallery({ open: false, start: 0 })}
      />
    </div>
  );
}
