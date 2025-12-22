import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import {
  FiBarChart2,
  FiBox,
  FiThermometer,
  FiCheckCircle,
  FiTool,
  FiShoppingCart,
  FiUsers,
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const allMenuItems = [
    { icon: FiBarChart2, label: 'Dashboard', path: '/', roles: ['operator', 'technician', 'sales', 'client'] },
    { icon: FiBarChart2, label: 'Director View', path: '/director', roles: ['director', 'admin'] },
    { icon: FiBox, label: 'Traçabilité', path: '/traceability', roles: ['operator', 'production_manager', 'quality_manager', 'director', 'admin'] },
    { icon: FiThermometer, label: 'IoT & Température', path: '/iot', roles: ['operator', 'quality_manager', 'director', 'admin'] },
    { icon: FiCheckCircle, label: 'Réception', path: '/reception', roles: ['quality_manager', 'director', 'admin'] },
    { icon: FiBox, label: 'Découpe', path: '/cutting', roles: ['operator', 'production_manager', 'director', 'admin'] },
    { icon: FiBox, label: 'Emballage', path: '/packaging', roles: ['operator', 'production_manager', 'director', 'admin'] },
    { icon: FiShoppingCart, label: 'Commandes', path: '/orders', roles: ['sales', 'production_manager', 'director', 'admin'] },
    { icon: FiBox, label: 'Expédition', path: '/shipping', roles: ['production_manager', 'sales', 'director', 'admin'] },
    { icon: FiCheckCircle, label: 'Contrôle Qualité', path: '/quality', roles: ['quality_manager', 'director', 'admin'] },
    { icon: FiBarChart2, label: 'Production (MES)', path: '/production', roles: ['production_manager', 'operator', 'director', 'admin'] },
    { icon: FiTool, label: 'Maintenance', path: '/maintenance', roles: ['technician', 'production_manager', 'director', 'admin'] },
    { icon: FiUsers, label: 'Opérateurs', path: '/operators', roles: ['operator', 'production_manager', 'director', 'admin'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className="hidden md:flex md:flex-col bg-gray-900 text-white w-64 h-screen fixed">
      <div className="p-4">
        <h1 className="text-lg font-bold">Modules</h1>
      </div>
      <nav className="flex-1 overflow-y-auto space-y-2 px-2">
        {menuItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              location.pathname === path
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
