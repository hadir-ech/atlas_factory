import React, { useState, useEffect } from 'react';

const OperatorDashboard = () => {
  const [stats, setStats] = useState({
    todayTasks: 0,
    lotsInProgress: 0,
    completedToday: 0,
    avgYield: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/production/operations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      const operations = Array.isArray(data) ? data : [];
      
      const today = new Date().toDateString();
      const todayOps = operations.filter(op => new Date(op.createdAt).toDateString() === today);
      
      const avgYield = operations.length > 0 
        ? (operations.reduce((sum, op) => sum + (op.outputQuantity / op.inputQuantity * 100), 0) / operations.length).toFixed(1)
        : 0;

      setStats({
        todayTasks: todayOps.length,
        lotsInProgress: operations.filter(op => op.status === 'in_progress').length,
        completedToday: todayOps.filter(op => op.status === 'completed').length,
        avgYield,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">👷 Mon Espace Opérateur</h1>
        <p className="text-gray-600">Suivi des tâches et rendement de la journée</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tâches du Jour</p>
              <p className="text-3xl font-bold text-blue-600">{stats.todayTasks}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">En Cours</p>
              <p className="text-3xl font-bold text-orange-600">{stats.lotsInProgress}</p>
            </div>
            <div className="text-4xl">⚙️</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Complétées Aujourd'hui</p>
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
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🚀 Actions Rapides</h2>
          <div className="space-y-3">
            <a href="/production" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 font-semibold transition">
              → Enregistrer une opération
            </a>
            <a href="/cutting" className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 font-semibold transition">
              → Découpe & Hygiène
            </a>
            <a href="/packaging" className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 font-semibold transition">
              → Emballage
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📱 Conseils de Sécurité</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>✓ Vérifiez la température régulièrement</p>
            <p>✓ Respectez les checklists HACCP</p>
            <p>✓ Documentez chaque opération</p>
            <p>✓ Alertez en cas de problème</p>
            <p>✓ Maintenez l'hygiène</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;
