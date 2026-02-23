import apiClient from './client';

export const menuAPI = {
  getCategories: async (restaurantId) => {
    const response = await apiClient.get('/menu/categories/', {
      params: { restaurant: restaurantId },
    });
    return response.data;
  },

  getItems: async (restaurantId, categoryId = null) => {
    const params = { restaurant: restaurantId };
    if (categoryId) {
      params.category = categoryId;
    }
    const response = await apiClient.get('/menu/items/', { params });
    return response.data;
  },

  getItem: async (itemId) => {
    const response = await apiClient.get(`/menu/items/${itemId}/`);
    return response.data;
  },

  getNutritionalInfo: async (itemId) => {
    const response = await apiClient.get(`/menu/items/${itemId}/nutritional-info/`);
    return response.data;
  },
};

export default menuAPI;