import apiClient from './client';

export const addressesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/auth/addresses/');
    return response.data;
  },

  getById: async (addressId) => {
    const response = await apiClient.get(`/auth/addresses/${addressId}/`);
    return response.data;
  },

  create: async (addressData) => {
    const response = await apiClient.post('/auth/addresses/', addressData);
    return response.data;
  },

  update: async (addressId, addressData) => {
    const response = await apiClient.patch(`/auth/addresses/${addressId}/`, addressData);
    return response.data;
  },

  delete: async (addressId) => {
    const response = await apiClient.delete(`/auth/addresses/${addressId}/`);
    return response.data;
  },

  setDefault: async (addressId) => {
    const response = await apiClient.post(`/auth/addresses/${addressId}/set-default/`);
    return response.data;
  },
};

export default addressesAPI;