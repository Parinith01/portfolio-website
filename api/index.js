// api/index.ts
import dotenv2 from "dotenv";
import express8 from "express";
import cors from "cors";
import path5 from "path";

// server/db.ts
import mongoose from "mongoose";
var connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes("localhost") || uri.includes("127.0.0.1")) {
    if (true) {
      console.log("No cloud MONGO_URI provided in production. Using built-in CMS JSON storage.");
      return false;
    }
  }
  const connectionUri = uri || "mongodb://localhost:27017/portfolio_db";
  try {
    const conn = await mongoose.connect(connectionUri, {
      serverSelectionTimeoutMS: 3e3
      // Fast 3s timeout
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn("MongoDB Connection Failed. Running with built-in CMS JSON storage.");
    return false;
  }
};
var db_default = connectDB;

// server/routes/auth.ts
import express from "express";
import jwt2 from "jsonwebtoken";
import bcrypt2 from "bcryptjs";
import mongoose3 from "mongoose";

// server/models/user.ts
import mongoose2 from "mongoose";
import bcrypt from "bcryptjs";
var userSchema = new mongoose2.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
var User = mongoose2.model("User", userSchema);

// server/middleware/authMiddleware.ts
import jwt from "jsonwebtoken";
var getJwtSecret = () => process.env.JWT_SECRET || "portfolio_jwt_secret_2026";
var protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, getJwtSecret());
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token validation failed" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// server/routes/auth.ts
var router = express.Router();
var getJwtSecret2 = () => process.env.JWT_SECRET || "portfolio_jwt_secret_2026";
var DEFAULT_ADMIN_USER = process.env.ADMIN_USERNAME || "parinith";
var DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || "Pari@1947";
var DEFAULT_ADMIN_PASS_HASH = bcrypt2.hashSync(DEFAULT_ADMIN_PASS, 10);
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  try {
    let isAuthenticated = false;
    let userId = "admin-id";
    let userRole = "admin";
    if (mongoose3.connection && mongoose3.connection.readyState === 1) {
      try {
        const user = await User.findOne({ username });
        if (user && await bcrypt2.compare(password, user.password)) {
          isAuthenticated = true;
          userId = user._id.toString();
        }
      } catch (dbErr) {
      }
    }
    if (!isAuthenticated) {
      if (username === DEFAULT_ADMIN_USER) {
        if (password === DEFAULT_ADMIN_PASS || bcrypt2.compareSync(password, DEFAULT_ADMIN_PASS_HASH)) {
          isAuthenticated = true;
        }
      }
    }
    if (isAuthenticated) {
      const token = jwt2.sign(
        { id: userId, username, role: userRole },
        getJwtSecret2(),
        { expiresIn: "30d" }
      );
      return res.json({
        message: "Login successful",
        token,
        user: {
          username,
          role: userRole
        }
      });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    return res.status(500).json({ message: error?.message || "Authentication error" });
  }
});
router.get("/me", protect, (req, res) => {
  res.json({
    user: req.user
  });
});
router.post("/seed", async (req, res) => {
  const { username = "parinith", password = "Pari@1947" } = req.body;
  if (mongoose3.connection.readyState !== 1) {
    return res.json({ message: "Default admin credentials active (DB not connected)." });
  }
  const userExists = await User.findOne({ username });
  if (userExists) return res.status(400).json({ message: "User already exists" });
  await User.create({ username, password });
  res.json({ message: "Admin user created in MongoDB" });
});
var auth_default = router;

// server/routes/projects.ts
import express2 from "express";

// server/models/project.ts
import mongoose4 from "mongoose";
var projectSchema = new mongoose4.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  link: { type: String },
  image: { type: String }
}, { timestamps: true });
var Project = mongoose4.model("Project", projectSchema);

// server/routes/projects.ts
var router2 = express2.Router();
router2.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router2.post("/", protect, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router2.put("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router2.delete("/:id", protect, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
var projects_default = router2;

// server/routes/contact.ts
import express3 from "express";
import nodemailer from "nodemailer";
import mongoose6 from "mongoose";

// server/models/contact.ts
import mongoose5 from "mongoose";
var contactSchema = new mongoose5.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: false, default: "New Portfolio Inquiry" },
  message: { type: String, required: true }
}, { timestamps: true });
var Contact = mongoose5.model("Contact", contactSchema);

// server/storageCMS.ts
import fs from "fs";
import path from "path";
var DEFAULT_STATE = {
  lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
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
    biography: "I\u2019m a creative developer and engineer who enjoys turning ideas into practical, real-world solutions. I like building, experimenting, and learning continuously, whether it\u2019s through code, system design, or exploring new technologies. I work across the development lifecycle, from planning and designing to implementing and improving, with a focus on creating efficient, scalable, and user-friendly solutions.",
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
      createdAt: new Date(Date.now() - 36e5 * 24).toISOString(),
      read: false
    }
  ],
  settings: {
    siteTitle: "Parinith C M - Admin Control Center",
    favicon: "/favicon.ico",
    logoText: "PARINITH C M",
    footerText: "\xA9 2026 Parinith C M. Built with React & Express.",
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
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      action: "CMS Initialized",
      section: "System",
      user: "admin"
    }
  ]
};
var getCMSDataFilePath = () => {
  if (process.env.VERCEL || true) {
    return path.join("/tmp", "cms_data.json");
  }
  return path.join(process.cwd(), "data", "cms_data.json");
};
var CMSStorage = class {
  data;
  constructor() {
    this.data = this.loadData();
  }
  loadData() {
    try {
      const dataFile = getCMSDataFilePath();
      if (fs.existsSync(dataFile)) {
        const fileContent = fs.readFileSync(dataFile, "utf-8");
        return { ...DEFAULT_STATE, ...JSON.parse(fileContent) };
      }
      const rootDataFile = path.join(process.cwd(), "data", "cms_data.json");
      if (fs.existsSync(rootDataFile)) {
        const fileContent = fs.readFileSync(rootDataFile, "utf-8");
        return { ...DEFAULT_STATE, ...JSON.parse(fileContent) };
      }
    } catch (error) {
      console.error("Failed to read CMS data file:", error);
    }
    return DEFAULT_STATE;
  }
  saveData() {
    try {
      const dataFile = getCMSDataFilePath();
      const dir = path.dirname(dataFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      this.data.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      fs.writeFileSync(dataFile, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (error) {
      console.warn("CMS data persist note:", error.message);
    }
  }
  getFullState() {
    this.data.websiteViews += 1;
    return this.data;
  }
  logActivity(action, section, user = "admin") {
    const log2 = {
      id: "log-" + Date.now(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      action,
      section,
      user
    };
    this.data.activityLogs.unshift(log2);
    if (this.data.activityLogs.length > 50) {
      this.data.activityLogs = this.data.activityLogs.slice(0, 50);
    }
  }
  updateHome(homeData) {
    this.data.home = { ...this.data.home, ...homeData };
    this.logActivity("Updated Home Section", "Home");
    this.saveData();
    return this.data.home;
  }
  updateAbout(aboutData) {
    this.data.about = { ...this.data.about, ...aboutData };
    this.logActivity("Updated About Section", "About");
    this.saveData();
    return this.data.about;
  }
  updateSocials(socialsData) {
    this.data.socials = { ...this.data.socials, ...socialsData };
    this.logActivity("Updated Social Links", "Social Links");
    this.saveData();
    return this.data.socials;
  }
  updateSettings(settingsData) {
    this.data.settings = { ...this.data.settings, ...settingsData };
    this.logActivity("Updated Site Settings", "Settings");
    this.saveData();
    return this.data.settings;
  }
  // Skills
  addSkill(skill) {
    const newSkill = { ...skill, id: "skill-" + Date.now() };
    this.data.skills.push(newSkill);
    this.logActivity(`Added Skill: ${skill.name}`, "Skills");
    this.saveData();
    return newSkill;
  }
  updateSkill(id, skill) {
    const index = this.data.skills.findIndex((s) => s.id === id);
    if (index === -1) return null;
    this.data.skills[index] = { ...this.data.skills[index], ...skill };
    this.logActivity(`Updated Skill: ${this.data.skills[index].name}`, "Skills");
    this.saveData();
    return this.data.skills[index];
  }
  deleteSkill(id) {
    const initialLen = this.data.skills.length;
    this.data.skills = this.data.skills.filter((s) => s.id !== id);
    if (this.data.skills.length !== initialLen) {
      this.logActivity(`Deleted Skill (ID: ${id})`, "Skills");
      this.saveData();
      return true;
    }
    return false;
  }
  // Projects
  addProject(project) {
    const newProj = { ...project, id: "proj-" + Date.now() };
    this.data.projects.push(newProj);
    this.logActivity(`Added Project: ${project.title}`, "Projects");
    this.saveData();
    return newProj;
  }
  updateProject(id, project) {
    const index = this.data.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.data.projects[index] = { ...this.data.projects[index], ...project };
    this.logActivity(`Updated Project: ${this.data.projects[index].title}`, "Projects");
    this.saveData();
    return this.data.projects[index];
  }
  deleteProject(id) {
    const initialLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    if (this.data.projects.length !== initialLen) {
      this.logActivity(`Deleted Project (ID: ${id})`, "Projects");
      this.saveData();
      return true;
    }
    return false;
  }
  // Experience
  addExperience(exp) {
    const newExp = { ...exp, id: "exp-" + Date.now() };
    this.data.experience.push(newExp);
    this.logActivity(`Added Experience: ${exp.company}`, "Experience");
    this.saveData();
    return newExp;
  }
  updateExperience(id, exp) {
    const index = this.data.experience.findIndex((e) => e.id === id);
    if (index === -1) return null;
    this.data.experience[index] = { ...this.data.experience[index], ...exp };
    this.logActivity(`Updated Experience: ${this.data.experience[index].company}`, "Experience");
    this.saveData();
    return this.data.experience[index];
  }
  deleteExperience(id) {
    const initialLen = this.data.experience.length;
    this.data.experience = this.data.experience.filter((e) => e.id !== id);
    if (this.data.experience.length !== initialLen) {
      this.logActivity(`Deleted Experience (ID: ${id})`, "Experience");
      this.saveData();
      return true;
    }
    return false;
  }
  // Education
  addEducation(edu) {
    const newEdu = { ...edu, id: "edu-" + Date.now() };
    this.data.education.push(newEdu);
    this.logActivity(`Added Education: ${edu.institution}`, "Education");
    this.saveData();
    return newEdu;
  }
  updateEducation(id, edu) {
    const index = this.data.education.findIndex((e) => e.id === id);
    if (index === -1) return null;
    this.data.education[index] = { ...this.data.education[index], ...edu };
    this.logActivity(`Updated Education: ${this.data.education[index].institution}`, "Education");
    this.saveData();
    return this.data.education[index];
  }
  deleteEducation(id) {
    const initialLen = this.data.education.length;
    this.data.education = this.data.education.filter((e) => e.id !== id);
    if (this.data.education.length !== initialLen) {
      this.logActivity(`Deleted Education (ID: ${id})`, "Education");
      this.saveData();
      return true;
    }
    return false;
  }
  // Certificates
  addCertificate(cert) {
    const newCert = { ...cert, id: "cert-" + Date.now() };
    this.data.certificates.push(newCert);
    this.logActivity(`Added Certificate: ${cert.name}`, "Certificates");
    this.saveData();
    return newCert;
  }
  updateCertificate(id, cert) {
    const index = this.data.certificates.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.data.certificates[index] = { ...this.data.certificates[index], ...cert };
    this.logActivity(`Updated Certificate: ${this.data.certificates[index].name}`, "Certificates");
    this.saveData();
    return this.data.certificates[index];
  }
  deleteCertificate(id) {
    const initialLen = this.data.certificates.length;
    this.data.certificates = this.data.certificates.filter((c) => c.id !== id);
    if (this.data.certificates.length !== initialLen) {
      this.logActivity(`Deleted Certificate (ID: ${id})`, "Certificates");
      this.saveData();
      return true;
    }
    return false;
  }
  // Gallery
  addGalleryItem(item) {
    const newItem = { ...item, id: "img-" + Date.now(), uploadedAt: (/* @__PURE__ */ new Date()).toISOString() };
    this.data.gallery.push(newItem);
    this.logActivity("Uploaded Gallery Image", "Gallery");
    this.saveData();
    return newItem;
  }
  deleteGalleryItem(id) {
    const initialLen = this.data.gallery.length;
    this.data.gallery = this.data.gallery.filter((g) => g.id !== id);
    if (this.data.gallery.length !== initialLen) {
      this.logActivity(`Deleted Gallery Image (ID: ${id})`, "Gallery");
      this.saveData();
      return true;
    }
    return false;
  }
  // Messages
  addMessage(msg) {
    const newMsg = {
      ...msg,
      id: "msg-" + Date.now(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      read: false
    };
    this.data.messages.unshift(newMsg);
    this.saveData();
    return newMsg;
  }
  markMessageRead(id) {
    const msg = this.data.messages.find((m) => m.id === id);
    if (!msg) return null;
    msg.read = true;
    this.saveData();
    return msg;
  }
  deleteMessage(id) {
    const initialLen = this.data.messages.length;
    this.data.messages = this.data.messages.filter((m) => m.id !== id);
    if (this.data.messages.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }
  // Backup & Restore
  restoreState(state) {
    try {
      this.data = { ...state, lastUpdated: (/* @__PURE__ */ new Date()).toISOString() };
      this.logActivity("Restored Database from Backup", "System");
      this.saveData();
      return true;
    } catch (e) {
      return false;
    }
  }
};
var cmsStorage = new CMSStorage();

// server/routes/contact.ts
import fs2 from "fs";
import path2 from "path";
import dotenv from "dotenv";
dotenv.config();
var router3 = express3.Router();
var logPath = path2.resolve(process.cwd(), "debug_mail.log");
var log = (msg) => {
  const time = (/* @__PURE__ */ new Date()).toISOString();
  try {
    fs2.appendFileSync(logPath, `[${time}] ${msg}
`);
  } catch (e) {
    console.error("LOG ERROR:", e);
  }
};
router3.post("/", (req, res) => {
  log("-----------------------------------------");
  log("ROUTE HIT: POST /api/contact");
  const { name, email, subject = "New Portfolio Inquiry", message } = req.body;
  log(`Payload: ${email} - ${subject}`);
  try {
    cmsStorage.addMessage({ name, email, message: message || subject });
    log("CMS: Saved to admin inbox successfully");
  } catch (cmsErr) {
    log(`CMS Save Error: ${cmsErr.message}`);
  }
  res.status(200).json({ message: "Message received!" });
  (async () => {
    if (mongoose6.connection.readyState === 1) {
      try {
        await Contact.create({ name, email, subject, message });
        log("DB: Saved successfully");
      } catch (dbError) {
        log(`DB Error: ${dbError.message}`);
      }
    } else {
      log("DB: Not connected");
    }
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      log(`EMAIL CONFIG ERROR: User=${!!process.env.EMAIL_USER}, Pass=${!!process.env.EMAIL_PASS}`);
      return;
    }
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS.replace(/^"|"$/g, "")
        }
      });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `Portfolio Contact: ${subject}`,
        text: `Name: ${name}
Email: ${email}
Message: ${message}`
      };
      await transporter.sendMail(mailOptions);
      log("EMAIL SUCCESS: Sent via Nodemailer");
    } catch (emailError) {
      log(`EMAIL ERROR: ${emailError.message}`);
      console.error("Background Email Send failed:", emailError);
    }
  })().catch((err) => {
    log(`FATAL ASYNC ERROR: ${err.message}`);
  });
});
var contact_default = router3;

// server/routes/resume.ts
import express4 from "express";
import path3 from "path";
import fs3 from "fs";
var router4 = express4.Router();
router4.get("/", (req, res) => {
  const resumePath = path3.join(process.cwd(), "client", "public", "Parinith_CM_One_Resume.pdf");
  if (fs3.existsSync(resumePath)) {
    res.contentType("application/pdf");
    res.download(resumePath, "Parinith_CM_Resume.pdf");
  } else {
    res.status(404).json({ message: "Resume not found" });
  }
});
var resume_default = router4;

// server/routes/analytics.ts
import express5 from "express";
import mongoose8 from "mongoose";

// server/models/analytics.ts
import mongoose7 from "mongoose";
var analyticsSchema = new mongoose7.Schema({
  path: { type: String, required: true },
  visitorIp: { type: String },
  // Should be hashed for privacy
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });
var Analytics = mongoose7.model("Analytics", analyticsSchema);

// server/routes/analytics.ts
var router5 = express5.Router();
router5.get("/", async (req, res) => {
  try {
    const count = await Analytics.countDocuments();
    res.json({ totalVisitors: count });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
var trackVisitor = async (req, res, next) => {
  if (mongoose8.connection.readyState !== 1) {
    return next();
  }
  try {
    await Analytics.create({
      path: req.path,
      visitorIp: req.ip
      // In a real app, hash this!
    });
  } catch (e) {
    console.error("Analytics Error (non-fatal)", e.message);
  }
  next();
};
var analytics_default = router5;

// server/routes/cms.ts
import express6 from "express";
var router6 = express6.Router();
var getIdParam = (id) => {
  return Array.isArray(id) ? id[0] : id;
};
router6.get("/content", (req, res) => {
  try {
    const fullState = cmsStorage.getFullState();
    res.json(fullState);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch CMS content" });
  }
});
router6.put("/home", protect, (req, res) => {
  try {
    const updated = cmsStorage.updateHome(req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update home section" });
  }
});
router6.put("/about", protect, (req, res) => {
  try {
    const updated = cmsStorage.updateAbout(req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update about section" });
  }
});
router6.put("/socials", protect, (req, res) => {
  try {
    const updated = cmsStorage.updateSocials(req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update social links" });
  }
});
router6.put("/settings", protect, (req, res) => {
  try {
    const updated = cmsStorage.updateSettings(req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update settings" });
  }
});
router6.post("/skills", protect, (req, res) => {
  try {
    const newSkill = cmsStorage.addSkill(req.body);
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(500).json({ message: "Failed to add skill" });
  }
});
router6.put("/skills/:id", protect, (req, res) => {
  try {
    const updated = cmsStorage.updateSkill(getIdParam(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: "Skill not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update skill" });
  }
});
router6.delete("/skills/:id", protect, (req, res) => {
  try {
    const success = cmsStorage.deleteSkill(getIdParam(req.params.id));
    if (!success) return res.status(404).json({ message: "Skill not found" });
    res.json({ message: "Skill deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete skill" });
  }
});
router6.post("/projects", protect, (req, res) => {
  try {
    const newProj = cmsStorage.addProject(req.body);
    res.status(201).json(newProj);
  } catch (error) {
    res.status(500).json({ message: "Failed to add project" });
  }
});
router6.put("/projects/:id", protect, (req, res) => {
  try {
    const updated = cmsStorage.updateProject(getIdParam(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: "Project not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update project" });
  }
});
router6.delete("/projects/:id", protect, (req, res) => {
  try {
    const success = cmsStorage.deleteProject(getIdParam(req.params.id));
    if (!success) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project" });
  }
});
router6.post("/experience", protect, (req, res) => {
  try {
    const newExp = cmsStorage.addExperience(req.body);
    res.status(201).json(newExp);
  } catch (error) {
    res.status(500).json({ message: "Failed to add experience entry" });
  }
});
router6.put("/experience/:id", protect, (req, res) => {
  try {
    const updated = cmsStorage.updateExperience(getIdParam(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: "Experience entry not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update experience entry" });
  }
});
router6.delete("/experience/:id", protect, (req, res) => {
  try {
    const success = cmsStorage.deleteExperience(getIdParam(req.params.id));
    if (!success) return res.status(404).json({ message: "Experience entry not found" });
    res.json({ message: "Experience entry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete experience entry" });
  }
});
router6.post("/education", protect, (req, res) => {
  try {
    const newEdu = cmsStorage.addEducation(req.body);
    res.status(201).json(newEdu);
  } catch (error) {
    res.status(500).json({ message: "Failed to add education entry" });
  }
});
router6.put("/education/:id", protect, (req, res) => {
  try {
    const updated = cmsStorage.updateEducation(getIdParam(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: "Education entry not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update education entry" });
  }
});
router6.delete("/education/:id", protect, (req, res) => {
  try {
    const success = cmsStorage.deleteEducation(getIdParam(req.params.id));
    if (!success) return res.status(404).json({ message: "Education entry not found" });
    res.json({ message: "Education entry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete education entry" });
  }
});
router6.post("/certificates", protect, (req, res) => {
  try {
    const newCert = cmsStorage.addCertificate(req.body);
    res.status(201).json(newCert);
  } catch (error) {
    res.status(500).json({ message: "Failed to add certificate" });
  }
});
router6.put("/certificates/:id", protect, (req, res) => {
  try {
    const updated = cmsStorage.updateCertificate(getIdParam(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: "Certificate not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update certificate" });
  }
});
router6.delete("/certificates/:id", protect, (req, res) => {
  try {
    const success = cmsStorage.deleteCertificate(getIdParam(req.params.id));
    if (!success) return res.status(404).json({ message: "Certificate not found" });
    res.json({ message: "Certificate deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete certificate" });
  }
});
router6.post("/gallery", protect, (req, res) => {
  try {
    const newItem = cmsStorage.addGalleryItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to add gallery image" });
  }
});
router6.delete("/gallery/:id", protect, (req, res) => {
  try {
    const success = cmsStorage.deleteGalleryItem(getIdParam(req.params.id));
    if (!success) return res.status(404).json({ message: "Gallery item not found" });
    res.json({ message: "Gallery item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete gallery item" });
  }
});
router6.patch("/messages/:id/read", protect, (req, res) => {
  try {
    const updated = cmsStorage.markMessageRead(getIdParam(req.params.id));
    if (!updated) return res.status(404).json({ message: "Message not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark message as read" });
  }
});
router6.delete("/messages/:id", protect, (req, res) => {
  try {
    const success = cmsStorage.deleteMessage(getIdParam(req.params.id));
    if (!success) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete message" });
  }
});
router6.post("/restore", protect, (req, res) => {
  try {
    const success = cmsStorage.restoreState(req.body);
    if (!success) return res.status(400).json({ message: "Invalid backup file format" });
    res.json({ message: "Database restored successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to restore database backup" });
  }
});
router6.post("/ai-helper", protect, (req, res) => {
  try {
    const { promptType, text, context } = req.body;
    let result = "";
    if (promptType === "project-description") {
      result = `Designed and implemented ${context || "this application"} utilizing modern architectural patterns, scalable API design, and high-performance frontend interfaces. Emphasized code quality, secure authentication, and seamless user experiences.`;
    } else if (promptType === "improve-bio") {
      result = text ? `Enhanced: ${text}` : `Passionate software engineer focused on building robust, high-availability web applications and modern interactive systems. Driven by clean code architecture, problem-solving, and continuous technical growth.`;
    } else if (promptType === "seo-tags") {
      result = `${context || "Portfolio"}, Full Stack Developer, React, Node.js, Express, JavaScript, Python, Web Engineering, Software Developer`;
    } else {
      result = `Refined content: ${text || "Professional software engineer portfolio content."}`;
    }
    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: "AI processing failed" });
  }
});
var cms_default = router6;

// server/routes/upload.ts
import express7 from "express";
import multer from "multer";
import path4 from "path";
import fs4 from "fs";
var router7 = express7.Router();
var getUploadDir = () => {
  if (process.env.VERCEL || true) {
    return path4.join("/tmp", "uploads");
  }
  return path4.join(process.cwd(), "public", "uploads");
};
var uploadDir = getUploadDir();
try {
  if (!fs4.existsSync(uploadDir)) {
    fs4.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  console.warn("Upload directory initialization warning:", e.message);
}
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs4.existsSync(uploadDir)) {
        fs4.mkdirSync(uploadDir, { recursive: true });
      }
    } catch (e) {
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path4.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});
var upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|webp|pdf/;
    const extName = allowedTypes.test(path4.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype.toLowerCase()) || file.mimetype === "application/pdf";
    if (extName && mimeType) {
      return cb(null, true);
    }
    cb(new Error("Only images (JPG, PNG, SVG, WEBP) and PDF files are allowed!"));
  }
});
router7.post("/single", protect, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      message: "File uploaded successfully",
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    res.status(500).json({ message: "File upload failed" });
  }
});
router7.post("/multiple", protect, upload.array("files", 10), (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const fileUrls = files.map((f) => `/uploads/${f.filename}`);
    res.json({
      message: "Files uploaded successfully",
      urls: fileUrls
    });
  } catch (err) {
    res.status(500).json({ message: "Files upload failed" });
  }
});
var upload_default = router7;

// api/index.ts
dotenv2.config();
var app = express8();
app.use(express8.json({ limit: "10mb" }));
app.use(express8.urlencoded({ extended: false, limit: "10mb" }));
app.use(cors());
var publicUploads = path5.join(process.cwd(), "public", "uploads");
app.use("/uploads", express8.static(publicUploads));
db_default().catch((err) => {
  console.warn("DB init warning:", err?.message || err);
});
app.use(trackVisitor);
app.use("/api/auth", auth_default);
app.use("/api/cms", cms_default);
app.use("/api/upload", upload_default);
app.use("/api/projects", projects_default);
app.use("/api/contact", contact_default);
app.use("/api/resume", resume_default);
app.use("/api/analytics", analytics_default);
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.use((err, _req, res, _next) => {
  console.error("Vercel Serverless Function Error:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});
var index_default = app;
export {
  index_default as default
};
