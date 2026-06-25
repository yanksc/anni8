interface NavigationControlsProps {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

/** Prev / Next pills with a "milestone N of M" indicator. */
export default function NavigationControls({
  index,
  total,
  onPrev,
  onNext,
}: NavigationControlsProps) {
  const atStart = index === 0;
  const atEnd = index === total - 1;

  return (
    <div className="flex items-center justify-center gap-4">
      <NavButton direction="prev" disabled={atStart} onClick={onPrev} />

      <span className="min-w-[6.5rem] text-center font-sans text-xs tracking-wide text-ink-soft">
        <span className="font-semibold text-ink">{index + 1}</span> of {total}
      </span>

      <NavButton direction="next" disabled={atEnd} onClick={onNext} />
    </div>
  );
}

function NavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? "Previous milestone" : "Next milestone"}
      className="group inline-flex items-center gap-2 rounded-full border border-gold/40 bg-ivory/70 px-5 py-2.5 font-sans text-sm font-semibold text-ink shadow-soft transition hover:border-gold hover:bg-cream disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-gold/40 disabled:hover:bg-ivory/70"
    >
      {isPrev && <Arrow dir="left" />}
      {isPrev ? "Previous" : "Next"}
      {!isPrev && <Arrow dir="right" />}
    </button>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {dir === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}
