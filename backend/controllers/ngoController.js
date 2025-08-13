import Item from '../models/Item.js';
import Order from '../models/Order.js';
import { adjustUserPoints } from '../utils/points.js';
import { NGO_POINTS_PER_PICKUP } from '../utils/constants.js';
import dayjs from 'dayjs';

export async function listAlerts(req, res, next) {
	try {
		const threshold = dayjs().add(30, 'minute').toDate();
		const items = await Item.find({ status: { $in: ['active','expired'] }, bestBefore: { $lte: threshold }, quantityAvailable: { $gt: 0 } }).lean();
		return res.json(items);
	} catch (err) { next(err); }
}

export async function confirmPickup(req, res, next) {
	try {
		const { itemId, quantity } = req.body;
		const item = await Item.findById(itemId);
		if (!item) return res.status(404).json({ message: 'Item not found' });
		const qty = Math.min(quantity || item.quantityAvailable, item.quantityAvailable);
		item.quantityAvailable = Math.max(0, item.quantityAvailable - qty);
		item.status = 'picked_by_ngo';
		await item.save();
		await adjustUserPoints(req.user.id, NGO_POINTS_PER_PICKUP);
		return res.json({ ok: true, item });
	} catch (err) { next(err); }
}