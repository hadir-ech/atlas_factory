import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const api = {
  // Traceability
  createLot: (data) =>
    axios.post(`${API_URL}/traceability`, data, { headers: getHeaders() }),
  getLots: () =>
    axios.get(`${API_URL}/traceability`, { headers: getHeaders() }),
  getLotById: (id) =>
    axios.get(`${API_URL}/traceability/${id}`, { headers: getHeaders() }),
  updateLotStatus: (id, status) =>
    axios.patch(`${API_URL}/traceability/${id}/status`, { status }, { headers: getHeaders() }),

  // IoT
  getSensors: () =>
    axios.get(`${API_URL}/iot`, { headers: getHeaders() }),
  getSensorById: (id) =>
    axios.get(`${API_URL}/iot/${id}`, { headers: getHeaders() }),
  createSensor: (data) =>
    axios.post(`${API_URL}/iot`, data, { headers: getHeaders() }),
  updateSensorReading: (id, currentValue) =>
    axios.patch(`${API_URL}/iot/${id}/reading`, { currentValue }, { headers: getHeaders() }),
};
