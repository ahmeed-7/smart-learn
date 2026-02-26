const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/user/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            university: user.university,
            specialty: user.specialty,
            goals: user.goals,
            level: user.level,
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// @desc    Update current user profile
// @route   PUT /api/user/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const allowedFields = ['name', 'university', 'specialty', 'goals', 'level'];
        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            university: user.university,
            specialty: user.specialty,
            goals: user.goals,
            level: user.level,
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
