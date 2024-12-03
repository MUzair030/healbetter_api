import mongoose from 'mongoose';
import AppointmentRepositoryImpl from "../../infrastructure/repositories/AppointmentRepositoryImpl.js";


class AppointmentService {
  constructor() {
    this.appointmentRepository = new AppointmentRepositoryImpl();
  }

  async createAppointment(appointmentData) {
    if (!appointmentData || Object.keys(appointmentData).length === 0) {
      throw new Error('Appointment data is required');
    }

    const { patient, therapist, mode, type, date, time } = appointmentData;
    if (!patient || !therapist || !mode || !type || !date || !time) {
      throw new Error('Missing required fields');
    }

    if (!mongoose.Types.ObjectId.isValid(patient)) {
      throw new Error('Invalid Patient ID');
    }
    if (!mongoose.Types.ObjectId.isValid(therapist)) {
      throw new Error('Invalid Therapist ID');
    }

    try {
      return await this.appointmentRepository.save(appointmentData);
    } catch (error) {
      throw new Error(`Error creating appointment: ${error.message}`);
    }
  }

  async updateAppointment(appointmentId, updatedData) {
    if (!appointmentId || !updatedData) {
      throw new Error('Appointment ID and updated data are required');
    }

    try {
      const updatedAppointment = await this.appointmentRepository.findByIdAndUpdate(appointmentId, updatedData);
      if (!updatedAppointment) {
        throw new Error('Appointment not found');
      }
      return updatedAppointment;
    } catch (error) {
      throw new Error(`Error updating appointment: ${error.message}`);
    }
  }

  async deleteAppointment(appointmentId) {
    if (!appointmentId) {
      throw new Error('Appointment ID is required');
    }

    try {
      const deletedAppointment = await this.appointmentRepository.deleteById(appointmentId);
      if (!deletedAppointment) {
        throw new Error('Appointment not found');
      }
      return deletedAppointment;
    } catch (error) {
      throw new Error(`Error deleting appointment: ${error.message}`);
    }
  }

  async getAllAppointments() {
    try {
      return await this.appointmentRepository.findAll();
    } catch (error) {
      throw new Error(`Error fetching appointments: ${error.message}`);
    }
  }

  async getAppointmentsForPatient(patientId, filter = {}) {
    if (!patientId) {
      throw new Error('Patient ID is required');
    }

    try {
      return await this.appointmentRepository.findAppointmentsForPatient(patientId, filter);
    } catch (error) {
      throw new Error(`Error fetching appointments for patient: ${error.message}`);
    }
  }

  async getAppointmentsForTherapist(therapistId, filter = {}) {
    if (!therapistId) {
      throw new Error('Therapist ID is required');
    }

    try {
      return await this.appointmentRepository.findAppointmentsForTherapist(therapistId, filter);
    } catch (error) {
      throw new Error(`Error fetching appointments for therapist: ${error.message}`);
    }
  }

  async getAppointmentsByDateRange(startDate, endDate) {
    if (!startDate || !endDate) {
      throw new Error('Start and End dates are required');
    }

    try {
      return await this.appointmentRepository.findAppointmentsByDateRange(startDate, endDate);
    } catch (error) {
      throw new Error(`Error fetching appointments by date range: ${error.message}`);
    }
  }

}
export default AppointmentService;
