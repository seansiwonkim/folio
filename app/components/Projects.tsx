import Section from "./Section";
import ProjectCard from "./ProjectCard";
import { projects } from "../data";

export default function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </Section>
  );
}
