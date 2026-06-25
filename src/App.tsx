import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { milestones } from "./data/milestones";
import { daysFromWedding } from "./utils/dateUtils";
import DayCounter from "./components/DayCounter";
import Timeline from "./components/Timeline";
import MilestoneSlide from "./components/MilestoneSlide";
import NavigationControls from "./components/NavigationControls";
import PhotoGalleryModal from "./components/PhotoGalleryModal";
import PhotoStage from "./components/PhotoStage";

export default function App() {
  useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
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
        <div className="flex flex-col gap-2 px-4 pb-3 sm:gap-3 sm:pb-5">
          <MilestoneSlide
            milestone={active}
            slideKey={activeIndex}
            direction={direction}
            onOpenGallery={(start) => setGallery({ open: true, start })}
          />

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
