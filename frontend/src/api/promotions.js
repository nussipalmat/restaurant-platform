import apiClient from './client';

export const promotionsAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/promotions/', { params });
    return response.data;
  },

  validate: async (code, orderData) => {
    const response = await apiClient.post('/promotions/validate/', {
      code,
      ...orderData,
    });
    return response.data;
  },

  apply: async (code, orderId) => {
    const response = await apiClient.post('/promotions/apply/', {
      code,
      order: orderId,
    });
    return response.data;
  },

  getActive: async () => {
    const response = await apiClient.get('/promotions/active/');
    return response.data;
  },
};

export default promotionsAPI;