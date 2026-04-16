const Subject = require('../models/Subject');
const LessonLog = require('../models/LessonLog');

const scheduleController = {
  // --- SUBJECTS ---
  getSubjects: async (req, res) => {
    try {
      const subjects = await Subject.find({ user: req.user._id });
      res.json(subjects);
    } catch (error) {
      console.error('getSubjects error:', error);
      res.status(500).json({ message: 'Failed to fetch subjects.' });
    }
  },

  addSubject: async (req, res) => {
    try {
      const subject = new Subject({
        ...req.body,
        user: req.user._id,
      });
      await subject.save();
      res.status(201).json(subject);
    } catch (error) {
      console.error('addSubject error:', error);
      res.status(400).json({ message: error.message || 'Failed to add subject.' });
    }
  },

  deleteSubject: async (req, res) => {
    try {
      const subject = await Subject.findOneAndDelete({ _id: req.params.id, user: req.user._id });
      if (!subject) return res.status(404).json({ message: 'Subject not found.' });
      
      // Also delete logs associated with this subject
      await LessonLog.deleteMany({ subjectId: req.params.id, user: req.user._id });
      
      res.json({ message: 'Subject and associated logs deleted.' });
    } catch (error) {
      console.error('deleteSubject error:', error);
      res.status(500).json({ message: 'Failed to delete subject.' });
    }
  },

  // --- LESSON LOGS ---
  getLogsBySubject: async (req, res) => {
    try {
      const { subjectId } = req.params;
      const logs = await LessonLog.find({ subjectId, user: req.user._id }).sort({ createdAt: -1 });
      res.json(logs);
    } catch (error) {
      console.error('getLogsBySubject error:', error);
      res.status(500).json({ message: 'Failed to fetch logs.' });
    }
  },

  addLog: async (req, res) => {
    try {
      const log = new LessonLog({
        ...req.body,
        user: req.user._id,
      });
      await log.save();
      res.status(201).json(log);
    } catch (error) {
      console.error('addLog error:', error);
      res.status(400).json({ message: error.message || 'Failed to add log.' });
    }
  }
};

module.exports = scheduleController;
