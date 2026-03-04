import express from 'express';
import { generate, getHistory } from '../controllers/imageController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, generate);
router.get('/history', authenticateToken, getHistory);

export default router;
