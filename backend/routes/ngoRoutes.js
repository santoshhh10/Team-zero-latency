import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { requireRoles } from '../middlewares/roles.js';
import { listAlerts, confirmPickup } from '../controllers/ngoController.js';

const router = Router();

router.get('/alerts', authRequired, requireRoles('ngo','admin'), listAlerts);
router.post('/pickup', authRequired, requireRoles('ngo','admin'), confirmPickup);

export default router;