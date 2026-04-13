const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/login', authController.login);

router.use(authenticateToken);

router.get('/', authController.getAdmins);
router.post('/', authController.createAdmin);
router.put('/:id', authController.updateAdmin);
router.delete('/:id', authController.deleteAdmin);
router.put('/:id/reset-password', authController.resetPassword);

module.exports = router;
