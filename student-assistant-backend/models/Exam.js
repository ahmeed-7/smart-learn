const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Exam title is required'],
        trim: true,
    },
    subject: {
        type: String,
        required: true,
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true,
    },
    time: {
        type: String, // HH:mm
        required: true,
    },
    location: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        enum: ['quiz', 'midterm', 'final', 'oral', 'practical'],
        default: 'midterm',
    },
    note: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

examSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('Exam', examSchema);
