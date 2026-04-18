const express = require('express');
const guestController = require('../controllers/guestController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const guestValidator = require('../utils/guestValidator');
const guestErrorHandler = require('../utils/guestErrorHandler');

const router = express.Router();

router.use(authenticateToken);
router.get('/', guestController.index);
router.get('/event/:eventId', guestValidator.validateGuestEventId, guestController.byEvent);
router.get('/:id', guestValidator.validateGuestId, guestController.show);
router.post('/', guestValidator.validateCreateGuest, guestController.store);
router.put('/:id', guestValidator.validateGuestId, guestValidator.validateUpdateGuest, guestController.update);
router.delete('/:id', guestValidator.validateGuestId, guestController.destroy);

router.use(guestErrorHandler);

module.exports = router;