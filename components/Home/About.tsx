import Bot from "../ui/Bot";
import Marquee from "@/components/ui/Marquee";
import { skillRows } from "@/data/MarqueeData";
import { identity } from "@/data/AboutData";

export default function About() {
  return (
    <section id="ABOUT" className="w-full h-full py-10">
      <Marquee rows={skillRows} className="py-2 bg-background" />
      <div className="w-full max-w-[1280px] 3xl:max-w-[1350px] h-full mx-auto flex flex-col gap-5 mt-10">
        <Bot
          title="WHO I AM"
          paragraph={identity}
          kicker="CORE · IDENTITY"
          background="#f2efec"
          ink="#141414"
          height={600}
        />
      </div>
    </section>
  );
}
