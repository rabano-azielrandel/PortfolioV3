import type { MarqueeRow } from "@/components/ui/Marquee";

const coreStacks = [
  "NEXT.JS",
  "REACT",
  "TYPESCRIPT",
  "TAILWIND CSS",
  "C#",
  ".NET",
  "ASP.NET CORE",
  "PYTHON",
  "SQL",
  "SQL SERVER",
  "SUPABASE",
  "GIT",
];

export const skillRows: MarqueeRow[] = [
  {
    direction: "right",
    speed: 25,
    separator: "/icons/marquee-separator3.png",
    items: [
      { type: "text", content: "NEXT.JS" },
      { type: "text", content: "REACT" },
      { type: "text", content: "TYPESCRIPT" },
      { type: "text", content: "TAILWIND CSS" },
      { type: "text", content: "C#" },
      { type: "text", content: ".NET" },
      { type: "text", content: "ASP.NET CORE" },
      { type: "text", content: "SQL" },
      { type: "text", content: "SQL SERVER" },
      { type: "text", content: "SUPABASE" },
      { type: "text", content: "GIT" },
    ],
  },
];
