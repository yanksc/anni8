import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { milestones } from "./data/milestones";
import { daysFromWedding } from "./utils/dateUtils";
import DayCounter from "./components/DayCounter";
import Timeline from "./components/Timeline";
import MilestoneSlide from "./components/MilestoneSlide";
import NavigationControls from "./components/NavigationControls";
import PhotoGalleryModal from "./components/PhotoGalleryModal";

export default function App() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [gallery, setGallery] = useState<{ open: boolean; start: number }>({
    open: false,
    start: 0,
  });

  const prevIndex = useRef(0);
  const active = milestones[activeIndex];
  const total = milestones.length;

  const goTo = useCallback((next: number) => {
    setActiveIndex((curr) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      setDirection(clamped >= curr ? 1 : -1);
      prevIndex.current = curr;
      return clamped;
    });
  }, [total]);

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
    <div className="flex min-h-screen flex-col">
      {/* Header / counter */}
      <header className="px-4 pt-8 sm:pt-12">
        <DayCounter days={daysFromWedding(active.date)} />
      </header>

      {/* Timeline */}
      <section className="mt-8 sm:mt-10" aria-label="Timeline of milestones">
        <Timeline
          milestones={milestones}
          activeIndex={activeIndex}
          onSelect={goTo}
        />
      </section>

      {/* Active milestone slide */}
      <main className="mt-8 flex flex-1 items-center sm:mt-10">
        <div className="w-full">
          <MilestoneSlide
            milestone={active}
            slideKey={activeIndex}
            direction={direction}
            onOpenGallery={(start) => setGallery({ open: true, start })}
          />
        </div>
      </main>

      {/* Navigation */}
      <div className="mt-8 px-4 pb-6">
        <NavigationControls
          index={activeIndex}
          total={total}
          onPrev={goPrev}
          onNext={goNext}
        />
      </div>

      {/* Footer note */}
      <motion.footer
        className="pb-8 text-center font-serif italic text-sm text-ink-soft/80"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        Happy 8th anniversary — here's to every chapter still unwritten. ♥
      </motion.footer>

      {/* Photo gallery modal */}
      <PhotoGalleryModal
        milestone={gallery.open ? active : null}
        startIndex={gallery.start}
        onClose={() => setGallery({ open: false, start: 0 })}
      />
    </div>
  );
}
