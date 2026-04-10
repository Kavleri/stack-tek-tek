const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Endpoint Public (Tidak butuh token)
router.post('/login', authController.login);

// Endpoint Protected (Butuh token, ini berarti hanya admin yang login yang bisa akses operasi di bawah ini)
router.use(authenticateToken);

router.get('/', authController.getAdmins);
router.post('/', authController.createAdmin);
router.put('/:id', authController.updateAdmin);
router.delete('/:id', authController.deleteAdmin);
router.put('/:id/reset-password', authController.resetPassword);

module.exports = router;
