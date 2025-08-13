import dayjs from 'dayjs';
import Item from '../models/Item.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Event from '../models/Event.js';
import { sendEmail } from '../utils/mailer.js';
import { markExpiredAndSoldOut } from '../controllers/itemController.js';

export async function runExpiryAlertJob() {
	await markExpiredAndSoldOut();
	const threshold = dayjs().add(30, 'minute').toDate();
	const items = await Item.find({ status: 'active', bestBefore: { $lte: threshold }, quantityAvailable: { $gt: 0 } }).populate('createdBy', 'name').lean();
	const ngos = await User.find({ role: 'ngo' }).lean();
	if (!ngos.length) return;
	const ngoEmails = ngos.map(n => n.email).filter(Boolean);
	for (const item of items) {
		const subject = `Surplus alert: ${item.name} at ${item.location}`;
		const html = `<p>${item.quantityAvailable} left, best-before ${dayjs(item.bestBefore).format('YYYY-MM-DD HH:mm')}</p>`;
		await sendEmail({ to: ngoEmails.join(','), subject, html });
	}
}

export async function runRemindersJob() {
	// Order reminders: reserved orders starting within 30 minutes
	const startWindow = dayjs().add(30, 'minute').toDate();
	const now = new Date();
	const orders = await Order.find({ status: 'reserved', 'slot.start': { $gte: now, $lte: startWindow }, reminderSent: { $ne: true } }).populate('userId', 'email name').lean();
	for (const order of orders) {
		if (order.userId?.email) {
			await sendEmail({ to: order.userId.email, subject: 'Pickup reminder', html: `<p>Your order is ready soon. Slot starts at ${dayjs(order.slot.start).format('HH:mm')}.</p>` });
		}
		await Order.updateOne({ _id: order._id }, { $set: { reminderSent: true } });
	}
	// Event reminders: events ended without reminderSent
	const events = await Event.find({ end: { $lte: now }, reminderSent: { $ne: true } }).populate('organizerId', 'email name').lean();
	for (const ev of events) {
		if (ev.organizerId?.email) {
			await sendEmail({ to: ev.organizerId.email, subject: 'Event ended - log surplus', html: `<p>Please log any surplus for event: ${ev.title}</p>` });
		}
		await Event.updateOne({ _id: ev._id }, { $set: { reminderSent: true } });
	}
}