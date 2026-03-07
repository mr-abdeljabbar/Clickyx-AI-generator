import express from 'express';
import { generate, getHistory } from '../controllers/imageController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, generate);
router.get('/history', authenticateToken, getHistory);

// Proxy route to bypass CORS for downloads
router.get('/download', async (req, res) => {
    try {
        const imageUrl = req.query.url as string;
        if (!imageUrl) return res.status(400).send('URL is required');

        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Failed to fetch image');

        res.setHeader('Content-Type', response.headers.get('content-type') || 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename="neural-synthesis.png"');

        // Use standard node streams if possible, or just send buffer
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        res.send(buffer);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).send('Error downloading image');
    }
});

export default router;
