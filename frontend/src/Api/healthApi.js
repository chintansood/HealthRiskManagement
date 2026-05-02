import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api'
});

export const patientApi = {
  create: (data) => API.post('/patients', data),
  getAll: () => API.get('/patients'),
  highRisk: () => API.get('/patients/high-risk')
};

export const metricsApi = {
  add: (patientId, data) => API.post(`/metrics/${patientId}`, data),
  getByPatient: (patientId) => API.get(`/metrics/${patientId}`)
};