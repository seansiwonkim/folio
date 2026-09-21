"use client";

import { motion } from "framer-motion";
import type { Project } from "../data";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.button
      type="button"
      layoutId={`project-${project.title}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className="w-full rounded-2xl border border-border p-6 text-left transition-colors hover:border-accent/50"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <span className="text-xs text-muted">{project.year}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {project.description}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-foreground/5 px-3 py-1 text-xs text-muted"
          >
            {tag}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm font-medium text-accent">
        Open case study <span aria-hidden="true">↗</span>
      </p>
    </motion.button>
  );
}
