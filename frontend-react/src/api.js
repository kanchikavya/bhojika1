import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  // Dashboard & Analytics
  getDashboardStats: () => client.get('/dashboard/stats/').then(r => r.data),
  getAnalytics: () => client.get('/analytics/').then(r => r.data),

  // Users
  getUsers: (search = '') => client.get(`/users/${search ? `?search=${encodeURIComponent(search)}` : ''}`).then(r => r.data),
  getUser: (id) => client.get(`/users/${id}/`).then(r => r.data),
  getUserOrders: (id) => client.get(`/users/${id}/orders/`).then(r => r.data),
  createUser: (data) => client.post('/users/', data).then(r => r.data),
  updateUser: (id, data) => client.put(`/users/${id}/`, data).then(r => r.data),
  deleteUser: (id) => client.delete(`/users/${id}/`).then(r => r.data),

  // Orders
  getOrders: (params = {}) => client.get('/orders/', { params }).then(r => r.data),
  getOrder: (id) => client.get(`/orders/${id}/`).then(r => r.data),
  createOrder: (data) => client.post('/orders/', data).then(r => r.data),
  updateOrder: (id, data) => client.put(`/orders/${id}/`, data).then(r => r.data),
  deleteOrder: (id) => client.delete(`/orders/${id}/`).then(r => r.data),
  updateOrderStatus: (id, status) => client.post(`/orders/${id}/update_status/`, { status }).then(r => r.data),

  // Payments
  getPayments: (status = '') => client.get(`/payments/${status ? `?status=${encodeURIComponent(status)}` : ''}`).then(r => r.data),
  createPayment: (data) => client.post('/payments/', data).then(r => r.data),
  markPaymentStatus: (id, status) => client.post(`/payments/${id}/mark_status/`, { status }).then(r => r.data),

  // Returns
  getReturns: () => client.get('/returns/').then(r => r.data),
  createReturn: (data) => client.post('/returns/', data).then(r => r.data),

  // Refunds
  getRefunds: () => client.get('/refunds/').then(r => r.data),
  createRefund: (data) => client.post('/refunds/', data).then(r => r.data),

  // Complaints
  getComplaints: (search = '') => client.get(`/complaints/${search ? `?search=${encodeURIComponent(search)}` : ''}`).then(r => r.data),
  createComplaint: (data) => client.post('/complaints/', data).then(r => r.data),
  deleteComplaint: (id) => client.delete(`/complaints/${id}/`).then(r => r.data),

  // Feedback
  getFeedbacks: () => client.get('/feedback/').then(r => r.data),
  createFeedback: (data) => client.post('/feedback/', data).then(r => r.data),
  getFeedbackSummary: () => client.get('/feedback/summary/').then(r => r.data),

  // Status & Logs
  getStatuses: () => client.get('/status/').then(r => r.data),
  getOrderLogs: () => client.get('/order-logs/').then(r => r.data),
};

export default api;
