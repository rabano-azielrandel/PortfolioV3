"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

export type BotProps = {
  /** Front face headline — sits above the droid. */
  title: string;
  /** Back face copy — revealed when the card flips. */
  paragraph: string;
  /** Band background colour. */
  background?: string;
  /** Line + type colour. */
  ink?: string;
  /** Small monospace note, top-left. Pass "" to omit. */
  kicker?: string;
  /** Band height in px. */
  height?: number;
  className?: string;
};

const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
const MONO = "font-mono text-[10px] tracking-[0.22em] text-[#8d8579]";

export default function Bot({
  title,
  paragraph,
  background = "#f2efec",
  ink = "#141414",
  kicker = "SENTRY · AXIS X",
  height = 424,
  className = "",
}: BotProps) {
  const card = useRef<HTMLDivElement | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [idle, setIdle] = useState(true);
  const [coarse, setCoarse] = useState(false);

  /* ---------- motion values: one spring chain, no React re-renders ---------- */
  const targetX = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 70, damping: 20, mass: 0.7 });
  const roll = useTransform(x, (v) => (v / 47) * 57.2958);

  const velocity = useVelocity(x);
  const lead = useSpring(
    useTransform(velocity, (v) => clamp(v * 0.014, 14)),
    { stiffness: 140, damping: 20 },
  );
  const tiltFromVel = useSpring(
    useTransform(velocity, (v) => clamp(v * 0.007, 9)),
    { stiffness: 140, damping: 20 },
  );
  const idleTilt = useMotionValue(0);
  const tilt = useTransform(
    [tiltFromVel, idleTilt] as const,
    ([a, b]: number[]) => a + b,
  );

  const eyeTargetX = useMotionValue(0);
  const eyeTargetY = useMotionValue(2);
  const eyeX = useSpring(eyeTargetX, { stiffness: 180, damping: 22 });
  const eyeY = useSpring(eyeTargetY, { stiffness: 180, damping: 22 });

  useEffect(() => {
    animate(idleTilt, idle ? 3 : 0, { duration: 0.5 });
  }, [idle, idleTilt]);

  /* ---------- pointer input ---------- */
  useEffect(() => {
    let timer: number | undefined;
    const onMove = (e: PointerEvent) => {
      const r = card.current?.getBoundingClientRect();
      if (!r) return;
      const dx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), 1);
      targetX.set(dx * (r.width / 2 - 96));
      eyeTargetX.set(dx * 3.2);
      eyeTargetY.set(
        clamp((e.clientY - (r.top + r.height * 0.6)) / 140, 1) * 3,
      );
      setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setIdle(true);
        eyeTargetX.set(0);
        eyeTargetY.set(2);
      }, 2000);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.clearTimeout(timer);
    };
  }, [targetX, eyeTargetX, eyeTargetY]);

  /* ---------- coarse pointer? tap instead of scroll ---------- */
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(pointer: coarse)");
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  /* ---------- desktop: scroll over the card flips it, then page scroll resumes ---------- */
  useEffect(() => {
    const node = card.current;
    if (!node || coarse) return;
    let acc = 0;
    let lock = 0;
    const onWheel = (e: WheelEvent) => {
      if (performance.now() < lock) {
        e.preventDefault();
        return;
      }
      const down = e.deltaY > 0;
      if (down === flipped) return;
      acc += Math.abs(e.deltaY);
      e.preventDefault();
      if (acc > 60) {
        acc = 0;
        lock = performance.now() + 700;
        setFlipped(down);
      }
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [coarse, flipped]);

  const onTap = useCallback(() => {
    if (coarse) setFlipped((f) => !f);
  }, [coarse]);

  const eyeStyle = { x: eyeX, y: eyeY };
  const lens = "rounded-full will-change-transform";

  return (
    <section className="w-full h-full">
      <div className="w-full max-w-[1280px] 3xl:max-w-[1350px] mx-auto">
        <div
          ref={card}
          onClick={onTap}
          style={{ height, background, perspective: 1600 }}
          className={`relative overflow-hidden rounded-[14px] border border-[#e0dad2] [touch-action:manipulation] ${coarse ? "cursor-pointer" : ""} ${className}`}
        >
          <motion.div
            className="absolute inset-0 [transform-style:preserve-3d]"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.82, ease: [0.7, 0, 0.2, 1] }}
          >
            {/* ---------------- front: title + rolling droid ---------------- */}
            <div className="absolute inset-0 [backface-visibility:hidden]">
              {kicker ? (
                <div className={`absolute left-11 top-[30px] ${MONO}`}>
                  {kicker}
                </div>
              ) : null}

              <h2
                style={{ color: ink }}
                className="absolute inset-x-0 top-[74px] m-0 px-12 text-center font-sans text-[72px] font-bold leading-[0.94] tracking-[-0.028em] text-balance"
              >
                {title}
              </h2>

              <motion.div
                style={{ x }}
                className="absolute bottom-[85px] left-1/2 -ml-[70px] w-[140px] will-change-transform"
              >
                <div className="absolute -bottom-1.5 left-[22px] h-[11px] w-24 rounded-full bg-[radial-gradient(50%_50%,rgba(20,20,20,.24),rgba(20,20,20,0)_70%)]" />
                <div className="relative h-[150px]">
                  {/* body — spin derived from distance travelled */}
                  <motion.div
                    style={{ rotate: roll, borderColor: ink, background }}
                    className="absolute bottom-0 left-[22px] h-24 w-24 rounded-full border-[1.5px] will-change-transform"
                  >
                    <div
                      style={{ borderColor: ink }}
                      className="absolute left-3 top-[30px] h-[34px] w-[34px] rounded-full border-[1.5px]"
                    />
                    <div
                      style={{ borderColor: ink }}
                      className="absolute left-[22px] top-10 h-[14px] w-[14px] rounded-full border"
                    />
                    <div
                      style={{ borderColor: ink }}
                      className="absolute right-2 top-[14px] h-[22px] w-[22px] rounded-full border-[1.5px]"
                    />
                    <div
                      style={{ borderColor: ink }}
                      className="absolute bottom-2.5 left-10 h-4 w-4 rounded-full border-[1.5px]"
                    />
                    <div
                      style={{ background: ink }}
                      className="absolute left-[46px] top-1 h-[22px] w-px"
                    />
                    <div
                      style={{ background: ink }}
                      className="absolute bottom-[26px] right-3 h-px w-5"
                    />
                  </motion.div>

                  {/* dome — stays upright, leads the turn */}
                  <motion.div
                    style={{
                      x: lead,
                      rotate: tilt,
                      transformOrigin: "50% 160%",
                    }}
                    className="absolute bottom-[88px] left-9 h-10 w-[68px] will-change-transform"
                  >
                    <div
                      style={{ background: ink }}
                      className="absolute inset-0 rounded-t-[34px] rounded-b-[3px]"
                    />
                    <div
                      style={{ background, borderColor: ink }}
                      className="absolute -left-[3px] bottom-0 box-border h-[3px] w-[74px] border-y"
                    />
                    <div
                      style={{ background: ink }}
                      className="absolute left-[26px] -top-[26px] h-[26px] w-px"
                    />
                    <div
                      style={{ background: ink }}
                      className="absolute left-[38px] -top-4 h-4 w-px rotate-[8deg]"
                    />
                    <div className="absolute left-3 top-3 h-[18px] w-[46px] overflow-hidden">
                      <div className="absolute inset-0 flex items-center gap-2">
                        <motion.div
                          style={{
                            ...eyeStyle,
                            background,
                            boxShadow: `inset 0 0 0 4px ${ink}`,
                          }}
                          animate={{ scaleY: idle ? 0.16 : 1 }}
                          transition={{ duration: 0.35 }}
                          className={`h-[18px] w-[18px] ${lens}`}
                        />
                        <motion.div
                          style={{
                            ...eyeStyle,
                            background,
                            boxShadow: `inset 0 0 0 2.5px ${ink}`,
                          }}
                          animate={{ scaleY: idle ? 0.16 : 1 }}
                          transition={{ duration: 0.35 }}
                          className={`h-2.5 w-2.5 ${lens}`}
                        />
                      </div>
                      {/* blink */}
                      <motion.div
                        style={{ background: ink, transformOrigin: "50% 0" }}
                        className="absolute inset-0"
                        animate={{ scaleY: [0, 0, 1, 0] }}
                        transition={{
                          duration: 7.8,
                          times: [0, 0.955, 0.974, 0.99],
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className={`absolute inset-x-0 bottom-14 text-center ${MONO}`}
                animate={{ opacity: idle ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              >
                STANDBY
              </motion.div>
            </div>

            {/* ---------------- back: paragraph ---------------- */}
            <div className="absolute inset-0 flex items-center justify-center box-border px-24 py-[72px] [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <p
                style={{ color: ink }}
                className="m-0 max-w-[62ch] text-justify font-sans text-[19px] leading-[1.72] text-pretty"
              >
                {paragraph}
              </p>
              <div className={`absolute left-11 top-[30px] ${MONO}`}>
                {coarse ? "TAP TO RETURN" : "SCROLL UP TO RETURN"}
              </div>
            </div>
          </motion.div>

          {/* ---------------- affordance ---------------- */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-5 z-[3] flex items-center justify-center gap-2.5"
            animate={{ opacity: flipped ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {coarse ? (
              <>
                <span className="relative inline-block h-3.5 w-3.5">
                  <span
                    style={{ borderColor: ink }}
                    className="absolute inset-0 rounded-full border"
                  />
                  <motion.span
                    style={{ borderColor: ink }}
                    className="absolute inset-0 rounded-full border"
                    animate={{ scale: [0.6, 1.5], opacity: [0.9, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                </span>
                <span className={MONO}>TAP TO READ</span>
              </>
            ) : (
              <>
                <span
                  style={{ borderColor: ink }}
                  className="relative inline-block h-5 w-[13px] overflow-hidden rounded-[7px] border"
                >
                  <motion.span
                    style={{ background: ink }}
                    className="absolute left-[5px] top-[5px] h-[5px] w-0.5"
                    animate={{ y: [-6, 7], opacity: [0, 1, 0] }}
                    transition={{
                      duration: 1.7,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </span>
                <span className={MONO}>SCROLL TO READ</span>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
