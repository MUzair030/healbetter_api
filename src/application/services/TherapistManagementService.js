import {v4 as uuidv4} from 'uuid';
import TherapistRepositoryImpl from "../../infrastructure/repositories/TherapistRepositoryImpl.js";
import FileUploadService from "./FileUploadService.js";
import {mapToDto as mapTherapistToDto} from "../common/mapper/TherapistMapper.js";

class TherapistManagementService {
  constructor() {
    this.therapistRepository = new TherapistRepositoryImpl();
  }

  async getAllTherapists() {
    const users = await this.therapistRepository.findAll();
    if (!users || users.length === 0) {
      throw new Error('Therapist not found');
    }
    return users?.map(user => mapTherapistToDto(user));
  }

  async searchTherapists(filters, pagination){
      try {
        const {
          search, country, services, availabilityStartDate,
          availabilityEndDate, typeOfAvailability, isVerified, specialization
        } = filters;
        const { page, limit } = pagination;

        // Build the MongoDB query object dynamically based on filters
        let query = {};

        if (search) {
          query.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { careOffered: { $regex: search, $options: 'i' } },
            { title: { $regex: search, $options: 'i' } }
          ];
        }

        if (country) {
          query.country = { $regex: country, $options: 'i' };
        }

        if (services) {
          query.services = { $in: services.split(',') };
        }

        if (isVerified !== undefined) {
          query.isVerified = isVerified === 'true';
        }

        if (specialization) {
          query.specialization = { $regex: specialization, $options: 'i' };
        }

        // Handle availability date range filter
        if (availabilityStartDate && availabilityEndDate) {
          query['availability.timestamp'] = {
            $gte: new Date(availabilityStartDate),
            $lte: new Date(availabilityEndDate)
          };
        }

        // Handle TypeOfAvailability filter for 'pro bono' or 'paid'
        if (typeOfAvailability) {
          if (typeOfAvailability.toLowerCase() === 'probono') {
            query.probono = true;
          } else if (typeOfAvailability.toLowerCase() === 'paid') {
            query.probono = false;
          }
        }

        // Pagination logic (skip, limit)
        const skip = (page - 1) * limit;

        // Call repository to fetch data with query and pagination
        const therapists = await this.therapistRepository.searchTherapists(query, skip, limit);

        // Get total count of therapists matching the query for pagination
        const totalTherapists = await this.therapistRepository.searchTherapists(query);

        return { therapists: therapists?.map(user => mapTherapistToDto(user)), totalTherapists };
      } catch (err) {
        console.error(err);
        throw new Error('Error while searching therapists');
      }
    };

  async getTherapistById(id) {
    if (!id) {
      throw new Error('Therapist ID is required');
    }

    const user = await this.therapistRepository.findById(id);
    if (!user) {
      throw new Error('Therapist not found');
    }
    return mapTherapistToDto(user);
  }

  async getTherapistByEmail(email) {
    if (!email) {
      throw new Error('Therapist email is required');
    }

    const user = await this.therapistRepository.findByEmail(email);
    if (!user) {
      throw new Error('Therapist not found');
    }
    return mapTherapistToDto(user);
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
    return mapTherapistToDto(updatedPatient);
  }

  async addEducation(therapistId, educationData) {
    if (!educationData || Object.keys(educationData).length === 0) {
      throw new Error('Education data is required');
    }
    try {
      const therapist = await this.therapistRepository.findById(therapistId);
      if (!therapist) {
        throw new Error('Therapist not found');
      }
      therapist?.education.push(educationData);
      await this.therapistRepository.save(therapist);
      return mapTherapistToDto(therapist);
    } catch (err) {
      throw new Error(`Error adding education: ${err.message}`);
    }
  }

  async updateEducation(therapistId, educationId, educationData) {
    if (!therapistId || !educationId) {
      throw new Error('Therapist ID and Education ID are required');
    }
    if (!educationData || Object.keys(educationData).length === 0) {
      throw new Error('Education data is required');
    }
    try {
      const therapist = await this.therapistRepository.findById(therapistId);
      if (!therapist) {
        throw new Error('Therapist not found');
      }
      const educationIndex = therapist.education.findIndex(e => e._id.toString() === educationId);
      if (educationIndex === -1) {
        throw new Error('Education record not found');
      }
      therapist.education[educationIndex] = { ...therapist.education[educationIndex], ...educationData };
      await this.therapistRepository.save(therapist);
      return mapTherapistToDto(therapist);
    } catch (err) {
      throw new Error(`Error updating education: ${err.message}`);
    }
  }

  async deleteEducation(therapistId, educationId) {
    if (!therapistId || !educationId) {
      throw new Error('Therapist ID and Education ID are required');
    }
    try {
      const therapist = await this.therapistRepository.findById(therapistId);
      if (!therapist) {
        throw new Error('Therapist not found');
      }
      therapist.education = therapist.education.filter(e => e._id.toString() !== educationId);
      await this.therapistRepository.save(therapist);
      return mapTherapistToDto(therapist);
    } catch (err) {
      throw new Error(`Error deleting education: ${err.message}`);
    }
  }

  async addCertification(therapistId, certificationData) {
    if (!certificationData || Object.keys(certificationData).length === 0) {
      throw new Error('Certification data is required');
    }
    try {
      const therapist = await this.therapistRepository.findById(therapistId);
      if (!therapist) {
        throw new Error('Therapist not found');
      }
      therapist?.certification.push(certificationData);
      await this.therapistRepository.save(therapist);
      return mapTherapistToDto(therapist);
    } catch (err) {
      throw new Error(`Error adding certification: ${err.message}`);
    }
  }

  async updateCertification(therapistId, certificationId, certificationData) {
    if (!therapistId || !certificationId) {
      throw new Error('Therapist ID and Certification ID are required');
    }
    if (!certificationData || Object.keys(certificationData).length === 0) {
      throw new Error('Certification data is required');
    }
    try {
      const therapist = await this.therapistRepository.findById(therapistId);
      if (!therapist) {
        throw new Error('Therapist not found');
      }
      const certificationIndex = therapist.certification.findIndex(c => c._id.toString() === certificationId);
      if (certificationIndex === -1) {
        throw new Error('Certification record not found');
      }
      therapist.certification[certificationIndex] = { ...therapist.certification[certificationIndex], ...certificationData };
      await this.therapistRepository.save(therapist);
      return mapTherapistToDto(therapist);
    } catch (err) {
      throw new Error(`Error updating certification: ${err.message}`);
    }
  }

  async deleteCertification(therapistId, certificationId) {
    if (!therapistId || !certificationId) {
      throw new Error('Therapist ID and Certification ID are required');
    }
    try {
      const therapist = await this.therapistRepository.findById(therapistId);
      if (!therapist) {
        throw new Error('Therapist not found');
      }
      therapist.certification = therapist.certification.filter(c => c._id.toString() !== certificationId);
      await this.therapistRepository.save(therapist);
      return mapTherapistToDto(therapist);
    } catch (err) {
      throw new Error(`Error deleting certification: ${err.message}`);
    }
  }

  async addAvailability(therapistId, availabilityData) {
    if (!availabilityData || !availabilityData.timestamp || !availabilityData.probono) {
      throw new Error('Availability data (timestamp and probono) is required');
    }
    try {
      const therapist = await this.therapistRepository.findById(therapistId);
      if (!therapist) {
        throw new Error('Therapist not found');
      }
      therapist?.availability.push(availabilityData);
      await this.therapistRepository.save(therapist);
      return mapTherapistToDto(therapist);
    } catch (err) {
      throw new Error(`Error adding availability: ${err.message}`);
    }
  }

  async addMultipleAvailabilities(therapistId, availabilities) {
    if (!Array.isArray(availabilities) || availabilities.length === 0) {
      throw new Error('Availabilities must be a non-empty array');
    }

    try {
      const therapist = await this.therapistRepository.findById(therapistId);
      if (!therapist) {
        throw new Error('Therapist not found');
      }

      availabilities.forEach(availability => {
        if (!availability.timestamp || typeof availability.probono !== 'boolean') {
          throw new Error('Each availability must have a timestamp and a probono field');
        }
        therapist?.availability.push(availability);
      });

      await this.therapistRepository.save(therapist);
      return mapTherapistToDto(therapist);
    } catch (err) {
      throw new Error(`Error adding availabilities: ${err.message}`);
    }
  }

  async updateAvailability(therapistId, availabilityId, availabilityData) {
    if (!therapistId || !availabilityId) {
      throw new Error('Therapist ID and Availability ID are required');
    }
    if (!availabilityData || !availabilityData.timestamp || !availabilityData.probono) {
      throw new Error('Availability data (timestamp and probono) is required');
    }
    try {
      const therapist = await this.therapistRepository.findById(therapistId);
      if (!therapist) {
        throw new Error('Therapist not found');
      }
      const availabilityIndex = therapist.availability.findIndex(a => a._id.toString() === availabilityId);
      if (availabilityIndex === -1) {
        throw new Error('Availability record not found');
      }
      therapist.availability[availabilityIndex] = { ...therapist.availability[availabilityIndex], ...availabilityData };
      await this.therapistRepository.save(therapist);
      return mapTherapistToDto(therapist);
    } catch (err) {
      throw new Error(`Error updating availability: ${err.message}`);
    }
  }

  async deleteAvailability(therapistId, availabilityId) {
    if (!therapistId || !availabilityId) {
      throw new Error('Therapist ID and Availability ID are required');
    }
    try {
      const therapist = await this.therapistRepository.findById(therapistId);
      if (!therapist) {
        throw new Error('Therapist not found');
      }
      therapist.availability = therapist.availability.filter(a => a._id.toString() !== availabilityId);
      await this.therapistRepository.save(therapist);
      return mapTherapistToDto(therapist);
    } catch (err) {
      throw new Error(`Error deleting availability: ${err.message}`);
    }
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
