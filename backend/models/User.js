import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		passwordHash: { type: String, required: true },
		role: { type: String, enum: ['student', 'canteen', 'ngo', 'admin'], default: 'student' },
		points: { type: Number, default: 0 },
		phone: { type: String },
		location: { type: String }
	},
	{ timestamps: true }
);

UserSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model('User', UserSchema);