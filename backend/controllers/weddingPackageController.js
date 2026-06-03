const {
  createWeddingPackage,
  deleteWeddingPackage,
  findAllWeddingPackages,
  findWeddingPackageById,
  updateWeddingPackage,
} = require('../models/weddingPackageModel');

async function getWeddingPackages(req, res, next) {
  try {
    const includeInactive = req.query.includeInactive !== 'false';
    const packages = await findAllWeddingPackages(includeInactive);
    res.json({ data: packages });
  } catch (error) {
    next(error);
  }
}

async function getWeddingPackageById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const weddingPackage = await findWeddingPackageById(id);

    if (!weddingPackage) {
      return next({ type: 'WEDDING_PACKAGE_NOT_FOUND' });
    }

    return res.json({ data: weddingPackage });
  } catch (error) {
    return next(error);
  }
}

async function createWeddingPackageHandler(req, res, next) {
  try {
    const weddingPackage = await createWeddingPackage(req.validatedWeddingPackage);

    return res.status(201).json({ message: 'Paket berhasil dibuat', data: weddingPackage });
  } catch (error) {
    return next(error);
  }
}

async function updateWeddingPackageHandler(req, res, next) {
  try {
    const id = Number(req.params.id);
    const weddingPackage = await updateWeddingPackage(id, req.validatedWeddingPackage);

    if (!weddingPackage) {
      return next({ type: 'WEDDING_PACKAGE_NOT_FOUND' });
    }

    return res.json({ message: 'Paket berhasil diperbarui', data: weddingPackage });
  } catch (error) {
    return next(error);
  }
}

async function deleteWeddingPackageHandler(req, res, next) {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteWeddingPackage(id);

    if (!deleted) {
      return next({ type: 'WEDDING_PACKAGE_NOT_FOUND' });
    }

    return res.json({ message: 'Paket berhasil dihapus' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createWeddingPackageHandler,
  deleteWeddingPackageHandler,
  getWeddingPackageById,
  getWeddingPackages,
  updateWeddingPackageHandler,
};