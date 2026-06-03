function parseBoolean(value) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    if (normalized === 'true') {
      return true;
    }

    if (normalized === 'false') {
      return false;
    }
  }

  return undefined;
}

function validateWeddingPackageId(req, res, next) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'ID paket tidak valid' });
  }

  return next();
}

function validateCreateWeddingPackage(req, res, next) {
  const { package_name, price, description, is_active } = req.body || {};

  if (typeof package_name !== 'string' || package_name.trim() === '') {
    return res.status(400).json({ message: 'Nama paket wajib diisi' });
  }

  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return res.status(400).json({ message: 'Harga paket harus berupa angka lebih dari 0' });
  }

  req.validatedWeddingPackage = {
    package_name: package_name.trim(),
    price: numericPrice,
    description: typeof description === 'string' ? description.trim() : null,
    is_active: parseBoolean(is_active),
  };

  return next();
}

function validateUpdateWeddingPackage(req, res, next) {
  const { package_name, price, description, is_active } = req.body || {};
  const payload = {};

  if (package_name !== undefined) {
    if (typeof package_name !== 'string' || package_name.trim() === '') {
      return res.status(400).json({ message: 'Nama paket tidak boleh kosong' });
    }

    payload.package_name = package_name.trim();
  }

  if (price !== undefined) {
    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: 'Harga paket harus berupa angka lebih dari 0' });
    }

    payload.price = numericPrice;
  }

  if (description !== undefined) {
    payload.description = typeof description === 'string' ? description.trim() : null;
  }

  if (is_active !== undefined) {
    const parsedIsActive = parseBoolean(is_active);
    if (parsedIsActive === undefined) {
      return res.status(400).json({ message: 'is_active harus berupa boolean' });
    }

    payload.is_active = parsedIsActive;
  }

  if (Object.keys(payload).length === 0) {
    return res.status(400).json({ message: 'Payload update tidak boleh kosong' });
  }

  req.validatedWeddingPackage = payload;
  return next();
}

module.exports = {
  validateCreateWeddingPackage,
  validateUpdateWeddingPackage,
  validateWeddingPackageId,
};