const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const authValidator = require('../utils/authValidator');
const authErrorHandler = require('../utils/authErrorHandler');

router.post('/login', authValidator.validateLogin, authController.login);

router.use(authenticateToken);

router.get('/', authController.getAdmins);
router.post('/', authValidator.validateCreateAdmin, authController.createAdmin);
router.put('/:id', authValidator.validateUpdateAdmin, authController.updateAdmin);
router.delete('/:id', authController.deleteAdmin);
router.put('/:id/reset-password', authValidator.validateResetPassword, authController.resetPassword);

// Include the auth error handler
router.use(authErrorHandler);

module.exports = router;
