import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';

const Shipping = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    orderId: '',
    lotId: '',
    quantity: '',
    temperatureAtShipping: '',
    carrier: '',
    trackingNumber: '',
    expectedDeliveryDate: '',
  });

  const [orders, setOrders] = useState([]);
  const [lots, setLots] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchLots();
    fetchShipments();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/production/order?status=ready', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    }
  };

  const fetchLots = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/traceability', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      const lotsArray = Array.isArray(data) ? data : [];
      setLots(lotsArray.filter(lot => lot.status === 'storage'));
    } catch (err) {
      console.error('Error fetching lots:', err);
      setLots([]);
    }
  };

  const fetchShipments = async () => {
    try {
      const response = await fetch('/api/production/shipping', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setShipments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setShipments([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/production/shipping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create shipment');
      }

      const data = await response.json();
      setResult(data);
      setFormData({
        orderId: '',
        lotId: '',
        quantity: '',
        temperatureAtShipping: '',
        carrier: '',
        trackingNumber: '',
        expectedDeliveryDate: '',
      });
      setShowForm(false);
      fetchShipments();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async (shippingId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/production/shipping/${shippingId}/delivered`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.ok) {
        fetchShipments();
      }
    } catch (err) {
      console.error('Error confirming delivery:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🚚 Expédition</h1>
          <p className="text-gray-600">Gérer l'expédition des commandes</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          {showForm ? '✕ Annuler' : '➕ Nouvelle Expédition'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">✅ Expédition créée!</p>
          <p>Numéro: {result.shipping.shippingNumber}</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8 space-y-6">
          {/* Order & Lot Selection */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📦 Sélection Commande/Lot</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commande *</label>
                <select
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner une commande...</option>
                  {orders.map(order => (
                    <option key={order.id} value={order.id}>
                      {order.orderNumber} - {order.clientName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lot *</label>
                <select
                  name="lotId"
                  value={formData.lotId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un lot...</option>
                  {lots.map(lot => (
                    <option key={lot.id} value={lot.id}>
                      {lot.lotNumber} - {lot.quantity}kg
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Détails d'Expédition</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité (kg) *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Température à l'expédition (°C) *</label>
                <input
                  type="number"
                  name="temperatureAtShipping"
                  value={formData.temperatureAtShipping}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transporteur *</label>
                <input
                  type="text"
                  name="carrier"
                  value={formData.carrier}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: DHL, UPS"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de suivi *</label>
                <input
                  type="text"
                  name="trackingNumber"
                  value={formData.trackingNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de livraison attendue *</label>
                <input
                  type="date"
                  name="expectedDeliveryDate"
                  value={formData.expectedDeliveryDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {loading ? 'Création...' : '🚚 Créer l\'Expédition'}
          </button>
        </form>
      )}

      {/* Shipments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">📊 Expéditions En Cours</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Numéro</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Transporteur</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantité</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Température</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {shipments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Aucune expédition
                  </td>
                </tr>
              ) : (
                shipments.map(shipment => (
                  <tr key={shipment.id}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{shipment.shippingNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{shipment.carrier}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{shipment.quantity} kg</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{shipment.temperatureAtShipping}°C</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {shipment.status === 'in_transit' && (
                        <button
                          onClick={() => handleConfirmDelivery(shipment.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold"
                        >
                          Confirmer livraison
                        </button>
                      )}
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

export default Shipping;
