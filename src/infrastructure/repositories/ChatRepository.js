import Chat from "../../domain/models/Chat.js";

class ChatRepository {
    static async findChatByParticipants(participant1, model1, participant2, model2) {
        return Chat.findOne({
            participants: {
                $all: [
                    { userId: participant1, modelType: model1 },
                    { userId: participant2, modelType: model2 },
                ],
            },
        });
    }

    static async createChat(participants) {
        const chat = new Chat({ participants, messages: [] });
        return chat.save();
    }

    // static async findChatsByUser(userId, modelType) {
    //     return Chat.find({
    //         'participants.userId': userId,
    //         'participants.modelType': modelType,
    //     });
    // }

    static async findChatsByUser(userId, modelType) {
        return Chat.find({
            'participants.userId': userId,
            'participants.modelType': modelType,
        }).populate('participants.userId', 'firstName lastName email');
    }

    static async findChatById(chatId) {
        return Chat.findById(chatId);
    }

    static async updateChat(chat) {
        return chat.save();
    }
}

export default ChatRepository;
