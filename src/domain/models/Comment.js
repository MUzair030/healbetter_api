import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'creatorModel', // Either 'Patient' or 'Therapist'
        required: true,
    },
    creatorModel: {
        type: String,
        enum: ['Patient', 'Therapist'],
        required: true,
    },
    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread',
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
