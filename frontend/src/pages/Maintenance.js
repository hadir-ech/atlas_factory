import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';

const Maintenance = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    machineId: '',
    problemDescription: '',
    severity: 'medium', // low, medium, high, critical
    problemType: '', // mechanical, electrical, software, other
    attachments: '',
  });

  const [machines, setMachines] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMachines();
    fetchInterventions();
  }, []);

  const fetchMachines = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/iot/machines', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      // Ensure data is always an array
      setMachines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching machines:', err);
      setMachines([]);
    }
  };

  const fetchInterventions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/maintenance/interventions', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      // Ensure data is always an array
      setInterventions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching interventions:', err);
      setInterventions([]);
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
      const response = await fetch('http://localhost:5000/api/maintenance/interventions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create intervention');
      }

      const data = await response.json();
      setResult(data);
      setFormData({
        machineId: '',
        problemDescription: '',
        severity: 'medium',
        problemType: '',
        attachments: '',
      });
      setShowForm(false);
      fetchInterventions();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    return badges[severity] || badges.medium;
  };

  const getStatusBadge = (status) => {
    const badges = {
      reported: 'bg-gray-100 text-gray-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-600',
    };
    return badges[status] || badges.reported;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🔧 Maintenance Intelligente</h1>
          <p className="text-gray-600">Maintenance prédictive et gestion des interventions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          {showForm ? '✕ Annuler' : '➕ Signaler Panne'}
        </button>
      </div>

      {/* Machine Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">
            {machines.filter(m => m.status === 'operational').length}
          </div>
          <div className="text-gray-600">Machines Opérationnelles</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-orange-600">
            {machines.filter(m => m.status === 'maintenance').length}
          </div>
          <div className="text-gray-600">En Maintenance</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-red-600">
            {interventions.filter(i => i.status === 'reported').length}
          </div>
          <div className="text-gray-600">Interventions Signalées</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">
            {interventions.filter(i => i.status === 'in_progress').length}
          </div>
          <div className="text-gray-600">En Cours</div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">✅ Intervention signalée!</p>
          <p>Numéro: {result.intervention.id}</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8 space-y-6">
          {/* Machine Selection */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🏭 Sélection Machine</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Machine *</label>
              <select
                name="machineId"
                value={formData.machineId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner une machine...</option>
                {machines.map(machine => (
                  <option key={machine.id} value={machine.id}>
                    {machine.name} - {machine.status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Problem Details */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">⚠️ Détails du Problème</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de problème *</label>
                <select
                  name="problemType"
                  value={formData.problemType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner...</option>
                  <option value="mechanical">🔩 Mécanique</option>
                  <option value="electrical">⚡ Électrique</option>
                  <option value="software">💾 Logiciel</option>
                  <option value="other">📝 Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sévérité *</label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">🟢 Basse</option>
                  <option value="medium">🟡 Moyenne</option>
                  <option value="high">🟠 Haute</option>
                  <option value="critical">🔴 Critique</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description du problème *</label>
            <textarea
              name="problemDescription"
              value={formData.problemDescription}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez en détail le problème observé..."
              required
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pièces jointes (URL)</label>
            <input
              type="text"
              name="attachments"
              value={formData.attachments}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="URL de photos ou documents"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {loading ? 'Signalement...' : '🚨 Signaler Panne'}
          </button>
        </form>
      )}

      {/* Interventions History */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">📊 Historique des Interventions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Machine</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sévérité</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {interventions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Aucune intervention
                  </td>
                </tr>
              ) : (
                interventions.map(intervention => (
                  <tr key={intervention.id}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {machines.find(m => m.id === intervention.machineId)?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{intervention.problemType}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityBadge(intervention.severity)}`}>
                        {intervention.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(intervention.status)}`}>
                        {intervention.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(intervention.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Machines List */}
      <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">🏭 État des Machines</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Machine</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">État</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Dernière Maintenance</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Prochaine Maintenance</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {machines.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    Aucune machine
                  </td>
                </tr>
              ) : (
                machines.map(machine => (
                  <tr key={machine.id}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{machine.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        machine.status === 'operational' ? 'bg-green-100 text-green-800' :
                        machine.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {machine.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {machine.lastMaintenanceDate ? new Date(machine.lastMaintenanceDate).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {machine.nextMaintenanceDate ? new Date(machine.nextMaintenanceDate).toLocaleDateString('fr-FR') : 'N/A'}
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

export default Maintenance;
