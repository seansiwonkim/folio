import Section from "./Section";
import { profile } from "../data";

const links = [
  {
    label: "Email",
    href: `mailto:${profile.email}`,
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0-.828.672-1.5 1.5-1.5h16.5c.828 0 1.5.672 1.5 1.5v10.5c0 .828-.672 1.5-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5V6.75Zm1.5 0 8.25 6 8.25-6"
      />
    ),
  },
  {
    label: "GitHub",
    href: profile.github,
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.833.09-.647.35-1.088.636-1.338-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.921.678 1.856 0 1.34-.012 2.421-.012 2.751 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
      />
    ),
  },
  {
    label: "LinkedIn",
    href: profile.linkedin,
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.5 9.5h5v12h-5v-12Zm7.5 0h4.8v1.64h.07c.67-1.2 2.3-2.46 4.73-2.46 5.06 0 6 3.13 6 7.2v8.62h-5v-7.65c0-1.82-.03-4.17-2.55-4.17-2.55 0-2.94 1.95-2.94 4.03v7.79h-5v-12Z"
      />
    ),
  },
];

export default function Contact() {
  return (
    <Section id="contact" title="Contact">
      <p className="mb-6 text-muted">
        Feel free to reach out — I&apos;m happy to chat about opportunities,
        projects, or anything else.
      </p>
      <div className="flex gap-4">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noreferrer"
            aria-label={link.label}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
              {link.icon}
            </svg>
          </a>
        ))}
      </div>
    </Section>
  );
}
