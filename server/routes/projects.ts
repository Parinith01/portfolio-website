import express from 'express';
import { Project } from '../models/project';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// GET all projects (Public)
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ADD project (Protected)
router.post('/', protect, async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATE project (Protected)
router.put('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE project (Protected)
router.delete('/:id', protect, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
