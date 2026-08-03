import fs from 'fs';
import path from 'path';

export interface HomeData {
  name: string;
  role: string;
  typingText: string;
  shortDescription: string;
  btn1Text: string;
  btn1Link: string;
  btn2Text: string;
  btn2Link: string;
  bgImage: string;
  profileImage: string;
}

export interface AboutData {
  photo: string;
  biography: string;
  myWhyQuote: string;
  experience: string;
  location: string;
  email: string;
  phone: string;
  resumeUrl: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  percentage: number;
  description: string;
  logo: string;
  displayOrder: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  image: string;
  multipleImages: string[];
  featured: boolean;
  category: string;
  status: string;
  date: string;
  displayOrder: number;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  companyLogo: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  location: string;
  degree: string;
  score: string;
  year: string;
  color: string;
  displayOrder: number;
}

export interface CertificateItem {
  id: string;
  name: string;
  org: string;
  issueDate: string;
  credentialId: string;
  verificationLink: string;
  image: string;
  pdfLink: string;
  displayOrder: number;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  uploadedAt: string;
}

export interface SocialLinksData {
  github: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  leetcode: string;
  hackerrank: string;
  codechef: string;
  codeforces: string;
  email: string;
  phone: string;
}

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface SettingsData {
  siteTitle: string;
  favicon: string;
  logoText: string;
  footerText: string;
  themeColor: string;
  darkMode: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  googleAnalyticsId: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  action: string;
  section: string;
  user: string;
}

export interface CMSState {
  home: HomeData;
  about: AboutData;
  skills: SkillItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certificates: CertificateItem[];
  gallery: GalleryItem[];
  socials: SocialLinksData;
  messages: MessageItem[];
  settings: SettingsData;
  activityLogs: ActivityLogItem[];
  lastUpdated: string;
  websiteViews: number;
}

const DEFAULT_STATE: CMSState = {
  lastUpdated: new Date().toISOString(),
  websiteViews: 142,
  home: {
    name: "PARINITH C M",
    role: "Computer Science Engineer",
    typingText: "FULL STACK DEVELOPER",
    shortDescription: "Passionate about building scalable solutions. Skilled in HTML, CSS, JavaScript for crafting responsive UIs, and Python, Java for robust backend engineering.",
    btn1Text: "View Projects",
    btn1Link: "#projects",
    btn2Text: "Contact Me",
    btn2Link: "#contact",
    bgImage: "",
    profileImage: "/src/assets/profile.jpg"
  },
  about: {
    photo: "/src/assets/profile.jpg",
    biography: "I’m a creative developer and engineer who enjoys turning ideas into practical, real-world solutions. I like building, experimenting, and learning continuously, whether it’s through code, system design, or exploring new technologies. I work across the development lifecycle, from planning and designing to implementing and improving, with a focus on creating efficient, scalable, and user-friendly solutions.",
    myWhyQuote: "Code is not just about logic; it's about architecture and art. I strive to build software that feels as good as it runs.",
    experience: "Student & Full Stack Developer",
    location: "Mysore / Mandya, Karnataka, India",
    email: "parinithmswamy15@gmail.com",
    phone: "+91 9876543210",
    resumeUrl: "/Parinith_CM_Resume.pdf"
  },
  skills: [
    { id: "1", name: "HTML", category: "Frontend", percentage: 95, description: "The foundational backbone used to structure web content with semantic clarity and modern accessibility standards.", logo: "html5", displayOrder: 1 },
    { id: "2", name: "CSS", category: "Frontend", percentage: 90, description: "The creative engine for styling responsive, high-fidelity interfaces using advanced layouts like Flexbox and Grid.", logo: "css3", displayOrder: 2 },
    { id: "3", name: "JavaScript", category: "Frontend", percentage: 90, description: "The primary language for adding dynamic interactivity and complex logic to the client-side of web applications.", logo: "javascript", displayOrder: 3 },
    { id: "4", name: "Python", category: "Backend", percentage: 85, description: "A versatile, high-level language leveraged for building robust backend logic, automation scripts, and AI-driven solutions.", logo: "python", displayOrder: 4 },
    { id: "5", name: "Java", category: "Backend", percentage: 85, description: "A powerful, object-oriented language essential for developing secure, scalable, and cross-platform enterprise applications.", logo: "java", displayOrder: 5 }
  ],
  projects: [
    {
      id: "1",
      title: "Driver Drowsiness Detection",
      shortDescription: "A concept project using computer vision (OpenCV) to detect signs of driver fatigue (eye closure, yawning) and raise real-time audible alerts.",
      detailedDescription: "Designed and built an end-to-end real-time driver fatigue monitoring system. Utilized OpenCV and Dlib facial landmark predictors to calculate Eye Aspect Ratio (EAR) and Mouth Aspect Ratio (MAR) in real-time, triggering immediate audio alert warnings when parameters cross danger thresholds.",
      technologies: ["Python", "OpenCV", "Machine Learning", "Real-time Processing"],
      githubUrl: "https://github.com/parinith01",
      liveUrl: "https://github.com/parinith01",
      image: "",
      multipleImages: [],
      featured: true,
      category: "Computer Vision / ML",
      status: "Completed",
      date: "2025",
      displayOrder: 1
    },
    {
      id: "2",
      title: "Banking Database System",
      shortDescription: "A secured banking system mockup emphasizing database integrity, multi-role authentication (Admin vs User), and transaction workflows.",
      detailedDescription: "A full-featured relational database management application providing secure user authentication, multi-account management, transaction auditing, fund transfer validation, and role-based access control.",
      technologies: ["Java", "SQL", "DBMS", "Full Stack"],
      githubUrl: "https://github.com/parinith01",
      liveUrl: "https://github.com/parinith01",
      image: "",
      multipleImages: [],
      featured: true,
      category: "DBMS / Full Stack",
      status: "Completed",
      date: "2024",
      displayOrder: 2
    }
  ],
  experience: [
    {
      id: "1",
      company: "Stack Forge Coding Club",
      role: "Member & Technical Contributor",
      description: "Collaborated on open-source projects, peer learning sessions, and hackathon prototypes.",
      startDate: "2023",
      endDate: "Present",
      currentlyWorking: true,
      companyLogo: ""
    }
  ],
  education: [
    { id: "1", institution: "Maharaja Institute of Technology Mysore", location: "Mandya", degree: "BE in Computer Science & Engineering", score: "8.56 CGPA", year: "2023 - 2027", color: "cyan", displayOrder: 1 },
    { id: "2", institution: "Marimallappa Pre University College", location: "Mysore", degree: "Pre-University (PCMB)", score: "90%", year: "2021 - 2023", color: "fuchsia", displayOrder: 2 },
    { id: "3", institution: "Adarsha Vidyalaya Sosale", location: "T Narsipura, Mysore", degree: "High School", score: "90%", year: "2018 - 2021", color: "emerald", displayOrder: 3 }
  ],
  certificates: [
    { id: "1", name: "Cyber Security Technologies", org: "Illinois Tech", issueDate: "2024", credentialId: "IL-CYBER-2024", verificationLink: "", image: "", pdfLink: "/Cyber_Security_Technologies.pdf", displayOrder: 1 },
    { id: "2", name: "AWS Cloud Practitioner Essentials", org: "Amazon Web Services", issueDate: "2024", credentialId: "AWS-CP-2024", verificationLink: "", image: "", pdfLink: "/AWS_Cloud_Practitioner_Essentials.pdf", displayOrder: 2 },
    { id: "3", name: "Advanced Java", org: "LearnQuest", issueDate: "2024", credentialId: "LQ-JAVA-2024", verificationLink: "", image: "", pdfLink: "/advanced_java.pdf", displayOrder: 3 },
    { id: "4", name: "Developing Front-End Apps with React", org: "IBM", issueDate: "2024", credentialId: "IBM-REACT-2024", verificationLink: "", image: "", pdfLink: "/Developing_Front-End_Apps_with_React.pdf", displayOrder: 4 }
  ],
  gallery: [],
  socials: {
    github: "https://github.com/parinith01",
    linkedin: "https://www.linkedin.com/in/parinith-c-m-1042712b7/",
    instagram: "https://www.instagram.com/parinith_shaiva/",
    twitter: "https://x.com",
    leetcode: "https://leetcode.com",
    hackerrank: "https://hackerrank.com",
    codechef: "https://codechef.com",
    codeforces: "https://codeforces.com",
    email: "parinithmswamy15@gmail.com",
    phone: "+91 9876543210"
  },
  messages: [
    {
      id: "msg-1",
      name: "Alex Morgan",
      email: "alex@example.com",
      message: "Hey Parinith! Great portfolio website! Would love to connect regarding software engineering opportunities.",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      read: false
    }
  ],
  settings: {
    siteTitle: "Parinith C M - Admin Control Center",
    favicon: "/favicon.ico",
    logoText: "PARINITH C M",
    footerText: "© 2026 Parinith C M. Built with React & Express.",
    themeColor: "cyan",
    darkMode: true,
    seoTitle: "Parinith C M | Computer Science Engineer & Full Stack Developer",
    seoDescription: "Portfolio website of Parinith C M - Computer Science Engineer skilled in React, Node, Python, and Java.",
    seoKeywords: "Parinith C M, Portfolio, Full Stack Developer, Computer Science Engineer, React, Python, Java",
    googleAnalyticsId: "UA-12345678-1"
  },
  activityLogs: [
    {
      id: "log-1",
      timestamp: new Date().toISOString(),
      action: "CMS Initialized",
      section: "System",
      user: "admin"
    }
  ]
};

const getCMSDataFilePath = () => {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    return path.join('/tmp', 'cms_data.json');
  }
  return path.join(process.cwd(), 'data', 'cms_data.json');
};

export class CMSStorage {
  private data: CMSState;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): CMSState {
    try {
      const dataFile = getCMSDataFilePath();
      if (fs.existsSync(dataFile)) {
        const fileContent = fs.readFileSync(dataFile, 'utf-8');
        return { ...DEFAULT_STATE, ...JSON.parse(fileContent) };
      }
      // Also check root data folder as fallback
      const rootDataFile = path.join(process.cwd(), 'data', 'cms_data.json');
      if (fs.existsSync(rootDataFile)) {
        const fileContent = fs.readFileSync(rootDataFile, 'utf-8');
        return { ...DEFAULT_STATE, ...JSON.parse(fileContent) };
      }
    } catch (error) {
      console.error('Failed to read CMS data file:', error);
    }
    return DEFAULT_STATE;
  }

  private saveData() {
    try {
      const dataFile = getCMSDataFilePath();
      const dir = path.dirname(dataFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      this.data.lastUpdated = new Date().toISOString();
      fs.writeFileSync(dataFile, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (error) {
      console.warn('CMS data persist note:', (error as Error).message);
    }
  }

  public getFullState(): CMSState {
    this.data.websiteViews += 1;
    return this.data;
  }

  public logActivity(action: string, section: string, user: string = 'admin') {
    const log: ActivityLogItem = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      action,
      section,
      user
    };
    this.data.activityLogs.unshift(log);
    if (this.data.activityLogs.length > 50) {
      this.data.activityLogs = this.data.activityLogs.slice(0, 50);
    }
  }

  public updateHome(homeData: Partial<HomeData>): HomeData {
    this.data.home = { ...this.data.home, ...homeData };
    this.logActivity('Updated Home Section', 'Home');
    this.saveData();
    return this.data.home;
  }

  public updateAbout(aboutData: Partial<AboutData>): AboutData {
    this.data.about = { ...this.data.about, ...aboutData };
    this.logActivity('Updated About Section', 'About');
    this.saveData();
    return this.data.about;
  }

  public updateSocials(socialsData: Partial<SocialLinksData>): SocialLinksData {
    this.data.socials = { ...this.data.socials, ...socialsData };
    this.logActivity('Updated Social Links', 'Social Links');
    this.saveData();
    return this.data.socials;
  }

  public updateSettings(settingsData: Partial<SettingsData>): SettingsData {
    this.data.settings = { ...this.data.settings, ...settingsData };
    this.logActivity('Updated Site Settings', 'Settings');
    this.saveData();
    return this.data.settings;
  }

  // Skills
  public addSkill(skill: Omit<SkillItem, 'id'>): SkillItem {
    const newSkill: SkillItem = { ...skill, id: 'skill-' + Date.now() };
    this.data.skills.push(newSkill);
    this.logActivity(`Added Skill: ${skill.name}`, 'Skills');
    this.saveData();
    return newSkill;
  }

  public updateSkill(id: string, skill: Partial<SkillItem>): SkillItem | null {
    const index = this.data.skills.findIndex(s => s.id === id);
    if (index === -1) return null;
    this.data.skills[index] = { ...this.data.skills[index], ...skill };
    this.logActivity(`Updated Skill: ${this.data.skills[index].name}`, 'Skills');
    this.saveData();
    return this.data.skills[index];
  }

  public deleteSkill(id: string): boolean {
    const initialLen = this.data.skills.length;
    this.data.skills = this.data.skills.filter(s => s.id !== id);
    if (this.data.skills.length !== initialLen) {
      this.logActivity(`Deleted Skill (ID: ${id})`, 'Skills');
      this.saveData();
      return true;
    }
    return false;
  }

  // Projects
  public addProject(project: Omit<ProjectItem, 'id'>): ProjectItem {
    const newProj: ProjectItem = { ...project, id: 'proj-' + Date.now() };
    this.data.projects.push(newProj);
    this.logActivity(`Added Project: ${project.title}`, 'Projects');
    this.saveData();
    return newProj;
  }

  public updateProject(id: string, project: Partial<ProjectItem>): ProjectItem | null {
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.projects[index] = { ...this.data.projects[index], ...project };
    this.logActivity(`Updated Project: ${this.data.projects[index].title}`, 'Projects');
    this.saveData();
    return this.data.projects[index];
  }

  public deleteProject(id: string): boolean {
    const initialLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    if (this.data.projects.length !== initialLen) {
      this.logActivity(`Deleted Project (ID: ${id})`, 'Projects');
      this.saveData();
      return true;
    }
    return false;
  }

  // Experience
  public addExperience(exp: Omit<ExperienceItem, 'id'>): ExperienceItem {
    const newExp: ExperienceItem = { ...exp, id: 'exp-' + Date.now() };
    this.data.experience.push(newExp);
    this.logActivity(`Added Experience: ${exp.company}`, 'Experience');
    this.saveData();
    return newExp;
  }

  public updateExperience(id: string, exp: Partial<ExperienceItem>): ExperienceItem | null {
    const index = this.data.experience.findIndex(e => e.id === id);
    if (index === -1) return null;
    this.data.experience[index] = { ...this.data.experience[index], ...exp };
    this.logActivity(`Updated Experience: ${this.data.experience[index].company}`, 'Experience');
    this.saveData();
    return this.data.experience[index];
  }

  public deleteExperience(id: string): boolean {
    const initialLen = this.data.experience.length;
    this.data.experience = this.data.experience.filter(e => e.id !== id);
    if (this.data.experience.length !== initialLen) {
      this.logActivity(`Deleted Experience (ID: ${id})`, 'Experience');
      this.saveData();
      return true;
    }
    return false;
  }

  // Education
  public addEducation(edu: Omit<EducationItem, 'id'>): EducationItem {
    const newEdu: EducationItem = { ...edu, id: 'edu-' + Date.now() };
    this.data.education.push(newEdu);
    this.logActivity(`Added Education: ${edu.institution}`, 'Education');
    this.saveData();
    return newEdu;
  }

  public updateEducation(id: string, edu: Partial<EducationItem>): EducationItem | null {
    const index = this.data.education.findIndex(e => e.id === id);
    if (index === -1) return null;
    this.data.education[index] = { ...this.data.education[index], ...edu };
    this.logActivity(`Updated Education: ${this.data.education[index].institution}`, 'Education');
    this.saveData();
    return this.data.education[index];
  }

  public deleteEducation(id: string): boolean {
    const initialLen = this.data.education.length;
    this.data.education = this.data.education.filter(e => e.id !== id);
    if (this.data.education.length !== initialLen) {
      this.logActivity(`Deleted Education (ID: ${id})`, 'Education');
      this.saveData();
      return true;
    }
    return false;
  }

  // Certificates
  public addCertificate(cert: Omit<CertificateItem, 'id'>): CertificateItem {
    const newCert: CertificateItem = { ...cert, id: 'cert-' + Date.now() };
    this.data.certificates.push(newCert);
    this.logActivity(`Added Certificate: ${cert.name}`, 'Certificates');
    this.saveData();
    return newCert;
  }

  public updateCertificate(id: string, cert: Partial<CertificateItem>): CertificateItem | null {
    const index = this.data.certificates.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.data.certificates[index] = { ...this.data.certificates[index], ...cert };
    this.logActivity(`Updated Certificate: ${this.data.certificates[index].name}`, 'Certificates');
    this.saveData();
    return this.data.certificates[index];
  }

  public deleteCertificate(id: string): boolean {
    const initialLen = this.data.certificates.length;
    this.data.certificates = this.data.certificates.filter(c => c.id !== id);
    if (this.data.certificates.length !== initialLen) {
      this.logActivity(`Deleted Certificate (ID: ${id})`, 'Certificates');
      this.saveData();
      return true;
    }
    return false;
  }

  // Gallery
  public addGalleryItem(item: Omit<GalleryItem, 'id' | 'uploadedAt'>): GalleryItem {
    const newItem: GalleryItem = { ...item, id: 'img-' + Date.now(), uploadedAt: new Date().toISOString() };
    this.data.gallery.push(newItem);
    this.logActivity('Uploaded Gallery Image', 'Gallery');
    this.saveData();
    return newItem;
  }

  public deleteGalleryItem(id: string): boolean {
    const initialLen = this.data.gallery.length;
    this.data.gallery = this.data.gallery.filter(g => g.id !== id);
    if (this.data.gallery.length !== initialLen) {
      this.logActivity(`Deleted Gallery Image (ID: ${id})`, 'Gallery');
      this.saveData();
      return true;
    }
    return false;
  }

  // Messages
  public addMessage(msg: Omit<MessageItem, 'id' | 'createdAt' | 'read'>): MessageItem {
    const newMsg: MessageItem = {
      ...msg,
      id: 'msg-' + Date.now(),
      createdAt: new Date().toISOString(),
      read: false
    };
    this.data.messages.unshift(newMsg);
    this.saveData();
    return newMsg;
  }

  public markMessageRead(id: string): MessageItem | null {
    const msg = this.data.messages.find(m => m.id === id);
    if (!msg) return null;
    msg.read = true;
    this.saveData();
    return msg;
  }

  public deleteMessage(id: string): boolean {
    const initialLen = this.data.messages.length;
    this.data.messages = this.data.messages.filter(m => m.id !== id);
    if (this.data.messages.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Backup & Restore
  public restoreState(state: CMSState): boolean {
    try {
      this.data = { ...state, lastUpdated: new Date().toISOString() };
      this.logActivity('Restored Database from Backup', 'System');
      this.saveData();
      return true;
    } catch (e) {
      return false;
    }
  }
}

export const cmsStorage = new CMSStorage();
