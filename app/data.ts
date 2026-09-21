export type Project = {
  title: string;
  description: string;
  details: string;
  tags: string[];
  year: string;
  images?: string[];
  repoUrl?: string;
  demoUrl?: string;
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export const profile = {
  name: "Sean Kim",
  education: "Computer Engineering @ Georgia Tech",
  role: "SWE/AI/ML/Hardware",
  location: "Centreville, VA",
  heroImage: `${process.env.NODE_ENV === "production" ? "/next-portfolio" : ""}/myself.jpg`,
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
    details:
      "A closer look at the problem, the decisions behind the implementation, and the result. Replace this with the story you want visitors to remember.",
    tags: ["TypeScript", "React", "Node.js"],
    year: "2025",
    repoUrl: "https://github.com/your-username/project-one",
    demoUrl: "https://project-one.example.com",
  },
  {
    title: "Project Two",
    description:
      "A short description of what this project does and the problem it solves. Swap this out with a real project.",
    details:
      "A deeper project overview can live here, with room for context, constraints, and the parts you personally owned.",
    tags: ["Python", "Flask", "PostgreSQL"],
    year: "2024",
    repoUrl: "https://github.com/your-username/project-two",
  },
  {
    title: "Project Three",
    description:
      "A short description of what this project does and the problem it solves. Swap this out with a real project.",
    details:
      "Use this space for the longer case study: what changed, how it works, and what you learned while building it.",
    tags: ["Next.js", "Tailwind CSS"],
    year: "2024",
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
