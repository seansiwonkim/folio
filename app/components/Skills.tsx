import Section from "./Section";
import { skills } from "../data";

export default function Skills() {
  return (
    <Section id="skills" title="Skills">
      <dl className="divide-y divide-border">
        {skills.map((group) => (
          <div
            key={group.category}
            className="grid gap-3 py-5 sm:grid-cols-[14rem_1fr] sm:gap-8"
          >
            <dt className="font-medium">{group.category}</dt>
            <dd className="leading-relaxed text-muted">
              {group.items.join(", ")}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
