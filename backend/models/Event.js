import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		start: { type: Date, required: true },
		end: { type: Date, required: true },
		organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		location: { type: String },
		reminderSent: { type: Boolean, default: false }
	},
	{ timestamps: true }
);

export default mongoose.model('Event', EventSchema);