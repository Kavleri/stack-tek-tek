import { Router } from 'express';
import {
  createWeddingPackageHandler,
  deleteWeddingPackageHandler,
  getWeddingPackageById,
  getWeddingPackages,
  updateWeddingPackageHandler,
} from '../controllers/weddingPackageController.ts';

const router = Router();

router.get('/', getWeddingPackages);
router.get('/:id', getWeddingPackageById);
router.post('/', createWeddingPackageHandler);
router.put('/:id', updateWeddingPackageHandler);
router.delete('/:id', deleteWeddingPackageHandler);

export default router;