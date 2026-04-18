const express = require('express');
const {
  createWeddingPackageHandler,
  deleteWeddingPackageHandler,
  getWeddingPackageById,
  getWeddingPackages,
  updateWeddingPackageHandler,
} = require('../controllers/weddingPackageController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/authorizeMiddleware');
const weddingPackageValidator = require('../utils/weddingPackageValidator');
const weddingPackageErrorHandler = require('../utils/weddingPackageErrorHandler');

const router = express.Router();

router.get('/', getWeddingPackages);
router.get('/:id', weddingPackageValidator.validateWeddingPackageId, getWeddingPackageById);
router.post('/', authenticateToken, authorizeRoles('admin'), weddingPackageValidator.validateCreateWeddingPackage, createWeddingPackageHandler);
router.put('/:id', authenticateToken, authorizeRoles('admin'), weddingPackageValidator.validateWeddingPackageId, weddingPackageValidator.validateUpdateWeddingPackage, updateWeddingPackageHandler);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), weddingPackageValidator.validateWeddingPackageId, deleteWeddingPackageHandler);

router.use(weddingPackageErrorHandler);

module.exports = router;