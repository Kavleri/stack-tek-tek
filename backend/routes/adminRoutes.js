const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/authorizeMiddleware');
const authValidator = require('../utils/authValidator');
const authErrorHandler = require('../utils/authErrorHandler');

router.post('/login', authValidator.validateLogin, authController.login);

router.use(authenticateToken);

router.get('/me', (req, res) => {
  res.json({
    admin: {
      id: req.user.id,
      username: req.user.username,
      fullName: req.user.fullName,
      role: req.user.role,
      name: req.user.fullName,
      email: req.user.username
    },
    user: {
      id: req.user.id,
      username: req.user.username,
      fullName: req.user.fullName,
      role: req.user.role,
      name: req.user.fullName,
      email: req.user.username
    }
  });
});

router.use(authorizeRoles('admin'));

router.get('/', authController.getAdmins);
router.post('/', authValidator.validateCreateAdmin, authController.createAdmin);
router.put('/:id', authValidator.validateUpdateAdmin, authController.updateAdmin);
router.delete('/:id', authController.deleteAdmin);
router.put('/:id/reset-password', authValidator.validateResetPassword, authController.resetPassword);

// Include the auth error handler
router.use(authErrorHandler);

module.exports = router;
