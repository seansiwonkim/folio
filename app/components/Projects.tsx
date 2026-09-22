"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Section from "./Section";
import ProjectCard from "./ProjectCard";
import { projects, type Project } from "../data";

function ProjectDetail({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-100 overflow-y-auto bg-background/95 px-6 py-8 backdrop-blur-xl sm:px-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-widest text-muted">
            Project details
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-xl text-muted transition-colors hover:border-accent hover:text-accent"
          >
            ×
          </button>
        </div>
        <motion.div
          layoutId={`project-${project.title}`}
          className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="relative aspect-16/10 overflow-hidden rounded-3xl border border-border bg-foreground/5">
            {project.images?.[0] ? (
              <Image
                src={project.images[0]}
                alt={`${project.title} preview`}
                fill
                sizes="(max-width: 1024px) 90vw, 55vw"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-end bg-[radial-gradient(circle_at_30%_30%,rgba(96,165,250,.45),transparent_38%),linear-gradient(135deg,var(--accent),var(--background))] p-8">
                <span className="text-5xl font-semibold text-white/90">
                  {project.title}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm text-accent">{project.year}</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
              {project.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              {project.details}
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-border px-3 py-1.5 text-sm text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex gap-5 text-sm font-medium">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline"
                >
                  View code ↗
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline"
                >
                  Live demo ↗
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <Section id="projects" title="Projects">
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <div key={project.title} onClick={() => setSelected(project)}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </Section>
      <AnimatePresence>
        {selected && (
          <ProjectDetail project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
