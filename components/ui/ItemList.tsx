"use client";

import { useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "motion/react";
import { ProcessedProjectList } from "@/types/ProjectTypes";
import { useMediaQuery } from "@/helpers/useMediaQuery";

interface Props {
  data: ProcessedProjectList;
}

export default function ItemList({ data }: Props) {
  const isDesktop = useMediaQuery(
    "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
    false,
  );
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const imageX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.5 });
  const imageY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.5 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDesktop) return;
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }

  return (
    <div
      className="w-full h-full py-4 cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredImage(null)}
    >
      {isDesktop && (
        <AnimatePresence>
          {hoveredImage && (
            <motion.img
              key={hoveredImage}
              src={hoveredImage}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ x: imageX, y: imageY, translate: "40px -50%" }}
              className="pointer-events-none fixed top-0 left-0 z-40 h-[220px] w-[300px] rounded-2xl object-cover shadow-xl"
            />
          )}
        </AnimatePresence>
      )}

      {data.projects.map((item, index) => (
        <motion.div
          key={index + item.projectName}
          onMouseEnter={() =>
            isDesktop && setHoveredImage(item.projectImage)
          }
          onMouseLeave={() => setHoveredImage(null)}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 22,
            mass: 0.6,
          }}
          className="flex flex-col lg:flex-row gap-4 lg:gap-0 lg:justify-between py-10 border-b border-[#DED8D0]"
        >
          <div className="flex flex-col">
            <h3 className="m-0 font-sans text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground">
              {item.projectName}
            </h3>

            <p
              dangerouslySetInnerHTML={{ __html: item.projectDescription }}
              className="mt-3 mb-0 max-w-[64ch] font-serif text-[15px] leading-[1.65] text-[#4a4844] text-pretty"
            />

            <div className="flex gap-4 mt-4">
              {item.techStacks.map((tech, i) => (
                <span
                  key={i + tech}
                  className="rounded-full text-[10px] text-[#8d8579] uppercase tracking-[0.12em]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div
            className={`${item.liveSite ?? "text-[#c4bfb6]"} flex items-center text-[14px] font-light`}
          >
            <Link href={item.liveSite ?? "/"}>
              {item.liveSite ?? "Internal only "}
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
