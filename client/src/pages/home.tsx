import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import cyberBg from "@/assets/images/cyber-rave-bg.png";
import { Badge } from "@/components/ui/badge";
import IdentitySection from "@/components/IdentitySection";
import AdditionalInfoSection from "@/components/AdditionalInfoSection";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

function SkillsSection({ skillsData }: { skillsData?: any[] }) {
  const defaultSkills = [
    {
      name: "HTML",
      description: "The foundational backbone used to structure web content with semantic clarity and modern accessibility standards."
    },
    {
      name: "CSS",
      description: "The creative engine for styling responsive, high-fidelity interfaces using advanced layouts like Flexbox and Grid."
    },
    {
      name: "JavaScript",
      description: "The primary language for adding dynamic interactivity and complex logic to the client-side of web applications."
    },
    {
      name: "Python",
      description: "A versatile, high-level language leveraged for building robust backend logic, automation scripts, and AI-driven solutions."
    },
    {
      name: "Java",
      description: "A powerful, object-oriented language essential for developing secure, scalable, and cross-platform enterprise applications."
    }
  ];

  const skills = skillsData && skillsData.length > 0 ? skillsData : defaultSkills;

  return (
    <section id="skills" data-testid="section-skills" className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="glass rounded-2xl p-8 border border-cyan-400/20 bg-cyan-900/5 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
          <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-neon text-3xl font-semibold tracking-tight text-white mb-2">Technical Skills</h2>
            <p className="text-white/70 max-w-xl">
              Core technologies powering my development workflow.
            </p>
          </div>
          <Badge className="bg-cyan-400/10 text-cyan-200 ring-1 ring-inset ring-cyan-300/30 px-3 py-1 text-sm font-mono">
            {skills.length} Core Technologies
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((s: any) => (
            <div
              key={s.name}
              className="group relative rounded-xl border border-cyan-300/20 bg-white/5 p-5 transition-all hover:bg-white/10 hover:border-cyan-400/50"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-mono text-lg font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                  {s.name}
                </h3>
                {s.percentage && (
                  <span className="text-xs font-mono text-cyan-400/80 font-semibold">{s.percentage}%</span>
                )}
              </div>
              <p className="text-sm text-white/75 leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CertificationsSection({ certsData }: { certsData?: any[] }) {
  const defaultCertifications = [
    {
      name: "Cyber Security Technologies",
      org: "Illinois Tech",
      pdfLink: "/Cyber_Security_Technologies.pdf"
    },
    {
      name: "AWS Cloud Practitioner Essentials",
      org: "Amazon Web Services",
      pdfLink: "/AWS_Cloud_Practitioner_Essentials.pdf"
    },
    {
      name: "Advanced Java",
      org: "LearnQuest",
      pdfLink: "/advanced_java.pdf"
    },
    {
      name: "Developing Front-End Apps with React",
      org: "IBM",
      pdfLink: "/Developing_Front-End_Apps_with_React.pdf"
    }
  ];

  const certifications = certsData && certsData.length > 0 ? certsData : defaultCertifications;

  return (
    <section id="certifications" data-testid="section-certifications" className="mx-auto w-full max-w-7xl px-6 pb-10">
      <div className="glass rounded-2xl p-8 border border-emerald-400/20 bg-emerald-900/5 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
          <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-neon text-3xl font-semibold tracking-tight text-white mb-2">Certifications</h2>
            <p className="text-white/70 max-w-xl">
              Verified credentials from industry leaders.
            </p>
          </div>
          <Badge className="bg-emerald-400/10 text-emerald-200 ring-1 ring-inset ring-emerald-300/30 px-3 py-1 text-sm font-mono">
            {certifications.length} Credentials
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {certifications.map((c: any) => (
            <a
              key={c.name}
              href={c.pdfLink || c.verificationLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-emerald-300/15 bg-white/5 p-4 hover:bg-white/10 transition-all hover:-translate-y-1 block group/card"
            >
              <div className="font-semibold text-white text-lg mb-1 group-hover/card:text-emerald-300 transition-colors">
                {c.name}
              </div>
              <div className="text-sm text-emerald-300/80 font-mono uppercase">
                ISSUED BY {c.org}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ socialsData }: { socialsData?: any }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const email = socialsData?.email || "parinithmswamy15@gmail.com";
  const github = socialsData?.github || "https://github.com/parinith01";
  const linkedin = socialsData?.linkedin || "https://www.linkedin.com/in/parinith-c-m-1042712b7/";
  const instagram = socialsData?.instagram || "https://www.instagram.com/parinith_shaiva/";

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: (error as any).message || "Failed to send message.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <section id="contact" data-testid="section-contact" className="mx-auto w-full max-w-7xl px-6 py-10 md:py-14">
      <div className="glass rounded-2xl p-8 md:p-12 border border-fuchsia-400/20 bg-fuchsia-900/5 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-fuchsia-400/10 blur-3xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          <div>
            <h2 className="text-neon text-3xl font-semibold tracking-tight text-white mb-6">
              Let's Connect
            </h2>
            <p className="text-white/70 text-lg mb-8 leading-relaxed max-w-md">
              I am actively seeking internships and full-time opportunities to apply my full-stack skills.
              Whether you have a challenging project, a job opening, or just want to connect, I’d love to hear from you.
              Let’s build something amazing together!
            </p>

            <div className="space-y-6">
              <a href={`mailto:${email}`} className="flex items-center gap-4 text-white/80 hover:text-cyan-400 transition-colors group">
                <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cyan-400/10 group-hover:border-cyan-400/30 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                </div>
                <span className="font-mono text-sm">{email}</span>
              </a>

              <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/80 hover:text-fuchsia-400 transition-colors group">
                <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-fuchsia-400/10 group-hover:border-fuchsia-400/30 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                </div>
                <span className="font-mono text-sm">{github.replace('https://', '')}</span>
              </a>

              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/80 hover:text-emerald-400 transition-colors group">
                <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-400/10 group-hover:border-emerald-400/30 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                </div>
                <span className="font-mono text-sm">{linkedin.replace('https://www.', '')}</span>
              </a>

              <a href={instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/80 hover:text-pink-500 transition-colors group">
                <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-pink-500/10 group-hover:border-pink-500/30 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </div>
                <span className="font-mono text-sm">parinith_shaiva</span>
              </a>
            </div>
          </div>

          <div className="bg-black/40 p-6 rounded-2xl border border-white/5 backdrop-blur-xl">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs uppercase tracking-widest text-white/60 font-bold ml-1 font-mono">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-fuchsia-400/50 focus:bg-fuchsia-400/5 transition-all text-sm font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-widest text-white/60 font-bold ml-1 font-mono">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-fuchsia-400/50 focus:bg-fuchsia-400/5 transition-all text-sm font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs uppercase tracking-widest text-white/60 font-bold ml-1 font-mono">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your message here..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-fuchsia-400/50 focus:bg-fuchsia-400/5 transition-all text-sm font-mono resize-none"
                ></textarea>
              </div>

              <button
                disabled={mutation.isPending}
                className="w-full py-3 bg-gradient-to-r from-fuchsia-500 to-pink-600 rounded-xl font-bold text-white uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg shadow-fuchsia-500/20 disabled:opacity-50 font-mono text-sm"
              >
                {mutation.isPending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function EducationSection({ eduData }: { eduData?: any[] }) {
  const defaultEducation = [
    {
      institution: "Maharaja Institute of Technology Mysore",
      location: "Mandya",
      degree: "BE in Computer Science & Engineering",
      score: "8.56 CGPA",
      year: "2023 - 2027",
      color: "cyan"
    },
    {
      institution: "Marimallappa Pre University College",
      location: "Mysore",
      degree: "Pre-University (PCMB)",
      score: "90%",
      year: "2021 - 2023",
      color: "fuchsia"
    },
    {
      institution: "Adarsha Vidyalaya Sosale",
      location: "T Narsipura, Mysore",
      degree: "High School",
      score: "90%",
      year: "2018 - 2021",
      color: "emerald"
    }
  ];

  const education = eduData && eduData.length > 0 ? eduData : defaultEducation;

  return (
    <section id="education" data-testid="section-education" className="mx-auto w-full max-w-7xl px-6 py-10 md:py-14">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-neon text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Education
          </h2>
          <p className="mt-2 max-w-2xl text-base text-white/70">
            My academic journey and milestones.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {education.map((edu: any, idx: number) => {
          const badgeColor = edu.color || (idx === 0 ? "cyan" : idx === 1 ? "fuchsia" : "emerald");
          return (
            <div key={idx} className={`glass rounded-2xl p-6 border border-${badgeColor}-400/20 relative overflow-hidden group hover:bg-white/5 transition-all duration-300`}>
              <div className={`absolute top-0 right-0 w-24 h-24 bg-${badgeColor}-500/10 blur-2xl rounded-full -mr-10 -mt-10 transition-all group-hover:bg-${badgeColor}-500/20`} />

              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-1 leading-snug">{edu.institution}</h3>
                <p className="text-sm text-white/60 mb-4 font-mono">{edu.location}</p>

                <div className="space-y-2">
                  <div className={`inline-block px-3 py-1 rounded-lg bg-${badgeColor}-400/10 border border-${badgeColor}-400/20 text-${badgeColor}-300 text-xs font-bold tracking-widest uppercase font-mono`}>
                    {edu.degree}
                  </div>
                  <div className="flex justify-between items-end mt-4 font-mono">
                    <div className="text-white/80 text-sm">{edu.year}</div>
                    <div className={`text-2xl font-bold text-${badgeColor}-400`}>{edu.score}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function Home() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Fetch live CMS content from server
  const { data: cmsData } = useQuery<any>({
    queryKey: ["/api/cms/content"],
    queryFn: async () => {
      const res = await fetch("/api/cms/content");
      if (!res.ok) return null;
      return res.json();
    }
  });

  const defaultProjects = [
    {
      title: "Driver Drowsiness Detection",
      shortDescription: "A concept project using computer vision (OpenCV) to detect signs of driver fatigue (eye closure, yawning) and raise real-time audible alerts.",
      technologies: ["ML", "Computer Vision", "Real-time"],
      githubUrl: "https://github.com/parinith01",
      color: "cyan"
    },
    {
      title: "Banking Database System",
      shortDescription: "A secured banking system mockup emphasizing database integrity, multi-role authentication (Admin vs User), and transaction workflows.",
      technologies: ["DBMS", "Full Stack", "Java/SQL"],
      githubUrl: "https://github.com/parinith01",
      color: "fuchsia"
    }
  ];

  const projects = cmsData?.projects && cmsData.projects.length > 0 ? cmsData.projects : defaultProjects;
  const aboutText = cmsData?.about?.biography;

  return (
    <div data-testid="page-home" className="min-h-screen bg-background relative selection:bg-cyan-500/30 font-sans">

      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <img
          data-testid="img-hero-background"
          src={cyberBg}
          alt="Cyberpunk rave abstract background"
          className="h-full w-full object-cover opacity-40 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-rave mix-blend-overlay opacity-80" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 noise" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <main className="relative z-10">
        <Navbar />
        <IdentitySection homeData={cmsData?.home} />

        <section id="about" data-testid="section-about" className="mx-auto w-full max-w-7xl px-6 py-6 md:py-10">
          <div className="glass rounded-2xl p-8 border border-white/10 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
            </div>

            <h2 data-testid="text-about-title" className="text-neon text-3xl font-semibold tracking-tight text-white mb-6">
              About Me
            </h2>
            <div className="grid grid-cols-1 gap-8 items-start">
              <div className="space-y-4 text-base text-white/80 leading-relaxed font-light">
                {aboutText ? (
                  <p className="whitespace-pre-line">{aboutText}</p>
                ) : (
                  <>
                    <p>
                      I’m a creative developer and engineer who enjoys turning ideas into practical, real-world solutions. I like building, experimenting, and learning continuously, whether it’s through code, system design, or exploring new technologies. I work across the development lifecycle, from planning and designing to implementing and improving, with a focus on creating efficient, scalable, and user-friendly solutions.
                    </p>
                    <p>
                      I enjoy breaking down complex problems, thinking logically, and engineering solutions that make processes smarter and more impactful. What excites me most about technology is the balance between analytical thinking and creativity, and how modern tools allow us to build things that were once just ideas.
                    </p>
                    <p>
                      Beyond development, I’m inspired by creativity in everyday life, from design and innovation to exploring new perspectives. I believe strong problem-solving comes from both technical skill and creative thinking. For me, technology is not just about writing code, it’s about designing meaningful solutions, improving experiences, and continuously evolving as a builder and thinker in a fast-moving digital world.
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2 font-mono">My "Why"</h3>
                  <p className="text-sm text-white/70 italic">
                    "{cmsData?.about?.myWhyQuote || "Code is not just about logic; it's about architecture and art. I strive to build software that feels as good as it runs."}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <EducationSection eduData={cmsData?.education} />

        <section id="projects" data-testid="section-projects" className="mx-auto w-full max-w-7xl px-6 pb-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 data-testid="text-projects-title" className="text-neon text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Featured Projects
              </h2>
              <p data-testid="text-projects-subtitle" className="mt-2 max-w-2xl text-base text-white/70">
                The builds that best represent my interests: safety-focused ML and systems thinking.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((proj: any, idx: number) => {
              const borderGlow = idx % 2 === 0 ? "hover:border-cyan-400/50" : "hover:border-fuchsia-400/50";
              const titleGlow = idx % 2 === 0 ? "group-hover:text-cyan-300" : "group-hover:text-fuchsia-300";
              const linkGlow = idx % 2 === 0 ? "text-cyan-300 hover:text-cyan-200" : "text-fuchsia-300 hover:text-fuchsia-200";

              return (
                <div key={proj.title} className={`glass rounded-2xl p-8 hover:bg-white/5 transition-all duration-500 border border-white/10 ${borderGlow} group flex flex-col h-full`}>
                  <div className="flex-grow">
                    <h3 className={`font-mono text-xl font-semibold text-white ${titleGlow} transition-colors`}>
                      {proj.title}
                    </h3>
                    <p className="mt-4 text-base text-white/75 leading-relaxed">
                      {proj.shortDescription}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {proj.technologies?.map((tech: string) => (
                        <Badge key={tech} className="bg-white/5 text-white/75 ring-1 ring-inset ring-white/10 font-mono">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <a href={proj.githubUrl || "https://github.com/parinith01"} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 text-sm font-medium ${linkGlow} transition-colors font-mono`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                      View Repository
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <SkillsSection skillsData={cmsData?.skills} />
        <CertificationsSection certsData={cmsData?.certificates} />
        <AdditionalInfoSection />
        <ContactSection socialsData={cmsData?.socials} />

        <footer data-testid="footer" className="mx-auto w-full max-w-7xl px-6 pb-12">
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
            <div className="text-center md:text-left">
              <div data-testid="text-footer-name" className="font-mono text-base font-semibold text-white">
                {cmsData?.home?.name || "Parinith C M"}
              </div>
              <div data-testid="text-footer-note" className="mt-1 text-sm text-white/60 font-mono">
                {cmsData?.settings?.footerText || "© 2026. Built with React & Express CMS."}
              </div>
            </div>
            <div className="flex gap-4">
              <a href="/admin/login" className="text-xs font-mono text-cyan-400/60 hover:text-cyan-300 transition-colors">
                Parinith C M Portal
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
