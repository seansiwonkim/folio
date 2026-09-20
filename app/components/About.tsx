import Section from "./Section";
import { profile } from "../data";

export default function About() {
  return (
    <Section id="about" title="About">
      <p className="leading-relaxed text-muted">{profile.bio}</p>
    </Section>
  );
}
