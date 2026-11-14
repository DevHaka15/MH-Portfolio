import { useState } from "react";
import { ProjectGrid } from "../components/ProjectGrid";
import { Reveal } from "../components/Reveal";
import { categories, projects } from "../data/projects";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Work() {
  usePageTitle("Work");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const items = cat === "All" ? projects : projects.filter((p) => p.category === cat);

  return (
    <section className="pg-top">
      <div className="wrap">
        <div className="sh">
          <Reveal as="h2">All work</Reveal>
          <Reveal as="p" delay={0.1}>Every project from my Behance portfolio. Filter by type.</Reveal>
        </div>
        <Reveal className="filters" delay={0.2}>
          <div role="group" aria-label="Filter projects" style={{ display: "contents" }}>
            {categories.map((c) => (
              <button key={c} type="button" aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
        </Reveal>
        {/* the key makes the tiles remount, so the reveal animation plays again after every filter change */}
        <ProjectGrid key={cat} items={items} eagerCount={3} />
      </div>
    </section>
  );
}
