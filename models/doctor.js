import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  twoFactorCode: String,
  twoFactorCodeExpires: Date,
  // Referencing multiple patients (many-to-many relationship)
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
});

const Doctor = mongoose.model('Doctor', DoctorSchema);
export default Doctor;
