import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Item from './models/Item.js';
import Order from './models/Order.js';
import dayjs from 'dayjs';

dotenv.config();

async function run() {
	await mongoose.connect(process.env.MONGO_URI);
	console.log('Connected to Mongo');
	await Promise.all([User.deleteMany({}), Item.deleteMany({}), Order.deleteMany({})]);

	const passwordHash = await bcrypt.hash('password123', 10);

	const [admin, canteen1, canteen2, student1, student2, student3, ngo1, ngo2] = await User.create([
		{ name: 'Admin', email: 'admin@example.com', passwordHash, role: 'admin' },
		{ name: 'Canteen A', email: 'canteenA@example.com', passwordHash, role: 'canteen', location: 'North Campus' },
		{ name: 'Canteen B', email: 'canteenB@example.com', passwordHash, role: 'canteen', location: 'South Campus' },
		{ name: 'Alice', email: 'alice@student.com', passwordHash, role: 'student' },
		{ name: 'Bob', email: 'bob@student.com', passwordHash, role: 'student' },
		{ name: 'Cara', email: 'cara@student.com', passwordHash, role: 'student' },
		{ name: 'Helping Hands', email: 'ngo1@example.com', passwordHash, role: 'ngo' },
		{ name: 'Green Bites', email: 'ngo2@example.com', passwordHash, role: 'ngo' }
	]);

	const now = dayjs();

	const items = await Item.create([
		{
			name: 'Veg Sandwich Combo', description: 'Sandwich + Juice', quantityTotal: 20, quantityAvailable: 20,
			originalPrice: 120, discountedPrice: 60, bestBefore: now.add(90, 'minute').toDate(), images: [], veg: true,
			location: 'North Campus', availabilityWindow: { start: now.toDate(), end: now.add(2, 'hour').toDate() },
			pickupSlots: [], createdBy: canteen1._id, estimatedKg: 0.25
		},
		{
			name: 'Chicken Wrap', description: 'Grilled chicken wrap', quantityTotal: 10, quantityAvailable: 10,
			originalPrice: 150, discountedPrice: 80, bestBefore: now.add(45, 'minute').toDate(), images: [], veg: false,
			location: 'North Campus', availabilityWindow: { start: now.toDate(), end: now.add(1, 'hour').toDate() },
			pickupSlots: [], createdBy: canteen1._id, estimatedKg: 0.35
		},
		{
			name: 'Pasta Box', description: 'Creamy Alfredo', quantityTotal: 15, quantityAvailable: 15,
			originalPrice: 200, discountedPrice: 100, bestBefore: now.add(150, 'minute').toDate(), images: [], veg: true,
			location: 'South Campus', availabilityWindow: { start: now.toDate(), end: now.add(3, 'hour').toDate() },
			pickupSlots: [], createdBy: canteen2._id, estimatedKg: 0.4
		},
		{
			name: 'Salad Bowl', description: 'Fresh greens', quantityTotal: 8, quantityAvailable: 8,
			originalPrice: 180, discountedPrice: 90, bestBefore: now.add(20, 'minute').toDate(), images: [], veg: true,
			location: 'South Campus', availabilityWindow: { start: now.toDate(), end: now.add(40, 'minute').toDate() },
			pickupSlots: [], createdBy: canteen2._id, estimatedKg: 0.2
		},
		{
			name: 'Samosa Pack', description: '5 pcs', quantityTotal: 25, quantityAvailable: 25,
			originalPrice: 100, discountedPrice: 40, bestBefore: now.add(60, 'minute').toDate(), images: [], veg: true,
			location: 'North Campus', availabilityWindow: { start: now.toDate(), end: now.add(90, 'minute').toDate() },
			pickupSlots: [], createdBy: canteen1._id, estimatedKg: 0.15
		},
		{
			name: 'Fruit Cup', description: 'Assorted fruits', quantityTotal: 12, quantityAvailable: 12,
			originalPrice: 80, discountedPrice: 30, bestBefore: now.add(25, 'minute').toDate(), images: [], veg: true,
			location: 'South Campus', availabilityWindow: { start: now.toDate(), end: now.add(45, 'minute').toDate() },
			pickupSlots: [], createdBy: canteen2._id, estimatedKg: 0.2
		}
	]);

	await Order.create([
		{ userId: student1._id, itemId: items[0]._id, quantity: 2, price: 120, status: 'reserved', paid: true },
		{ userId: student2._id, itemId: items[1]._id, quantity: 1, price: 80, status: 'walkin', paid: true }
	]);

	console.log('Seeded.');
	await mongoose.disconnect();
	process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });