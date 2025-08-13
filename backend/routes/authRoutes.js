import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { authRequired } from '../middlewares/auth.js';
import User from '../models/User.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authRequired, async (req, res) => {
	const user = await User.findById(req.user.id).select('name role points email');
	return res.json(user);
});

export default router;