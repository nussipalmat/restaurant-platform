import apiClient from './client';

export const authAPI = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register/', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login/', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout/');
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/auth/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me/');
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await apiClient.post('/auth/change-password/', passwordData);
    return response.data;
  },

  requestPasswordReset: async (email) => {
    const response = await apiClient.post('/auth/password-reset/', { email });
    return response.data;
  },

  confirmPasswordReset: async (data) => {
    const response = await apiClient.post('/auth/password-reset-confirm/', data);
    return response.data;
  },
};

export default authAPI;