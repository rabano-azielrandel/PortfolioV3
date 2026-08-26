import Bot from "../ui/Bot";
import Marquee from "@/components/ui/Marquee";
import { skillRows } from "@/data/MarqueeData";

export default function About() {
  return (
    <section className="w-full h-full py-10">
      <div className="w-full max-w-full h-full mx-auto flex flex-col gap-5">
        <Marquee rows={skillRows} className="py-2 bg-background" />
        <Bot
          title="WHO I AM"
          paragraph="Six years of work, most of it built alone: point-of-sale for kiosks that had to survive a power cut, a ledger that reconciles itself, an atlas nobody asked for."
          kicker="CORE · IDENTITY"
          background="#f2efec"
          ink="#141414"
          height={700}
        />
      </div>
    </section>
  );
}
