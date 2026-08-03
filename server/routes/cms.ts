import express from 'express';
import { cmsStorage } from '../storageCMS';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

const getIdParam = (id: string | string[]): string => {
  return Array.isArray(id) ? id[0] : id;
};

// GET Public Website CMS Content
router.get('/content', (req, res) => {
  try {
    const fullState = cmsStorage.getFullState();
    res.json(fullState);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch CMS content' });
  }
});

// --- HOME SECTION ---
router.put('/home', protect, (req, res) => {
  try {
    const updated = cmsStorage.updateHome(req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update home section' });
  }
});

// --- ABOUT SECTION ---
router.put('/about', protect, (req, res) => {
  try {
    const updated = cmsStorage.updateAbout(req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update about section' });
  }
});

// --- SOCIALS SECTION ---
router.put('/socials', protect, (req, res) => {
  try {
    const updated = cmsStorage.updateSocials(req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update social links' });
  }
});

// --- SETTINGS SECTION ---
router.put('/settings', protect, (req, res) => {
  try {
    const updated = cmsStorage.updateSettings(req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

// --- SKILLS ---
router.post('/skills', protect, (req, res) => {
  try {
    const newSkill = cmsStorage.addSkill(req.body);
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add skill' });
  }
});

router.put('/skills/:id', protect, (req, res) => {
  try {
    const updated = cmsStorage.updateSkill(getIdParam(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Skill not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update skill' });
  }
});

router.delete('/skills/:id', protect, (req, res) => {
  try {
    const success = cmsStorage.deleteSkill(getIdParam(req.params.id));
    if (!success) return res.status(404).json({ message: 'Skill not found' });
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete skill' });
  }
});

// --- PROJECTS ---
router.post('/projects', protect, (req, res) => {
  try {
    const newProj = cmsStorage.addProject(req.body);
    res.status(201).json(newProj);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add project' });
  }
});

router.put('/projects/:id', protect, (req, res) => {
  try {
    const updated = cmsStorage.updateProject(getIdParam(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Project not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project' });
  }
});

router.delete('/projects/:id', protect, (req, res) => {
  try {
    const success = cmsStorage.deleteProject(getIdParam(req.params.id));
    if (!success) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

// --- EXPERIENCE ---
router.post('/experience', protect, (req, res) => {
  try {
    const newExp = cmsStorage.addExperience(req.body);
    res.status(201).json(newExp);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add experience entry' });
  }
});

router.put('/experience/:id', protect, (req, res) => {
  try {
    const updated = cmsStorage.updateExperience(getIdParam(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Experience entry not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update experience entry' });
  }
});

router.delete('/experience/:id', protect, (req, res) => {
  try {
    const success = cmsStorage.deleteExperience(getIdParam(req.params.id));
    if (!success) return res.status(404).json({ message: 'Experience entry not found' });
    res.json({ message: 'Experience entry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete experience entry' });
  }
});

// --- EDUCATION ---
router.post('/education', protect, (req, res) => {
  try {
    const newEdu = cmsStorage.addEducation(req.body);
    res.status(201).json(newEdu);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add education entry' });
  }
});

router.put('/education/:id', protect, (req, res) => {
  try {
    const updated = cmsStorage.updateEducation(getIdParam(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Education entry not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update education entry' });
  }
});

router.delete('/education/:id', protect, (req, res) => {
  try {
    const success = cmsStorage.deleteEducation(getIdParam(req.params.id));
    if (!success) return res.status(404).json({ message: 'Education entry not found' });
    res.json({ message: 'Education entry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete education entry' });
  }
});

// --- CERTIFICATES ---
router.post('/certificates', protect, (req, res) => {
  try {
    const newCert = cmsStorage.addCertificate(req.body);
    res.status(201).json(newCert);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add certificate' });
  }
});

router.put('/certificates/:id', protect, (req, res) => {
  try {
    const updated = cmsStorage.updateCertificate(getIdParam(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Certificate not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update certificate' });
  }
});

router.delete('/certificates/:id', protect, (req, res) => {
  try {
    const success = cmsStorage.deleteCertificate(getIdParam(req.params.id));
    if (!success) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ message: 'Certificate deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete certificate' });
  }
});

// --- GALLERY ---
router.post('/gallery', protect, (req, res) => {
  try {
    const newItem = cmsStorage.addGalleryItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add gallery image' });
  }
});

router.delete('/gallery/:id', protect, (req, res) => {
  try {
    const success = cmsStorage.deleteGalleryItem(getIdParam(req.params.id));
    if (!success) return res.status(404).json({ message: 'Gallery item not found' });
    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete gallery item' });
  }
});

// --- MESSAGES (CONTACT INBOX) ---
router.patch('/messages/:id/read', protect, (req, res) => {
  try {
    const updated = cmsStorage.markMessageRead(getIdParam(req.params.id));
    if (!updated) return res.status(404).json({ message: 'Message not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark message as read' });
  }
});

router.delete('/messages/:id', protect, (req, res) => {
  try {
    const success = cmsStorage.deleteMessage(getIdParam(req.params.id));
    if (!success) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete message' });
  }
});

// --- BACKUP & RESTORE ---
router.post('/restore', protect, (req, res) => {
  try {
    const success = cmsStorage.restoreState(req.body);
    if (!success) return res.status(400).json({ message: 'Invalid backup file format' });
    res.json({ message: 'Database restored successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to restore database backup' });
  }
});

// --- AI ASSISTANT TOOL ENDPOINT ---
router.post('/ai-helper', protect, (req, res) => {
  try {
    const { promptType, text, context } = req.body;
    let result = '';

    if (promptType === 'project-description') {
      result = `Designed and implemented ${context || 'this application'} utilizing modern architectural patterns, scalable API design, and high-performance frontend interfaces. Emphasized code quality, secure authentication, and seamless user experiences.`;
    } else if (promptType === 'improve-bio') {
      result = text ? `Enhanced: ${text}` : `Passionate software engineer focused on building robust, high-availability web applications and modern interactive systems. Driven by clean code architecture, problem-solving, and continuous technical growth.`;
    } else if (promptType === 'seo-tags') {
      result = `${context || 'Portfolio'}, Full Stack Developer, React, Node.js, Express, JavaScript, Python, Web Engineering, Software Developer`;
    } else {
      result = `Refined content: ${text || 'Professional software engineer portfolio content.'}`;
    }

    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: 'AI processing failed' });
  }
});

export default router;
