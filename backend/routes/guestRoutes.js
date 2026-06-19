const express = require('express');
const guestController = require('../controllers/guestController');
<<<<<<< HEAD

const router = express.Router();

router.get('/', guestController.index);
router.get('/event/:eventId', guestController.byEvent);
router.get('/:id', guestController.show);
router.post('/', guestController.store);
router.put('/:id', guestController.update);
router.delete('/:id', guestController.destroy);
=======
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/authorizeMiddleware');
const guestValidator = require('../utils/guestValidator');
const guestErrorHandler = require('../utils/guestErrorHandler');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('admin'));
router.get('/', guestController.index);
router.get('/event/:eventId', guestValidator.validateGuestEventId, guestController.byEvent);
router.get('/:id', guestValidator.validateGuestId, guestController.show);
router.post('/', guestValidator.validateCreateGuest, guestController.store);
router.put('/:id', guestValidator.validateGuestId, guestValidator.validateUpdateGuest, guestController.update);
router.delete('/:id', guestValidator.validateGuestId, guestController.destroy);

router.use(guestErrorHandler);
>>>>>>> e206de95c34cb82afbcf946fc1c0c8aa75d013a2

module.exports = router;