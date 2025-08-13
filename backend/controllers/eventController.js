import Event from '../models/Event.js';

export async function listEvents(req, res, next) {
	try {
		const events = await Event.find().sort({ start: -1 }).lean();
		return res.json(events);
	} catch (err) { next(err); }
}

export async function createEvent(req, res, next) {
	try {
		const { title, description, start, end, location } = req.body;
		if (!title || !start || !end) return res.status(400).json({ message: 'Missing fields' });
		const ev = await Event.create({ title, description, start, end, location, organizerId: req.user.id });
		return res.status(201).json(ev);
	} catch (err) { next(err); }
}