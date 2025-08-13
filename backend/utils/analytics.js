import Order from '../models/Order.js';
import Item from '../models/Item.js';
import { ANALYTICS_CO2_PER_KG, ANALYTICS_WATER_PER_KG } from './constants.js';

export async function getAggregatedAnalytics({ from, to }) {
	const orderMatch = {};
	if (from) orderMatch.createdAt = { ...(orderMatch.createdAt || {}), $gte: new Date(from) };
	if (to) orderMatch.createdAt = { ...(orderMatch.createdAt || {}), $lte: new Date(to) };

	const orders = await Order.find(orderMatch).lean();
	const items = await Item.find().lean();

	let totalItemsSaved = 0;
	let totalPeopleServed = 0;
	let totalKgSaved = 0;

	const itemIdToItem = new Map(items.map(i => [String(i._id), i]));

	for (const o of orders) {
		const item = itemIdToItem.get(String(o.itemId));
		const qty = o.quantity || 0;
		if (['reserved', 'picked_up', 'walkin'].includes(o.status)) {
			totalItemsSaved += qty;
			totalPeopleServed += qty;
			if (item) totalKgSaved += (item.estimatedKg || 0.3) * qty;
		}
	}

	const estimatedCO2 = totalKgSaved * ANALYTICS_CO2_PER_KG;
	const estimatedWater = totalKgSaved * ANALYTICS_WATER_PER_KG;

	return {
		total_items_saved: totalItemsSaved,
		total_people_served: totalPeopleServed,
		total_kg_saved: Number(totalKgSaved.toFixed(2)),
		estimated_co2_saved: Number(estimatedCO2.toFixed(2)),
		estimated_water_saved: Number(estimatedWater.toFixed(2))
	};
}