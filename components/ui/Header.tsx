import Link from "next/link";
import Image from "next/image";
import { navs } from "@/data/HeaderData";

export default function Header() {
  return (
    <nav className="sticky top-10 w-full h-full mt-10 z-10">
      <div className="w-full max-w-[288px] mx-auto flex gap-4 p-2 rounded-xl bg-foreground">
        {navs.map((item) => (
          <Link key={item.name} href={item.route} className="cursor-pointer">
            <Image
              src={item.path}
              alt={item.name}
              width={50}
              height={50}
              className="object-contain w-[50px] h-auto"
            />
          </Link>
        ))}
      </div>
    </nav>
  );
}
