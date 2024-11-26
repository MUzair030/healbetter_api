import Patient from '../../domain/models/Patient.js';
import PatientRepository from '../../domain/repositories/PatientRepository.js';

class PatientRepositoryImpl extends PatientRepository {
  async findById(id) {
    return Patient.findOne({ _id: id });
  }

  async findByEmail(email) {
    return Patient.findOne({ email });
  }

  async findByGoogleId(googleId) {
    return Patient.findOne({ googleId });
  }

  async save(user) {
    const newUser = new Patient(user);
    return newUser.save();
  }

  async update(user) {
    try {
      const updatedUser = await Patient.findByIdAndUpdate(user._id, user, { new: true });
      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }
}

export default PatientRepositoryImpl;
