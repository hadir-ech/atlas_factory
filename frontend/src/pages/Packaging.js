import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';

const Packaging = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    lotId: '',
    packagingType: 'vacuum',
    quantity: '',
    productionDate: new Date().toISOString().split('T')[0],
    bestBeforeDate: '',
    temperature: '',
  });

  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLots();
  }, []);

  const fetchLots = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/traceability', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      const lotsArray = Array.isArray(data) ? data : [];
      setLots(lotsArray.filter(lot => lot.status === 'grinding' || lot.status === 'seasoning'));
    } catch (err) {
      console.error('Error fetching lots:', err);
      setLots([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/production/packaging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create packaging');
      }

      const data = await response.json();
      setResult(data);
      setFormData({
        lotId: '',
        packagingType: 'vacuum',
        quantity: '',
        productionDate: new Date().toISOString().split('T')[0],
        bestBeforeDate: '',
        temperature: '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">📦 Emballage & Étiquetage</h1>
      <p className="text-gray-600 mb-8">Emballer les produits et générer les QR codes finaux</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">✅ Emballage réalisé!</p>
          <p>QR Code final généré</p>
          <img src={result.qrCode} alt="QR Code Final" className="w-48 mt-4" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Lot Selection */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📦 Sélection du Lot</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lot *</label>
            <select
              name="lotId"
              value={formData.lotId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un lot...</option>
              {lots.map(lot => (
                <option key={lot.id} value={lot.id}>
                  {lot.lotNumber} - {lot.quantity}kg
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Packaging Details */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📦 Détails d'Emballage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type d'emballage *</label>
              <select
                name="packagingType"
                value={formData.packagingType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="vacuum">Sous vide</option>
                <option value="modified_atmosphere">Atmosphère modifiée</option>
                <option value="frozen">Surgelé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité emballée (kg) *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de production *</label>
              <input
                type="date"
                name="productionDate"
                value={formData.productionDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date limite de consommation *</label>
              <input
                type="date"
                name="bestBeforeDate"
                value={formData.bestBeforeDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Température (°C) *</label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          {loading ? 'Emballage...' : '📦 Créer l\'Emballage'}
        </button>
      </form>
    </div>
  );
};

export default Packaging;
