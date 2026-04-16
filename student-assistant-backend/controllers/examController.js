const Exam = require('../models/Exam');

exports.getExams = async (req, res) => {
    try {
        const exams = await Exam.find({ user: req.user._id });
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exams' });
    }
};

exports.addExam = async (req, res) => {
    try {
        const exam = new Exam({ ...req.body, user: req.user._id });
        await exam.save();
        res.status(201).json(exam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!exam) return res.status(404).json({ message: 'Exam not found' });
        res.json({ message: 'Exam deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting exam' });
    }
};
