"use client";

import Image from "next/image";
import Link from "next/link";
import { socmed } from "@/data/ContactsData";

export default function Contacts() {
  return (
    <section id="CONTACTS" className="w-full h-full py-10">
      <div className="w-full lg:max-w-[1280px] 3xl:max-w-[1350px] mx-auto flex flex-col lg:flex-row justify-between gap-10">
        {/* left content */}
        <div className="flex flex-col justify-between">
          {/* text */}
          <div className="flex flex-col">
            <h2 className="text-[76px] text-foreground font-sans font-semibold">
              Leave a Note
            </h2>
            <p className="text-[18px] text-foreground font-sans">
              Got an Idea? Let's Make It Real.
            </p>
          </div>
          {/* soc meds */}
          <div className="flex gap-3">
            {socmed.map((item) => {
              const isResume = item.name === "Resume";
              return (
                <Link
                  key={item.name}
                  href={item.value}
                  aria-label={item.name}
                  {...(isResume
                    ? { download: true }
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/15 transition-colors hover:bg-foreground/5"
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                  />
                </Link>
              );
            })}
          </div>
        </div>
        {/* right content */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full lg:w-[440px] shrink-0 flex flex-col gap-5 rounded-3xl bg-foreground p-8"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-name"
              className="font-sans text-sm font-medium text-background"
            >
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-full border border-background/20 bg-transparent px-5 py-3 font-sans text-sm text-background outline-none placeholder:text-background/40 focus:border-background/50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-email"
              className="font-sans text-sm font-medium text-background"
            >
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-full border border-background/20 bg-transparent px-5 py-3 font-sans text-sm text-background outline-none placeholder:text-background/40 focus:border-background/50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-project"
              className="font-sans text-sm font-medium text-background"
            >
              Your Project
            </label>
            <textarea
              id="contact-project"
              name="project"
              rows={5}
              placeholder="Tell us about your project"
              className="w-full resize-y rounded-2xl border border-background/20 bg-transparent px-5 py-4 font-sans text-sm text-background outline-none placeholder:text-background/40 focus:border-background/50"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-background py-3 font-sans text-sm font-medium text-foreground transition-opacity hover:opacity-90"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
