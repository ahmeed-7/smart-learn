const mongoose = require('mongoose');

const weekendChallengeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    xpPoints: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

weekendChallengeSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('WeekendChallenge', weekendChallengeSchema);
