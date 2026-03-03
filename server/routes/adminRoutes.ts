import express from 'express';
import { getUsers, adjustCredits, updateUserPlan, getStats } from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken, requireAdmin);

router.get('/users', getUsers);
router.post('/credits', adjustCredits);
router.post('/plan', updateUserPlan);
router.get('/stats', getStats);

export default router;
