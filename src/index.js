import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bodyParser from 'body-parser';
import connectDB from './infrastructure/database/MongoDB.js';
import passport from './application/services/GoogleAuthService.js';
import CommonResponse from "./application/common/CommonResponse.js";
import patientAuthController from './infrastructure/controllers/PatientAuthController.js';
import therapistAuthController from './infrastructure/controllers/TherapistAuthController.js';
import patientProfileController from './infrastructure/controllers/PatientProfileController.js';
import therapistProfileController from './infrastructure/controllers/TherapistProfileController.js';
import commonController from './infrastructure/controllers/CommonController.js';

const app = express();
const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
};

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
  }));
  app.use(passport.initialize());
  app.use(passport.session());


// Routes
app.use('/api/v1/auth/patient', patientAuthController);
app.use('/api/v1/auth/therapist', therapistAuthController);
app.use('/api/v1/patients', patientProfileController);
app.use('/api/v1/therapists', therapistProfileController);
app.use('/api/v1', commonController);

app.use((err, req, res, next) => {
  console.error(err);
  CommonResponse.error(res, err);
});

const PORT = 8081;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

