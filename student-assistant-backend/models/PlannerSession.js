const mongoose = require('mongoose');

const plannerSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Session title is required'],
        trim: true,
    },
    subject: {
        type: String,
        required: true,
    },
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true,
    },
    startTime: {
        type: String, // HH:mm
        required: true,
    },
    endTime: {
        type: String, // HH:mm
        required: true,
    },
    location: {
        type: String,
        default: '',
    },
    note: {
        type: String,
        default: '',
    },
    color: {
        type: String,
    },
}, {
    timestamps: true,
});

plannerSessionSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('PlannerSession', plannerSessionSchema);
