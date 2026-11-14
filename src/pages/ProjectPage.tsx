import { Link, Navigate, useParams } from "react-router-dom";
import { Cover } from "../components/Cover";
import { Reveal } from "../components/Reveal";
import { behanceUrl, findProject, nextProject } from "../data/projects";
import { usePageTitle } from "../hooks/usePageTitle";

export default function ProjectPage() {
  const { id } = useParams();
  const project = findProject(id);
  usePageTitle(project?.title);
  if (!project) return <Navigate to="/work" replace />;
  const next = nextProject(project);

  return (
    <section className="case pg-top">
      <div className="wrap" key={project.id}>
        <Reveal><Link className="backlink" to="/work">Back to all work</Link></Reveal>
        <div className="case-top" style={{ marginTop: 24 }}>
          <Reveal className="art" delay={0.1}><Cover project={project} eager /></Reveal>
          <div>
            <Reveal as="h2" delay={0.2}>{project.title}</Reveal>
            <Reveal as="p" className="lead" delay={0.3}>{project.description}</Reveal>
            <Reveal as="dl" delay={0.4}><dt>Category</dt><dd>{project.category}</dd></Reveal>
            <Reveal delay={0.5}>
              <a className="cta" href={behanceUrl(project)} target="_blank" rel="noopener">View on Behance</a>
            </Reveal>
          </div>
        </div>
        <Reveal><Link className="nextlink" to={`/work/${next.id}`}><span>Next: {next.title}</span></Link></Reveal>
      </div>
    </section>
  );
}
