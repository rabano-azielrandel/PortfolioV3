"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BentoGrid,
  Cover,
  DECORATIVE_TILES,
  ExitTile,
  FillerTile,
  Icon,
  Tile,
  TileButton,
  mosaicTileSize,
} from "./BentoParts";
import type {
  BentoCategory,
  BentoView,
  HobbiesBentoProps,
} from "@/types/HobbiesTypes";

/** Screen 1: every category, as a grid of tiles. */
function CategoriesScreen({
  categories,
  decorativeTileCount,
  onOpenCategory,
}: {
  categories: BentoCategory[];
  decorativeTileCount: number;
  onOpenCategory: (categoryIndex: number) => void;
}) {
  return (
    <BentoGrid>
      {categories.map((category, categoryIndex) => (
        <TileButton
          key={category.id ?? category.label}
          onClick={() => onOpenCategory(categoryIndex)}
          className={mosaicTileSize(categoryIndex)}
        >
          <Image
            src={category.cover}
            alt="cover"
            fill
            sizes="1"
            className="object-cover"
          />
          <span className="z-2 mt-auto flex shrink-0 flex-col gap-1.5 border-t border-background/20 bg-background/30 px-3.5 py-2 backdrop-blur-xs backdrop-saturate-150">
            <span className="flex items-center gap-2">
              {category.icon ? (
                <Icon
                  icon={category.icon}
                  className="h-4 w-4 shrink-0 text-foreground"
                />
              ) : null}
              <h2 className="font-sans text-base font-semibold leading-tight tracking-tight text-foreground sm:text-lg">
                {category.label}
              </h2>
            </span>
            {category.description ? (
              <p className="font-serif text-sm leading-snug line-clamp-2 text-foreground">
                {category.description}
              </p>
            ) : null}
          </span>
        </TileButton>
      ))}

      {DECORATIVE_TILES.slice(
        0,
        Math.max(0, Math.min(4, decorativeTileCount)),
      ).map((tile, index) => (
        <FillerTile
          key={tile.number}
          number={tile.number}
          caption={tile.caption}
          className={index >= 2 ? "hidden sm:flex" : "flex"}
        />
      ))}

      {/* the mosaic above only tiles evenly up to 3 columns — at the 4-column
          breakpoint it leaves one row short by 2 cells, so these two close it */}
      <FillerTile number="05" caption="the math" className="hidden lg:flex" />
      <FillerTile
        number="06"
        caption="didn't add up"
        className="hidden lg:flex"
      />
    </BentoGrid>
  );
}

/** Screen 2: the entries inside one category. */
function CategoryScreen({
  category,
  onBack,
}: {
  category: BentoCategory;
  onBack: () => void;
}) {
  return (
    <BentoGrid>
      <Tile
        solidBorder
        className="col-span-1 flex-row items-center gap-2.5 px-4 sm:col-span-2 lg:col-span-3"
      >
        <Image
          src={category.cover2}
          alt="img"
          fill
          sizes="1"
          loading="lazy"
          className="object-cover"
        />
        <Icon
          icon={category.icon}
          className="h-4 w-4 shrink-0 text-foreground"
        />
        <h2 className="font-sans text-sm font-semibold leading-tight tracking-tight text-foreground sm:text-base">
          {category.label}
        </h2>
        {category.description ? (
          <p className="ml-auto hidden font-serif text-sm leading-snug line-clamp-1 text-foreground/60 sm:block">
            {category.description}
          </p>
        ) : null}
      </Tile>

      <ExitTile label="all rooms" onClick={onBack} />

      {category.entries.map((entry, entryIndex) => (
        <Tile key={entry.title} className={mosaicTileSize(entryIndex)}>
          <Cover
            entry={entry}
            showRating
            footer={
              <>
                <h2 className="font-sans text-base font-semibold leading-tight tracking-tight text-foreground sm:text-lg">
                  {entry.title}
                </h2>
                {entry.description ? (
                  <p className="font-serif text-sm leading-snug line-clamp-2 text-foreground/70">
                    {entry.description}
                  </p>
                ) : null}
              </>
            }
          />
        </Tile>
      ))}

      {/* same 4-column shortfall as the categories screen — plug it here too */}
      <FillerTile number="05" caption="the math" className="hidden lg:flex" />
      <FillerTile
        number="06"
        caption="didn't add up"
        className="hidden lg:flex"
      />
    </BentoGrid>
  );
}

export function Bento({
  data,
  heading = "Hobbies",
  subheading,
  decorativeTileCount = 4,
  className = "",
  onChange,
}: HobbiesBentoProps) {
  const [view, setView] = useState<BentoView>("categories");
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const categories = data ?? [];
  const activeCategory =
    categories[Math.min(activeCategoryIndex, categories.length - 1)];

  function showView(nextView: BentoView, categoryIndex: number) {
    setView(nextView);
    setActiveCategoryIndex(categoryIndex);
    onChange?.({ view: nextView, categoryIndex });
  }

  function openCategory(categoryIndex: number) {
    showView("category", categoryIndex);
  }

  function backToCategories() {
    showView("categories", activeCategoryIndex);
  }

  let hint = "";
  if (view === "category" && activeCategory) {
    hint = "the exit tile takes you back";
  } else if (categories.length) {
    hint = "click a room to see what's inside";
  }

  return (
    <div className={`relative rounded-lg p-4 sm:p-6 ${className}`}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-sans text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
            {heading}
          </h2>
          {subheading ? (
            <p className="font-serif text-sm leading-snug text-foreground/60">
              {subheading}
            </p>
          ) : null}
        </div>
        {hint ? (
          <span className="max-w-[28ch] text-right font-mono text-[10px] uppercase leading-none tracking-[0.16em] text-foreground/50">
            {hint}
          </span>
        ) : null}
      </div>

      {!categories.length ? (
        <span className="font-mono text-[10px] uppercase leading-none tracking-[0.16em] text-foreground/50">
          No data — pass a `data` array.
        </span>
      ) : view === "category" && activeCategory ? (
        <CategoryScreen category={activeCategory} onBack={backToCategories} />
      ) : (
        <CategoriesScreen
          categories={categories}
          decorativeTileCount={decorativeTileCount}
          onOpenCategory={openCategory}
        />
      )}
    </div>
  );
}
