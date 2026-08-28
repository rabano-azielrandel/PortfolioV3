"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useMediaQuery } from "@/helpers/useMediaQuery";

const FLIP_END = 0.9;
const HEADING_FADE_END = 0.15;
const FLIP_MIN_WIDTH = 1180;
const IMAGE_FINAL_SCALE = 2.6;

export default function Hero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const imageBoxRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery(`(min-width: ${FLIP_MIN_WIDTH}px)`, true);
  const [bottomCorrection, setBottomCorrection] = useState(0);

  useEffect(() => {
    function measure() {
      const imageEl = imageBoxRef.current;
      const stickyEl = stickyRef.current;
      const introEl = introRef.current;
      if (!imageEl || !stickyEl || !introEl) return;

      let offsetSum = 0;
      let node: HTMLElement | null = imageEl;
      while (node && node !== stickyEl) {
        offsetSum += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }

      const naturalHeight = imageEl.offsetHeight;
      const stickyTop = stickyEl.getBoundingClientRect().top;
      const naturalCenterY = stickyTop + offsetSum + naturalHeight / 2;
      const naturalBottomAtFullScale =
        naturalCenterY + (naturalHeight * IMAGE_FINAL_SCALE) / 2;

      const targetBottom = introEl.getBoundingClientRect().bottom;

      setBottomCorrection(targetBottom - naturalBottomAtFullScale);
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const flipProgress = useTransform(scrollYProgress, [0, FLIP_END], [0, 1], {
    clamp: true,
  });

  const rotateY = useTransform(flipProgress, [0, 1], [0, 180]);
  const counterRotateY = useTransform(rotateY, (v) => -v);
  const correctionY = useTransform(flipProgress, [0, 1], [0, bottomCorrection]);

  const scale = useTransform(flipProgress, [0, 1], [1, IMAGE_FINAL_SCALE], {
    ease: (t: number) => t * t,
  });

  const headingOpacity = useTransform(
    scrollYProgress,
    [0, HEADING_FADE_END, 1],
    [1, 0, 0],
  );

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
    <section ref={trackRef} id="HOME" className="relative h-[150vh] pb-2">
      <div
        ref={stickyRef}
        className="sticky top-0 w-full max-w-[1280px] 3xl:max-w-[1350px] h-screen
        mx-auto flex flex-col justify-between"
      >
        {/* heading layer */}
        <motion.div className="relative w-full h-[100vh] flex flex-col items-center pt-20 pb-5">
          <motion.h1
            style={{ opacity: headingOpacity }}
            className="text-[46px] lg:text-[120px] font-extrabold text-center
                lg:leading-[1.10]"
          >
            FULL STACK
            <br />
            <span
              className="text-transparent 
                [-webkit-text-stroke:1.5px_var(--foreground)] 
                lg:[-webkit-text-stroke:2.5px_var(--foreground)] 
                3xl:[-webkit-text-stroke:3.5px_var(--foreground)]"
            >
              DEVELOPER
            </span>
          </motion.h1>

          <motion.p
            style={{ opacity: headingOpacity }}
            className="text-[16px] text-gray-600 font-[400px] pt-7"
          >
            The story is longer than this title suggests.
          </motion.p>

          {/* hero image card */}
          {/* outer wrapper carries only the bottom-alignment correction, so
              its translateY is always a raw screen-space shift, unaffected
              by the scale/rotate applied to the box inside it */}
          <motion.div style={{ y: isDesktop ? correctionY : 0 }}>
            <motion.div
              ref={imageBoxRef}
              style={{
                scale: isDesktop ? scale : 1,
                rotateY: isDesktop ? rotateY : 0,
                opacity: isDesktop ? 1 : headingOpacity,
                transformPerspective: 800,
                transformStyle: "preserve-3d", // preserves the inner counter
              }}
              className="mt-10 w-44 h-52 rounded-lg overflow-hidden bg-gray-700 z-10"
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
          </motion.div>
        </motion.div>

        {/* intro*/}
        <div
          ref={introRef}
          className="absolute inset-x-0 bottom-0 h-132 flex flex-col lg:flex-row
            justify-between items-center px-2 md:px-0 gap-8"
        >
          {/* left text */}
          <div className="w-full h-full flex flex-col justify-between">
            <motion.p
              style={{ opacity: greetingOpacity, y: greetingY }}
              className="w-full lg:max-w-sm text-6xl lg:text-7xl font-medium"
            >
              Oh, <br className="hidden lg:block" /> hi there.
            </motion.p>
            <motion.p
              style={{ opacity: restOpacity, y: restY }}
              className="text-xl font-light max-w-2xs"
            >
              I'm Aziel, A-S-I-Y-E-L. A full-stack developer blending creative
              thinking with logical structure.
            </motion.p>
          </div>

          {/* right text */}
          <motion.div
            style={{ opacity: restOpacity, y: restY }}
            className="w-full lg:max-w-2xs xl:max-w-sm h-full flex flex-col lg:justify-end 
              text-xl font-light gap-4"
          >
            <p>
              I'm drawn to the space where design meets logic—building
              interfaces that feel intentional and systems that are built to
              solve real problems. From web applications to experimental
              projects, I'm always exploring new technologies and better ways to
              turn an idea into something people can actually use.
            </p>

            <a href="#" className="group flex items-center gap-4">
              Get Started
              <span className="group relative w-7 h-7 flex justify-center items-center rounded-xl border border-black overflow-hidden">
                {/* fill layer */}
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
      </div>
    </section>
  );
}
