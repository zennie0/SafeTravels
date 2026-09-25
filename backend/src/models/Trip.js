import mongoose from 'mongoose';
const activitySchema = new mongoose.Schema({ title: { type: String, required: true }, day: String, time: String, category: String, address: String, durationMinutes: Number, distanceKm: Number, reason: String, thumbnail: String, link: String, gps: mongoose.Schema.Types.Mixed, completed: { type: Boolean, default: false } });
const tripSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, destination: { type: String, required: true }, startDate: Date, endDate: Date, hotel: mongoose.Schema.Types.Mixed, activities: [activitySchema], status: { type: String, enum: ['upcoming','active','completed'], default: 'upcoming' }, preferences: [String] }, { timestamps: true });
export default mongoose.model('Trip', tripSchema);


