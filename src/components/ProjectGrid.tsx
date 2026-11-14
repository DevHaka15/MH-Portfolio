import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import { Cover } from "./Cover";
import { Reveal } from "./Reveal";
import { prefetchRoute } from "../routes";

interface ProjectGridProps {
  items: Project[];
  /** how many tiles are in the first screen (loaded straight away) */
  eagerCount?: number;
}

export function ProjectGrid({ items, eagerCount = 0 }: ProjectGridProps) {
  return (
    <div className="grid">
      {items.map((p, i) => (
        <Reveal key={p.id} className="tile" delay={(i % 3) * 0.12}>
          <Link to={`/work/${p.id}`} onPointerEnter={() => prefetchRoute("/work/x")} onTouchStart={() => prefetchRoute("/work/x")}>
            <span className="art">
              <Cover project={p} eager={i < eagerCount} />
            </span>
            <span className="cap">
              <b>{p.title}</b>
              <small>{p.category}</small>
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
