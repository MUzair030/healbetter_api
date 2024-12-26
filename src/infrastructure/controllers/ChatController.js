import express from 'express';
import CommonResponse from '../../application/common/CommonResponse.js';
import ChatService from '../../application/services/ChatService.js';
import CommonService from "../../application/services/CommonService.js";
// import {io} from "../../index.js";

const router = express.Router();
const commonService = new CommonService();
export const userSocketMap = {};

router.post('/initiate', async (req, res) => {
    const { userId1, userId2 } = req.body;
    const model1 = await getUserModel(userId1);
    console.log("model1:: ", model1)
    const model2 = await getUserModel(userId2);
    console.log("model2:: ", model2)
    try {
        const chat = await ChatService.initiateChat(userId1, model1, userId2, model2);
        CommonResponse.success(res, chat);
    } catch (err) {
        CommonResponse.error(res, err.message, 400);
    }
});

router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    const modelType = await getUserModel(userId);
    try {
        const chats = await ChatService.getUserChats(userId, modelType);
        CommonResponse.success(res, chats);
    } catch (err) {
        CommonResponse.error(res, err.message, 400);
    }
});

router.post('/:chatId/message', async (req, res) => {
    const { chatId } = req.params;
    const { senderId, content } = req.body;
    const senderModel = await getUserModel(senderId);
    try {
        const updatedChat = await ChatService.addMessage(chatId, senderId, senderModel, content);
        io.to(chatId).emit('newMessage', { chatId, content });
        CommonResponse.success(res, updatedChat);
    } catch (err) {
        CommonResponse.error(res, err.message, 400);
    }
});

export async function handleSendMessage(socket, data, io) {
    const { chatId, senderId, content } = data;
    const senderModel = await getUserModel(senderId);
    try {
        const updatedChat = await ChatService.addMessage(chatId, senderId, senderModel, content);
        const newMessage = updatedChat.messages[updatedChat.messages.length - 1];
        // io.to(chatId).emit('newMessage', { chatId, ...newMessage });
        // io.to(chatId).emit('newMessage', updatedChat.messages[updatedChat.messages.length - 1]);
    } catch (err) {
        console.error('Error sending message:', err);
        socket.emit('errorMessage', 'Failed to send message');
    }
}

// Helper function to get the socket IDs of participants in a chat
export async function getReceiverSocketId(chatId) {
    try {
        const chat = await ChatService.getChatById(chatId);
        if (chat) {
            return chat.participants;
        } else {
            console.log(`Chat ${chatId} not found.`);
            return null;
        }
    } catch (err) {
        console.error('Error fetching chat participants:', err);
        return null;
    }
}

async function getUserModel(id){
    const user = await commonService.getUserById(id);
    return user?.userType;
}


export default router;
