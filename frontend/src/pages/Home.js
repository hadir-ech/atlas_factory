import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Home = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // If already logged in, send to app
  React.useEffect(() => {
    if (user) navigate('/app', { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-white">
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Atlas SmartFactory</h1>
        <p className="text-gray-600 mb-6">Monitor production, quality, traceability and IoT devices — a lightweight smart factory dashboard.</p>

        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</Link>
          <a href="#features" className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Learn more</a>
        </div>

        <section id="features" className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Features</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Real-time IoT monitoring</li>
            <li>Production KPIs and TRG</li>
            <li>Quality controls and traceability</li>
            <li>Role-based dashboards</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Home;
