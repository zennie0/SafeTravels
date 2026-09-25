import mongoose from 'mongoose';
const emergencySchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }, level: { type: String, enum: ['standard','urgent'], required: true }, location: { lat: Number, lng: Number }, places: [mongoose.Schema.Types.Mixed], status: { type: String, enum: ['created','resolved'], default: 'created' } }, { timestamps: true });
export default mongoose.model('Emergency', emergencySchema);
