import { Router } from 'express';
import { listItems, createItem, updateItem } from '../controllers/itemController.js';
import { authRequired } from '../middlewares/auth.js';
import { requireRoles } from '../middlewares/roles.js';

const router = Router();

router.get('/', listItems);
router.post('/', authRequired, requireRoles('canteen','admin'), createItem);
router.put('/:id', authRequired, requireRoles('canteen','admin'), updateItem);

export default router;