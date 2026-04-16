const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Subject name is required'],
        trim: true,
    },
    startTime: {
        type: String, // HH:mm format
        required: [true, 'Start time is required'],
    },
    endTime: {
        type: String, // HH:mm format
        required: [true, 'End time is required'],
    },
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: [true, 'Day is required'],
    },
    room: {
        type: String,
        default: '',
    },
    color: {
        type: String,
        default: 'bg-blue-100 text-blue-700',
    },
}, {
    timestamps: true,
});

// To match frontend expectations when returning JSON
subjectSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('Subject', subjectSchema);
