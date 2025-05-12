import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  twoFactorCode: String,
  twoFactorCodeExpires: Date,
  // Referencing multiple doctors (many-to-many relationship)
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
});

const Patient = mongoose.model('Patient', PatientSchema);
export default Patient;
