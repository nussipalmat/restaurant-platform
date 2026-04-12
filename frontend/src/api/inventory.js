import apiClient from './client';

export const inventoryAPI = {
  getItems: async (params = {}) => {
    const response = await apiClient.get('/inventory/items/', { params });
    return response.data;
  },

  createItem: async (payload) => {
    const response = await apiClient.post('/inventory/items/', payload);
    return response.data;
  },

  updateItem: async (itemId, payload) => {
    const response = await apiClient.patch(`/inventory/items/${itemId}/`, payload);
    return response.data;
  },

  deleteItem: async (itemId) => {
    const response = await apiClient.delete(`/inventory/items/${itemId}/`);
    return response.data;
  },

  getMovements: async (params = {}) => {
    const response = await apiClient.get('/inventory/movements/', { params });
    return response.data;
  },
};

export default inventoryAPI;
