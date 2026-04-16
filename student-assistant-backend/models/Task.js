const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
    },
    subject: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    dueDate: {
        type: String, // YYYY-MM-DD
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    status: {
        type: String,
        enum: ['todo', 'done'],
        default: 'todo',
    },
}, {
    timestamps: true,
});

taskSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('Task', taskSchema);
