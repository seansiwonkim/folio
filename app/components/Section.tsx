"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function Section({ id, title, children, className }: SectionProps) {
  return (
    <motion.section
      id={id}
      className={`mx-auto w-full max-w-3xl scroll-mt-24 px-6 py-16 ${className ?? ""}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {title && (
        <h2 className="mb-8 text-2xl font-semibold tracking-tight">{title}</h2>
      )}
      {children}
    </motion.section>
  );
}
