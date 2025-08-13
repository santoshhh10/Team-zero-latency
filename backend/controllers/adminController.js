import { getAggregatedAnalytics } from '../utils/analytics.js';
import { runExpiryAlertJob } from '../jobs/scheduler.js';

export async function getAnalytics(req, res, next) {
	try {
		const { from, to } = req.query;
		const data = await getAggregatedAnalytics({ from, to });
		return res.json(data);
	} catch (err) { next(err); }
}

export async function triggerAlerts(req, res, next) {
	try {
		await runExpiryAlertJob();
		return res.json({ ok: true });
	} catch (err) { next(err); }
}