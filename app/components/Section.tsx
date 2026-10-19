import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function Section({ id, title, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-5xl scroll-mt-24 px-6 py-20 ${className ?? ""}`}
    >
      {title && (
        <h2 className="mb-10 border-b border-border pb-4 text-3xl font-semibold tracking-tight">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
