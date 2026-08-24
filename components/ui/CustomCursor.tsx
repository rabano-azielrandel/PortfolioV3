"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

// ring lags behind the raw pointer position via spring physics - small,
// quick movements let the dot slip toward the edge before the ring catches up
const RING_SPRING = { damping: 25, stiffness: 300, mass: 0.5 };
const HOVER_SPRING = { damping: 20, stiffness: 300 };

const DOT_SIZE = 8;
const RING_SIZE = 32;
const HOVER_SCALE = 1.6;

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], .cursor-pointer';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // raw pointer position - the dot follows this directly, no delay
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const ringX = useSpring(mouseX, RING_SPRING);
  const ringY = useSpring(mouseY, RING_SPRING);

  // offset by half the element size so each shape is centered on the point
  const dotX = useTransform(mouseX, (v) => v - DOT_SIZE / 2);
  const dotY = useTransform(mouseY, (v) => v - DOT_SIZE / 2);
  const ringOffsetX = useTransform(ringX, (v) => v - RING_SIZE / 2);
  const ringOffsetY = useTransform(ringY, (v) => v - RING_SIZE / 2);

  useEffect(() => {
    // skip on touch devices - there's no hovering pointer to replace
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.body.classList.add("custom-cursor-active");

    function onMouseMove(event: MouseEvent) {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      setEnabled(true);
    }

    // pointerover/pointerout (unlike mouseenter/mouseleave) bubble, so a
    // single listener on document can catch every interactive element via
    // event.target.closest() - no per-pixel elementFromPoint lookup needed
    function onPointerOver(event: PointerEvent) {
      if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) {
        setIsHovering(true);
      }
    }

    function onPointerOut(event: PointerEvent) {
      const related = event.relatedTarget;
      const stillInside = related instanceof Element && related.closest(INTERACTIVE_SELECTOR);
      if (!stillInside) setIsHovering(false);
    }

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        style={{
          x: ringOffsetX,
          y: ringOffsetY,
          width: RING_SIZE,
          height: RING_SIZE,
        }}
        animate={{ scale: isHovering ? HOVER_SCALE : 1 }}
        transition={HOVER_SPRING}
        className="fixed top-0 left-0 z-[9999] rounded-full border border-background mix-blend-difference pointer-events-none"
      />
      <motion.div
        style={{ x: dotX, y: dotY, width: DOT_SIZE, height: DOT_SIZE }}
        animate={{ scale: isHovering ? HOVER_SCALE : 1 }}
        transition={HOVER_SPRING}
        className="fixed top-0 left-0 z-[9999] rounded-full bg-background mix-blend-difference pointer-events-none"
      />
    </>
  );
}
