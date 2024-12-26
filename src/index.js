import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bodyParser from 'body-parser';
import https from 'https';
import fs from 'fs';
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
import chatController, {
    getReceiverSocketId,
    handleSendMessage,
    userSocketMap
} from './infrastructure/controllers/ChatController.js';

const app = express();
// Load SSL certificates
const options = {
    key: fs.readFileSync('/home/ec2-user/certs/selfsigned.key'), // Update path if needed
    cert: fs.readFileSync('/home/ec2-user/certs/selfsigned.crt'),
  };

const server = https.createServer(options, app);
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

// Socket.IO Connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Register user by their userId (sent via query string or headers)
    socket.on('registerUser', (userId) => {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    });

    // Listen for 'sendMessage' events from users
    socket.on('sendMessage', async (data) => {
        const { senderId, chatId, content } = data;
        handleSendMessage(socket, data, io);

        try {
            // Fetch the participants for the given chatId
            const participants = await getReceiverSocketId(chatId);
            if (participants) {
                participants.forEach((participant) => {
                    const receiverSocketId = userSocketMap[participant.userId]; // Use userId to get socket ID

                    if (receiverSocketId) {
                        // Send notification to the receiver
                        io.to(receiverSocketId).emit('newMessageNotification', {
                            senderId,
                            content,
                            notification: 'You have a new message!',
                        });
                        console.log(`Notification sent to receiver ${participant.userId} in chat ID: ${chatId}`);
                    } else {
                        console.log(`User ${participant.userId} is not online`);
                    }
                });
            } else {
                console.log(`No participants found for chat ID: ${chatId}`);
            }
        } catch (err) {
            console.error('Error sending message notification:', err);
        }
    });

    // Handle user disconnections and clean up userSocketMap
    socket.on('disconnect', () => {
        for (let userId in userSocketMap) {
            if (userSocketMap[userId] === socket.id) {
                delete userSocketMap[userId]; // Remove the disconnected user from the map
                console.log(`User ${userId} disconnected and removed from map`);
                break;
            }
        }
    });
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    CommonResponse.error(res, err);
});

// Start the server
const PORT = 8443;
server.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.error('Failed to start server:', err);
    } else {
        console.log(`Server started on https://<your-public-ip>:${PORT}`);
    }
});
