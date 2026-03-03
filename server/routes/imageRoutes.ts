import express from 'express';
import { generate, getHistory } from '../controllers/imageController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, generate);
router.get('/history', authenticateToken, getHistory);

export default router;
