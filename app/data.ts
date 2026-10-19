export type Project = {
  title: string;
  description: string;
  details: string;
  tags: string[];
  year: string;
  metric: { value: string; label: string };
  highlights: string[];
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
  heroImage: `${process.env.NODE_ENV === "production" ? "/folio" : ""}/myself.jpg`,
  bio: "I love cool designs, sustainable systems, and scalable software.",
  email: "sean.sk07@gmail.com",
  github: "https://github.com/seansiwonkim",
  resume: `${process.env.NODE_ENV === "production" ? "/folio" : ""}/Sean_Kim_Resume.pdf`,
  linkedin: "https://linkedin.com/in/ssk1214",
};

export const projects: Project[] = [
  {
    title: "MarketPulse",
    description:
      "A containerized financial intelligence platform that ingests market news and scores the sentiment of every headline.",
    details:
      "FastAPI serves 10,000+ articles across 25+ public companies. A scheduled ETL job pulls from Finnhub every 15 minutes, and FinBERT and VADER classify each headline.",
    metric: { value: "<150 ms", label: "average API response" },
    highlights: [
      "Ingests 500+ articles daily from the Finnhub API with Pydantic validation, SQLAlchemy and PostgreSQL deduplication, holding a 99%+ processing success rate.",
      "Classifies 1,000+ headlines per hour with FinBERT and VADER (PyTorch, Hugging Face Transformers) at 85%+ accuracy on a labeled evaluation set.",
      "Indexed PostgreSQL schema cut average query latency by 40%; pytest and GitHub Actions CI/CD hold 85%+ test coverage.",
    ],
    tags: ["Python", "FastAPI", "PostgreSQL", "Docker", "PyTorch"],
    year: "2026",
    repoUrl: "https://github.com/seansiwonkim",
  },
  {
    title: "Oratio",
    description:
      "A 1D CNN that spots five childhood speech-error patterns from IPA text instead of audio.",
    details:
      "Working on text sidesteps the noise, pitch and privacy limits of audio-based speech ML. Phonological errors such as /k/ to /t/ fronting were simulated, transcribed to IPA, integer-mapped and zero-padded across a 563-word dataset.",
    metric: { value: "94.69%", label: "accuracy, 94.66% F1" },
    highlights: [
      "Architecture: embedding, Conv1D (64 filters), max-pooling, then a 128-unit ReLU dense layer with softmax, trained with Adam and categorical cross-entropy.",
      "Capped training at 20 epochs against an ~12-epoch accuracy plateau to prevent overfitting.",
      "Validated with precision, recall, F1 and a confusion matrix to expose per-class errors under class imbalance.",
    ],
    tags: ["Python", "TensorFlow", "Google Colab"],
    year: "2025",
  },
];

export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["C", "C++", "Python", "JavaScript", "TypeScript", "SQL", "HTML/CSS"],
  },
  {
    category: "Frameworks & Libraries",
    items: ["React", "React Native", "Node.js", "Express.js", "FastAPI", "SQLAlchemy", "PyTorch", "Hugging Face Transformers"],
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MongoDB", "MySQL", "SQLite"],
  },
  {
    category: "Developer Tools",
    items: ["Git", "Docker", "GitHub Actions", "AWS S3", "Linux", "REST APIs", "GraphQL", "CI/CD", "TCP/IP"],
  },
];
