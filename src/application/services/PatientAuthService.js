import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config/config.js';
import emailService from './EmailService.js';

class PatientAuthService {
  constructor(patientRepository) {
    this.patientRepository = patientRepository;
  }

  async signUp({ firstName, lastName, phone, email, password }) {
    const existingUser = await this.patientRepository.findByEmail(email);
    console.log("existingUser", existingUser)
    if (existingUser) {
      throw new Error('Patient already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = jwt.sign({ email }, config.jwtSecret, { expiresIn: '1h' });
    const user = { firstName, lastName, phone, email, password: hashedPassword, verificationToken };
    console.log("useruser", user)
    let savedUser = null;
    try{
      savedUser = await this.patientRepository.save(user);
    } catch (e)
    {
      console.log(e)
    }
    console.log("savedUser", savedUser)
    await emailService.sendVerificationEmail(savedUser, verificationToken);
    return { message: 'Verification email sent. Please check your email.' };
  }

  async verifyEmail(token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await this.patientRepository.findByEmail(decoded.email);

      if (!user || user.isVerified) {
        throw new Error('Invalid or already verified token');
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      await this.patientRepository.update(user);
      return { message: 'Email verified successfully!' };
    } catch (err) {
      throw new Error('Invalid token');
    }
  }

  async signIn({ email, password }) {
    const user = await this.patientRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.isDeleted) {
      throw new Error('Account marked as Deleted.');
    }

    // if (!user.isVerified) {
    //   throw new Error('Please verify your email first');
    // }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const accessToken = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, config.refreshTokenSecret, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.refreshTokenSecret);
      const accessToken = jwt.sign({ userId: decoded.userId }, config.jwtSecret, { expiresIn: '15m' });
      return { accessToken };
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.patientRepository.findById(userId);
    if (!user) {
      throw new Error('Patient not found');
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await this.patientRepository.update(user);
  }

  async resetPassword(email) {
    const user = await this.patientRepository.findByEmail(email);
    if (!user) {
      throw new Error('Patient not found');
    }
    const temPass = "tempPassword@123";
    const hashedPassword = await bcrypt.hash(temPass, await bcrypt.genSalt(10));
    user.password = hashedPassword;
    let savedUser = await this.patientRepository.update(user);
    await emailService.sendPasswordResetEmail(savedUser, temPass);
  }


  async markAccountAsDeleted(userId) {
    const user = await this.patientRepository.findById(userId);
    if (!user) {
      throw new Error('Patient not found');
    }
    user.isDeleted = true;
    await this.patientRepository.update(user);
  }


}

export default PatientAuthService;
