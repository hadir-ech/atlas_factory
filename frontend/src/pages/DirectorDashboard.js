import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '../utils/apiClient';
import useAuthStore from '../store/authStore';

const DirectorDashboard = () => {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [productionData, setProductionData] = useState([]);
  const [qualityData, setQualityData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel
      const [dashboard, production, quality, temperature] = await Promise.all([
        fetch('http://localhost:5000/api/dashboard/director', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }).then(r => r.json()),
        fetch('http://localhost:5000/api/dashboard/production?daysBack=7', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }).then(r => r.json()),
        fetch('http://localhost:5000/api/dashboard/quality?daysBack=30', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }).then(r => r.json()),
        fetch('http://localhost:5000/api/dashboard/temperature?hours=24', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }).then(r => r.json()),
      ]);

      setDashboardData(dashboard);
      setProductionData(Array.isArray(production.data) ? production.data : []);
      setQualityData(Array.isArray(quality.data) ? quality.data : []);
      setTemperatureData(Array.isArray(temperature.data) ? temperature.data : []);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading director dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">{error}</div>;
  }

  const { kpis, alerts } = dashboardData || {};

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📊 Director Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.firstName}! Global performance overview</p>
      </div>

      {/* Critical Alerts */}
      {alerts?.critical?.length > 0 && (
        <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <h2 className="text-lg font-bold text-red-800 mb-3">⚠️ Critical Alerts ({alerts.critical.length})</h2>
          <div className="space-y-2">
            {alerts.critical.map((alert, idx) => (
              <div key={idx} className="bg-white p-3 rounded border-l-2 border-red-500">
                <p className="font-semibold text-gray-800">{alert.message}</p>
                <p className="text-sm text-gray-600">{new Date(alert.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Production KPI */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">📦 Today's Production</p>
          <p className="text-2xl font-bold text-blue-600">{kpis?.production?.actualQuantity} kg</p>
          <p className="text-xs text-gray-500">Planned: {kpis?.production?.plannedQuantity} kg</p>
          <p className="text-lg font-semibold text-green-600 mt-2">TRG: {kpis?.production?.trgScore}%</p>
        </div>

        {/* Quality KPI */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">✅ Quality Control</p>
          <p className="text-2xl font-bold text-green-600">{kpis?.quality?.failureRate}%</p>
          <p className="text-xs text-gray-500">Failure rate (7 days)</p>
          <p className="text-lg font-semibold text-orange-600 mt-2">{kpis?.quality?.controlsPending} Pending</p>
        </div>

        {/* Temperature KPI */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">🌡️ Temperature</p>
          <p className="text-2xl font-bold text-indigo-600">{kpis?.temperature?.average}°C</p>
          <p className="text-xs text-gray-500">Average (all sensors)</p>
          <p className="text-lg font-semibold text-red-600 mt-2">{kpis?.temperature?.alerts} Alerts</p>
        </div>

        {/* Traceability KPI */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">🏷️ Traceability</p>
          <p className="text-2xl font-bold text-purple-600">{kpis?.traceability?.activeLots}</p>
          <p className="text-xs text-gray-500">Active lots</p>
          <p className="text-lg font-semibold text-blue-600 mt-2">{kpis?.traceability?.lotsInPackaging} Packaging</p>
        </div>

        {/* Maintenance KPI */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">🔧 Machines</p>
          <p className="text-2xl font-bold text-teal-600">{kpis?.maintenance?.machinesOperational}/{kpis?.maintenance?.totalMachines}</p>
          <p className="text-xs text-gray-500">Operational</p>
          <p className="text-lg font-semibold text-yellow-600 mt-2">{kpis?.maintenance?.machinesInMaintenance} Maintenance</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Production Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📈 Production Trend (7 days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="planned" stroke="#3b82f6" />
              <Line type="monotone" dataKey="actual" stroke="#10b981" />
              <Line type="monotone" dataKey="trg" stroke="#f59e0b" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quality by Check Type */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">✅ Quality Controls (30 days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={qualityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="checkType" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="passed" fill="#10b981" />
              <Bar dataKey="failed" fill="#ef4444" />
              <Bar dataKey="pending" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Temperature Monitoring */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">🌡️ Temperature Sensors Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {temperatureData.map((sensor) => (
            <div key={sensor.id} className={`p-4 rounded-lg border-2 ${
              sensor.status === 'error' ? 'bg-red-50 border-red-500' :
              sensor.currentValue > sensor.maxThreshold ? 'bg-yellow-50 border-yellow-500' :
              'bg-green-50 border-green-500'
            }`}>
              <p className="font-semibold text-gray-800">{sensor.name}</p>
              <p className="text-sm text-gray-600">{sensor.location}</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{sensor.currentValue}°C</p>
              <p className="text-xs text-gray-600">Range: {sensor.minThreshold}°C - {sensor.maxThreshold}°C</p>
              <p className={`text-sm font-semibold mt-2 ${
                sensor.status === 'error' ? 'text-red-600' :
                sensor.status === 'active' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {sensor.status.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <h2 className="text-lg font-bold text-blue-800 mb-3">🚀 Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold">View Reports</button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold">Export Data</button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold">Manage Users</button>
          <button onClick={fetchDashboardData} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold">Refresh</button>
        </div>
      </div>
    </div>
  );
};

export default DirectorDashboard;
