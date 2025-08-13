import User from '../models/User.js';

export async function adjustUserPoints(userId, delta) {
	const user = await User.findById(userId);
	if (!user) return null;
	user.points = Math.max(0, (user.points || 0) + delta);
	await user.save();
	return user.points;
}