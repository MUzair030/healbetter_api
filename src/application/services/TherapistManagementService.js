import {v4 as uuidv4} from 'uuid';
import TherapistRepositoryImpl from "../../infrastructure/repositories/TherapistRepositoryImpl.js";
import FileUploadService from "./FileUploadService.js";

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

  async updateTherapistById(id, updateData) {
    if (!id) {
      throw new Error('Therapist ID is required');
    }
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error('Update data is required');
    }

    const updatedPatient = await this.therapistRepository.findByIdAndUpdate(id, updateData);
    if (!updatedPatient) {
      throw new Error('Therapist not found');
    }
    return updatedPatient;
  }

  async uploadTherapistProfilePicture(file, user) {
    console.log("uploadTherapistProfilePicture:::::::: ", user);
    const uniqueFileName = `therapist/${uuidv4()}_${file.originalname}`;
    const uploadResult = await FileUploadService.uploadToS3(file.buffer, uniqueFileName, file.mimetype);
    console.log("uploadResult:::::::: ", uploadResult);
    await this.updateTherapistById(user.id, {profilePicture: uploadResult?.Location});
    return uploadResult;

  }
}

export default TherapistManagementService;
