import express from 'express';
import { getUsers, adjustCredits, updateUserPlan, getStats, deleteUser } from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateToken, requireAdmin);

router.get('/users', getUsers);
router.post('/credits', adjustCredits);
router.post('/plan', updateUserPlan);
router.get('/stats', getStats);
router.delete('/users/:id', deleteUser);

export default router;
