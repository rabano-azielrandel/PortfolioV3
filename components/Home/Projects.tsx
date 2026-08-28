"use server";

import ItemList from "../ui/ItemList";
import { getProjects } from "@/lib/hygraph/queries/getProjects";
import { ProcessedProjectList } from "@/types/ProjectTypes";

export default async function Projects() {
  const professional = await getProjects("professional");
  const personal = await getProjects("personal");
  const sections = [professional, personal];

  return (
    <section id="PROJECTS" className="w-full h-full py-10">
      <div className=" w-full max-w-[1280px] 3xl:max-w-[1350px] mx-auto">
        {sections.map((data, index) => (
          <div key={index} className="px-4">
            {/* header */}
            <div className="flex flex-col gap-4 py-4 border-b border-[#DED8D0]">
              {/* kicker */}
              <p
                dangerouslySetInnerHTML={{ __html: data?.kicker ?? "" }}
                className="m-0 font-mono text-[10px] uppercase tracking-[0.22em] text-[#8d8579]"
              />

              {/* display heading*/}
              <h2
                dangerouslySetInnerHTML={{
                  __html: data?.displayHeading ?? "",
                }}
                className="mt-4 mb-0 max-w-[16ch] text-[56px] font-bold leading-[0.98] tracking-[-0.03em] text-[#141414] text-balance"
              />

              {/* serif deck */}
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.serifDeck ?? "",
                }}
                className="mt-5 w-full max-w-[800px] font-serif text-[16px] leading-[1.6] text-[#4a4844] text-pretty"
              />
            </div>
            {/* projects */}
            <ItemList data={data as ProcessedProjectList} />
          </div>
        ))}
      </div>
    </section>
  );
}
