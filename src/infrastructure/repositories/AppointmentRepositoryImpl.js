import Appointment from '../../domain/models/Appointment.js';

class AppointmentRepositoryImpl {
  // Find appointment by ID
  async findById(id) {
    return Appointment.findOne({ _id: id });
  }

  // Find appointment by patient or therapist email
  async findByEmail(email) {
    return Appointment.findOne({ 'patient.email': email }).or([{ 'therapist.email': email }]);
  }

  // Find appointment by patient or therapist Google ID
  async findByGoogleId(googleId) {
    return Appointment.findOne({ 'patient.googleId': googleId }).or([{ 'therapist.googleId': googleId }]);
  }

  // Find all appointments
  async findAll() {
    return Appointment.find();
  }

  // Save a new appointment
  async save(appointmentData) {
    const newAppointment = new Appointment(appointmentData);
    return newAppointment.save();
  }

  // Update an existing appointment
  async update(appointment) {
    try {
      const updatedAppointment = await Appointment.findByIdAndUpdate(appointment._id, appointment, { new: true, runValidators: true });
      return updatedAppointment;
    } catch (error) {
      throw new Error(`Failed to update appointment: ${error.message}`);
    }
  }

  // Find an appointment by ID and update it
  async findByIdAndUpdate(id, updatedData) {
    try {
      return await Appointment.findByIdAndUpdate(id, { $set: updatedData }, { new: true, runValidators: true });
    } catch (error) {
      throw new Error(`Failed to update appointment: ${error.message}`);
    }
  }

  // Find appointments for a specific therapist with filters (e.g., status)
  async findAppointmentsForTherapist(therapistId, filter = {}) {
    return Appointment.find({ therapist: therapistId, ...filter });
  }

  // Find appointments for a specific patient with filters (e.g., status)
  async findAppointmentsForPatient(patientId, filter = {}) {
    return Appointment.find({ patient: patientId, ...filter });
  }

  // Delete an appointment by ID
  async deleteById(id) {
    try {
      return await Appointment.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Failed to delete appointment: ${error.message}`);
    }
  }

  // Find appointments within a date range (for availability checking)
  async findAppointmentsByDateRange(startDate, endDate) {
    return Appointment.find({ date: { $gte: startDate, $lte: endDate } });
  }
}

export default AppointmentRepositoryImpl;
