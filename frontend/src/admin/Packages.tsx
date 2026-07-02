import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || '';

interface Package {
  id: number;
  package_name: string;
  price: number;
  description: string;
  is_active: boolean;
}

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState<Partial<Package>>({
    package_name: '',
    price: 0,
    description: '',
    is_active: true,
  });
  const token = localStorage.getItem('token');

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/packages`);
      const data = await response.json();
      setPackages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPackage
        ? `${API_URL}/api/packages/${editingPackage.id}`
        : `${API_URL}/api/packages`;
      const method = editingPackage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingPackage(null);
        setFormData({
          package_name: '',
          price: 0,
          description: '',
          is_active: true,
        });
        fetchPackages();
      }
    } catch (error) {
      console.error('Failed to save package:', error);
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData(pkg);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus paket pernikahan ini?')) {
      try {
        const response = await fetch(`${API_URL}/api/packages/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          fetchPackages();
        }
      } catch (error) {
        console.error('Failed to delete package:', error);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-light text-primary tracking-wide">
              Wedding <span className="font-normal font-serif">Packages</span>
            </h1>
            <p className="text-xs text-on-surface-variant tracking-wider uppercase font-sans mt-2 font-medium">
              Katalog Layanan & CRUD Paket Pernikahan
            </p>
          </div>
          <div>
            <button
              onClick={() => {
                setEditingPackage(null);
                setFormData({
                  package_name: '',
                  price: 0,
                  description: '',
                  is_active: true,
                });
                setShowModal(true);
              }}
              className="bg-primary text-white px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all duration-300 shadow-md shadow-primary/10 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Tambah Paket Baru
            </button>
          </div>
        </div>

        {/* Packages Layout (Asymmetric grid, tonal containers) */}
        {loading ? (
          <p className="text-sm text-on-surface-variant">Memuat katalog paket...</p>
        ) : packages.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-low rounded-2xl">
            <span className="material-symbols-outlined text-5xl text-outline-variant/50">inventory_2</span>
            <p className="text-sm text-on-surface-variant mt-3 font-medium">Belum ada paket pernikahan terdaftar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.01]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="material-symbols-outlined text-3xl text-secondary">stars</span>
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                        pkg.is_active
                          ? 'bg-secondary-container text-on-secondary-fixed-variant'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      {pkg.is_active ? 'Aktif' : 'Non-Aktif'}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif text-primary font-medium mb-2">{pkg.package_name}</h3>
                  <p className="text-2xl font-serif font-bold text-primary mb-4">
                    Rp {pkg.price.toLocaleString('id-ID')}
                  </p>
                  
                  <p className="text-sm text-on-surface-variant font-sans leading-relaxed mb-6 whitespace-pre-line">
                    {pkg.description || 'Tidak ada deskripsi paket.'}
                  </p>
                </div>

                <div className="flex gap-3 mt-4 border-t border-outline-variant/10 pt-4">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="flex-1 bg-surface-container-lowest text-primary py-2.5 rounded-xl text-xs font-semibold uppercase hover:bg-secondary-container transition-all duration-300"
                  >
                    Edit Detail
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="flex-1 bg-error-container/40 text-on-error-container py-2.5 rounded-xl text-xs font-semibold uppercase hover:bg-error-container transition-all duration-300"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
            <div className="bg-surface-container-lowest p-8 rounded-[24px] shadow-[0_12px_40px_rgba(11,37,69,0.06)] border border-outline-variant/15 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-serif text-primary mb-6">
                {editingPackage ? 'Edit Detail Paket' : 'Tambah Paket Pernikahan'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nama Paket</label>
                  <input
                    type="text"
                    value={formData.package_name}
                    onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                    placeholder="Contoh: Gold Package"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Harga Paket (Rp)</label>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                    placeholder="50000000"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Deskripsi Layanan</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans resize-none"
                    placeholder="Tuliskan detail katering, dekorasi panggung, dokumentasi, dll..."
                  />
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active || false}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-primary bg-surface-container-low border-transparent rounded focus:ring-0 focus:ring-offset-0"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-on-surface">
                    Aktifkan Paket Pernikahan (Muncul di Pemesanan)
                  </label>
                </div>

                <div className="flex gap-4 pt-4 border-t border-outline-variant/10">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-surface-container-low text-on-surface-variant py-3 rounded-xl text-xs font-semibold uppercase hover:bg-surface-container-high transition-all duration-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-3 rounded-xl text-xs font-semibold uppercase hover:opacity-95 transition-all duration-300 shadow-md shadow-primary/10"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
