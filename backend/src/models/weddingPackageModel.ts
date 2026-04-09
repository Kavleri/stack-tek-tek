import pool from '../config/db.ts';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export interface WeddingPackage {
  id: number;
  package_name: string;
  price: number;
  description: string | null;
  is_active: number;
  created_at: Date;
}

export interface WeddingPackageInput {
  package_name: string;
  price: number;
  description?: string | null;
  is_active?: boolean;
}

export interface WeddingPackageUpdateInput {
  package_name?: string;
  price?: number;
  description?: string | null;
  is_active?: boolean;
}

interface WeddingPackageRow extends RowDataPacket {
  id: number;
  package_name: string;
  price: string | number;
  description: string | null;
  is_active: number;
  created_at: Date;
}

export async function findAllWeddingPackages(includeInactive = true): Promise<WeddingPackage[]> {
  const query = includeInactive
    ? 'SELECT * FROM wedding_packages ORDER BY id DESC'
    : 'SELECT * FROM wedding_packages WHERE is_active = TRUE ORDER BY id DESC';

  const [rows] = await pool.query<WeddingPackageRow[]>(query);

  return rows.map((row) => ({
    id: row.id,
    package_name: row.package_name,
    price: Number(row.price),
    description: row.description,
    is_active: row.is_active,
    created_at: row.created_at,
  }));
}

export async function findWeddingPackageById(id: number): Promise<WeddingPackage | null> {
  const [rows] = await pool.query<WeddingPackageRow[]>('SELECT * FROM wedding_packages WHERE id = ?', [id]);

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];

  return {
    id: row.id,
    package_name: row.package_name,
    price: Number(row.price),
    description: row.description,
    is_active: row.is_active,
    created_at: row.created_at,
  };
}

export async function createWeddingPackage(input: WeddingPackageInput): Promise<WeddingPackage> {
  const description = input.description ?? null;
  const isActive = input.is_active ?? true;

  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO wedding_packages (package_name, price, description, is_active) VALUES (?, ?, ?, ?)',
    [input.package_name, input.price, description, isActive],
  );

  const created = await findWeddingPackageById(result.insertId);

  if (!created) {
    throw new Error('Gagal mengambil data paket yang baru dibuat');
  }

  return created;
}

export async function updateWeddingPackage(id: number, input: WeddingPackageUpdateInput): Promise<WeddingPackage | null> {
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
    [nextName, nextPrice, nextDescription, nextIsActive, id],
  );

  return findWeddingPackageById(id);
}

export async function deleteWeddingPackage(id: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM wedding_packages WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
