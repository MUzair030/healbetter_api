import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bodyParser from 'body-parser';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import connectDB from './infrastructure/database/MongoDB.js';
import passport from './application/services/GoogleAuthService.js';
import CommonResponse from './application/common/CommonResponse.js';
import patientAuthController from './infrastructure/controllers/PatientAuthController.js';
import therapistAuthController from './infrastructure/controllers/TherapistAuthController.js';
import patientProfileController from './infrastructure/controllers/PatientProfileController.js';
import therapistProfileController from './infrastructure/controllers/TherapistProfileController.js';
import commonController from './infrastructure/controllers/CommonController.js';
import appointmentController from './infrastructure/controllers/AppointmentController.js';
import threadController from './infrastructure/controllers/ThreadController.js';
import chatController, {handleSendMessage} from './infrastructure/controllers/ChatController.js';

const app = express();

const server = http.createServer(app);
export const io = new SocketIOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});


// CORS configuration
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
app.use('/api/v1/appointments', appointmentController);
app.use('/api/v1/threads', threadController);
app.use('/api/v1/chat', chatController);
app.use('/api/v1', commonController);

// socket io
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    // socket.on('joinRoom', (chatId) => {
    //     socket.join(chatId);
    //     console.log(`User joined chat room: ${chatId}`);
    // });

    socket.on('sendMessage', (data) => {
        handleSendMessage(socket, data, io);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    CommonResponse.error(res, err);
});

// Start the server
const PORT = 8081;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
