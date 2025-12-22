import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DirectorDashboard from './pages/DirectorDashboard';
import OperatorDashboard from './pages/OperatorDashboard';
import QualityManagerDashboard from './pages/QualityManagerDashboard';
import ProductionManagerDashboard from './pages/ProductionManagerDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import SalesDashboard from './pages/SalesDashboard';
import Traceability from './pages/Traceability';
import IoTMonitoring from './pages/IoTMonitoring';
import Reception from './pages/Reception';
import Cutting from './pages/Cutting';
import Packaging from './pages/Packaging';
import Orders from './pages/Orders';
import Shipping from './pages/Shipping';
import Production from './pages/Production';
import QualityControl from './pages/QualityControl';
import Maintenance from './pages/Maintenance';
import ComingSoon from './pages/ComingSoon';
import useAuthStore from './store/authStore';
import './App.css';

// Dashboard router based on user role
const DashboardRouter = ({ user }) => {
  if (!user) return <Dashboard />;
  
  switch (user.role) {
    case 'director':
      return <DirectorDashboard />;
    case 'quality_manager':
      return <QualityManagerDashboard />;
    case 'production_manager':
      return <ProductionManagerDashboard />;
    case 'technician':
      return <TechnicianDashboard />;
    case 'sales':
      return <SalesDashboard />;
    case 'operator':
      return <OperatorDashboard />;
    case 'admin':
      return <DirectorDashboard />;
    default:
      return <Dashboard />;
  }
};

function App() {
  const { user } = useAuthStore();
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col ml-0 md:ml-64">
                  <Navbar />
                  <main className="flex-1 overflow-y-auto p-6">
                    <Routes>
                      <Route path="/" element={<DashboardRouter user={user} />} />
                      <Route path="/director" element={<DirectorDashboard />} />
                      <Route path="/traceability" element={<Traceability />} />
                      <Route path="/iot" element={<IoTMonitoring />} />
                      <Route path="/reception" element={<Reception />} />
                      <Route path="/cutting" element={<Cutting />} />
                      <Route path="/packaging" element={<Packaging />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/shipping" element={<Shipping />} />
                      <Route path="/quality" element={<QualityControl />} />
                      <Route path="/maintenance" element={<Maintenance />} />
                      <Route path="/production" element={<Production />} />
                      <Route
                        path="/operators"
                        element={
                          <ComingSoon
                            title="Espace Opérateurs"
                            icon="👥"
                            description="Interface tablette simplifiée pour les opérateurs"
                          />
                        }
                      />
                      <Route
                        path="/sales"
                        element={
                          <ComingSoon
                            title="Commercial B2B"
                            icon="🛍️"
                            description="Espace commercial et CRM pour les clients"
                          />
                        }
                      />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
