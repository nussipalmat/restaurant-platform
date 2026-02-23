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
};

export default restaurantsAPI;