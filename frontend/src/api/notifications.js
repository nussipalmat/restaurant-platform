import apiClient from './client';

export const notificationsAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/notifications/', { params });
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await apiClient.post(`/notifications/${notificationId}/mark-as-read/`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.post('/notifications/mark-all-as-read/');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get('/notifications/unread-count/');
    return response.data;
  },

  getSettings: async () => {
    const response = await apiClient.get('/notifications/settings/');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await apiClient.put('/notifications/settings/', settings);
    return response.data;
  },
};

export default notificationsAPI;