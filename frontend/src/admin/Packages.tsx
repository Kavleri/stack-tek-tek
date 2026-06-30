import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Package {
  id: number;
  name: string;
  sub_title: string;
  category: string;
  icon: string;
  description: string;
  price: number;
  features: string[];
  is_popular: boolean;
}

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState<Partial<Package>>({
    name: '',
    sub_title: '',
    category: 'Full',
    icon: 'stars',
    description: '',
    price: 0,
    features: [],
    is_popular: false,
  });
  const [featureInput, setFeatureInput] = useState('');
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
          name: '',
          sub_title: '',
          category: 'Full',
          icon: 'stars',
          description: '',
          price: 0,
          features: [],
          is_popular: false,
        });
        setFeatureInput('');
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
    if (window.confirm('Are you sure you want to delete this package?')) {
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

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), featureInput.trim()],
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: (formData.features || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-slate-800">Packages</h1>
            <p className="text-slate-500 mt-1">Manage your wedding packages</p>
          </div>
          <button
            onClick={() => {
              setEditingPackage(null);
              setFormData({
                name: '',
                sub_title: '',
                category: 'Full',
                icon: 'stars',
                description: '',
                price: 0,
                features: [],
                is_popular: false,
              });
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Add Package
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-slate-500">Loading packages...</p>
          ) : packages.length === 0 ? (
            <p className="text-slate-500">No packages yet</p>
          ) : (
            packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl shadow-sm border-2 ${
                  pkg.is_popular ? 'border-amber-400' : 'border-slate-200'
                } p-6 relative`}
              >
                {pkg.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    MOST POPULAR
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-3xl text-blue-600">{pkg.icon}</span>
                  <div>
                    <h3 className="text-xl font-serif text-slate-800">{pkg.name}</h3>
                    <p className="text-sm text-slate-500">{pkg.sub_title}</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-800 mb-4">
                  Rp {pkg.price.toLocaleString()}
                </p>
                <ul className="space-y-2 mb-6">
                  {(pkg.features || []).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="flex-1 bg-red-100 text-red-700 py-2 rounded-xl font-semibold hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-serif text-slate-800 mb-6">
                {editingPackage ? 'Edit Package' : 'Add New Package'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={formData.sub_title}
                      onChange={(e) => setFormData({ ...formData, sub_title: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="Full">Full Package</option>
                      <option value="Catering">Catering</option>
                      <option value="Decor">Decoration</option>
                      <option value="Documentation">Documentation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="stars">Stars</option>
                      <option value="diamond">Diamond</option>
                      <option value="workspace_premium">Premium</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="local_florist">Florist</option>
                      <option value="camera_enhance">Camera</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price (Rp)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Features</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      placeholder="Add a feature"
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.features || []).map((feature, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                          className="ml-1 text-blue-900 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_popular"
                    checked={formData.is_popular}
                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="is_popular" className="text-sm font-medium text-slate-700">
                    Mark as Popular
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
