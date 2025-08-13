import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { requireRoles } from '../middlewares/roles.js';
import { listEvents, createEvent } from '../controllers/eventController.js';

const router = Router();

router.get('/', authRequired, listEvents);
router.post('/', authRequired, requireRoles('admin','canteen'), createEvent);

export default router;