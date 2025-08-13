import User from '../models/User.js';

export async function getUserPoints(req, res, next) {
	try {
		const { id } = req.params;
		const user = await User.findById(id).select('points name role');
		if (!user) return res.status(404).json({ message: 'User not found' });
		return res.json({ id: user._id, name: user.name, role: user.role, points: user.points });
	} catch (err) { next(err); }
}

export async function leaderboard(req, res, next) {
	try {
		const { role } = req.query;
		const filter = role ? { role } : {};
		const users = await User.find(filter).sort({ points: -1 }).limit(20).select('name points role');
		return res.json(users);
	} catch (err) { next(err); }
}

export async function adjustPoints(req, res, next) {
	try {
		const { id } = req.params;
		const { delta } = req.body;
		const user = await User.findById(id);
		if (!user) return res.status(404).json({ message: 'User not found' });
		user.points = Math.max(0, (user.points || 0) + Number(delta || 0));
		await user.save();
		return res.json({ id: user._id, points: user.points });
	} catch (err) { next(err); }
}