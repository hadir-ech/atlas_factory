import React, { useEffect, useState } from 'react';
import { api } from '../utils/apiClient';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const IoTMonitoring = () => {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSensors();
    const interval = setInterval(fetchSensors, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSensors = async () => {
    try {
      const response = await api.getSensors();
      setSensors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch sensors:', error);
      setLoading(false);
    }
  };

  const getAlertStatus = (sensor) => {
    if (sensor.minThreshold && sensor.currentValue < sensor.minThreshold) {
      return 'alert-low';
    }
    if (sensor.maxThreshold && sensor.currentValue > sensor.maxThreshold) {
      return 'alert-high';
    }
    return 'normal';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">IoT & Surveillance des Températures</h1>
        <button
          onClick={fetchSensors}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <FiRefreshCw /> <span>Actualiser</span>
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Chargement des capteurs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensors.map(sensor => {
            const alertStatus = getAlertStatus(sensor);
            return (
              <div
                key={sensor.id}
                className={`rounded-lg shadow p-6 border-l-4 ${
                  alertStatus === 'alert-low'
                    ? 'border-blue-500 bg-blue-50'
                    : alertStatus === 'alert-high'
                    ? 'border-red-500 bg-red-50'
                    : 'border-green-500 bg-green-50'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{sensor.sensorName}</h3>
                    <p className="text-sm text-gray-600">{sensor.location}</p>
                  </div>
                  {alertStatus !== 'normal' && (
                    <FiAlertCircle className="text-red-600" size={24} />
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-4xl font-bold text-blue-600">
                    {sensor.currentValue}
                    <span className="text-xl text-gray-600 ml-1">{sensor.unit}</span>
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min:</span>
                    <span className="font-semibold">{sensor.minThreshold}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max:</span>
                    <span className="font-semibold">{sensor.maxThreshold}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold">{sensor.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dernière mise à jour:</span>
                    <span className="font-semibold">
                      {new Date(sensor.lastReadAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {alertStatus !== 'normal' && (
                  <div className={`mt-4 p-3 rounded text-sm font-semibold ${
                    alertStatus === 'alert-low'
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-red-200 text-red-800'
                  }`}>
                    {alertStatus === 'alert-low'
                      ? `Lecture inférieure au minimum (${sensor.minThreshold})`
                      : `Lecture supérieure au maximum (${sensor.maxThreshold})`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IoTMonitoring;
