import mongoose from 'mongoose';

const PickupSlotSchema = new mongoose.Schema(
	{
		start: { type: Date, required: true },
		end: { type: Date, required: true },
		capacity: { type: Number, default: 0 },
		reserved: { type: Number, default: 0 }
	},
	{ _id: false }
);

const ItemSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		quantityTotal: { type: Number, required: true },
		quantityAvailable: { type: Number, required: true },
		reservedCount: { type: Number, default: 0 },
		originalPrice: { type: Number, required: true },
		discountedPrice: { type: Number, required: true },
		bestBefore: { type: Date, required: true },
		images: [{ type: String }],
		veg: { type: Boolean, default: true },
		location: { type: String, required: true },
		availabilityWindow: {
			start: { type: Date, required: true },
			end: { type: Date, required: true }
		},
		pickupSlots: [PickupSlotSchema],
		status: { type: String, enum: ['active', 'sold_out', 'expired', 'picked_by_ngo'], default: 'active' },
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		estimatedKg: { type: Number, default: 0.3 }
	},
	{ timestamps: true }
);

export default mongoose.model('Item', ItemSchema);