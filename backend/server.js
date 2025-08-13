import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import ngoRoutes from './routes/ngoRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import { runExpiryAlertJob, runRemindersJob } from './jobs/scheduler.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
	return res.json({ ok: true, time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/events', eventRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			serverSelectionTimeoutMS: 5000
		});
		console.log('MongoDB connected');
		// Schedule jobs every 5 minutes
		cron.schedule('*/5 * * * *', async () => {
			try {
				await runExpiryAlertJob();
				await runRemindersJob();
				console.log('Scheduled jobs executed');
			} catch (err) {
				console.error('Scheduled jobs error', err);
			}
		});
		app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
	} catch (err) {
		console.error('Failed to start server', err);
		process.exit(1);
	}
}

start();