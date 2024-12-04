import PatientRepositoryImpl from "../../infrastructure/repositories/PatientRepositoryImpl.js";
import TherapistRepositoryImpl from "../../infrastructure/repositories/TherapistRepositoryImpl.js";
import { mapToDto as mapTherapistToDto, mapToDomain as mapTherapistToDomain } from "../common/mapper/TherapistMapper.js";
import { mapToDto as mapPatientToDto, mapToDomain as mapPatientToDomain } from "../common/mapper/PatientMapper.js";

import therapist from "../../domain/models/Therapist.js";


class CommonService {
  constructor() {
    this.patientRepository = new PatientRepositoryImpl();
    this.therapistRepository = new TherapistRepositoryImpl();
  }

  async getUserById(userId) {
    let user = null;
    user = await this.therapistRepository.findById(userId);
    if(user) user = mapTherapistToDto(user);
    if(!user) {
      user = await this.patientRepository.findById(userId);
      user = mapPatientToDto(user);
    }
    if (!user) {
      throw new Error('Therapist/Patient not found');
    }
    return user;
  }


}

export default CommonService;
