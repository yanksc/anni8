import type { Milestone } from "../data/milestones";

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface PhotoPlaceholderProps {
  milestone: Milestone;
  /** Index within the milestone's intended photo set (for subtle variation). */
  variant?: number;
  className?: string;
}

/**
 * Elegant cream/gold placeholder shown when a milestone has no photos yet.
 * Replace by adding URLs to the milestone's `images` array in milestones.ts.
 */
export default function PhotoPlaceholder({
  milestone,
  variant = 0,
  className = "",
}: PhotoPlaceholderProps) {
  // Tiny rotation between washes so multiple placeholders feel distinct.
  const tilt = variant % 2 === 0 ? "8%" : "92%";
  const color = milestone.dotColor;

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(70% 70% at ${tilt} 18%, ${hexToRgba(color, 0.12)}, var(--color-beige))`,
      }}
    >
      {/* decorative corner flourishes */}
      <div
        className="pointer-events-none absolute inset-3 rounded-xl border"
        style={{ borderColor: hexToRgba(color, 0.3) }}
      />

      <svg
        viewBox="0 0 24 24"
        className="h-9 w-9"
        style={{ color: hexToRgba(color, 0.75) }}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="1.6" />
        <path d="M21 16l-5-5L5 19" />
      </svg>

      <p className="mt-3 font-serif text-lg text-ink">{milestone.year}</p>
      <p className="mt-0.5 font-sans text-[10px] uppercase tracking-[0.25em] text-ink-soft">
        Photo coming soon
      </p>
    </div>
  );
}
