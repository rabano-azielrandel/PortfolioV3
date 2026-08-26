"use client";

import { useEffect, useRef } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";

const DOT_COUNT = 4;

// wider than a dense-grid stagger would use, since with only four dots the
// spread still needs to read as deliberate rather than jittery.
const STAGGER = 0.09;
const SEPARATION_DURATION = 0.4;
const DOT_TRAVEL = 90; // px, from the column's center

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

export default function DotColumn() {
  const sectionRef = useRef<HTMLElement>(null);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    let frameId: number;

    const tick = () => {
      const section = sectionRef.current;

      if (section) {
        const rect = section.getBoundingClientRect();
        const p = clamp(-rect.top / (rect.height - window.innerHeight));

        for (let i = 0; i < DOT_COUNT; i++) {
          const dot = dotRefs.current[i];
          if (!dot) continue;

          const local = clamp((p - i * STAGGER) / SEPARATION_DURATION);
          const eased = smoothstep(local);
          const translateY = eased * (i - (DOT_COUNT - 1) / 2) * DOT_TRAVEL;
          const opacity = 1 - clamp((local - 0.5) / 0.5);

          dot.style.transform = `translateY(${translateY}px)`;
          dot.style.opacity = String(opacity);
        }
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section ref={sectionRef} style={{ position: "relative", height: "300vh" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          {Array.from({ length: DOT_COUNT }).map((_, i) => (
            <span
              key={i}
              data-dotrow
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                backgroundColor: "var(--foreground)",
                opacity: 0.34,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// translateY + opacity for one dot, as a pure transform of an external 0..1
// progress value - same separate-then-fade math as the standalone DotColumn,
// just driven by a caller-supplied MotionValue instead of its own rAF loop.
function useDotMotion(progress: MotionValue<number>, index: number) {
  const y = useTransform(progress, (p) => {
    const local = clamp((p - index * STAGGER) / SEPARATION_DURATION);
    return smoothstep(local) * (index - (DOT_COUNT - 1) / 2) * DOT_TRAVEL;
  });
  const opacity = useTransform(progress, (p) => {
    const local = clamp((p - index * STAGGER) / SEPARATION_DURATION);
    return 1 - clamp((local - 0.5) / 0.5);
  });
  return { y, opacity };
}

// same dot column as DotColumn, but without its own <section> runway - for
// embedding inside a layout that already has a scroll-linked progress value
// (e.g. a hero's scrollYProgress).
export function DotColumnArtwork({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const dot0 = useDotMotion(progress, 0);
  const dot1 = useDotMotion(progress, 1);
  const dot2 = useDotMotion(progress, 2);
  const dot3 = useDotMotion(progress, 3);
  const dots = [dot0, dot1, dot2, dot3];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      {dots.map((dot, i) => (
        <motion.span
          key={i}
          data-dotrow
          style={{
            y: dot.y,
            opacity: dot.opacity,
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: "var(--foreground)",
          }}
        />
      ))}
    </div>
  );
}
