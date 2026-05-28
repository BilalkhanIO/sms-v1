import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const stopSchema = new Schema({
  name: { type: String, required: true, trim: true },
  pickupTime: { type: String },  // "07:30"
  dropTime: { type: String },    // "15:30"
  location: {
    address: { type: String, trim: true },
    coordinates: { lat: Number, lng: Number },
  },
});

const routeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    vehicle: {
      number: { type: String, trim: true },
      type: { type: String, enum: ['BUS', 'VAN', 'MINIBUS'], default: 'BUS' },
      capacity: { type: Number },
      driver: {
        name: { type: String, trim: true },
        phone: { type: String, trim: true },
        license: { type: String, trim: true },
      },
    },
    stops: [stopSchema],
    school: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    assignedStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    isActive: { type: Boolean, default: true },
    monthlyFee: { type: Number, default: 0 },
  },
  { timestamps: true }
);

routeSchema.index({ school: 1 });
routeSchema.index({ isActive: 1 });

const Transport = model('Transport', routeSchema);
export default Transport;
