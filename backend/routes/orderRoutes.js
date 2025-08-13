import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { requireRoles } from '../middlewares/roles.js';
import { createPreorder, cancelPreorder, createWalkin, scanOrder } from '../controllers/orderController.js';

const router = Router();

router.post('/', authRequired, requireRoles('student'), createPreorder);
router.post('/walkin', authRequired, requireRoles('canteen'), createWalkin);
router.post('/scan', authRequired, requireRoles('canteen','admin'), scanOrder);
router.post('/:id/cancel', authRequired, requireRoles('student'), cancelPreorder);

export default router;