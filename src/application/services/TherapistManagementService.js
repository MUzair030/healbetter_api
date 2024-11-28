import bcrypt from 'bcryptjs';
import TherapistRepositoryImpl from "../../infrastructure/repositories/TherapistRepositoryImpl.js";

class TherapistManagementService {
  constructor() {
    this.therapistRepository = new TherapistRepositoryImpl();
  }

  async getAllTherapists() {
    const users = await this.therapistRepository.findAll();
    if (!users || users.length === 0) {
      throw new Error('Therapist not found');
    }
    return users;
  }

  async getTherapistById(id) {
    if (!id) {
      throw new Error('Therapist ID is required');
    }

    const user = await this.therapistRepository.findById(id);
    if (!user) {
      throw new Error('Therapist not found');
    }
    return user;
  }

  async getTherapistByEmail(email) {
    if (!email) {
      throw new Error('Therapist email is required');
    }

    const user = await this.therapistRepository.findByEmail(email);
    if (!user) {
      throw new Error('Therapist not found');
    }
    return user;
  }
}

export default TherapistManagementService;
