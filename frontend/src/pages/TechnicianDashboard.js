import React, { useState, useEffect } from 'react';

const TechnicianDashboard = () => {
  const [stats, setStats] = useState({
    machinesTotal: 0,
    machinesOperational: 0,
    machinesMaintenance: 0,
    interventions: 0,
  });

  const [machines, setMachines] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [machinesRes, interventionsRes] = await Promise.all([
        fetch('http://localhost:5000/api/iot/machines', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('http://localhost:5000/api/maintenance/interventions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      const machinesData = await machinesRes.json();
      const interventionsData = await interventionsRes.json();

      const machinesArray = Array.isArray(machinesData) ? machinesData : [];
      const interventionsArray = Array.isArray(interventionsData) ? interventionsData : [];

      const operational = machinesArray.filter(m => m.status === 'operational').length;
      const maintenance = machinesArray.filter(m => m.status === 'maintenance').length;

      setStats({
        machinesTotal: machinesArray.length,
        machinesOperational: operational,
        machinesMaintenance: maintenance,
        interventions: interventionsArray.length,
      });

      setMachines(machinesArray.slice(0, 8));
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🔧 Tableau de Bord Maintenance</h1>
        <p className="text-gray-600">Gestion des machines et interventions</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Machines Totales</p>
              <p className="text-3xl font-bold text-blue-600">{stats.machinesTotal}</p>
            </div>
            <div className="text-4xl">⚙️</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Opérationnelles</p>
              <p className="text-3xl font-bold text-green-600">{stats.machinesOperational}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Maintenance</p>
              <p className="text-3xl font-bold text-orange-600">{stats.machinesMaintenance}</p>
            </div>
            <div className="text-4xl">🔨</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Interventions</p>
              <p className="text-3xl font-bold text-purple-600">{stats.interventions}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🛠️ Actions Rapides</h2>
          <div className="space-y-3">
            <a href="/maintenance" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 font-semibold transition">
              → Signaler une Intervention
            </a>
            <a href="/maintenance" className="block p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-600 font-semibold transition">
              → Historique Interventions
            </a>
            <a href="/iot" className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 font-semibold transition">
              → Monitoring IoT
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🚨 Priorités de Maintenance</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>🔴 Critiques: À traiter immédiatement</p>
            <p>🟠 Élevée: Cette semaine</p>
            <p>🟡 Moyenne: À planifier</p>
            <p>🟢 Basse: Suivi régulier</p>
            <p>⚪ Préventive: Calendrier</p>
          </div>
        </div>
      </div>

      {/* Machines Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">⚙️ État des Machines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {machines.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-6">
              Aucune machine disponible
            </div>
          ) : (
            machines.map(machine => (
              <div key={machine.id} className={`p-4 rounded-lg border-2 ${
                machine.status === 'operational' ? 'border-green-200 bg-green-50' :
                machine.status === 'maintenance' ? 'border-orange-200 bg-orange-50' :
                'border-red-200 bg-red-50'
              }`}>
                <h3 className="font-bold text-gray-800">{machine.name}</h3>
                <p className="text-sm text-gray-600">Type: {machine.type}</p>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    machine.status === 'operational' ? 'bg-green-100 text-green-800' :
                    machine.status === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {machine.status === 'operational' ? '✅ Opérationnelle' :
                     machine.status === 'maintenance' ? '🔨 En maintenance' :
                     '❌ Arrêtée'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
