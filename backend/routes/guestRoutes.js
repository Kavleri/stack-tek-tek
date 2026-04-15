const express = require('express');
const guestController = require('../controllers/guestController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/', guestController.index);
router.get('/event/:eventId', guestController.byEvent);
router.get('/:id', guestController.show);
router.post('/', guestController.store);
router.put('/:id', guestController.update);
router.delete('/:id', guestController.destroy);

module.exports = router;