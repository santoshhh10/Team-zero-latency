import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function register(req, res, next) {
	try {
		const { name, email, password, role } = req.body;
		if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
		const exists = await User.findOne({ email });
		if (exists) return res.status(400).json({ message: 'Email already registered' });
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, passwordHash, role: role || 'student' });
		return res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
	} catch (err) { next(err); }
}

export async function login(req, res, next) {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: 'Invalid credentials' });
		const ok = await user.comparePassword(password);
		if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
		const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
		return res.json({ token, user: { id: user._id, name: user.name, role: user.role, points: user.points } });
	} catch (err) { next(err); }
}