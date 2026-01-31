import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import cyberBg from "@/assets/images/cyber-rave-bg.png";
import { Badge } from "@/components/ui/badge";

function RaveCard({
  title,
  eyebrow,
  children,
  testId,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  testId: string;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 220, damping: 26 });
  const sy = useSpring(my, { stiffness: 220, damping: 26 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-10, 10]);

  return (
    <motion.div
      data-testid={testId}
      className="glass relative overflow-hidden rounded-2xl p-5 md:p-6"
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        mx.set(px - 0.5);
        my.set(py - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-16 top-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-2xl" />
        <div className="absolute -right-14 top-16 h-44 w-44 rounded-full bg-fuchsia-500/15 blur-2xl" />
        <div className="absolute bottom-[-40px] left-10 h-40 w-40 rounded-full bg-emerald-400/15 blur-2xl" />
      </div>

      <div className="relative">
        {eyebrow ? (
          <div
            data-testid={`${testId}-eyebrow`}
            className="mb-2 inline-flex items-center gap-2 text-xs font-medium tracking-wide text-cyan-200/90"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(0,245,255,0.55)]" />
            {eyebrow}
          </div>
        ) : null}

        <h3
          data-testid={`${testId}-title`}
          className="text-neon font-mono text-base font-semibold tracking-wide text-white md:text-lg"
        >
          {title}
        </h3>
        <div data-testid={`${testId}-content`} className="mt-3 text-sm text-white/80">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function SkillsAndCertifications() {
  const skills = ["HTML", "CSS", "JavaScript", "Python", "Java"];
  const certifications = [
    { name: "IBM SkillsBuild (AI)", org: "IBM" },
    { name: "AWS Cloud Practitioner", org: "AWS" },
    { name: "Advanced Java", org: "LearnQuest" },
  ];

  return (
    <section data-testid="section-skills" className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 data-testid="text-skills-title" className="text-neon text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Skills & Certifications
          </h2>
          <p data-testid="text-skills-subtitle" className="mt-2 max-w-2xl text-sm text-white/70">
            A quick snapshot of the tools I build with—and the certifications that back it up.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-3">
        <div
          data-testid="card-technical-skills"
          className="glass neon-glow-blue group relative rounded-2xl border border-cyan-400/30 p-5 transition duration-300 hover:border-cyan-300/70"
        >
          <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/20 blur-2xl" />
          </div>

          <div className="flex items-center justify-between">
            <h3 data-testid="text-technical-skills" className="font-mono text-sm font-semibold tracking-wide text-cyan-100">
              Technical Skills
            </h3>
            <Badge data-testid="badge-skills-count" className="bg-cyan-400/10 text-cyan-200 ring-1 ring-inset ring-cyan-300/30">
              {skills.length}
            </Badge>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s}
                data-testid={`badge-skill-${s.toLowerCase()}`}
                className="inline-flex items-center rounded-full border border-cyan-300/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div
          data-testid="card-certifications"
          className="glass neon-glow-green group relative rounded-2xl border border-emerald-400/30 p-5 transition duration-300 hover:border-emerald-300/70"
        >
          <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-300/20 blur-2xl" />
          </div>

          <div className="flex items-center justify-between">
            <h3 data-testid="text-certifications" className="font-mono text-sm font-semibold tracking-wide text-emerald-100">
              Certifications
            </h3>
            <Badge data-testid="badge-certifications-count" className="bg-emerald-400/10 text-emerald-200 ring-1 ring-inset ring-emerald-300/30">
              {certifications.length}
            </Badge>
          </div>

          <ul className="mt-4 space-y-3">
            {certifications.map((c, idx) => (
              <li
                key={c.name}
                data-testid={`row-certification-${idx}`}
                className="rounded-xl border border-emerald-300/15 bg-white/5 px-3 py-2 text-sm"
              >
                <div data-testid={`text-certification-name-${idx}`} className="font-medium text-white/90">
                  {c.name}
                </div>
                <div data-testid={`text-certification-org-${idx}`} className="text-xs text-white/60">
                  {c.org}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div data-testid="card-rave-notes" className="glass group relative rounded-2xl border border-fuchsia-400/25 p-5 transition duration-300 hover:border-fuchsia-300/70">
          <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
            <div className="absolute -left-10 bottom-[-40px] h-40 w-40 rounded-full bg-fuchsia-400/20 blur-2xl" />
          </div>

          <h3 data-testid="text-rave-title" className="font-mono text-sm font-semibold tracking-wide text-fuchsia-100">
            Rave Theme
          </h3>
          <p data-testid="text-rave-description" className="mt-3 text-sm text-white/75">
            Neon borders + glass blur + a cinematic cyber backdrop. Built to feel energetic without sacrificing readability.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge data-testid="badge-theme-glass" className="bg-white/5 text-white/80 ring-1 ring-inset ring-white/10">
              Glassmorphism
            </Badge>
            <Badge data-testid="badge-theme-neon" className="bg-white/5 text-white/80 ring-1 ring-inset ring-white/10">
              Neon
            </Badge>
            <Badge data-testid="badge-theme-motion" className="bg-white/5 text-white/80 ring-1 ring-inset ring-white/10">
              Motion
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [active, setActive] = useState("skills");

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const chips = useMemo(
    () => [
      { id: "hero", label: "Hero" },
      { id: "about", label: "About" },
      { id: "projects", label: "Projects" },
      { id: "skills", label: "Skills" },
      { id: "achievements", label: "Achievements" },
    ],
    [],
  );

  return (
    <div data-testid="page-home" className="min-h-screen bg-background">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <img
            data-testid="img-hero-background"
            src={cyberBg}
            alt="Cyberpunk rave abstract background"
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-rave" />
          <div className="absolute inset-0 bg-grid" />
          <div className="absolute inset-0 noise" />
        </div>

        <header data-testid="header-hero" className="relative mx-auto max-w-6xl px-4 pt-10 md:px-6 md:pt-14">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-start gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(0,255,136,0.7)]" />
                <span data-testid="text-status" className="text-xs font-medium tracking-wide text-white/75">
                  CSE Student • MIT Mysuru
                </span>
              </div>

              <h1 data-testid="text-hero-title" className="text-neon text-balance font-mono text-4xl font-semibold tracking-tight text-white md:text-6xl">
                Parinith C M
              </h1>
              <p data-testid="text-hero-subtitle" className="max-w-2xl text-pretty text-sm leading-relaxed text-white/75 md:text-base">
                Exploring AI, Machine Learning, and Web Development—building projects that feel fast, useful, and a little futuristic.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  data-testid="button-scroll-skills"
                  className="rounded-full border border-cyan-400/35 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 shadow-[0_0_0_1px_rgba(0,245,255,0.15)_inset] transition hover:border-cyan-300/70 hover:bg-cyan-300/15"
                  onClick={() => {
                    setActive("skills");
                    document.getElementById("skills")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  View Skills
                </button>
                <button
                  data-testid="button-scroll-projects"
                  className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
                  onClick={() => {
                    setActive("projects");
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  View Projects
                </button>
              </div>

              <div data-testid="nav-chips" className="mt-2 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <button
                    key={c.id}
                    data-testid={`button-nav-${c.id}`}
                    className={
                      "rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition " +
                      (active === c.id
                        ? "border border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-100 shadow-[0_0_0_1px_rgba(255,0,153,0.12)_inset]"
                        : "border border-white/10 bg-black/20 text-white/65 hover:bg-white/5")
                    }
                    onClick={() => {
                      setActive(c.id);
                      document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <RaveCard testId="card-focus" eyebrow="Focus" title="AI • ML • Web">
                Building intelligent and interactive experiences with a strong UI/UX bias.
              </RaveCard>
              <RaveCard testId="card-projects" eyebrow="Featured" title="Projects">
                Driver Drowsiness Detection & Banking System—practical builds with real constraints.
              </RaveCard>
              <RaveCard testId="card-now" eyebrow="Now" title="Learning">
                Cloud fundamentals, advanced Java, and deploying polished frontends.
              </RaveCard>
            </div>
          </div>
        </header>

        <main className="relative">
          <section id="about" data-testid="section-about" className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="glass rounded-2xl p-6">
                <h2 data-testid="text-about-title" className="text-neon font-mono text-xl font-semibold text-white">
                  About
                </h2>
                <p data-testid="text-about-body" className="mt-3 text-sm leading-relaxed text-white/75">
                  I enjoy working at the intersection of intelligent systems and clean interfaces. I’m especially interested in building
                  practical AI/ML projects and translating them into approachable, user-friendly applications.
                </p>
              </div>

              <div className="glass rounded-2xl p-6">
                <h2 data-testid="text-experience-title" className="text-neon font-mono text-xl font-semibold text-white">
                  Experience / Projects
                </h2>
                <div className="mt-3 space-y-3">
                  <div data-testid="row-project-drowsiness" className="rounded-xl border border-cyan-300/15 bg-white/5 p-4">
                    <div data-testid="text-project-drowsiness-title" className="font-medium text-white/90">
                      Driver Drowsiness Detection
                    </div>
                    <div data-testid="text-project-drowsiness-desc" className="mt-1 text-sm text-white/70">
                      Computer vision driven alerting concept focused on safety and real-time feedback.
                    </div>
                  </div>
                  <div data-testid="row-project-banking" className="rounded-xl border border-fuchsia-300/15 bg-white/5 p-4">
                    <div data-testid="text-project-banking-title" className="font-medium text-white/90">
                      Banking System
                    </div>
                    <div data-testid="text-project-banking-desc" className="mt-1 text-sm text-white/70">
                      A core-banking style system mockup emphasizing flows, roles, and data integrity.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="projects" data-testid="section-projects" className="mx-auto w-full max-w-6xl px-4 pb-2 md:px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 data-testid="text-projects-title" className="text-neon text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  Projects
                </h2>
                <p data-testid="text-projects-subtitle" className="mt-2 max-w-2xl text-sm text-white/70">
                  The two builds that best represent my interests: safety-focused ML and systems thinking.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div data-testid="card-projects-drowsiness" className="glass rounded-2xl p-6">
                <h3 data-testid="text-projects-drowsiness" className="font-mono text-base font-semibold text-white">
                  Driver Drowsiness Detection
                </h3>
                <p data-testid="text-projects-drowsiness-body" className="mt-2 text-sm text-white/75">
                  A concept project using vision cues to detect fatigue and raise alerts.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge data-testid="badge-tag-ml" className="bg-white/5 text-white/75 ring-1 ring-inset ring-white/10">
                    ML
                  </Badge>
                  <Badge data-testid="badge-tag-cv" className="bg-white/5 text-white/75 ring-1 ring-inset ring-white/10">
                    Computer Vision
                  </Badge>
                  <Badge data-testid="badge-tag-realtime" className="bg-white/5 text-white/75 ring-1 ring-inset ring-white/10">
                    Real-time
                  </Badge>
                </div>
              </div>

              <div data-testid="card-projects-banking" className="glass rounded-2xl p-6">
                <h3 data-testid="text-projects-banking" className="font-mono text-base font-semibold text-white">
                  Banking System
                </h3>
                <p data-testid="text-projects-banking-body" className="mt-2 text-sm text-white/75">
                  A mock banking workflow emphasizing correctness, roles, and clean interaction patterns.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge data-testid="badge-tag-systems" className="bg-white/5 text-white/75 ring-1 ring-inset ring-white/10">
                    Systems
                  </Badge>
                  <Badge data-testid="badge-tag-ui" className="bg-white/5 text-white/75 ring-1 ring-inset ring-white/10">
                    UI
                  </Badge>
                  <Badge data-testid="badge-tag-java" className="bg-white/5 text-white/75 ring-1 ring-inset ring-white/10">
                    Java
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          <div id="skills">
            <SkillsAndCertifications />
          </div>

          <section id="achievements" data-testid="section-achievements" className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6">
            <div className="glass rounded-2xl p-6">
              <h2 data-testid="text-achievements-title" className="text-neon font-mono text-xl font-semibold text-white">
                Achievements
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div data-testid="card-achievement-cgpa" className="rounded-xl border border-emerald-300/15 bg-white/5 p-4">
                  <div data-testid="text-cgpa-label" className="text-xs font-medium tracking-wide text-white/60">
                    CGPA
                  </div>
                  <div data-testid="text-cgpa-value" className="mt-1 font-mono text-2xl font-semibold text-white">
                    8.56
                  </div>
                </div>
                <div data-testid="card-achievement-certs" className="rounded-xl border border-cyan-300/15 bg-white/5 p-4">
                  <div data-testid="text-achievements-label" className="text-xs font-medium tracking-wide text-white/60">
                    Industry Certifications
                  </div>
                  <div data-testid="text-achievements-value" className="mt-1 text-sm text-white/80">
                    IBM SkillsBuild (AI), AWS Cloud Practitioner, Advanced Java (LearnQuest)
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer data-testid="footer" className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-6">
            <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center">
              <div>
                <div data-testid="text-footer-name" className="font-mono text-sm font-semibold text-white">
                  Parinith C M
                </div>
                <div data-testid="text-footer-note" className="mt-1 text-xs text-white/60">
                  Cyberpunk-rave portfolio mockup
                </div>
              </div>
              <a
                data-testid="link-back-to-top"
                className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs font-medium text-white/75 transition hover:bg-white/10"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActive("hero");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Back to top
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
