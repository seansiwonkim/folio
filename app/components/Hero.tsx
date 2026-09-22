"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { profile } from "../data";

const ParticleHero = dynamic(() => import("./ParticleHero"), {
  ssr: false,
  loading: () => <div className="aspect-4/5 w-full max-w-md bg-background" />,
});

export default function Hero() {
  return (
    <section
      id="top"
      className="mx-auto grid min-h-[80vh] w-full max-w-5xl items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_0.9fr] lg:gap-20"
    >
      <div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-sm font-medium uppercase tracking-widest text-accent"
        >
          Hello, I&apos;m
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="text-5xl font-semibold tracking-tight sm:text-7xl"
        >
          {profile.name}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="mt-7 space-y-2 text-lg text-muted"
        >
          <p>{profile.education}</p>
          <p>{profile.role}</p>
          <p>{profile.location}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="mt-9 flex gap-4"
        >
          <a
            href="#projects"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-foreground/5"
          >
            Contact
          </a>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mx-auto w-full max-w-md"
      >
        <ParticleHero image={profile.heroImage} />
      </motion.div>
    </section>
  );
}
