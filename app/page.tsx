import Hero from "@/components/Home/Hero";
import About from "@/components/Home/About";
import Projects from "@/components/Home/Projects";
import Experience from "@/components/Home/Experience";
import Hobbies from "@/components/Home/Hobbies";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Hobbies />
    </main>
  );
}
