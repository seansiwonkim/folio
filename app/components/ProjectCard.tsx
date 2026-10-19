"use client";

import { motion } from "framer-motion";
import type { Project } from "../data";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.button
      type="button"
      layoutId={`project-${project.title}`}
      className="group grid w-full gap-6 rounded-2xl border border-border p-7 text-left transition-colors hover:border-accent sm:grid-cols-[1fr_15rem] sm:gap-10"
    >
      <div>
        <div className="flex items-baseline gap-3">
          <h3 className="text-3xl font-semibold tracking-tight">
            {project.title}
          </h3>
          <span className="text-sm text-muted">{project.year}</span>
        </div>
        <p className="mt-3 max-w-prose leading-relaxed text-muted">
          {project.description}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-foreground/5 px-3 py-1 text-xs text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col justify-between sm:items-end sm:text-right">
        <div>
          <p className="font-display text-4xl font-semibold tracking-tighter text-accent">
            {project.metric.value}
          </p>
          <p className="mt-1 text-sm text-muted">{project.metric.label}</p>
        </div>
        <p className="mt-6 text-sm font-medium group-hover:text-accent">
          Read the details
        </p>
      </div>
    </motion.button>
  );
}
