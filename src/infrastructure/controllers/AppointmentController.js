import express from 'express';
import AppointmentService from "../../application/services/AppointmentService.js";
import CommonResponse from "../../application/common/CommonResponse.js";

const router = express.Router();
const appointmentService = new AppointmentService();

router.get('/', async (req, res) => {
  try {
    const appointments = await appointmentService.getAllAppointments();
    CommonResponse.success(res, appointments, 'Appointments fetched successfully');
  } catch (error) {
    console.error(error);
    CommonResponse.error(res, error.message, 400);
  }
});

router.post('/', async (req, res) => {
  try {
    const appointmentData = req.body;
    const createdAppointment = await appointmentService.createAppointment(appointmentData);
    CommonResponse.success(res, createdAppointment, 'Appointment created successfully');
  } catch (error) {
    console.error(error);
    CommonResponse.error(res, error.message, 400);
  }
});

router.put('/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updatedData = req.body;

    const updatedAppointment = await appointmentService.updateAppointment(appointmentId, updatedData);
    CommonResponse.success(res, updatedAppointment, 'Appointment updated successfully');
  } catch (error) {
    console.error(error);
    CommonResponse.error(res, error.message, 400);
  }
});

router.delete('/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const deletedAppointment = await appointmentService.deleteAppointment(appointmentId);
    CommonResponse.success(res, deletedAppointment, 'Appointment deleted successfully');
  } catch (error) {
    console.error(error);
    CommonResponse.error(res, error.message, 400);
  }
});

router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const filter = req.query;

    const appointments = await appointmentService.getAppointmentsForPatient(patientId, filter);
    CommonResponse.success(res, appointments, 'Appointments fetched successfully for patient');
  } catch (error) {
    console.error(error);
    CommonResponse.error(res, error.message, 400);
  }
});

router.get('/therapist/:therapistId', async (req, res) => {
  try {
    const { therapistId } = req.params;
    const filter = req.query;

    const appointments = await appointmentService.getAppointmentsForTherapist(therapistId, filter);
    CommonResponse.success(res, appointments, 'Appointments fetched successfully for therapist');
  } catch (error) {
    console.error(error);
    CommonResponse.error(res, error.message, 400);
  }
});

router.get('/by-date', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new Error('Start and End dates are required');
    }

    const appointments = await appointmentService.getAppointmentsByDateRange(startDate, endDate);
    CommonResponse.success(res, appointments, 'Appointments fetched successfully within date range');
  } catch (error) {
    console.error(error);
    CommonResponse.error(res, error.message, 400);
  }
});


export default router;
