import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const ComingSoonPage = ({ title, icon, description }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="text-6xl">{icon}</div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">{description}</p>
        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Ce module est en cours de développement. Veuillez revenir bientôt.
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          <span>Retour au Tableau de Bord</span>
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ComingSoonPage;
