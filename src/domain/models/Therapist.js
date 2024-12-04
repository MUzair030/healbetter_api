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
  about: { type: String, required: false },
  education: [
    {
      degree: { type: String, required: true },
      institution: { type: String, required: true },
      year: { type: Number, required: true }
    }
  ],
  certification: [
    {
      title: { type: String, required: true },
      issuingOrganization: { type: String, required: true },
      year: { type: Number, required: true }
    }
  ],
  specialization: { type: [String], required: false }, // 'Mental Health', 'Physical Therapy'
  title: { type: String, required: false },  // Professional title (e.g., Dr., Prof.)
  careOffered: { type: [String], required: false }, //'Mental Health', 'Physical Therapy'
  services: { type: [String], required: false }, //'Counseling', 'Consultation'
  availability: [
    {
      timestamp: { type: Date, required: true },
      probono: { type: Boolean, required: true, default: false }
    }
  ],
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],


  isPublic: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  isDeleted: { type: Boolean, default: false },
});

const Therapist = mongoose.model('Therapist', TherapistSchema);

export default Therapist;
