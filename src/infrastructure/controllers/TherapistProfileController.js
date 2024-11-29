import express from 'express';
import multer from 'multer';
import passport from '../../application/services/GoogleAuthService.js';
import CommonResponse from '../../application/common/CommonResponse.js';
import TherapistRepositoryImpl from "../repositories/TherapistRepositoryImpl.js";
import TherapistAuthService from "../../application/services/TherapistAuthService.js";
import TherapistManagementService from "../../application/services/TherapistManagementService.js";

const router = express.Router();
const userRepository = new TherapistRepositoryImpl();
const authService = new TherapistAuthService(userRepository);
const therapistService = new TherapistManagementService();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
  try {
    const result = await therapistService.getAllTherapists();
    CommonResponse.success(res, result);
  } catch (error) {
    CommonResponse.error(res, error.message, 400);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await therapistService.getTherapistById(id);
    CommonResponse.success(res, result);
  } catch (error) {
    CommonResponse.error(res, error.message, 404);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedPatient = await therapistService.updateTherapistById(id, updateData);
    CommonResponse.success(res, updatedPatient);
  } catch (error) {
    CommonResponse.error(res, error.message, 404);

  }
});

router.post('/:id/profile-picture', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return CommonResponse.error(res, 'No file uploaded', 400);
    }
    const user = await therapistService.getTherapistById(id);
    if(user){
      const uploadResult = await therapistService.uploadTherapistProfilePicture(file, user);
      CommonResponse.success(res, uploadResult);
    }
  } catch (error) {
    CommonResponse.error(res, error.message, 500);
  }
});

router.get('/verify-email', async (req, res) => {
  const { email, code } = req.query;
  try {
    if (!email || !code) {
      return CommonResponse.error(res, 'Email and verification code are required', 400);
    }

    const result = await authService.verifyEmail(email, code);
    CommonResponse.success(res, result);
  } catch (error) {
    CommonResponse.error(res, error.message, 400);
  }
});


router.put('/change-password', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const userId = req.user.id;
    await authService.changePassword(userId, currentPassword, newPassword);
    CommonResponse.success(res, null, 'Password changed successfully');
    // res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    CommonResponse.error(res, err.message, 400);
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    await authService.sendForgotPasswordOTP(email);
    CommonResponse.success(res, null, 'OTP sent successfully');
  } catch (error) {
    CommonResponse.error(res, error.message, 400);
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    await authService.verifyOtp(email, otp);
    CommonResponse.success(res, null, 'OTP verified successfully');
  } catch (error) {
    CommonResponse.error(res, error.message, 400);
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const result = await authService.resetPasswordWithOtp(email, newPassword);
    CommonResponse.success(res, true);
  } catch (error) {
    CommonResponse.error(res, error.message, 400);
  }
});

router.get('/delete', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.id;
    await authService.markAccountAsDeleted(userId);
    CommonResponse.success(res, null,  'Account deleted successfully');
  } catch (error) {
    CommonResponse.error(res, error.message, 400);
  }
});



export default router;
