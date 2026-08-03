import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|webp|pdf/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype.toLowerCase()) || file.mimetype === 'application/pdf';

    if (extName && mimeType) {
      return cb(null, true);
    }
    cb(new Error('Only images (JPG, PNG, SVG, WEBP) and PDF files are allowed!'));
  }
});

// Single file upload endpoint (Protected) - Converts to Data URL for instant rendering on Vercel
router.post('/single', protect, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const mimeType = req.file.mimetype || 'image/jpeg';
    const base64Data = req.file.buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    res.json({
      message: 'File uploaded successfully',
      url: dataUrl,
      filename: req.file.originalname,
      size: req.file.size
    });
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'File upload failed' });
  }
});

// Multiple file upload endpoint (Protected)
router.post('/multiple', protect, upload.array('files', 10), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const dataUrls = files.map(f => {
      const mimeType = f.mimetype || 'image/jpeg';
      return `data:${mimeType};base64,${f.buffer.toString('base64')}`;
    });

    res.json({
      message: 'Files uploaded successfully',
      urls: dataUrls
    });
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Files upload failed' });
  }
});

export default router;
