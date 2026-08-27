import Link from "next/link";
import { ProjectList } from "@/types/ProjectTypes";

interface Props {
  data: ProjectList;
}

export default function ItemList({ data }: Props) {
  console.log(data);
  return (
    <div className="w-full h-full py-4">
      {data.projects.map((item, index) => (
        <div
          key={index + item.projectName}
          className="flex flex-col lg:flex-row gap-4 lg:gap-0 lg:justify-between py-10 border-b border-[#DED8D0]"
        >
          <div className="flex flex-col">
            <h3 className="m-0 font-sans text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground">
              {item.projectName}
            </h3>

            <p
              dangerouslySetInnerHTML={{ __html: item.projectDescription.html }}
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
        </div>
      ))}
    </div>
  );
}
