const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', examController.getExams);
router.post('/', examController.addExam);
router.delete('/:id', examController.deleteExam);

module.exports = router;
