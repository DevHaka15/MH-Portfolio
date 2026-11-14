import { Hero } from "../components/Hero";
import { Ticker } from "../components/Ticker";
import { ProjectGrid } from "../components/ProjectGrid";
import { Reveal } from "../components/Reveal";
import { projects } from "../data/projects";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Home() {
  usePageTitle();
  return (
    <>
      <Hero />
      <Ticker />
      <section>
        <div className="wrap">
          <div className="sh">
            <Reveal as="h2">Recent projects</Reveal>
            <Reveal as="p" delay={0.1}>A selection of recent work from my Behance portfolio.</Reveal>
          </div>
          <ProjectGrid items={projects.slice(0, 9)} />
        </div>
      </section>
    </>
  );
}
