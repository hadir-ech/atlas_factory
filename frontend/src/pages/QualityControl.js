import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';

const QualityControl = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    lotId: '',
    checkType: 'initial', // initial, intermediate, final
    visualInspection: 0,
    odorTest: 0,
    temperatureCheck: 0,
    pHMeasurement: 0,
    microbiologicalTest: 0,
    foreignObjectsCheck: false,
    packagingIntegrity: false,
    labelingCorrect: false,
    notes: '',
  });

  const [lots, setLots] = useState([]);
  const [controls, setControls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('create'); // create or history

  useEffect(() => {
    fetchLots();
    fetchControls();
  }, []);

  const fetchLots = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/traceability', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      // Ensure data is always an array
      setLots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching lots:', err);
      setLots([]);
    }
  };

  const fetchControls = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/quality/controls', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      // Ensure data is always an array
      setControls(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching controls:', err);
      setControls([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/quality/controls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create quality control');
      }

      const data = await response.json();
      setResult(data);
      setFormData({
        lotId: '',
        checkType: 'initial',
        visualInspection: 0,
        odorTest: 0,
        temperatureCheck: 0,
        pHMeasurement: 0,
        microbiologicalTest: 0,
        foreignObjectsCheck: false,
        packagingIntegrity: false,
        labelingCorrect: false,
        notes: '',
      });
      setShowForm(false);
      fetchControls();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getConformityStatus = (control) => {
    const avgScore = (control.visualInspection + control.odorTest + control.temperatureCheck + control.pHMeasurement + control.microbiologicalTest) / 5;
    if (avgScore >= 8) return { text: 'CONFORME', color: 'bg-green-100 text-green-800' };
    if (avgScore >= 6) return { text: 'À REVOIR', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'NON-CONFORME', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">✅ Contrôle Qualité HACCP</h1>
          <p className="text-gray-600">Gestion des contrôles qualité et conformité HACCP</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          {showForm ? '✕ Annuler' : '➕ Nouveau Contrôle'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">✅ Contrôle qualité enregistré!</p>
          <p>Lot: {result.control.lotId}</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8 space-y-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrôle *</label>
                <select
                  name="checkType"
                  value={formData.checkType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="initial">Contrôle initial</option>
                  <option value="intermediate">Contrôle intermédiaire</option>
                  <option value="final">Contrôle final</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tests HACCP */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🧪 Tests HACCP (0-10)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inspection visuelle (0-10) *
                </label>
                <input
                  type="number"
                  name="visualInspection"
                  value={formData.visualInspection}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test d'odeur (0-10) *
                </label>
                <input
                  type="number"
                  name="odorTest"
                  value={formData.odorTest}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vérification température (0-10) *
                </label>
                <input
                  type="number"
                  name="temperatureCheck"
                  value={formData.temperatureCheck}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mesure pH (0-10) *
                </label>
                <input
                  type="number"
                  name="pHMeasurement"
                  value={formData.pHMeasurement}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test microbiologique (0-10) *
                </label>
                <input
                  type="number"
                  name="microbiologicalTest"
                  value={formData.microbiologicalTest}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Physical Checks */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🔍 Vérifications Physiques</h2>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="foreignObjectsCheck"
                  checked={formData.foreignObjectsCheck}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-500 rounded"
                />
                <span className="ml-2 text-gray-700">Absence d'objets étrangers</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="packagingIntegrity"
                  checked={formData.packagingIntegrity}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-500 rounded"
                />
                <span className="ml-2 text-gray-700">Intégrité de l'emballage</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="labelingCorrect"
                  checked={formData.labelingCorrect}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-500 rounded"
                />
                <span className="ml-2 text-gray-700">Étiquetage correct</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
            <textarea
              name="notes"
              value={formData.notes}
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
            {loading ? 'Enregistrement...' : '✅ Enregistrer Contrôle'}
          </button>
        </form>
      )}

      {/* Controls History */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">📋 Historique des Contrôles</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Lot</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Score Moyen</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Conformité</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {controls.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Aucun contrôle enregistré
                  </td>
                </tr>
              ) : (
                controls.map(control => {
                  const avgScore = ((control.visualInspection || 0) + (control.odorTest || 0) + (control.temperatureCheck || 0) + (control.pHMeasurement || 0) + (control.microbiologicalTest || 0)) / 5;
                  const conformity = getConformityStatus(control);
                  return (
                    <tr key={control.id}>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{control.lotId}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{control.checkType}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{avgScore.toFixed(1)}/10</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${conformity.color}`}>
                          {conformity.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(control.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QualityControl;
