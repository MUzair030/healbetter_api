import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  googleId: { type: String, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  isDeleted: { type: Boolean, default: false },
});

const Patient = mongoose.model('Patient', PatientSchema);

export default Patient;
