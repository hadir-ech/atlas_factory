import React, { useState, useEffect } from 'react';

const SalesDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    shippedToday: 0,
    revenue: 0,
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersRes, shippingRes] = await Promise.all([
        fetch('http://localhost:5000/api/production/order', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('http://localhost:5000/api/production/shipping', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      const ordersData = await ordersRes.json();
      const shippingData = await shippingRes.json();

      const ordersArray = Array.isArray(ordersData) ? ordersData : [];
      const shippingArray = Array.isArray(shippingData) ? shippingData : [];

      const today = new Date().toDateString();
      const shippedToday = shippingArray.filter(s => new Date(s.createdAt).toDateString() === today).length;

      setStats({
        totalOrders: ordersArray.length,
        pendingOrders: ordersArray.filter(o => o.status === 'pending').length,
        shippedToday,
        revenue: ordersArray.length * 150, // Exemple de calcul
      });

      setOrders(ordersArray.slice(0, 5));
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">💼 Tableau de Bord Commercial</h1>
        <p className="text-gray-600">Gestion des commandes et clients</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Commandes Totales</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Commandes en Attente</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Expéditions Aujourd'hui</p>
              <p className="text-3xl font-bold text-green-600">{stats.shippedToday}</p>
            </div>
            <div className="text-4xl">🚚</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">CA Estimé</p>
              <p className="text-3xl font-bold text-purple-600">{stats.revenue}€</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Gestion Commerciale</h2>
          <div className="space-y-3">
            <a href="/orders" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 font-semibold transition">
              → Créer une Commande
            </a>
            <a href="/shipping" className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 font-semibold transition">
              → Suivi Expéditions
            </a>
            <a href="/traceability" className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 font-semibold transition">
              → Traçabilité Lots
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 Objectifs Commerciaux</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>📊 CA mensuel: {stats.revenue}€ / 5000€</p>
            <p>🎯 Commandes: {stats.totalOrders} / 50</p>
            <p>📈 Clients fidèles: 15</p>
            <p>🌟 Taux satisfaction: 98%</p>
            <p>🚀 Nouveaux clients: 3</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Commandes Récentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Commande</th>
                <th className="px-4 py-2 text-left font-semibold">Client</th>
                <th className="px-4 py-2 text-left font-semibold">Quantité</th>
                <th className="px-4 py-2 text-left font-semibold">Statut</th>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                    Aucune commande
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-semibold">{order.id}</td>
                    <td className="px-4 py-2">{order.clientName}</td>
                    <td className="px-4 py-2">{order.quantity || '-'} kg</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
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

export default SalesDashboard;
