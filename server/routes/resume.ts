import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.get('/', (req, res) => {
    // Assumption: Reuse existing public folder logic
    const resumePath = path.join(process.cwd(), 'client', 'public', 'Parinith_CM_One_Resume.pdf');

    if (fs.existsSync(resumePath)) {
        res.contentType("application/pdf");
        res.download(resumePath, 'Parinith_CM_Resume.pdf');
    } else {
        res.status(404).json({ message: 'Resume not found' });
    }
});

export default router;
