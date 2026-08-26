"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

type MarqueeTextItem = {
  type: "text";
  content: string;
};

type MarqueeImageItem = {
  type: "image";
  src: string;
  alt: string;
};

export type MarqueeItem = MarqueeTextItem | MarqueeImageItem;

export type MarqueeRow = {
  direction: "left" | "right";
  items: MarqueeItem[];
  /** seconds for one full loop of the row */
  speed?: number;
  /** image shown between every item in the row */
  separator?: string;
};

type MarqueeProps = {
  rows: MarqueeRow[];
  /** gap between items, in px */
  gap?: number;
  className?: string;
};

const DEFAULT_SPEED = 30;
const DEFAULT_GAP = 40;

function MarqueeItemView({
  item,
  gap,
  separator,
}: {
  item: MarqueeItem;
  gap: number;
  separator?: string;
}) {
  // gap is split evenly around the separator so items stay evenly spaced
  // whether or not a separator is present.
  const half = separator ? gap / 2 : gap;

  return (
    <div className="flex shrink-0 items-center" style={{ marginRight: half }}>
      {item.type === "image" ? (
        <div className="w-[180px] h-[180px] shrink-0 flex items-center justify-center p-10">
          <Image
            src={item.src}
            alt={item.alt}
            width={180}
            height={180}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <span className="min-w-[100px] text-center font-light shrink-0 whitespace-nowrap">
          {item.content}
        </span>
      )}
      {separator && (
        <Image
          src={separator}
          alt=""
          width={28}
          height={28}
          aria-hidden
          className="shrink-0 object-contain"
          style={{ marginLeft: half }}
        />
      )}
    </div>
  );
}

// one pass over the row's items. every item (including the last) carries
// its own trailing margin, so N copies placed back to back compose to
// exactly N * (this component's rendered width) - no extra "connecting"
// gap sneaks in between copies the way a flex `gap` on the parent would.
function MarqueeCopy({
  items,
  gap,
  separator,
  ariaHidden,
}: {
  items: MarqueeItem[];
  gap: number;
  separator?: string;
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="flex shrink-0 items-center py-2 border-y border-black"
      aria-hidden={ariaHidden}
    >
      {items.map((item, index) => (
        <MarqueeItemView
          key={index}
          item={item}
          gap={gap}
          separator={separator}
        />
      ))}
    </div>
  );
}

function MarqueeLane({ row, gap }: { row: MarqueeRow; gap: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [{ repeats, copyWidth }, setLayout] = useState({
    repeats: 2,
    copyWidth: 0,
  });

  useLayoutEffect(() => {
    const track = trackRef.current;
    const measure = measureRef.current;
    if (!track || !measure) return;

    const recalculate = () => {
      const width = measure.scrollWidth;
      if (width === 0) return;
      // enough copies that the track never runs out of tiled content
      // while sliding by one copy-width per loop.
      const needed = Math.max(2, Math.ceil(track.clientWidth / width) + 1);
      setLayout((prev) =>
        prev.repeats === needed && prev.copyWidth === width
          ? prev
          : { repeats: needed, copyWidth: width },
      );
    };

    recalculate();

    const observer = new ResizeObserver(recalculate);
    observer.observe(track);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [row.items, gap]);

  return (
    <div ref={trackRef} className="relative overflow-hidden">
      {/* invisible single pass, used only to measure the loop unit width */}
      <div
        ref={measureRef}
        className="absolute top-0 left-0 invisible pointer-events-none flex"
        aria-hidden
      >
        <MarqueeCopy items={row.items} gap={gap} separator={row.separator} />
      </div>

      <div
        className="flex w-max"
        style={
          {
            animationName: copyWidth ? "marquee-scroll" : "none",
            animationDuration: `${row.speed ?? DEFAULT_SPEED}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDirection:
              row.direction === "right" ? "reverse" : "normal",
            "--marquee-distance": `${copyWidth}px`,
          } as React.CSSProperties
        }
      >
        {Array.from({ length: repeats }).map((_, copyIndex) => (
          <MarqueeCopy
            key={copyIndex}
            items={row.items}
            gap={gap}
            separator={row.separator}
            ariaHidden={copyIndex > 0}
          />
        ))}
      </div>
    </div>
  );
}

export default function Marquee({
  rows,
  gap = DEFAULT_GAP,
  className,
}: MarqueeProps) {
  return (
    <div className={className}>
      {rows.map((row, index) => (
        <MarqueeLane key={index} row={row} gap={gap} />
      ))}
    </div>
  );
}
