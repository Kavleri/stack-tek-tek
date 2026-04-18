const express = require('express');
const {
  createWeddingPackageHandler,
  deleteWeddingPackageHandler,
  getWeddingPackageById,
  getWeddingPackages,
  updateWeddingPackageHandler,
} = require('../controllers/weddingPackageController');
const weddingPackageValidator = require('../utils/weddingPackageValidator');
const weddingPackageErrorHandler = require('../utils/weddingPackageErrorHandler');

const router = express.Router();

router.get('/', getWeddingPackages);
router.get('/:id', weddingPackageValidator.validateWeddingPackageId, getWeddingPackageById);
router.post('/', weddingPackageValidator.validateCreateWeddingPackage, createWeddingPackageHandler);
router.put('/:id', weddingPackageValidator.validateWeddingPackageId, weddingPackageValidator.validateUpdateWeddingPackage, updateWeddingPackageHandler);
router.delete('/:id', weddingPackageValidator.validateWeddingPackageId, deleteWeddingPackageHandler);

router.use(weddingPackageErrorHandler);

module.exports = router;