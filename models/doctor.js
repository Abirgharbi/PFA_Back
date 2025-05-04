import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  
  twoFactorCode: String,
  twoFactorCodeExpires: Date,
});


const Doctor = mongoose.model('Doctor', DoctorSchema);
export default Doctor;
