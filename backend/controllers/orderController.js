import Order from '../models/Order.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import { decrementQuantityAtomic, incrementQuantityAtomic } from './itemController.js';
import { generateQrToken, generateQrDataURL } from '../utils/qr.js';
import { adjustUserPoints } from '../utils/points.js';
import { STUDENT_POINTS_PER_ORDER } from '../utils/constants.js';
import dayjs from 'dayjs';
import { sendEmail } from '../utils/mailer.js';

export async function createPreorder(req, res, next) {
	try {
		const { itemId, quantity, slot } = req.body;
		if (!itemId || !quantity) return res.status(400).json({ message: 'Missing fields' });
		const item = await Item.findById(itemId).populate('createdBy', 'email name');
		if (!item) return res.status(404).json({ message: 'Item not found' });
		if (dayjs(item.bestBefore).isBefore(dayjs())) return res.status(400).json({ message: 'Item expired' });

		const updated = await decrementQuantityAtomic(itemId, quantity);
		if (!updated) return res.status(409).json({ message: 'Not enough quantity' });

		const price = (item.discountedPrice || 0) * quantity;
		const qrToken = generateQrToken({ itemId, userId: req.user.id, quantity });
		const order = await Order.create({
			userId: req.user.id,
			itemId,
			quantity,
			price,
			status: 'reserved',
			slot: slot || null,
			qrToken,
			paid: true
		});
		await adjustUserPoints(req.user.id, STUDENT_POINTS_PER_ORDER);
		if (item.createdBy?.email) {
			await sendEmail({ to: item.createdBy.email, subject: 'New preorder', html: `<p>${quantity} x ${item.name} reserved by ${req.user.name}</p>` });
		}
		const qrImage = await generateQrDataURL(qrToken);
		return res.status(201).json({ order, qrImage });
	} catch (err) { next(err); }
}

export async function cancelPreorder(req, res, next) {
	try {
		const { id } = req.params;
		const order = await Order.findById(id);
		if (!order) return res.status(404).json({ message: 'Order not found' });
		if (String(order.userId) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });
		if (order.status !== 'reserved') return res.status(400).json({ message: 'Cannot cancel' });
		if (order.slot?.start && dayjs(order.slot.start).diff(dayjs(), 'minute') < 15) {
			return res.status(400).json({ message: 'Too late to cancel' });
		}
		order.status = 'cancelled';
		await order.save();
		await incrementQuantityAtomic(order.itemId, order.quantity);
		return res.json({ message: 'Cancelled' });
	} catch (err) { next(err); }
}

export async function createWalkin(req, res, next) {
	try {
		const { itemId, quantity, studentId, studentEmail } = req.body;
		if (!itemId || !quantity) return res.status(400).json({ message: 'Missing fields' });
		const item = await Item.findById(itemId);
		if (!item) return res.status(404).json({ message: 'Item not found' });
		if (String(item.createdBy) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });
		const updated = await decrementQuantityAtomic(itemId, quantity);
		if (!updated) return res.status(409).json({ message: 'Not enough quantity' });
		let resolvedUserId = studentId || null;
		if (!resolvedUserId && studentEmail) {
			const stu = await User.findOne({ email: studentEmail, role: 'student' });
			if (stu) resolvedUserId = stu._id;
		}
		const userId = resolvedUserId || req.user.id;
		const price = (item.discountedPrice || 0) * quantity;
		const qrToken = generateQrToken({ itemId, userId, quantity, walkin: true });
		const order = await Order.create({ userId, itemId, quantity, price, status: 'walkin', qrToken, paid: true });
		await adjustUserPoints(userId, STUDENT_POINTS_PER_ORDER);
		const qrImage = await generateQrDataURL(qrToken);
		return res.status(201).json({ order, qrImage });
	} catch (err) { next(err); }
}

export async function scanOrder(req, res, next) {
	try {
		const { token } = req.body;
		if (!token) return res.status(400).json({ message: 'Missing token' });
		const order = await Order.findOne({ qrToken: token });
		if (!order) return res.status(404).json({ message: 'Invalid token' });
		if (order.status === 'picked_up') return res.status(400).json({ message: 'Already picked' });
		order.status = 'picked_up';
		order.pickedUpAt = new Date();
		await order.save();
		return res.json({ success: true });
	} catch (err) { next(err); }
}