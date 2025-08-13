import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
		quantity: { type: Number, required: true, min: 1 },
		price: { type: Number, required: true },
		status: { type: String, enum: ['reserved','picked_up','cancelled','walkin'], required: true },
		slot: {
			start: { type: Date },
			end: { type: Date }
		},
		qrToken: { type: String },
		paid: { type: Boolean, default: false },
		pickedUpAt: { type: Date },
		reminderSent: { type: Boolean, default: false }
	},
	{ timestamps: true }
);

export default mongoose.model('Order', OrderSchema);