import apiClient from './client';

export const supportAPI = {
  create: async (ticketData) => {
    const response = await apiClient.post('/support/tickets/', ticketData);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await apiClient.get('/support/tickets/', { params });
    return response.data;
  },

  getById: async (ticketId) => {
    const response = await apiClient.get(`/support/tickets/${ticketId}/`);
    return response.data;
  },

  addComment: async (ticketId, commentData) => {
    const response = await apiClient.post(`/support/tickets/${ticketId}/comments/`, commentData);
    return response.data;
  },

  getComments: async (ticketId) => {
    const response = await apiClient.get(`/support/tickets/${ticketId}/comments/`);
    return response.data;
  },

  close: async (ticketId) => {
    const response = await apiClient.post(`/support/tickets/${ticketId}/close/`);
    return response.data;
  },
};

export default supportAPI;