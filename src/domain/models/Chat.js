import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'senderModel',
        required: true
    },
    senderModel: {
        type: String,
        enum: ['Patient', 'Therapist'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
});

const chatSchema = new mongoose.Schema({
    participants: [{
        userId: { type: mongoose.Schema.Types.ObjectId, refPath: 'modelType', required: true },
        modelType: { type: String, enum: ['Patient', 'Therapist'], required: true }
    }],
    messages: [messageSchema],
    createdAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
