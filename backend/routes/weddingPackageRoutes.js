const express = require('express');
const {
  createWeddingPackageHandler,
  deleteWeddingPackageHandler,
  getWeddingPackageById,
  getWeddingPackages,
  updateWeddingPackageHandler,
} = require('../controllers/weddingPackageController');

const router = express.Router();

router.get('/', getWeddingPackages);
router.get('/:id', getWeddingPackageById);
router.post('/', createWeddingPackageHandler);
router.put('/:id', updateWeddingPackageHandler);
router.delete('/:id', deleteWeddingPackageHandler);

module.exports = router;