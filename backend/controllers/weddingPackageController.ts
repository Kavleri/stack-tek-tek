import { Request, Response } from 'express';
import {
  createWeddingPackage,
  deleteWeddingPackage,
  findAllWeddingPackages,
  findWeddingPackageById,
  updateWeddingPackage,
} from '../models/weddingPackageModel.ts';

function parseBoolean(value: unknown): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return true;
    }

    if (value.toLowerCase() === 'false') {
      return false;
    }
  }

  return undefined;
}

export async function getWeddingPackages(req: Request, res: Response) {
  const includeInactive = req.query.includeInactive !== 'false';
  const packages = await findAllWeddingPackages(includeInactive);
  res.json({ data: packages });
}

export async function getWeddingPackageById(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'ID paket tidak valid' });
    return;
  }

  const weddingPackage = await findWeddingPackageById(id);

  if (!weddingPackage) {
    res.status(404).json({ message: 'Paket tidak ditemukan' });
    return;
  }

  res.json({ data: weddingPackage });
}

export async function createWeddingPackageHandler(req: Request, res: Response) {
  const { package_name, price, description, is_active } = req.body ?? {};

  if (typeof package_name !== 'string' || package_name.trim() === '') {
    res.status(400).json({ message: 'Nama paket wajib diisi' });
    return;
  }

  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    res.status(400).json({ message: 'Harga paket harus berupa angka lebih dari 0' });
    return;
  }

  const weddingPackage = await createWeddingPackage({
    package_name: package_name.trim(),
    price: numericPrice,
    description: typeof description === 'string' ? description.trim() : null,
    is_active: parseBoolean(is_active),
  });

  res.status(201).json({ message: 'Paket berhasil dibuat', data: weddingPackage });
}

export async function updateWeddingPackageHandler(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'ID paket tidak valid' });
    return;
  }

  const { package_name, price, description, is_active } = req.body ?? {};
  const payload: {
    package_name?: string;
    price?: number;
    description?: string | null;
    is_active?: boolean;
  } = {};

  if (package_name !== undefined) {
    if (typeof package_name !== 'string' || package_name.trim() === '') {
      res.status(400).json({ message: 'Nama paket tidak boleh kosong' });
      return;
    }

    payload.package_name = package_name.trim();
  }

  if (price !== undefined) {
    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      res.status(400).json({ message: 'Harga paket harus berupa angka lebih dari 0' });
      return;
    }

    payload.price = numericPrice;
  }

  if (description !== undefined) {
    payload.description = typeof description === 'string' ? description.trim() : null;
  }

  const parsedIsActive = parseBoolean(is_active);
  if (parsedIsActive !== undefined) {
    payload.is_active = parsedIsActive;
  }

  const weddingPackage = await updateWeddingPackage(id, payload);

  if (!weddingPackage) {
    res.status(404).json({ message: 'Paket tidak ditemukan' });
    return;
  }

  res.json({ message: 'Paket berhasil diperbarui', data: weddingPackage });
}

export async function deleteWeddingPackageHandler(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'ID paket tidak valid' });
    return;
  }

  const deleted = await deleteWeddingPackage(id);

  if (!deleted) {
    res.status(404).json({ message: 'Paket tidak ditemukan' });
    return;
  }

  res.json({ message: 'Paket berhasil dihapus' });
}