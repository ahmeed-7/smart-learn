const express = require('express');
const router = express.Router();
const plannerController = require('../controllers/plannerController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', plannerController.getSessions);
router.post('/', plannerController.addSession);
router.put('/:id', plannerController.updateSession);
router.delete('/:id', plannerController.deleteSession);

module.exports = router;
