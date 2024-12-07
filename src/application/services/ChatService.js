import ChatRepository from "../../infrastructure/repositories/ChatRepository.js";


class ChatService {
    static async initiateChat(participant1, model1, participant2, model2) {
        let chat = await ChatRepository.findChatByParticipants(participant1, model1, participant2, model2);

        if (!chat) {
            // If not, create a new chat
            chat = await ChatRepository.createChat([
                { userId: participant1, modelType: model1 },
                { userId: participant2, modelType: model2 },
            ]);
        }
        return chat;
    }

    static async getUserChats(userId, modelType) {
        return ChatRepository.findChatsByUser(userId, modelType);
    }

    static async addMessage(chatId, senderId, senderModel, content) {
        const chat = await ChatRepository.findChatById(chatId);
        if (!chat) throw new Error('Chat not found');
        chat.messages.push({ sender: senderId, senderModel, content });
        return ChatRepository.updateChat(chat);
    }
}

export default ChatService;
