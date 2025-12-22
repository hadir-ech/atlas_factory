import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';

const Production = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    lotId: '',
    operation: 'grinding', // grinding, seasoning, mixing, other
    inputQuantity: '',
    outputQuantity: '',
    operatorNotes: '',
    temperatureMaintained: '',
    duration: '',
  });

  const [lots, setLots] = useState([]);
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchLots();
    fetchProductions();
  }, []);

  const fetchLots = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/traceability', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      const lotsArray = Array.isArray(data) ? data : [];
      setLots(lotsArray.filter(lot => lot.status === 'cutting' || lot.status === 'received'));
    } catch (err) {
      console.error('Error fetching lots:', err);
      setLots([]);
    }
  };

  const fetchProductions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/production/operations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setProductions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching productions:', err);
      setProductions([]);
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
      const response = await fetch('http://localhost:5000/api/production/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create production operation');
      }

      const data = await response.json();
      setResult(data);
      setFormData({
        lotId: '',
        operation: 'grinding',
        inputQuantity: '',
        outputQuantity: '',
        operatorNotes: '',
        temperatureMaintained: '',
        duration: '',
      });
      setShowForm(false);
      fetchProductions();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateYield = (input, output) => {
    if (!input || !output) return 0;
    return ((output / input) * 100).toFixed(1);
  };

  const getAverageYield = () => {
    if (productions.length === 0) return 0;
    const totalYield = productions.reduce((sum, p) => {
      return sum + calculateYield(p.inputQuantity, p.outputQuantity);
    }, 0);
    return (totalYield / productions.length).toFixed(1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📊 Gestion de Production (MES)</h1>
          <p className="text-gray-600">Mini-MES pour optimiser les flux de production</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          {showForm ? '✕ Annuler' : '➕ Nouvelle Opération'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{productions.length}</div>
          <div className="text-gray-600">Opérations Totales</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">{getAverageYield()}%</div>
          <div className="text-gray-600">Rendement Moyen</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-orange-600">
            {productions.filter(p => p.status === 'in_progress').length}
          </div>
          <div className="text-gray-600">En Cours</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-purple-600">
            {productions.filter(p => p.status === 'completed').length}
          </div>
          <div className="text-gray-600">Complétées</div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">✅ Opération enregistrée!</p>
          <p>Rendement: {calculateYield(result.operation.inputQuantity, result.operation.outputQuantity)}%</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8 space-y-6">
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

          {/* Operation Details */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">⚙️ Détails de l'Opération</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type d'opération *</label>
                <select
                  name="operation"
                  value={formData.operation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="grinding">🔪 Hachage</option>
                  <option value="seasoning">🧂 Assaisonnement</option>
                  <option value="mixing">🥄 Mélange</option>
                  <option value="other">📝 Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min) *</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Quantities */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Quantités</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité entrée (kg) *</label>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité sortie (kg) *</label>
                <input
                  type="number"
                  name="outputQuantity"
                  value={formData.outputQuantity}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            {formData.inputQuantity && formData.outputQuantity && (
              <div className="mt-2 p-2 bg-blue-50 rounded">
                <p className="text-sm text-blue-700">
                  📈 Rendement calculé: <span className="font-bold">{calculateYield(formData.inputQuantity, formData.outputQuantity)}%</span>
                </p>
              </div>
            )}
          </div>

          {/* Conditions */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🌡️ Conditions</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Température maintenue (°C)</label>
              <input
                type="number"
                name="temperatureMaintained"
                value={formData.temperatureMaintained}
                onChange={handleChange}
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observations de l'opérateur</label>
            <textarea
              name="operatorNotes"
              value={formData.operatorNotes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Notes additionnelles..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {loading ? 'Enregistrement...' : '✅ Enregistrer Opération'}
          </button>
        </form>
      )}

      {/* Production History */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">📋 Historique des Opérations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Lot</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Opération</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Entrée (kg)</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sortie (kg)</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rendement</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Durée (min)</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {productions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    Aucune opération enregistrée
                  </td>
                </tr>
              ) : (
                productions.map(prod => (
                  <tr key={prod.id}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{prod.lotId}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{prod.operation}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{prod.inputQuantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{prod.outputQuantity}</td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">
                      {calculateYield(prod.inputQuantity, prod.outputQuantity)}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{prod.duration}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        prod.status === 'completed' ? 'bg-green-100 text-green-800' :
                        prod.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {prod.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(prod.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Production;
