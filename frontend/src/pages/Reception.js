import React, { useState } from 'react';
import useAuthStore from '../store/authStore';

const Reception = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    supplier: '',
    productType: '',
    quantity: '',
    slaughterDate: '',
    transportTemperature: '',
    sanitaryCertificate: '',
    visualControl: false,
    smellControl: false,
    temperatureControl: '',
    coldChainVerified: false,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/production/reception', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create reception');
      }

      const data = await response.json();
      setResult(data);
      setFormData({
        supplier: '',
        productType: '',
        quantity: '',
        slaughterDate: '',
        transportTemperature: '',
        sanitaryCertificate: '',
        visualControl: false,
        smellControl: false,
        temperatureControl: '',
        coldChainVerified: false,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">📥 Reception & Quality Control</h1>
      <p className="text-gray-600 mb-8">Enregistrer la réception de la viande et effectuer les contrôles qualité initiaux</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">✅ Réception acceptée!</p>
          <p>Lot créé: {result.lot.lotNumber}</p>
          <img src={result.lot.qrCode} alt="QR Code" className="w-48 mt-4" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Supplier Info */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🏭 Informations du Fournisseur</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur *</label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de produit *</label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner...</option>
                <option value="viande_fraiche">Viande fraîche</option>
                <option value="viande_congelee">Viande congelée</option>
                <option value="abats">Abats</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité (kg) *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Certificat sanitaire</label>
              <input
                type="text"
                name="sanitaryCertificate"
                value={formData.sanitaryCertificate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Transport Info */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🚚 Informations du Transport</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'abattage</label>
              <input
                type="date"
                name="slaughterDate"
                value={formData.slaughterDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Température de transport (°C) *</label>
              <input
                type="number"
                name="transportTemperature"
                value={formData.transportTemperature}
                onChange={handleChange}
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Quality Controls */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">✅ Contrôles Qualité</h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="visualControl"
                checked={formData.visualControl}
                onChange={handleChange}
                className="w-4 h-4 text-blue-500 rounded"
              />
              <span className="ml-2 text-gray-700">Contrôle visuel - OK</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="smellControl"
                checked={formData.smellControl}
                onChange={handleChange}
                className="w-4 h-4 text-blue-500 rounded"
              />
              <span className="ml-2 text-gray-700">Contrôle d'odeur - OK</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="coldChainVerified"
                checked={formData.coldChainVerified}
                onChange={handleChange}
                className="w-4 h-4 text-blue-500 rounded"
              />
              <span className="ml-2 text-gray-700">Chaîne du froid vérifiée - OK</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Température mesurée (°C) *</label>
              <input
                type="number"
                name="temperatureControl"
                value={formData.temperatureControl}
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
          {loading ? 'Enregistrement...' : '✅ Accepter la Réception'}
        </button>
      </form>
    </div>
  );
};

export default Reception;
