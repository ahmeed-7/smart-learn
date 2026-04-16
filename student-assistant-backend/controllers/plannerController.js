const PlannerSession = require('../models/PlannerSession');

exports.getSessions = async (req, res) => {
    try {
        const sessions = await PlannerSession.find({ user: req.user._id });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching planner sessions' });
    }
};

exports.addSession = async (req, res) => {
    try {
        const session = new PlannerSession({ ...req.body, user: req.user._id });
        await session.save();
        res.status(201).json(session);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateSession = async (req, res) => {
    try {
        const session = await PlannerSession.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );
        if (!session) return res.status(404).json({ message: 'Session not found' });
        res.json(session);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteSession = async (req, res) => {
    try {
        const session = await PlannerSession.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!session) return res.status(404).json({ message: 'Session not found' });
        res.json({ message: 'Session deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting session' });
    }
};
