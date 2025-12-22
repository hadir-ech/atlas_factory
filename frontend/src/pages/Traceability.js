import React, { useEffect, useState } from 'react';
import { api } from '../utils/apiClient';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const Traceability = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productType: '',
    quantity: '',
    unit: 'kg',
  });

  useEffect(() => {
    fetchLots();
  }, []);

  const fetchLots = async () => {
    try {
      const response = await api.getLots();
      setLots(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch lots:', error);
      setLoading(false);
    }
  };

  const handleCreateLot = async (e) => {
    e.preventDefault();
    try {
      await api.createLot(formData);
      setFormData({ productType: '', quantity: '', unit: 'kg' });
      setShowForm(false);
      fetchLots();
    } catch (error) {
      console.error('Failed to create lot:', error);
    }
  };

  const handleUpdateStatus = async (lotId, newStatus) => {
    try {
      await api.updateLotStatus(lotId, newStatus);
      fetchLots();
    } catch (error) {
      console.error('Failed to update lot status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Traçabilité des Lots</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <FiPlus /> <span>Nouveau Lot</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleCreateLot} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de Produit
                </label>
                <input
                  type="text"
                  value={formData.productType}
                  onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: Viande hachée"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unité
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>kg</option>
                  <option>tonnes</option>
                  <option>litres</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Créer
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Lot #</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Produit</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantité</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lots.map(lot => (
                <tr key={lot.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono">{lot.lotNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lot.productType}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lot.quantity} {lot.unit}</td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={lot.status}
                      onChange={(e) => handleUpdateStatus(lot.id, e.target.value)}
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        lot.status === 'shipped'
                          ? 'bg-green-100 text-green-800'
                          : lot.status === 'quality_blocked'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      <option value="received">Reçu</option>
                      <option value="cutting">Découpe</option>
                      <option value="grinding">Hachage</option>
                      <option value="seasoning">Assaisonnement</option>
                      <option value="packaging">Emballage</option>
                      <option value="storage">Stockage</option>
                      <option value="shipped">Expédié</option>
                      <option value="quality_blocked">Bloqué QC</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <FiEdit2 size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Traceability;
