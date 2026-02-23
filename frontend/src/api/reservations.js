import apiClient from './client';

export const reservationsAPI = {
  create: async (reservationData) => {
    const response = await apiClient.post('/reservations/', reservationData);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await apiClient.get('/reservations/', { params });
    return response.data;
  },

  getById: async (reservationId) => {
    const response = await apiClient.get(`/reservations/${reservationId}/`);
    return response.data;
  },

  update: async (reservationId, data) => {
    const response = await apiClient.patch(`/reservations/${reservationId}/`, data);
    return response.data;
  },

  cancel: async (reservationId) => {
    const response = await apiClient.post(`/reservations/${reservationId}/cancel/`);
    return response.data;
  },

  getAvailableSlots: async (restaurantId, date) => {
    const response = await apiClient.get('/reservations/available-slots/', {
      params: { restaurant: restaurantId, date },
    });
    return response.data;
  },

  getAvailableTables: async (restaurantId, date, time, guests) => {
    const response = await apiClient.get('/reservations/available-tables/', {
      params: { restaurant: restaurantId, date, time, guests },
    });
    return response.data;
  },
};

export default reservationsAPI;