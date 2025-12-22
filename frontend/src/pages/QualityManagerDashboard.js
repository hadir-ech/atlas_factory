import React, { useState, useEffect } from 'react';

const QualityManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalControls: 0,
    conforming: 0,
    nonConforming: 0,
    conformanceRate: 0,
  });

  const [recentControls, setRecentControls] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/quality/controls', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      const controls = Array.isArray(data) ? data : [];

      const conforming = controls.filter(c => c.status === 'CONFORME').length;
      const nonConforming = controls.filter(c => c.status === 'NON-CONFORME').length;
      const conformanceRate = controls.length > 0 ? ((conforming / controls.length) * 100).toFixed(1) : 0;

      setStats({
        totalControls: controls.length,
        conforming,
        nonConforming,
        conformanceRate,
      });

      setRecentControls(controls.slice(0, 5));
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🧪 Tableau de Bord Qualité</h1>
        <p className="text-gray-600">Suivi HACCP et conformité de la production</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Contrôles Totaux</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalControls}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Conformes</p>
              <p className="text-3xl font-bold text-green-600">{stats.conforming}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Non-conformes</p>
              <p className="text-3xl font-bold text-red-600">{stats.nonConforming}</p>
            </div>
            <div className="text-4xl">❌</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Taux de Conformité</p>
              <p className="text-3xl font-bold text-purple-600">{stats.conformanceRate}%</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔬 Actions Rapides</h2>
          <div className="space-y-3">
            <a href="/reception" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 font-semibold transition">
              → Contrôle de Réception
            </a>
            <a href="/quality" className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 font-semibold transition">
              → Contrôles HACCP
            </a>
            <a href="/traceability" className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 font-semibold transition">
              → Traçabilité
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⚠️ Critères HACCP</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>🌡️ Température: 0-4°C</p>
            <p>👃 Analyse sensorielle: Obligatoire</p>
            <p>🔬 Tests microbiologiques: Réguliers</p>
            <p>📦 Intégrité emballage: Vérifiée</p>
            <p>🏷️ Étiquetage: Correct</p>
          </div>
        </div>
      </div>

      {/* Recent Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Contrôles Récents</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Lot</th>
                <th className="px-4 py-2 text-left font-semibold">Type</th>
                <th className="px-4 py-2 text-left font-semibold">Statut</th>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentControls.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-center text-gray-500">
                    Aucun contrôle récent
                  </td>
                </tr>
              ) : (
                recentControls.map(control => (
                  <tr key={control.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-semibold">{control.lotId}</td>
                    <td className="px-4 py-2">{control.checkType || 'Initial'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        control.status === 'CONFORME' ? 'bg-green-100 text-green-800' :
                        control.status === 'NON-CONFORME' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {control.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {new Date(control.checkedAt).toLocaleDateString('fr-FR')}
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

export default QualityManagerDashboard;
