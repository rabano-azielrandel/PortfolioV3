export type IconKey =
  | "sparkle"
  | "book"
  | "play"
  | "film"
  | "music"
  | "disc"
  | "headphones"
  | "mic"
  | "code"
  | "terminal"
  | "database"
  | "box"
  | "map"
  | "target"
  | "trophy"
  | "star"
  | "close"
  | "gamepad"
  | "fire";

export interface BentoEntry {
  title: string;
  /** tailwind object-position class, e.g. "object-[50%_60%]" — defaults to centered */
  position?: string;
  icon?: IconKey;
  image?: string;
  description?: string;
  rating?: string | number;
  meta?: string;
}

export interface BentoFillerImage {
  image: string;
  /** tailwind object-position class, e.g. "object-[50%_60%]" — defaults to centered */
  position?: string;
}

export interface BentoCategory {
  id?: string;
  label: string;
  icon?: IconKey;
  cover: string;
  cover2: string;
  description?: string;
  filler: BentoFillerImage[];
  entries: BentoEntry[];
}

/** Which screen of the bento is currently showing. */
export type BentoView =
  | "categories" // the grid of every category
  | "category"; // the entries inside one category

export interface HobbiesBentoProps {
  data: BentoCategory[];
  heading?: string;
  subheading?: string;
  /** how many decorative filler tiles show on the categories screen (0–5) */
  decorativeTileCount?: number;
  className?: string;
  onChange?: (state: { view: BentoView; categoryIndex: number }) => void;
}
