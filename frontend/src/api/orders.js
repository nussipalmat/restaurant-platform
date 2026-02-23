import apiClient from './client';

export const ordersAPI = {
  create: async (orderData) => {
    const response = await apiClient.post('/orders/', orderData);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await apiClient.get('/orders/', { params });
    return response.data;
  },

  getById: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}/`);
    return response.data;
  },

  cancel: async (orderId) => {
    const response = await apiClient.post(`/orders/${orderId}/cancel/`);
    return response.data;
  },

  track: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}/track/`);
    return response.data;
  },

  getHistory: async (params = {}) => {
    const response = await apiClient.get('/orders/history/', { params });
    return response.data;
  },
};

export default ordersAPI;