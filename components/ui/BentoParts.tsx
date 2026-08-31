import Image from "next/image";
import type { ReactNode } from "react";
import type { BentoEntry, IconKey } from "@/types/HobbiesTypes";

const ICON_PATHS: Record<IconKey, string> = {
  sparkle: "M12 3l2.4 6.1L21 12l-6.6 2.9L12 21l-2.4-6.1L3 12l6.6-2.9z",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  play: "M8 5v14l11-7z",
  film: "M3 5h18v14H3zM8 2l4 3 4-3",
  music:
    "M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  disc: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  headphones:
    "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z",
  mic: "M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v4",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  terminal: "M4 17l6-6-6-6M12 19h8",
  database:
    "M3 5c0-1.1 4-2 9-2s9 .9 9 2v14c0 1.1-4 2-9 2s-9-.9-9-2zM3 12c0 1.1 4 2 9 2s9-.9 9-2",
  box: "M3 7l9-4 9 4v10l-9 4-9-4z",
  map: "M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z",
  target:
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  trophy: "M6 4h12v4a6 6 0 0 1-12 0zM9 20h6M12 14v6",
  star: "M12 3l2.9 5.9 6.6.9-4.8 4.6 1.2 6.5L12 17.8 6.1 20.9l1.2-6.5L2.5 9.8l6.6-.9z",
  close: "M18 6L6 18M6 6l12 12",
  gamepad:
    "M7 8h10a4 4 0 0 1 4 4v3a3 3 0 0 1-5.2 2.1L14 15h-4l-1.8 2.1A3 3 0 0 1 3 15v-3a4 4 0 0 1 4-4zM8.5 10.5v3M7 12h3M15.5 11.5h.01M17.5 13.5h.01",
  fire: "M12 2c3 4 6 7.5 6 11a6 6 0 1 1-12 0c0-1.8.7-3.4 1.8-4.6.3 1.7 1.5 2.9 1.5 2.9-.8-4.3 1-7.7 2.7-9.3z",
};

export function Icon({
  icon,
  className = "h-4 w-4 shrink-0",
}: {
  icon?: IconKey;
  className?: string;
}) {
  const d = (icon && ICON_PATHS[icon]) || ICON_PATHS.star;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={d} />
    </svg>
  );
}

/** The responsive grid every bento screen lays its tiles into. */
export function BentoGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-flow-row-dense grid-cols-2 auto-rows-[110px] gap-2.5 sm:grid-cols-3 sm:auto-rows-[120px] lg:grid-cols-4 lg:auto-rows-[130px]">
      {children}
    </div>
  );
}

/**
 * The categories screen and the "inside a category" screen both repeat the
 * same 4-tile rhythm: one big tile, then three smaller ones of different
 * shapes. This picks the size classes for the tile at a given position.
 */
export function mosaicTileSize(position: number): string {
  const step = position % 4;
  if (step === 0) return "col-span-2 row-span-2";
  if (step === 1)
    return "col-span-1 row-span-2 sm:col-span-1 sm:row-span-1 lg:col-span-2 lg:row-span-1";
  if (step === 2) return "col-span-1 row-span-1 sm:row-span-2";
  return "col-span-1 row-span-1 lg:row-span-2";
}

export const DECORATIVE_TILES = [
  { number: "01", caption: "four rooms" },
  { number: "02", caption: "no order" },
  { number: "03", caption: "pick one" },
  { number: "04", caption: "in progress" },
];

/**
 * A blank, numbered filler tile — same look as the decorative tiles above.
 * Used on its own (not through DECORATIVE_TILES) to plug the empty cell the
 * mosaic leaves at specific breakpoints, e.g. `className="hidden lg:flex"`.
 */
export function FillerTile({
  number,
  caption,
  className = "",
}: {
  number: string;
  caption: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`col-span-1 row-span-1 flex-col justify-between rounded-lg border border-foreground/10 px-3.5 py-3 ${className}`}
    >
      <span className="font-sans text-2xl leading-none text-foreground/40">
        {number}
      </span>
      <span className="font-mono text-[10px] uppercase leading-none tracking-[0.16em] text-foreground/50">
        {caption}
      </span>
    </div>
  );
}

/**
 * A static (non-clickable) tile: banners, headers. Colors here are plain
 * Tailwind classes, not data-driven — change them directly to restyle.
 */
export function Tile({
  solidBorder = false,
  className = "",
  children,
}: {
  solidBorder?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-lg border ${solidBorder ? "border-foreground/40" : "border-foreground/15"} ${className}`}
    >
      {children}
    </div>
  );
}

/** A clickable tile — every navigable tile in the bento uses this. */
export function TileButton({
  onClick,
  ariaLabel,
  className = "",
  children,
}: {
  onClick: () => void;
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`group relative flex flex-col overflow-hidden rounded-lg border border-foreground/15 text-left transition-transform duration-200 hover:-translate-y-0.5 hover:border-foreground/40 hover:bg-foreground/5 focus-visible:-translate-y-0.5 focus-visible:border-foreground/40 focus-visible:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40 ${className}`}
    >
      {children}
    </button>
  );
}

/** An entry's cover image, or a placeholder showing the title's first letter. */
export function Cover({
  entry,
  isLarge = false,
  showRating = false,
  footer,
  className = "",
}: {
  entry?: BentoEntry;
  isLarge?: boolean;
  showRating?: boolean;
  footer?: ReactNode;
  className?: string;
}) {
  const initial = (entry?.title || "?").trim()[0];
  return (
    <span
      className={`relative grid min-h-0 flex-1 place-items-center bg-foreground/5 ${className}`}
    >
      {entry?.image ? (
        <Image
          src={entry.image}
          alt={entry.title}
          fill
          sizes="1"
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover ${entry.position ?? "object-[50%_60%]"}`}
        />
      ) : (
        <span
          className={`font-sans leading-none text-foreground/30 ${isLarge ? "text-6xl sm:text-7xl" : "text-3xl sm:text-4xl"}`}
        >
          {initial}
        </span>
      )}
      <span className="absolute left-2.5 top-2 rounded bg-background/80 p-1 text-foreground">
        <Icon icon={entry?.icon} className="h-3.5 w-3.5 shrink-0" />
      </span>
      {showRating && entry?.rating != null ? (
        <span className="absolute right-2.5 top-2 rounded bg-background/80 px-1.5 py-1 font-mono text-[11px] leading-none text-foreground">
          {entry.rating}
        </span>
      ) : null}
      {footer ? (
        <span className="absolute inset-x-0 bottom-0 z-10 flex flex-col  border-t border-background/20 bg-background/30 px-3.5 py-2 backdrop-blur-xs backdrop-saturate-150">
          {footer}
        </span>
      ) : null}
    </span>
  );
}

/** The exit affordance shown on the "category" screen. */
export function ExitTile({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Back to ${label}`}
      className="group col-span-1 row-span-1 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-foreground/20 transition-transform duration-200 hover:-translate-y-0.5 hover:border-foreground/50"
    >
      <Icon
        icon="close"
        className="h-4 w-4 shrink-0 text-foreground/40 group-hover:text-foreground/80"
      />
      <span className="text-center font-mono text-[10px] uppercase leading-none tracking-[0.16em] text-foreground/60">
        {label}
      </span>
    </button>
  );
}
