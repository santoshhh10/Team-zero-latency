import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { requireRoles } from '../middlewares/roles.js';
import { getAnalytics, triggerAlerts } from '../controllers/adminController.js';

const router = Router();

router.get('/analytics', authRequired, requireRoles('admin'), getAnalytics);
router.post('/alerts/trigger', authRequired, requireRoles('admin'), triggerAlerts);

export default router;