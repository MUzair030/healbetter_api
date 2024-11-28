import mongoose from 'mongoose';

const TherapistSchema = new mongoose.Schema({
  googleId: { type: String, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false },
  dob: { type: Date, required: true },
  city: { type: String, required: false },
  state: { type: String, required: false },
  country: { type: String, required: false },
  password: { type: String, required: true },
  profilePicture: { type: String, required: false },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  isDeleted: { type: Boolean, default: false },
});

const Therapist = mongoose.model('Therapist', TherapistSchema);

export default Therapist;
