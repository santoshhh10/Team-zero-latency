import Item from '../models/Item.js';
import dayjs from 'dayjs';
import { adjustUserPoints } from '../utils/points.js';
import { CANTEEN_POINTS_PER_LISTING } from '../utils/constants.js';

export async function listItems(req, res, next) {
	try {
		const { location, veg, expiringSoon, q } = req.query;
		const filter = { status: 'active' };
		if (location) filter.location = location;
		if (veg !== undefined) filter.veg = veg === 'true';
		if (expiringSoon === 'true') {
			filter.bestBefore = { $lte: dayjs().add(2, 'hour').toDate() };
		}
		if (q) {
			filter.$or = [
				{ name: new RegExp(q, 'i') },
				{ description: new RegExp(q, 'i') }
			];
		}
		const items = await Item.find(filter).sort({ createdAt: -1 }).lean();
		return res.json(items);
	} catch (err) { next(err); }
}

export async function createItem(req, res, next) {
	try {
		const payload = req.body;
		payload.createdBy = req.user.id;
		payload.quantityAvailable = payload.quantityTotal;
		const item = await Item.create(payload);
		await adjustUserPoints(req.user.id, CANTEEN_POINTS_PER_LISTING);
		return res.status(201).json(item);
	} catch (err) { next(err); }
}

export async function updateItem(req, res, next) {
	try {
		const { id } = req.params;
		const update = req.body;
		const item = await Item.findOneAndUpdate({ _id: id, createdBy: req.user.id }, update, { new: true });
		if (!item) return res.status(404).json({ message: 'Item not found' });
		return res.json(item);
	} catch (err) { next(err); }
}

export async function decrementQuantityAtomic(itemId, qty) {
	return Item.findOneAndUpdate(
		{ _id: itemId, quantityAvailable: { $gte: qty }, status: 'active' },
		{ $inc: { quantityAvailable: -qty, reservedCount: qty } },
		{ new: true }
	).lean();
}

export async function incrementQuantityAtomic(itemId, qty) {
	return Item.findOneAndUpdate(
		{ _id: itemId },
		{ $inc: { quantityAvailable: qty, reservedCount: -qty } },
		{ new: true }
	).lean();
}

export async function markExpiredAndSoldOut() {
	await Item.updateMany(
		{ bestBefore: { $lt: new Date() }, status: { $nin: ['expired', 'picked_by_ngo'] } },
		{ $set: { status: 'expired' } }
	);
	await Item.updateMany(
		{ quantityAvailable: { $lte: 0 }, status: 'active' },
		{ $set: { status: 'sold_out' } }
	);
}