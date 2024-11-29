import {v4 as uuidv4} from 'uuid';
import PatientRepositoryImpl from "../../infrastructure/repositories/PatientRepositoryImpl.js";
import FileUploadService from "./FileUploadService.js";

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

  async updatePatientById(id, updateData) {
    if (!id) {
      throw new Error('Patient ID is required');
    }
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error('Update data is required');
    }

    const updatedPatient = await this.patientRepository.findByIdAndUpdate(id, updateData);
    if (!updatedPatient) {
      throw new Error('Patient not found');
    }
    return updatedPatient;
  }

  async uploadPatientProfilePicture(file, user) {
    console.log("uploadPatientProfilePicture:::::::: ", user);
    const uniqueFileName = `patients/${uuidv4()}_${file.originalname}`;
    const uploadResult = await FileUploadService.uploadToS3(file.buffer, uniqueFileName, file.mimetype);
    console.log("uploadResult:::::::: ", uploadResult);
    await this.updatePatientById(user.id, {profilePicture: uploadResult?.Location});
    return uploadResult;

  }
}

export default PatientManagementService;
