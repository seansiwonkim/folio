"use client";

import { motion } from "framer-motion";
import type { Project } from "../data";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border p-6 transition-colors hover:border-accent/50"
    >
      <h3 className="text-lg font-semibold">{project.title}</h3>
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
      <div className="mt-4 flex gap-4 text-sm">
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent hover:underline"
          >
            Code
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent hover:underline"
          >
            Live demo
          </a>
        )}
      </div>
    </motion.div>
  );
}
