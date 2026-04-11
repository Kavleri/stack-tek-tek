const pool = require('../config/database');

const mapPackageRow = (row) => ({
  id: row.id,
  package_name: row.package_name,
  price: Number(row.price),
  description: row.description,
  is_active: row.is_active,
  created_at: row.created_at,
});

const findAllWeddingPackages = async (includeInactive = true) => {
  const query = includeInactive
    ? 'SELECT * FROM wedding_packages ORDER BY id DESC'
    : 'SELECT * FROM wedding_packages WHERE is_active = TRUE ORDER BY id DESC';

  const [rows] = await pool.query(query);
  return rows.map(mapPackageRow);
};

const findWeddingPackageById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM wedding_packages WHERE id = ?', [id]);

  if (rows.length === 0) {
    return null;
  }

  return mapPackageRow(rows[0]);
};

const createWeddingPackage = async (input) => {
  const description = input.description ?? null;
  const isActive = input.is_active ?? true;

  const [result] = await pool.execute(
    'INSERT INTO wedding_packages (package_name, price, description, is_active) VALUES (?, ?, ?, ?)',
    [input.package_name, input.price, description, isActive]
  );

  const created = await findWeddingPackageById(result.insertId);
  if (!created) {
    throw new Error('Gagal mengambil data paket yang baru dibuat');
  }

  return created;
};

const updateWeddingPackage = async (id, input) => {
  const current = await findWeddingPackageById(id);

  if (!current) {
    return null;
  }

  const nextName = input.package_name ?? current.package_name;
  const nextPrice = input.price ?? current.price;
  const nextDescription = input.description !== undefined ? input.description : current.description;
  const nextIsActive = input.is_active !== undefined ? input.is_active : Boolean(current.is_active);

  await pool.execute(
    'UPDATE wedding_packages SET package_name = ?, price = ?, description = ?, is_active = ? WHERE id = ?',
    [nextName, nextPrice, nextDescription, nextIsActive, id]
  );

  return findWeddingPackageById(id);
};

const deleteWeddingPackage = async (id) => {
  const [result] = await pool.execute('DELETE FROM wedding_packages WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  createWeddingPackage,
  deleteWeddingPackage,
  findAllWeddingPackages,
  findWeddingPackageById,
  updateWeddingPackage,
};