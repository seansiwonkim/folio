export type Project = {
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  demoUrl?: string;
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export const profile = {
  name: "Sean Kim",
  title: "CompE @ Georgia Tech",
  tagline: "Based in Centreville, VA.",
  // Image the SK particles morph into on click. Swap for a photo in /public.
  heroImage: "/myself.jpg",
  bio: "I love cool designs, sustainable systems, and scalable software.",
  email: "sean.sk07@gmail.com",
  github: "https://github.com/thexstriker",
  linkedin: "https://linkedin.com/in/seankim1214",
};

export const projects: Project[] = [
  {
    title: "Project One",
    description:
      "A short description of what this project does and the problem it solves. Swap this out with a real project.",
    tags: ["TypeScript", "React", "Node.js"],
    repoUrl: "https://github.com/your-username/project-one",
    demoUrl: "https://project-one.example.com",
  },
  {
    title: "Project Two",
    description:
      "A short description of what this project does and the problem it solves. Swap this out with a real project.",
    tags: ["Python", "Flask", "PostgreSQL"],
    repoUrl: "https://github.com/your-username/project-two",
  },
  {
    title: "Project Three",
    description:
      "A short description of what this project does and the problem it solves. Swap this out with a real project.",
    tags: ["Next.js", "Tailwind CSS"],
    repoUrl: "https://github.com/your-username/project-three",
    demoUrl: "https://project-three.example.com",
  },
];

export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Java"],
  },
  {
    category: "Frameworks & Libraries",
    items: ["React", "Next.js", "Node.js", "Tailwind CSS"],
  },
  {
    category: "Tools",
    items: ["Git", "Docker", "VS Code", "Figma"],
  },
];
