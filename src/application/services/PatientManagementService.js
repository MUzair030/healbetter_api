import bcrypt from 'bcryptjs';
import PatientRepositoryImpl from "../../infrastructure/repositories/PatientRepositoryImpl.js";

class PatientManagementService {
  constructor() {
    this.patientRepository = new PatientRepositoryImpl();
  }

  async getAllPatients() {
    const users = await this.patientRepository.findAll();
    if (!users || users.length === 0) {
      throw new Error('Patients not found');
    }
    return users;
  }

  async getPatientById(id) {
    if (!id) {
      throw new Error('Patient ID is required');
    }

    const user = await this.patientRepository.findById(id);
    if (!user) {
      throw new Error('Patient not found');
    }
    return user;
  }

  async getPatientByEmail(email) {
    if (!email) {
      throw new Error('Patient email is required');
    }

    const user = await this.patientRepository.findByEmail(email);
    if (!user) {
      throw new Error('Patient not found');
    }
    return user;
  }
}

export default PatientManagementService;
