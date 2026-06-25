interface NavigationControlsProps {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Immersive navigation: large glass chevron buttons pinned to the screen
 * edges, plus a compact "N of M" indicator. Rendered inside the full-screen
 * stage (App positions the edge arrows absolutely).
 */
export default function NavigationControls({
  index,
  total,
  onPrev,
  onNext,
}: NavigationControlsProps) {
  const atStart = index === 0;
  const atEnd = index === total - 1;

  return (
    <>
      {/* Edge arrows */}
      <EdgeArrow side="left" disabled={atStart} onClick={onPrev} />
      <EdgeArrow side="right" disabled={atEnd} onClick={onNext} />

      {/* Position indicator */}
      <div className="flex items-center justify-center">
        <span className="rounded-full border border-ivory/20 bg-ink/30 px-3 py-1 font-sans text-xs tracking-wide text-ivory/80 backdrop-blur-md">
          <span className="font-semibold text-ivory">{index + 1}</span> of{" "}
          {total}
        </span>
      </div>
    </>
  );
}

function EdgeArrow({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const isLeft = side === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isLeft ? "Previous milestone" : "Next milestone"}
      className={`absolute top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/25 bg-ink/30 text-ivory shadow-lg backdrop-blur-md transition hover:bg-ink/50 disabled:cursor-not-allowed disabled:opacity-0 sm:h-14 sm:w-14 ${
        isLeft ? "left-3 sm:left-6" : "right-3 sm:right-6"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 sm:h-7 sm:w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isLeft ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}
