import { Bento } from "@/components/ui/Bento";
import { hobbies } from "@/data/HobbiesData";

export default function Hobbies() {
  return (
    <section id="HOBBIES" className="w-full h-full py-10">
      <div className="w-full max-w-[1280px] 3xl:max-w-[1350px] mx-auto px-4">
        <Bento
          data={hobbies}
          heading="Hobbies"
          subheading="A few rooms I keep coming back to."
        />
      </div>
    </section>
  );
}
