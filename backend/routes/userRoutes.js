import { Router } from 'express';
import { getUserPoints, leaderboard, adjustPoints } from '../controllers/userController.js';
import { authRequired } from '../middlewares/auth.js';
import { requireRoles } from '../middlewares/roles.js';

const router = Router();

router.get('/leaderboard', leaderboard);
router.get('/:id/points', authRequired, getUserPoints);
router.post('/:id/points/adjust', authRequired, requireRoles('admin'), adjustPoints);

export default router;