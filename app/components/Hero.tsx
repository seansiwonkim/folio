"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { profile } from "../data";

// Canvas-only, so skip SSR. The loading box reserves the same height to avoid layout shift.
const ParticleHero = dynamic(() => import("./ParticleHero"), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="h-[clamp(260px,48vh,500px)] w-full" />,
});

export default function Hero() {
  return (
    <section
      id="top"
      className="mx-auto flex min-h-[80vh] w-full max-w-4xl flex-col items-center justify-center px-6 py-10 text-center"
    >
      <ParticleHero image={profile.heroImage} />
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 mb-3 text-sm font-medium text-accent"
      >
        {profile.title}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl font-semibold tracking-tight sm:text-5xl"
      >
        {profile.name}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-4 max-w-xl text-lg text-muted"
      >
        {profile.tagline}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 flex gap-4"
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
    </section>
  );
}
