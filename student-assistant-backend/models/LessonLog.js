const mongoose = require('mongoose');

const lessonLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Log title is required'],
        trim: true,
    },
    content: {
        type: String,
        required: [true, 'Log content is required'],
    },
    date: {
        type: String, // YYYY-MM-DD
        required: [true, 'Date is required'],
    },
    audioUrl: {
        type: String,
        default: '',
    },
    pdfUrl: {
        type: String,
        default: '',
    },
    aiSummary: {
        type: String,
        default: '',
    },
    aiKeyPoints: {
        type: [String],
        default: [],
    },
    aiQuestions: {
        type: [String],
        default: [],
    },
    reviewDate: {
        type: String, // YYYY-MM-DD
        default: '',
    },
}, {
    timestamps: true,
});

// Match frontend expectations
lessonLogSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('LessonLog', lessonLogSchema);
