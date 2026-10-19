import { profile } from "../data";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <p className="mx-auto max-w-5xl px-6 text-left text-sm text-muted">
        © {new Date().getFullYear()} {profile.name}. Built with Next.js.
      </p>
    </footer>
  );
}
