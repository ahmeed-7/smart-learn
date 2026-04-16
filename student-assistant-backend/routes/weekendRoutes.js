const express = require('express');
const router = express.Router();
const weekendController = require('../controllers/weekendController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/challenges', weekendController.getChallenges);
router.put('/challenges/:id/toggle', weekendController.toggleChallenge);

module.exports = router;
