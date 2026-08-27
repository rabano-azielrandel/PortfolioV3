"use client";

import Image from "next/image";
import { useLenis } from "lenis/react";
import { navs } from "@/data/HeaderData";

export default function Header() {
  const lenis = useLenis();

  return (
    <nav className="sticky top-10 w-full h-full mt-10 z-10">
      <div className="w-full max-w-[288px] mx-auto flex gap-4 p-2 rounded-xl bg-foreground">
        {navs.map((item) => (
          <a
            key={item.name}
            href={`#${item.sectionId}`}
            className="cursor-pointer"
            onClick={(e) => {
              if (!lenis) return;
              e.preventDefault();
              lenis.scrollTo(`#${item.sectionId}`);
            }}
          >
            <Image
              src={item.path}
              alt={item.name}
              width={50}
              height={50}
              className="object-contain w-[50px] h-auto"
            />
          </a>
        ))}
      </div>
    </nav>
  );
}
