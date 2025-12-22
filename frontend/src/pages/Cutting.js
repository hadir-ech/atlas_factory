import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';

const Cutting = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    lotId: '',
    inputQuantity: '',
    handWashing: false,
    knifeDisinfection: false,
    equipmentWorn: false,
    surfaceCleaned: false,
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
      setLots(lotsArray.filter(lot => lot.status === 'received'));
    } catch (err) {
      console.error('Error fetching lots:', err);
      setLots([]);
    }
  };

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

    // Verify all hygiene checks are passed
    if (!formData.handWashing || !formData.knifeDisinfection || !formData.equipmentWorn || !formData.surfaceCleaned) {
      setError('❌ Tous les contrôles d\'hygiène doivent être validés');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/production/cutting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create cutting');
      }

      const data = await response.json();
      setResult(data);
      setFormData({
        lotId: '',
        inputQuantity: '',
        handWashing: false,
        knifeDisinfection: false,
        equipmentWorn: false,
        surfaceCleaned: false,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">🔪 Découpe & Hygiène</h1>
      <p className="text-gray-600 mb-8">Enregistrer la découpe avec les checklists hygiène HACCP</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">✅ Découpe enregistrée!</p>
          <p>Lot {result.cutting.lotId} prêt pour la transformation</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Lot Selection */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📦 Sélection du Lot</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité à découper (kg) *</label>
              <input
                type="number"
                name="inputQuantity"
                value={formData.inputQuantity}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Hygiene Checklist */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🧼 Checklist Hygiène HACCP</h2>
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="handWashing"
                checked={formData.handWashing}
                onChange={handleChange}
                className="w-4 h-4 text-blue-500 rounded"
              />
              <span className="ml-3 text-gray-700 font-medium">
                ✋ Lavage des mains - Réalisé
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="knifeDisinfection"
                checked={formData.knifeDisinfection}
                onChange={handleChange}
                className="w-4 h-4 text-blue-500 rounded"
              />
              <span className="ml-3 text-gray-700 font-medium">
                🔪 Désinfection couteaux - Réalisée
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="equipmentWorn"
                checked={formData.equipmentWorn}
                onChange={handleChange}
                className="w-4 h-4 text-blue-500 rounded"
              />
              <span className="ml-3 text-gray-700 font-medium">
                👨‍🔬 Port équipements (charlotte, gants) - Confirmé
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="surfaceCleaned"
                checked={formData.surfaceCleaned}
                onChange={handleChange}
                className="w-4 h-4 text-blue-500 rounded"
              />
              <span className="ml-3 text-gray-700 font-medium">
                🧽 Nettoyage surfaces - Réalisé
              </span>
            </label>
          </div>
          <p className="text-sm text-red-600 mt-3 font-semibold">
            ⚠️ Tous les contrôles doivent être validés
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !formData.handWashing || !formData.knifeDisinfection || !formData.equipmentWorn || !formData.surfaceCleaned}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          {loading ? 'Enregistrement...' : '🔪 Démarrer la Découpe'}
        </button>
      </form>
    </div>
  );
};

export default Cutting;
