"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { experienceIntro, experienceItems } from "@/data/ExperienceData";

export interface ExperienceItem {
  index: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
}

// desktop-and-up breakpoint for the pinned gallery, matches Hero.tsx's own
// flip threshold - expressed only as literal Tailwind classes below
// (`min-[1180px]:...`) since both branches must stay mounted at all times
// (see note on the wrapper divs further down), so there is no JS-computed
// desktop/mobile boolean gating anything in this component
const INTRO_VH = 60;
const PER_ITEM_VH = 70;
const OUTRO_VH = 40;
// must match the track's `gap-20` class below - the flex gap also applies
// between the leading/trailing spacer and its neighboring tile, so it has
// to be subtracted from the spacer width or the end tiles land off-center
const GALLERY_GAP_PX = 80;

function ExperienceCard({
  item,
  className = "",
  imageClassName = "",
}: {
  item: ExperienceItem;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div
        className={`relative overflow-hidden rounded-2xl bg-[#e5e0d8] ${imageClassName}`}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(min-width: 1180px) 60vw, 85vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs tracking-[0.2em] text-[#8d8579]">
          {item.index}
        </span>
        <h3 className="font-sans text-xl font-bold text-foreground">
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#8d8579]">
            {item.subtitle}
          </p>
        )}
        <p className="font-serif text-sm leading-relaxed text-[#4a4844]">
          {item.description}
        </p>
      </div>
    </div>
  );
}

export default function Experience() {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);

  const [maxTranslate, setMaxTranslate] = useState(0);
  const [leadingSpacer, setLeadingSpacer] = useState("50vw");
  const [trailingSpacer, setTrailingSpacer] = useState("50vw");
  const [activeIndex, setActiveIndex] = useState(0);

  const totalVh = INTRO_VH + experienceItems.length * PER_ITEM_VH + OUTRO_VH;
  const INTRO_END = INTRO_VH / totalVh;
  const OUTRO_START = 1 - OUTRO_VH / totalVh;

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // driven into plain state (rather than bound directly via motion's
  // style={{opacity}}) so the landing screen's fade is applied through a
  // normal React re-render - same reliable path already used for
  // activeIndex/rawIndex below, and avoids whatever throttling motion's own
  // direct DOM write does for this value once the pin section has been
  // scrolled through with a fast, discontinuous input (its live .get() value
  // clamps to 0 correctly, but the element's rendered opacity lagged behind)
  const landingOpacityMotion = useTransform(
    scrollYProgress,
    [0, INTRO_END],
    [1, 0],
    { clamp: true },
  );
  const [landingOpacity, setLandingOpacity] = useState(1);

  useMotionValueEvent(landingOpacityMotion, "change", (v) => {
    setLandingOpacity(v);
  });

  const trackX = useTransform(
    scrollYProgress,
    [INTRO_END, OUTRO_START],
    [0, -maxTranslate],
    { clamp: true },
  );
  const rawIndex = useTransform(
    scrollYProgress,
    [INTRO_END, OUTRO_START],
    [0, Math.max(experienceItems.length - 1, 0)],
    { clamp: true },
  );

  useMotionValueEvent(rawIndex, "change", (v) => {
    setActiveIndex(Math.round(v));
  });

  useEffect(() => {
    const trackEl = trackRef.current;
    if (!trackEl) return;

    function measure() {
      if (!trackEl) return;
      setMaxTranslate(Math.max(0, trackEl.scrollWidth - window.innerWidth));

      const firstWidth = firstItemRef.current?.offsetWidth ?? 0;
      const lastWidth = lastItemRef.current?.offsetWidth ?? 0;
      setLeadingSpacer(`calc(50vw - ${firstWidth / 2 + GALLERY_GAP_PX}px)`);
      setTrailingSpacer(`calc(50vw - ${lastWidth / 2 + GALLERY_GAP_PX}px)`);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(trackEl);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const activeItem = experienceItems[activeIndex];

  return (
    <section id="EXPERIENCE" className="relative">
      {/* desktop pinned gallery - always mounted (never conditionally
          rendered) so useScroll attaches to a real node on the very first
          render; CSS alone (not a JS media-query boolean) decides whether
          it's actually visible, which sidesteps the SSR-hydration timing
          mismatch a JS-computed default would otherwise cause */}
      <div
        ref={outerRef}
        className="relative hidden min-[1180px]:block"
        style={{ height: `${totalVh}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
          {/* landing screen */}
          <div
            style={{ opacity: landingOpacity }}
            className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-8 bg-background px-10 text-center"
          >
            <span className="font-mono text-xs tracking-[0.3em] text-[#8d8579]">
              00 / {String(experienceItems.length).padStart(2, "0")}
            </span>
            <h2 className="max-w-3xl text-balance font-sans text-5xl font-bold leading-[1.05] tracking-[-0.02em] text-foreground">
              {experienceIntro.heading}
            </h2>
            <p className="max-w-md font-serif text-base text-[#4a4844]">
              {experienceIntro.subheading}
            </p>
            <div className="relative mt-4 h-56 w-80 overflow-hidden rounded-2xl bg-[#e5e0d8]">
              <Image
                src={experienceIntro.image}
                alt={experienceIntro.heading}
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
          </div>

          {/* horizontal gallery track */}
          <motion.div
            ref={trackRef}
            style={{ x: trackX }}
            className="flex h-full w-max items-center gap-20 will-change-transform"
          >
            <div
              aria-hidden
              className="h-full shrink-0"
              style={{ width: leadingSpacer }}
            />
            {experienceItems.map((item, i) => (
              <div
                key={item.index}
                ref={
                  i === 0
                    ? firstItemRef
                    : i === experienceItems.length - 1
                      ? lastItemRef
                      : undefined
                }
                className="shrink-0"
              >
                <ExperienceCard
                  item={item}
                  className="w-[min(60vw,760px)]"
                  imageClassName="h-[60vh]"
                />
              </div>
            ))}
            <div
              aria-hidden
              className="h-full shrink-0"
              style={{ width: trailingSpacer }}
            />
          </motion.div>

          {/* numbering readout */}
          <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex items-end justify-between px-10">
            <span className="font-mono text-sm tracking-[0.2em] text-foreground">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(experienceItems.length).padStart(2, "0")}
            </span>
            {activeItem && (
              <div className="max-w-sm text-right">
                <p className="font-sans text-lg font-semibold text-foreground">
                  {activeItem.title}
                </p>
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#8d8579]">
                  {activeItem.subtitle}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile cards - shown only below the desktop breakpoint */}
      <div className="min-[1180px]:hidden py-16">
        <div className="mx-auto max-w-[1280px] px-4">
          <h2 className="mb-8 font-sans text-4xl font-bold text-foreground">
            {experienceIntro.heading}
          </h2>
        </div>
        <div
          data-lenis-prevent
          className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4"
        >
          {experienceItems.map((item) => (
            <ExperienceCard
              key={item.index}
              item={item}
              className="w-[85vw] shrink-0 snap-center"
              imageClassName="h-[45vh]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
