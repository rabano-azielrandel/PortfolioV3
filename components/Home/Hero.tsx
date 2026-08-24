"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

// end of the flip animation before it reaches the bottom
const FLIP_END = 0.9;

// below this viewport width, the flip is turned off entirely and the image
// just sits at its starting size/rotation regardless of scroll.
const FLIP_MIN_WIDTH = 1180;

// tracks a min-width media query as a boolean. Starts `true` (assumes
// desktop) since `window` doesn't exist yet on the server/first paint -
// the effect corrects it to the real value as soon as it mounts.
function useIsDesktop(minWidth: number) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${minWidth}px)`);
    setIsDesktop(query.matches);

    function onChange(event: MediaQueryListEvent) {
      setIsDesktop(event.matches);
    }

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [minWidth]);

  return isDesktop;
}

export default function Hero() {
  // element being tracked
  const trackRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop(FLIP_MIN_WIDTH);

  // live readout of where we are in the tracked element
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // ratio/rescale also responsible for ending the flip
  const flipProgress = useTransform(scrollYProgress, [0, FLIP_END], [0, 1], {
    clamp: true,
  });

  // the flip itself. one linear turn, 0deg to 180deg, over flipProgress.
  const rotateY = useTransform(flipProgress, [0, 1], [0, 180]);

  // always the exact opposite of rotateY
  const counterRotateY = useTransform(rotateY, (v) => -v);

  // for image box growth
  const scale = useTransform(flipProgress, [0, 1], [1, 2.6], {
    ease: (t: number) => t * t,
  });

  const headingOpacity = useTransform(scrollYProgress, [0, 0.15, 1], [1, 0, 0]);

  const mapRange = (
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number,
  ) => {
    const t = Math.min(Math.max((value - inMin) / (inMax - inMin), 0), 1);
    return outMin + t * (outMax - outMin);
  };

  const greetingOpacity = useTransform(scrollYProgress, (v) =>
    mapRange(v, 0.75, 0.9, 0, 1),
  );
  const greetingY = useTransform(scrollYProgress, (v) =>
    mapRange(v, 0.75, 0.9, 40, 0),
  );
  const restOpacity = useTransform(scrollYProgress, (v) =>
    mapRange(v, 0.9, 1, 0, 1),
  );
  const restY = useTransform(scrollYProgress, (v) =>
    mapRange(v, 0.9, 1, 40, 0),
  );

  return (
    <section ref={trackRef} className="relative h-[150vh] pb-10">
      {/* sticky top-0 h-screen` pins this content for parallax feel */}
      <div className="sticky top-0 h-screen w-full px-4 overflow-hidden">
        <div className="w-full max-w-[1280px] h-full mx-auto flex flex-col justify-between">
          {/* heading layer */}
          <motion.div
            style={{ opacity: headingOpacity }}
            className="relative w-full flex flex-col justify-center items-center py-24"
          >
            <h1 className="text-[46px] lg:text-[120px] 3xl:text-[174px] font-extrabold text-center">
              FULL STACK
              <br />
              DEVELOPER
            </h1>

            {/* offset elements */}
          </motion.div>

          {/* image + intro*/}
          <div className="relative flex-1">
            {/* intro layer - fills the whole stage, image renders over it */}
            <div className="absolute inset-x-0 bottom-10 h-132 flex flex-col lg:flex-row justify-between items-center gap-8">
              {/* left text */}
              <div className="h-full flex flex-col justify-between max-w-sm">
                <motion.p
                  style={{ opacity: greetingOpacity, y: greetingY }}
                  className="text-6xl lg:text-7xl font-medium"
                >
                  Oh, <br /> hi there.
                </motion.p>
                <motion.p
                  style={{ opacity: restOpacity, y: restY }}
                  className="text-xl font-light"
                >
                  I'm Aziel, A-S-I-Y-E-L. A full-stack developer blending
                  creative thinking with logical structure.
                </motion.p>
              </div>

              {/* right text */}
              <motion.div
                style={{ opacity: restOpacity, y: restY }}
                className="h-full flex flex-col justify-end max-w-sm text-xl font-light gap-4"
              >
                <p>
                  I'm drawn to the space where design meets logic—building
                  interfaces that feel intentional and systems that are built to
                  solve real problems. From web applications to experimental
                  projects, I'm always exploring new technologies and better
                  ways to turn an idea into something people can actually use.
                </p>

                <a href="#" className="group flex items-center gap-4">
                  Get Started
                  <span className="group relative w-7 h-7 flex justify-center items-center rounded-xl border border-black overflow-hidden">
                    {/* Diagonal fill layer, scoped to this span only */}
                    <span
                      className="absolute inset-0 rounded-xl bg-black origin-bottom-left scale-0
                        transition-transform duration-300 ease-out
                        group-hover:scale-100"
                    />

                    <Image
                      src={"/icons/arrow2.png"}
                      alt="arrow"
                      width={50}
                      height={50}
                      className="relative z-10 w-5 h-auto object-contain invert group-hover:invert-0 transition duration-500"
                    />
                  </span>
                </a>
              </motion.div>
            </div>

            {/* hero image card */}
            <motion.div
              style={{
                scale: isDesktop ? scale : 1,
                rotateY: isDesktop ? rotateY : 0,
                transformPerspective: 800,
                transformStyle: "preserve-3d", // preserves the inner counter
              }}
              className="lg:absolute lg:inset-0 m-auto w-44 h-52 mb-48 rounded-lg overflow-hidden bg-gray-700 z-10"
            >
              {/* counter-rotated wrapper*/}
              <motion.div
                style={{ rotateY: isDesktop ? counterRotateY : 0 }}
                className="relative w-full h-full"
              >
                <Image
                  src="/images/hero.png"
                  alt="hero"
                  fill
                  sizes="1"
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
