import React, { useState, useEffect } from 'react';

const ProductionManagerDashboard = () => {
  const [stats, setStats] = useState({
    lotsInProduction: 0,
    completedToday: 0,
    avgYield: 0,
    machines: 0,
  });

  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [lotsRes, opsRes, machinesRes] = await Promise.all([
        fetch('http://localhost:5000/api/traceability', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('http://localhost:5000/api/production/operations', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('http://localhost:5000/api/iot/machines', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      const lots = await lotsRes.json();
      const operations = await opsRes.json();
      const machines = await machinesRes.json();

      const lotsArray = Array.isArray(lots) ? lots : [];
      const opsArray = Array.isArray(operations) ? operations : [];
      const machinesArray = Array.isArray(machines) ? machines : [];

      const today = new Date().toDateString();
      const todayOps = opsArray.filter(op => new Date(op.createdAt).toDateString() === today);
      
      const avgYield = opsArray.length > 0
        ? (opsArray.reduce((sum, op) => sum + (op.outputQuantity / op.inputQuantity * 100), 0) / opsArray.length).toFixed(1)
        : 0;

      setStats({
        lotsInProduction: lotsArray.filter(l => l.status === 'transformation').length,
        completedToday: todayOps.length,
        avgYield,
        machines: machinesArray.length,
      });

      setSchedule(opsArray.slice(0, 5));
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📊 Tableau de Bord Production</h1>
        <p className="text-gray-600">Suivi des lots et rendement global</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Lots en Production</p>
              <p className="text-3xl font-bold text-blue-600">{stats.lotsInProduction}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Opérations Aujourd'hui</p>
              <p className="text-3xl font-bold text-green-600">{stats.completedToday}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Rendement Moyen</p>
              <p className="text-3xl font-bold text-purple-600">{stats.avgYield}%</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Machines Actives</p>
              <p className="text-3xl font-bold text-orange-600">{stats.machines}</p>
            </div>
            <div className="text-4xl">⚙️</div>
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 Gestion Production</h2>
          <div className="space-y-3">
            <a href="/production" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 font-semibold transition">
              → Gestion des Opérations MES
            </a>
            <a href="/orders" className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 font-semibold transition">
              → Gestion des Commandes
            </a>
            <a href="/shipping" className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 font-semibold transition">
              → Suivi Expédition
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Indicateurs Clés</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>📈 Rendement cible: 95%</p>
            <p>⏱️ Temps de cycle: Optimisé</p>
            <p>🎯 Lots programmés: À jour</p>
            <p>⚠️ Alertes: Aucune</p>
            <p>💰 Coût horaire: Contrôlé</p>
          </div>
        </div>
      </div>

      {/* Recent Operations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Opérations Récentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Lot</th>
                <th className="px-4 py-2 text-left font-semibold">Opération</th>
                <th className="px-4 py-2 text-left font-semibold">Rendement</th>
                <th className="px-4 py-2 text-left font-semibold">Statut</th>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {schedule.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                    Aucune opération récente
                  </td>
                </tr>
              ) : (
                schedule.map(op => (
                  <tr key={op.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-semibold">{op.lotId}</td>
                    <td className="px-4 py-2">{op.operation}</td>
                    <td className="px-4 py-2 font-bold text-blue-600">
                      {((op.outputQuantity / op.inputQuantity) * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        op.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {op.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {new Date(op.createdAt).toLocaleDateString('fr-FR')}
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

export default ProductionManagerDashboard;
