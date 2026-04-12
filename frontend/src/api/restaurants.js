import apiClient from './client';

export const restaurantsAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/restaurants/', { params });
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await apiClient.get(`/restaurants/${slug}/`);
    return response.data;
  },

  search: async (query, filters = {}) => {
    const response = await apiClient.get('/restaurants/', {
      params: { search: query, ...filters },
    });
    return response.data;
  },

  create: async (payload) => {
    const response = await apiClient.post('/restaurants/', payload);
    return response.data;
  },

  update: async (slug, payload) => {
    const response = await apiClient.patch(`/restaurants/${slug}/`, payload);
    return response.data;
  },

  delete: async (slug) => {
    const response = await apiClient.delete(`/restaurants/${slug}/`);
    return response.data;
  },

  getTables: async (params = {}) => {
    const response = await apiClient.get('/restaurants/tables/', { params });
    return response.data;
  },

  createTable: async (payload) => {
    const response = await apiClient.post('/restaurants/tables/', payload);
    return response.data;
  },

  updateTable: async (tableId, payload) => {
    const response = await apiClient.patch(`/restaurants/tables/${tableId}/`, payload);
    return response.data;
  },

  deleteTable: async (tableId) => {
    const response = await apiClient.delete(`/restaurants/tables/${tableId}/`);
    return response.data;
  },
};

export default restaurantsAPI;
