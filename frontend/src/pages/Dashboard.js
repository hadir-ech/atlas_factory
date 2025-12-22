import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    activeLots: 0,
    todayOperations: 0,
    qualityControls: 0,
    machines: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lotsRes, opsRes, qualityRes, machinesRes] = await Promise.all([
          fetch('http://localhost:5000/api/traceability', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          fetch('http://localhost:5000/api/production/operations', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          fetch('http://localhost:5000/api/quality/controls', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          fetch('http://localhost:5000/api/iot/machines', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);

        const lots = await lotsRes.json();
        const operations = await opsRes.json();
        const quality = await qualityRes.json();
        const machines = await machinesRes.json();

        const lotsArray = Array.isArray(lots) ? lots : [];
        const opsArray = Array.isArray(operations) ? operations : [];
        const today = new Date().toDateString();
        const todayOps = opsArray.filter(op => new Date(op.createdAt).toDateString() === today);

        setStats({
          activeLots: lotsArray.filter(l => l.status === 'transformation').length,
          todayOperations: todayOps.length,
          qualityControls: Array.isArray(quality) ? quality.length : 0,
          machines: Array.isArray(machines) ? machines.length : 0,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
      <p className="text-gray-600">Bienvenue, {user?.firstName} ({user?.role})</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">Lots Actifs</p>
          <p className="text-3xl font-bold text-blue-600">{stats.activeLots}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">Opérations Aujourd'hui</p>
          <p className="text-3xl font-bold text-green-600">{stats.todayOperations}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">Contrôles Qualité</p>
          <p className="text-3xl font-bold text-purple-600">{stats.qualityControls}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">Machines Actives</p>
          <p className="text-3xl font-bold text-orange-600">{stats.machines}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Accès Rapide</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/traceability" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 font-semibold text-center transition">
            📦 Traçabilité
          </a>
          <a href="/production" className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 font-semibold text-center transition">
            ⚙️ Production
          </a>
          <a href="/quality" className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 font-semibold text-center transition">
            🧪 Qualité
          </a>
          <a href="/maintenance" className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-600 font-semibold text-center transition">
            🔧 Maintenance
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
