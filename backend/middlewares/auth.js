import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function authRequired(req, res, next) {
	try {
		const authHeader = req.headers.authorization || '';
		const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
		if (!token) return res.status(401).json({ message: 'Unauthorized' });
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(payload.id);
		if (!user) return res.status(401).json({ message: 'User not found' });
		req.user = { id: user._id, role: user.role, name: user.name };
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid token' });
	}
}