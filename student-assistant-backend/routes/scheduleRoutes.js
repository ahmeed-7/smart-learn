const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middleware/auth');

// Apply auth to all schedule routes
router.use(auth);

// Subject routes
router.get('/subjects', scheduleController.getSubjects);
router.post('/subjects', scheduleController.addSubject);
router.delete('/subjects/:id', scheduleController.deleteSubject);

// Lesson log routes
router.get('/logs/:subjectId', scheduleController.getLogsBySubject);
router.post('/logs', scheduleController.addLog);

module.exports = router;
