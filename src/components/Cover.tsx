import { useState } from "react";
import { coverSize, localCover, remoteCover, type Project } from "../data/projects";

interface CoverProps {
  project: Project;
  /** true for images that are visible on first load (skips lazy-loading, raises priority) */
  eager?: boolean;
}

/** Local WebP first, then the Behance copy, then a styled placeholder with the title. */
export function Cover({ project, eager = false }: CoverProps) {
  const [stage, setStage] = useState(0);
  const { w, h } = coverSize(project);
  const local = localCover(project);
  const remote = remoteCover(project);
  // start at the Behance copy if there is no local file (avoids a pointless 404 request)
  const src = stage === 0 && local ? local : remote;

  if (!src || stage >= 2) {
    return (
      <div className="ph" role="img" aria-label={project.title}>
        {project.title}
      </div>
    );
  }

  return (
    <img
      src={src}
      width={w}
      height={h}
      alt={project.title}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      ref={(el) => {
        if (el && eager) el.setAttribute("fetchpriority", "high");
      }}
      onError={() => setStage((s) => (s === 0 && local && remote ? 1 : 2))}
    />
  );
}
